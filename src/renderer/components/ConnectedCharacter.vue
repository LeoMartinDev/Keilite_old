<template>
    <character-view :character="character">
      <template slot="action-items">
<!--         <v-list-tile-action>
            <v-switch
                    v-model="isDisabled"
            ></v-switch>
        </v-list-tile-action> -->
        <v-list-tile-action>
            <v-btn icon ripple @click.native="focusProcess(process)">
                <v-icon color="grey">open_in_browser</v-icon>
            </v-btn>
        </v-list-tile-action>
      </template>  
      <template slot="menu-items">
        <v-list-tile avatar @click="editCharacter(character)">
          <v-list-tile-avatar>
              <v-icon>settings</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>Paramètres</v-list-tile-title>
        </v-list-tile>
        <v-list-tile avatar @click="terminateProcess(process)">
          <v-list-tile-avatar>
              <v-icon>close</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>Fermer</v-list-tile-title>
        </v-list-tile>
      </template>
    </character-view>
</template>

<script>
import { mapActions } from "vuex";
import CharacterView from './CharacterView';

export default {
  name: "connectedCharacter",
  components: { CharacterView },
  props: {
    character: {
      required: true,
    },
    process: {
      required: true,
    }
  },
  methods: {
    ...mapActions([
        "editCharacter",
        "focusProcess",
        "terminateProcess",
    ]),
  },
};
</script>

<style scoped>

</style>