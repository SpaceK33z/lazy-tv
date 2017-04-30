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

    constructor(data) {
        this.id = data.id;
        this.program = data.program;
    }

    toStorage() {
        return {
            id: this.id,
            program: this.program,
        };
    }
}
