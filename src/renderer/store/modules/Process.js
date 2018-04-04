import {DIALOG} from "./UI";
import {setToForegroundAsync} from "windows-process";

const state = {
  processes: [],
  focusedProcessId: null,
  editingProcessId: null,
};

const mutations = {
  ADD_PROCESS(state, payload) {
    if (state.processes.findIndex(p => p.id === payload.id) < 0) {
      payload.disabled = false;
      state.processes.push(payload);
    }
  },
  REMOVE_PROCESS(state, payload) {
    let index = state.processes.findIndex(p => p.id === payload.id);

    if (index > -1) {
      if (payload.id === state.editingProcessId) {
        state.editingProcessId = null;
      }
      if (payload === state.focusedProcessId) {
        state.focusedProcessId = null;
      }
      state.processes.splice(index, 1);
    }
  },
  UPDATE_PROCESSES(state, payload) {
    state.processes = payload;
  },
  UPDATE_FOCUSED_PROCESS(state, payload) {
    if (payload && payload.id) {
      state.focusedProcessId = payload.id;
    }
  },
  UPDATE_EDITING_PROCESS(state, payload) {
    if (payload && payload.id) {
      state.editingProcessId = payload.id;
    }
  },
  REMOVE_PROCESSES(state) {
    state.processes.splice(0, state.processes.length);
  },
  TOGGLE_ACCESSIBILITY(state, payload) {
    let index = state.processes.findIndex(p => p.id === payload.id);

    if (index > -1) {
      state.processes[index].disabled = !state.processes[index].disabled;
    }
  }
};

const actions = {
  updateFocusedProcess({commit, state}, processId) {
    commit('UPDATE_FOCUSED_PROCESS', processId);
  },
  removeProcesses({commit, state}) {
    /*state.teams.forEach(team => commit('REMOVE_PROCESSES_FROM_TEAM', team.id));*/
    commit('REMOVE_PROCESSES');
  },
  updateProcesses({commit, state}, processes) {
    commit('UPDATE_PROCESSES', processes);
  },
  addProcess({commit, state, dispatch}, process) {
    commit('ADD_PROCESS', process);
    dispatch('notifyCharacter', process);
  },
  toggleAccessiblity({commit, state, dispatch}, process) {
    commit('TOGGLE_ACCESSIBILITY', process);
  },
  editProcess({commit, state, dispatch}, process) {
    commit('UPDATE_EDITING_PROCESS', process);
    dispatch('toggleDialog', DIALOG.PROCESS_SETTINGS);
  },
  focusProcess({commit, state, getters}, process) {
    if (process && process.id !== state.focusedProcessId) {
      //process.setToForeground();
      setToForegroundAsync(process.mainWindowHandle).then(success => {
          if (!success) console.error(error);
          else {
            commit('UPDATE_FOCUSED_PROCESS', process);
          }
      }).catch(error => {
          console.error(error);
        });
    }
  },
  focusNextProcess({ commit, state, dispatch, getters }) {
    if (getters.processByCharacterInitiative.length < 1) return;
    if (!state.focusedProcessId) {
      /*this.$store.commit('ADD_TEAM', { id: v4(), processes: [process] });*/
      dispatch('updateFocusedProcess', getters.processByCharacterInitiative[0]);
    }
    let currentIndex = getters.processByCharacterInitiative.findIndex(p => p.id === state.focusedProcessId);
    if (currentIndex + 1 > getters.processByCharacterInitiative.length - 1) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
    let process = getters.processByCharacterInitiative[currentIndex];

    dispatch('focusProcess', process);
  },
  focusPreviousProcess({ commit, state, dispatch, getters }) {
    if (getters.processByCharacterInitiative.length < 1) return;
    if (!state.focusedProcessId) {
      /*this.$store.commit('ADD_TEAM', { id: v4(), processes: [process] });*/
      dispatch('updateFocusedProcess', getters.processByCharacterInitiative[0]);
    }
    let currentIndex = getters.processByCharacterInitiative.findIndex(p => p.id === getters.focusedProcessId);
    if (currentIndex - 1 < 0) {
      currentIndex = getters.processByCharacterInitiative.length - 1;
    } else {
      currentIndex--;
    }
    let process = getters.processByCharacterInitiative[currentIndex];

    dispatch('focusProcess', process);
  },
  closeConnectedProcesses({commit, state, dispatch, getters}) {
    getters.processes.forEach(process => {
      if (process.terminate) {
        process.terminate();
      }
    });
  },
  removeProcess({commit, state, getters, dispatch}, process) {
    if (getters.editingProcessId === process.id) {
      dispatch('updateDialog', { dialog: DIALOG.PROCESS_SETTINGS, value: false });
    }
    dispatch('disconnectCharacter', process);
    commit('REMOVE_PROCESS', process);
  },
  terminateProcess({ commit, state, dispatch }, process) {
    if (process) {
      dispatch('removeProcess', process);
      process.terminate();
    }
  }
};

// TODO Order by initiative in getters

const getters = {
  processes: (state, getters) => state.processes,
  focusedProcessId: (state) => state.focusedProcessId,
  focusedProcess: (state, getters) => getters.processes.find(p => p.id === getters.focusedProcessId),
  editingProcessId: (state) => state.editingProcessId,
  editingProcess: (state, getters) => getters.processes.find(p => p.id === getters.editingProcessId),
  byId: (state, getters) => id => getters.processes.find(p => p.id === id),
  processByWindowTitle: (state, getters) => windowTitle => getters.processes.find(p => p.mainWindowTitle === windowTitle),
  processByWindowTitleQuery: (state, getters) => query => getters.processes.find(p => p.mainWindowTitle.includes(query)),
  processByCharacterInitiative: (state, getters) => {
    let p = getters.processes.slice(0);

    p.sort((a, b) => {
      let aC = getters.getCharacterByWindowTitle(a.mainWindowTitle);
      let bC = getters.getCharacterByWindowTitle(b.mainWindowTitle);

      return aC.initiative < bC.initiative;
    })
  return p;
  },
};

export default {
  state,
  mutations,
  getters,
  actions,
};
