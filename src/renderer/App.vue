<template>
    <div id="app">
        <v-app>
            <v-toolbar color="cyan" dark fixed class="drag" app>
                <v-menu offset-y transition="scale-transition" class="no-drag">
                    <v-btn icon class="no-drag" slot="activator">
                        <v-icon>more_vert</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="toggleDialog(DIALOG.TERMINATE_ALL)" :disabled="dialogs[DIALOG.TERMINATE_ALL]">
                            <v-list-tile-title>Fermer les processus</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="toggleDialog(DIALOG.REPAIR)" :disabled="dialogs[DIALOG.REPAIR]">
                            <v-list-tile-title>Réparer Dofus</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="">
                            <v-list-tile-title>Paramètres</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-toolbar-title>Keilite</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon medium class="no-drag" @click="minimize()" style="margin-right:0">
                    <v-icon color="white">minimize</v-icon>
                </v-btn>
                <v-btn icon medium class="no-drag" @click="close()" style="margin-left:0;margin-right:10px">
                    <v-icon color="white">close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-content>
                <div class="scroll-container">
                    <router-view></router-view>
                </div>
            </v-content>
            <v-dialog v-model="dialogs[DIALOG.TERMINATE_ALL]" persistent max-width="290">
                <v-card>
                    <v-card-title class="headline">Fermer tous les processus ?</v-card-title>
                    <v-card-text>
                        Les instances de Dofus seront fermées !
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red darken-1" flat @click.native="toggleDialog(DIALOG.TERMINATE_ALL)">Non</v-btn>
                        <v-btn color="green darken-1" flat :loading="!dialogs[DIALOG.TERMINATE_ALL]" :disabled="!dialogs[DIALOG.TERMINATE_ALL]" @click.native="terminateAll">Oui
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogs[DIALOG.REPAIR]" persistent max-width="290">
                <v-card>
                    <v-card-title class="headline">Réparer Dofus ?</v-card-title>
                    <v-card-text>
                        Attention, toutes les instances de Dofus seront fermées et vos paramètres de jeu seront réinitialisés !
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red darken-1" flat @click.native="toggleDialog(DIALOG.REPAIR)">Non</v-btn>
                        <v-btn color="green darken-1" flat :loading="!dialogs[DIALOG.REPAIR]" :disabled="!dialogs[DIALOG.REPAIR]" @click.native="repair">Oui
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogs[DIALOG.PROCESS_SETTINGS]" lazy fullscreen transition="dialog-bottom-transition" :overlay="false">
                <character-settings></character-settings>
            </v-dialog>
            <v-dialog v-model="dialogs[DIALOG.FIRST_START]" transition="dialog-bottom-transition" :overlay="false">
                <v-card>
                    <v-card-title class="headline">Utilisation</v-card-title>
                    <v-card-text>
                        L'application est encore en développement, vous pouvez remonter les bugs sur https://github.com/LeoMartinDev/Keilite Les raccourcis ne sont pas encore modifiables. Suivant:
                        <kbd>
                            <kbd>Ctrl</kbd>+
                            <kbd>s</kbd>
                        </kbd>
                        Précédent:
                        <kbd>
                            <kbd>Ctrl</kbd>+
                            <kbd>q</kbd>
                        </kbd>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" flat="flat" @click="updateDialog({dialog: DIALOG.FIRST_START, value: false })">OK!</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-app>
    </div>
</template>

<script>
import { remote } from "electron";
import { getProcessesByNameAsync } from "windows-process";
import { mapActions, mapGetters } from "vuex";
import * as fs from "fs-extra";
import * as path from "path";
import { DIALOG } from "./store/modules/UI";
import CharacterSettings from "./components/CharacterSettings";
import DofusWindowsEvent from "./libs/DofusWindowsEvent";
import { throttle } from "lodash";

export default {
  name: "keilite",
  components: { CharacterSettings },
  created() {
    const dofusEvents = new DofusWindowsEvent();
    const _focusPreviousProcess = throttle(this.focusPreviousProcess, 100);
    const _focusNextProcess = throttle(this.focusNextProcess, 100);

    dofusEvents.on("login", process => {
      this.addProcess(process);
      if (!this.focusedProcess) {
        this.updateFocusedProcess(process);
      }
    });
    dofusEvents.on("logout", process => {
      this.removeProcess(process);
    });
    dofusEvents.on("close", process => {
      this.removeProcess(process);
    });
    remote.globalShortcut.register("CommandOrControl+s", () => {
      if (!this.isLocked) {
        _focusNextProcess();
      }
    });
    remote.globalShortcut.register("CommandOrControl+q", () => {
      if (!this.isLocked) {
        _focusPreviousProcess();
      }
    });
  },
  computed: {
    ...mapGetters(["dialogs"])
  },
  data() {
    return {
      DIALOG
    };
  },
  methods: {
    ...mapActions([
      "updateDialog",
      "toggleDialog",
      "closeConnectedProcesses",
      "updateFocusedProcess",
      "removeProcesses",
      "updateProcesses",
      "addProcess",
      "removeProcess",
      "editProcess",
      "focusProcess",
      "focusPreviousProcess",
      "focusNextProcess"
    ]),
    terminateAll() {
      getProcessesByNameAsync("Dofus")
        .then(processes => {
          this.closeConnectedProcesses();
          return processes;
        })
        .then(processes => processes.forEach(process => process.terminate))
        .then(() => setTimeout(this.removeProcesses, 100))
        .catch(error => {
          console.error(error);
        })
        .then(() =>
          this.updateDialog({ dialog: this.DIALOG.TERMINATE_ALL, value: false })
        );
    },
    repair() {
      getProcessesByNameAsync("Dofus")
        .then(processes => processes.forEach(process => process.terminate()))
        .then(() => this.removeProcesses)
        .then(() => fs.remove(path.resolve(process.env.APPDATA, "Dofus")))
        .catch(error => {
          console.error(error);
        })
        .then(() =>
          this.updateDialog({ dialog: this.DIALOG.REPAIR, value: false })
        );
    },
    minimize() {
      remote.BrowserWindow.getFocusedWindow().minimize();
    },
    close() {
      remote.BrowserWindow.getFocusedWindow().close();
    }
  }
};
</script>

<style>
html {
  overflow: hidden;
}

.content {
  height: 100vh;
}

.scroll-container {
  height: 100%;
  overflow-y: scroll;
  backface-visibility: hidden;
}

.no-drag {
  -webkit-app-region: no-drag;
}

.drag {
  -webkit-app-region: drag;
}

::-webkit-scrollbar {
  width: 6px;
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  border-radius: 20px;
  height: 10px!important;
  background-color: #e0e0e0;
}
</style>
