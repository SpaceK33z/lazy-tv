import { observable, computed } from 'mobx';
import Gamepad from './patch/gamepad';
import Config from './Config';

const DEFAULT_CONFIG = {
    games: [],
};

export default class ViewStore {
    @observable games = [];
    @observable selectedGame = null;
    @observable gamepads = [];
    gamepadInstance = null;

    constructor() {
        const config = new Config({ configName: 'config', defaults: DEFAULT_CONFIG });
        this.games = config.get('games');
        if (this.games.length) {
            this.selectedGame = this.games[0];
        }
        this.gamepadInstance = new Gamepad();

        this.gamepadInstance.on('connect', (e) => {
            this.gamepads.push(e);
        });

        this.gamepadInstance.on('disconnect', (e) => {
            const gamepad = this.gamepads.find((gp) => gp.index === e.index);
            if (gamepad) {
                this.gamepads.remove(gamepad);
            }
        });
    }

    @computed get selectedGameIndex() {
        return this.games.indexOf(this.selectedGame);
    }

    changeGame(direction) {
        const index = this.selectedGameIndex;
        const newIndex = direction === 'left' ? index - 1 : index + 1;
        if (newIndex < this.games.length && newIndex >= 0) {
            this.selectedGame = this.games[newIndex];
        }
    }
}
