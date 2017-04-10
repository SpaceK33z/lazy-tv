import { observable, computed } from 'mobx';
import Gamepad from './patch/gamepad';
import Config from './Config';
import { fs, app, path, shell } from './electron';

const DEFAULT_CONFIG = {
    games: [],
};
const userDataPath = app.getPath('userData');

export default class ViewStore {
    @observable games = [];
    @observable selectedGame = null;
    @observable gamepads = [];
    @observable currentView = 'home';
    gpInstance = null;
    config = null;

    constructor() {
        this.config = new Config({ configName: 'config', defaults: DEFAULT_CONFIG });
        this.games = this.config.get('games');
        if (this.games.length) {
            this.selectedGame = this.games[0];
        }
        this.gpInstance = new Gamepad();

        this.gpInstance.on('connect', (e) => {
            this.gamepads.push(e);
        });

        this.gpInstance.on('disconnect', (e) => {
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

    openGame() {
        const { program } = this.selectedGame;

        if (!program) {
            // TODO: Maybe show an error notification here one day.
            return;
        }
        shell.openItem(program);
    }

    addGame(game, poster) {
        return new Promise((resolve, reject) => {
            this.games.push(game);
            this.config.set('games', this.games);
            if (poster) {
                const folderPath = path.join(userDataPath, 'posters');
                const filePath = path.join(folderPath, `${game.title}.png`);
                fs.mkdir(folderPath, (err) => {
                    if (err && err.code !== 'EEXIST') throw err;
                    fs.writeFile(filePath, poster.toPng(), (err) => {
                        if (err) throw err;
                        resolve();
                    });
                });
            }
        });
    }

    removeGame() {
        const game = this.selectedGame;
        this.games.remove(game);
        this.config.set('games', this.games);
        const filePath = path.join(userDataPath, 'posters', `${game.title}.png`);
        shell.moveItemToTrash(filePath);
    }
}
