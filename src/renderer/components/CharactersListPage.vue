<template>
    <v-layout row>
        <v-flex xs12>
            <v-container fluid>
                <v-expansion-panel :expand="processes.length > 0">
                    <v-expansion-panel-content :value="processes.length > 0">
                        <div slot="header"><v-chip disabled style="font-weight: bold;">{{ processes.length }}</v-chip> Personnages connectés</div>
                        <v-list two-line>
                            <draggable v-model="processes">
                                <transition-group>
                                    <connected-character v-for="process in processes" :process="process" :character="getCharacterByWindowTitle(process.mainWindowTitle)" :key="process.id"></connected-character>
                                </transition-group>
                            </draggable>
                        </v-list>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel :expand="disconnectedCharacters.length > 0">
                    <v-expansion-panel-content :value="disconnectedCharacters.length > 0">
                        <div slot="header"><v-chip disabled style="font-weight: bold;">{{ disconnectedCharacters.length }}</v-chip> Personnages non connectés</div>
                          <v-list two-line>
                            <disconnected-character v-for="character in disconnectedCharacters" :character="character" :key="character.name">
                            </disconnected-character>
                          </v-list>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-container>
        </v-flex>
    </v-layout>
</template>

<script>
  import draggable from 'vuedraggable';
  import {mapActions, mapGetters} from 'vuex';
  import ProcessSettings from './CharacterSettings';
  import DisconnectedCharacter from './DisconnectedCharacter';
  import ConnectedCharacter from './ConnectedCharacter';

  export default {
    name: 'characters-list-page',
    components: {draggable, ProcessSettings, DisconnectedCharacter, ConnectedCharacter},
    methods: {
        ...mapActions([
            'updateProcesses',
        ])
    },
    computed: {
      ...mapGetters([
        'disconnectedCharacters',
        'characters',
        'getCharacterByWindowTitle',
      ]),
      processes: {
        get() {
            let p = this.$store.getters.processes.slice(0);

            p.sort((a, b) => {
                let aC = this.getCharacterByWindowTitle(a.mainWindowTitle);
                let bC = this.getCharacterByWindowTitle(b.mainWindowTitle);

                return aC.initiative < bC.initiative;
            })
          return p;
        },
        set(value) {
          this.updateProcesses(value);
        }
      }
    },
  };
</script>

<style scoped>
</style>
