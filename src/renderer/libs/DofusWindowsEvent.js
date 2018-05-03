import {getProcessesByNameAsync} from 'windows-process';
import {EventEmitter} from 'events';

export default class DofusWindowsEvent extends EventEmitter {

  constructor() {
    super();
    this.loop.call(this, []);
  }

  loop(connectedProcesses) {
    setTimeout(() => {
      getProcessesByNameAsync("Dofus")
        .then(processes => {
          connectedProcesses = connectedProcesses.filter(process => {
            let index = processes.findIndex(value => value.id === process.id);

            if (index < 0) {
              this.emit('close', process);
              return false;
            }
            return true;
          });
          processes.forEach(process => {
            let index = connectedProcesses.findIndex(value => value.id === process.id);

            if (process.mainWindowTitle.startsWith("Dofus")) {
              if (index > -1) {
                if (connectedProcesses.splice(index, 1).length > 0) {
                  this.emit('logout', process);
                }
              } else {
                this.emit('new-window', process);
              }
            }
            else if (process.mainWindowTitle !== "" && process.mainWindowTitle.includes(" - ")) {
              if (index < 0) {
                connectedProcesses.push(process);
                this.emit('login', process);
              }
            }
            else {
            }
          });
          this.loop.call(this, connectedProcesses.slice(0));
        })
        .catch(console.error);
    }, 300);
  };

}