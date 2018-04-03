<template>
    <v-list-tile>
        <v-list-tile-avatar>
            <img v-if="character.imagePath !== ''" :src="character.imagePath">
            <img v-else src="/static/images/avatars/default.png">
        </v-list-tile-avatar>
        <v-list-tile-content>
            <v-list-tile-title style="font-weight: bold;">{{ character.name | toCharacterName }}</v-list-tile-title>
        </v-list-tile-content>
<!--         <v-list-tile-content v-if="character.initiative">
            <v-chip disabled style="font-weight: bold;">{{ character.initiative }}</v-chip>
        </v-list-tile-content> -->
        <slot name="action-items"></slot>
        <v-list-tile-action>
            <v-menu offset-y transition="scale-transition" class="no-drag">
                <v-btn icon class="no-drag" slot="activator">
                    <v-icon color="grey">more_vert</v-icon>
                </v-btn>
                <v-list>
                    <slot name="menu-items"></slot>
                </v-list>
            </v-menu>
        </v-list-tile-action>
    </v-list-tile>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "character",
  props: {
    character: {
      required: true,
      type: Object
    }
  },
};
</script>

<style scoped>

</style>