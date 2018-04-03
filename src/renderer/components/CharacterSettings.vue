<template>
    <v-card>
        <v-toolbar dark color="primary" fixed app>
            <v-btn icon @click.native="close" dark class="no-drag">
                <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Settings</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="no-drag">
                <v-btn dark flat @click.native="save" icon>
                    <v-icon color="white" large>save</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-content>
            <v-container>
                <v-form>
                    <v-select
                            :items="charactersList"
                            v-model="classSelection"
                            item-value="slug"
                            label="Classe"
                            hide-selected
                            :filter="selectFilter"
                            autocomplete>
                        <template slot="no-data">
                            <div style="text-align: center">Aucune classe de ce nom!</div>
                        </template>
                        <template slot="selection" slot-scope="data">
                            <v-chip>
                                <v-avatar>
                                    <img :src="data.item.imagePath">
                                </v-avatar>
                                {{ data.item.className }}
                            </v-chip>
                        </template>
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
                            v-model="initiative"
                            mask="####"
                    ></v-text-field>
                </v-form>
            </v-container>
        </v-content>
    </v-card>
</template>

<script>
  import * as _ from 'lodash';
  import {mapActions} from 'vuex';
  import {DIALOG} from "../store/modules/UI";

  const classNames = ["feca", "osamodas", "enutrof", "sram", "xelor", "ecaflip", "eniripsa", "iop", "cra", "sadida", "sacrieur", "pandawa", "roublard", "zobal", "steameur", "eliotrope", "huppermage", "ouginak"];
  const characters = classNames.reduce((accumulator, element) => {
    accumulator.push({
      className: _.startCase(_.toLower(element)),
      sexe: 'male',
      imagePath: `/static/images/avatars/${element}_male.png`,
      slug: `${_.startCase(_.toLower(element))}_male`,
    });
    accumulator.push({
      className: _.startCase(_.toLower(element)),
      sexe: 'female',
      imagePath: `/static/images/avatars/${element}_female.png`,
      slug: `${_.startCase(_.toLower(element))}_female`,
    });
    return accumulator;
  }, []);

  export default {
    name: "character-settings",
    data() {
      return {
        DIALOG,
        charactersList: characters,
        formValue: {},
        selectFilter(item, queryText, itemText) {
          const hasValue = val => val != null ? val : '';
          const text = hasValue(item.className);
          const query = hasValue(queryText);
          return text.toString()
            .toLowerCase()
            .indexOf(query.toString().toLowerCase()) > -1
        }
      }
    },
    computed: {
      currentFormValue: {
        get() {
          return this.$store.getters.editingCharacter;
        },
        set(value) {
          this.formValue = value;
        }
      },
      classSelection: {
        get() {
          return `${_.get(this.currentFormValue, 'className', '')}_${_.get(this.currentFormValue, 'sexe', '')}`;
        },
        set(slug) {
          let className = slug.split('_').shift();
          let sexe = slug.split('_').pop();

          this.formValue = _.merge({}, this.formValue, {
            slug,
            className,
            sexe,
            imagePath: `/static/images/avatars/${_.toLower(slug)}.png`,
          });
        }
      },
      initiative: {
        get() {
          return _.get(this.currentFormValue, 'initiative', 0);
        },
        set(value) {
          this.formValue.initiative = value;
        }
      },
    },
    methods: {
      ...mapActions([
        'toggleDialog',
        'addCharacter',
        'updateCharacter',
      ]),
      close() {
        /*        this.character = null;
                this.ini = 0;*/
        this.formValue = {};
        this.toggleDialog(DIALOG.PROCESS_SETTINGS);
      },
      save() {
        this.updateCharacter(_.merge({}, this.$store.getters.editingCharacter, this.formValue));
        this.close();
      }
    }
    /*    computed: {
          filterByName(item, query, idk) {
            console.log('item : ', item)
            console.log('query : ', query)
            console.log('idk : ', idk)
          }
        }*/
  }
</script>

<style scoped>

</style>