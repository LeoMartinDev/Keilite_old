<template>
    <character-view :character="character">
        <template slot="menu-items">
            <v-list-tile avatar @click="editCharacter(character)">
                <v-list-tile-avatar>
                    <v-icon>edit</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-title>Editer</v-list-tile-title>
            </v-list-tile>
            <v-list-tile avatar @click="removeCharacter(character)">
                <v-list-tile-avatar>
                    <v-icon>delete</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-title>Suppprimer</v-list-tile-title>
            </v-list-tile>
        </template>
    </character-view>
</template>

<script>
import { mapActions } from "vuex";
import CharacterView from './CharacterView';

export default {
  name: "disconnectedCharacter",
  components: { CharacterView },
  props: {
    character: {
      required: true,
    },
  },
  methods: {
    ...mapActions([
        "removeCharacter",
        "editCharacter",
    ]),
  },
};
</script>

<style scoped>

</style>