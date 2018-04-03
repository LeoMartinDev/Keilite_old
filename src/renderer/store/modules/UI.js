export const DIALOG = {
  TERMINATE_ALL: 'terminateAll',
  REPAIR: 'repair',
  PROCESS_SETTINGS: 'processSettings',
  FIRST_START: 'firstStart',
};

const firstStart = localStorage.getItem('firstStart') === undefined || (localStorage.getItem('firstStart') === "true");

const state = {
  firstStart,
  dialogs: {
    [DIALOG.TERMINATE_ALL]: false,
    [DIALOG.REPAIR]: false,
    [DIALOG.PROCESS_SETTINGS]: false,
    [DIALOG.FIRST_START]: firstStart,
  },
};

const mutations = {
  UPDATE_DIALOG(state, { dialog, value }) {
    if (state.dialogs[dialog] !== null) {
      state.dialogs[dialog] = value;
    }
  },
};

const actions = {
  updateDialog({ commit, state }, { dialog, value }) {
    if (dialog === DIALOG.FIRST_START) {
        localStorage.setItem('firstStart', value);
    }
    commit('UPDATE_DIALOG', { dialog, value });
  },
  toggleDialog({ commit, state }, payload) {
    if (state.dialogs[payload] !== null) {
      commit('UPDATE_DIALOG', { dialog: payload, value: !state.dialogs[payload] });
    }
  },
};

const getters = {
  dialogs: (state, getters) => state.dialogs,
};

export default {
  state,
  mutations,
  getters,
  actions,
};
