import { observable, computed } from 'mobx';

// TODO: I don't like the location of this file.

export default class Game {
    @observable id = '';
    @observable program = '';
    @observable disableSmartStart = false;
    @observable pid = '';

    @computed get isRunning() {
        return !!this.pid;
    }

    constructor(data = {}) {
        if (data.id) {
            this.id = data.id;
        }
        if (data.program) {
            this.program = data.program;
        }
        if (data.disableSmartStart) {
            this.disableSmartStart = data.disableSmartStart;
        }
    }

    toStorage() {
        return {
            id: this.id,
            program: this.program,
            disableSmartStart: this.disableSmartStart,
        };
    }
}
