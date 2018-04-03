<template>
    <v-form>
        <v-select
                :items="charactersList"
                v-model="currentFormValue"
                label="Classe"
                item-text="className"
                item-name="className"
                autocomplete>
            <template slot="item" slot-scope="data">
                <v-list-tile-avatar>
                    <img :src="data.item.imagePath">
                </v-list-tile-avatar>
                <v-list-tile-content>
                    <v-list-tile-title>{{ data.item.className }}</v-list-tile-title>
                </v-list-tile-content>
            </template>
        </v-select>
        <v-text-field
                label="Initiative"
                v-model="currentFormValue.initiative"
        ></v-text-field>
    </v-form>
</template>

<script>
  export default {
    name: "character-settings-form"
  }
</script>

<style scoped>

</style>