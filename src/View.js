import { observable, computed } from 'mobx';
import Game from './Game';
import Config from './Config';
import { remote, shell } from 'electron';
import fs from 'fs';
import path from 'path';
import TaskManager from './TaskManager';
import GamepadManager from './GamepadManager';
import uuid from 'uuid/v4';

const DEFAULT_CONFIG = {
    games: [],
};
const userDataPath = remote.app.getPath('userData');

export default class ViewStore {
    @observable games = [];
    @observable selectedGame = null;
    @observable gamepads = [];
    @observable notifications = [];
    @observable currentView = { screen: 'home' };
    @observable taskManager = new TaskManager();
    @observable gamepadManager = new GamepadManager();
    config = null;

    constructor() {
        this.config = new Config({ configName: 'config', defaults: DEFAULT_CONFIG });
        this.games = this.config.get('games').map(game => new Game(game));
        this.taskManager.setGames(this.games);
        if (this.games.length) {
            this.selectedGame = this.games[0];
        }

        this.gamepadManager.on('connect', e => {
            this.gamepads.push(e);
        });

        this.gamepadManager.on('disconnect', e => {
            const gamepad = this.gamepads.find(gp => gp.index === e.index);
            if (gamepad) {
                this.gamepads.remove(gamepad);
            }
        });
    }

    @computed get selectedGameIndex() {
        return this.games.indexOf(this.selectedGame);
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

    stopGame() {
        this.addNotification({
            message: 'Stopping game…',
            key: 'stopGame',
            dismissAfter: 1000,
        });
        this.taskManager.stop(this.selectedGame);
    }

    addGame(game, poster) {
        return new Promise((resolve, reject) => {
            game.id = uuid();
            this.games.push(game);
            this.saveGamesToConfig();
            if (poster) {
                const folderPath = path.join(userDataPath, 'posters');
                const filePath = path.join(folderPath, `${game.id}.png`);
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
