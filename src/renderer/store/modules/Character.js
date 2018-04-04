import * as _ from 'lodash';
import {DIALOG} from "./UI";

export function toCharacterName(value) {
  if (!value) return '';
  if (!value.includes(' - Dofus')) return value;
  value = value.toString();
  return value.split(' - Dofus').shift();
}

const state = {
  characters: JSON.parse(localStorage.getItem('characters')) || [],
  editingCharacter: null,
};

const mutations = {
  ADD_CHARACTER: (state, payload) => {
    let index = state.characters.findIndex(c => c.name === payload.name);
    if (index < 0) {
      let storage = JSON.parse(localStorage.getItem('characters')) || [];

      storage.push(payload);
      localStorage.setItem('characters', JSON.stringify(storage));
      state.characters.push(payload);
    }
  },
  UPDATE_EDITING_CHARACTER(state, payload) {
    state.editingCharacter = payload.name;
  },
  UPDATE_CHARACTER: (state, payload) => {
    let index = state.characters.findIndex(c => c.name === payload.name);

    if (index > -1) {
      let storage = JSON.parse(localStorage.getItem('characters')) || [];
      let storageIndex = storage.findIndex(c => c.name === payload.name);

      storage[storageIndex] = payload;
      localStorage.setItem('characters', JSON.stringify(storage));
      state.characters.splice(index, 1, payload);
    }
  },
  REMOVE_CHARACTER(state, payload) {
    let index = state.characters.findIndex(c => c.name === toCharacterName(payload.name));

    if (index > -1) {
      let storage = JSON.parse(localStorage.getItem('characters')) || [];
      let storageIndex = storage.findIndex(c => c.name === toCharacterName(payload.name));

      storage.splice(storageIndex, 1);
      localStorage.setItem('characters', JSON.stringify(storage));
      state.characters.splice(index, 1);
    }
  },
  REMOVE_CHARACTERS(state, payload) {
    localStorage.setItem('characters', JSON.stringify([]));
    state.characters = [];
  },
};

const actions = {
  notifyCharacter({ commit, state, dispatch }, process) {
    let index = state.characters.findIndex(c => c.name === process.mainWindowTitle);

    if (index < 0) {
      commit('ADD_CHARACTER', {
        name: toCharacterName(process.mainWindowTitle),
        initiative: 0,
        className: null,
        imagePath: null,
        sexe: null,
        startedAt: new Date(),
        connectedTime: 0, //seconds
        id: process.id,
      });
    } else {
      commit('UPDATE_CHARACTER', { startedAt: new Date(), id: process.id });
    }
  },
  disconnectCharacter({commit, state, dispatch, getters}, process) {
    let character = getters.getCharacterById(process.id);

    if (character) {

      commit('UPDATE_CHARACTER', _.merge({}, character, {
        startedAt: '',
        connectedTime: ((new Date() - character.startedAt) / 1000) + character.connectedTime,
        id: null,
      }));
    }
  },
  addCharacter({commit, state, dispatch}, character) {
    commit('ADD_CHARACTER', character);
  },
  updateCharacter({commit, state, dispatch}, character) {
    commit('UPDATE_CHARACTER', character);
  },
  upsertCharacter({commit, state, dispatch, getters}, character) {
    let index = getters.characters.findIndex(c => c.name === character.name);

    if (index > -1) {
      commit('UPDATE_CHARACTER', character);
    } else {
      commit('ADD_CHARACTER', character);
    }
  },
  removeCharacter({commit, state, dispatch}, character) {
    commit('REMOVE_CHARACTER', character);
  },
  removeCharacters({commit, state, dispatch}) {
    commit('REMOVE_CHARACTERS');
  },
  editCharacter({commit, state, dispatch}, process) {
    commit('UPDATE_EDITING_CHARACTER', process);
    dispatch('toggleDialog', DIALOG.PROCESS_SETTINGS);
  },
};

// TODO Order by initiative in getters

const getters = {
  characters: (state, getters) => state.characters,
  getCharacterByName: (state, getters) => name => getters.characters.find(c => c.name === name),
  getCharacterByWindowTitle: (state, getters) => windowTitle => getters.characters.find(c => c.name === toCharacterName(windowTitle)),
  getCharacterById: (state, getters) => id => getters.characters.find(c => c.id === id),
  editingCharacter: (state, getters) => getters.getCharacterByName(state.editingCharacter),
  disconnectedCharacters: (state, getters) => getters.characters.filter(c => getters.processByWindowTitleQuery(`${c.name} - Dofus`) === undefined),
  characterByInitiative: (state, getters) => getters.characters.sort((a, b) => a.initiative < b.initiative),
};

export default {
  state,
  mutations,
  getters,
  actions,
};
