const state = {
  teams: [],
  selectedTeamId: null,
};

const mutations = {
  ADD_TEAM(state, { id, processes }) {
    if (state.teams.findIndex(t => t.id === id) < 0) {
      let processIds = [];
      if (processes && processes.length > 0) {
        processIds = processes.map(p => p.id);
      }
      state.teams.push({
        name: 'ok',
        id,
        processIds,
      });
      if (!state.selectedTeamId) {
        state.selectedTeamId = id;
      }
    }
  },
  REMOVE_TEAM(state, payload) {
    let index = state.teams.findIndex(t => t.id === payload.id);

    if (index > -1) {
      state.teams.splice(index, 1);
      if (this.selectedTeamId === payload.id) {
        this.selectedTeamId = null;
      }
    }
  },
  UPDATE_TEAMS(state, payload) {
    state.teams = payload;
  },
  ADD_PROCESS_TO_TEAM(state, { id, process }) {
    let index = state.teams.findIndex(t => t.id === id);

    if (index > -1) {
      let processIndex = state.teams[index].processIds.findIndex(p => p.id === process.id);

      if (index < 1) {
        state.teams[index].processIds.push(process.id);
      }
    }
  },
  REMOVE_PROCESS_FROM_TEAM(state, { id, processId }) {
    let index = state.teams.findIndex(t => t.id === id);

    if (index > -1) {
      let processIndex = state.teams[index].processIds.findIndex(p => p === processId);

      if (processIndex > -1) {
        state.teams[index].processIds.splice(processIndex, 1);
      }
    }
  },
  REMOVE_PROCESSES_FROM_TEAM(state, id) {
    let index = state.teams.findIndex(t => t.id === id);

    if (index > -1) {
      state.teams[index].processIds = [];
    }
  },
  UPDATE_TEAM_PROCESSES(state, { id, processes }) {
    let index = state.teams.findIndex(t => t.id === id);

    if (index > -1) {
      //state.teams[index].processes.splice(0, state.teams[index].processes.length, payload.processes);
      state.teams[index].processIds = processes.map(p => p.id);
    }
  },
};

const getters = {
  teams: (state, getters) => state.teams,
  teamById: (state, getters) => id => getters.teams.find(t => t.id === id),
  teamProcesses: (state, getters) => {
    return id => {
      let team = getters.teamById(id);

      return team.processIds.map(id => getters.byId(id));
    }
  }
};

export default {
  state,
  mutations,
  getters,
};
