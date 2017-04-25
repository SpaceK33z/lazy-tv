import { observable, computed } from 'mobx';
import Game from './Game';
import Gamepad from './patch/gamepad';
import Config from './Config';
import { fs, app, path, shell } from './electron';
import TaskManager from './TaskManager';
import uuid from 'uuid/v4';

const DEFAULT_CONFIG = {
    games: [],
};
const userDataPath = app.getPath('userData');

export default class ViewStore {
    @observable games = [];
    @observable selectedGame = null;
    @observable gamepads = [];
    @observable notifications = [];
    @observable currentView = 'home';
    @observable taskManager = new TaskManager();
    gpInstance = null;
    config = null;

    constructor() {
        this.config = new Config({ configName: 'config', defaults: DEFAULT_CONFIG });
        this.games = this.config.get('games').map(game => new Game(game));
        this.taskManager.setGames(this.games);
        if (this.games.length) {
            this.selectedGame = this.games[0];
        }
        this.gpInstance = new Gamepad();

        this.gpInstance.on('connect', e => {
            this.gamepads.push(e);
        });

        this.gpInstance.on('disconnect', e => {
            const gamepad = this.gamepads.find(gp => gp.index === e.index);
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
        this.addNotification({
            message: 'Launching game…',
            key: 'startGame',
            dismissAfter: 4000,
        });
        this.taskManager.start(this.selectedGame);
    }

    addGame(game, poster) {
        return new Promise((resolve, reject) => {
            const newGame = Object.assign({}, game, { id: uuid() });
            this.games.push(newGame);
            this.saveGamesToConfig();
            if (poster) {
                const folderPath = path.join(userDataPath, 'posters');
                const filePath = path.join(folderPath, `${newGame.id}.png`);
                fs.mkdir(folderPath, err => {
                    if (err && err.code !== 'EEXIST') throw err;
                    fs.writeFile(filePath, poster.toPng(), err => {
                        if (err) throw err;
                        resolve();
                    });
                });
            }
        });
    }

    removeGame(game) {
        this.games.remove(game);
        this.saveGamesToConfig();
        const filePath = path.join(userDataPath, 'posters', `${game.id}.png`);
        shell.moveItemToTrash(filePath);
    }

    saveGamesToConfig() {
        this.config.set('games', this.games.map(game => game.toStorage()));
    }

    addNotification(msg) {
        // Notifications with the same key have the same contents, so we don't want to display them twice.
        // Existing ones are removed so the notification stays longer on the screen.
        const existingMsg = this.notifications.find(a => a.key === msg.key);
        if (existingMsg) {
            this.notifications.remove(existingMsg);
        }
        this.notifications.push(msg);
    }
}
