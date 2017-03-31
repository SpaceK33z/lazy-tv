import { observable, computed } from 'mobx';
import Gamepad from './patch/gamepad';
import Config from './Config';

const GAMES = [
    {
        title: 'Plex',
        poster: 'static/posters/plex.png',
    },
    {
        title: 'YouTube',
        poster: 'static/posters/youtube.png',
    },
    {
        title: 'Battlefield 4',
        poster: 'static/posters/battlefield-4.jpg',
    },
    {
        title: 'Rocket League',
        poster: 'static/posters/rocket-league.jpg',
    },
    {
        title: 'Goat Simulator',
        poster: 'static/posters/goat-simulator.jpg',
    },
    {
        title: 'Besiege',
        poster: 'static/posters/besiege.jpg',
    },
    {
        title: 'Grand Theft Auto V',
        poster: 'static/posters/grand-theft-auto-v.jpg',
    },
    {
        title: 'Battlefield 1',
        poster: 'static/posters/battlefield-1.jpg',
    },
    {
        title: 'Horizon Zero Dawn',
        poster: 'static/posters/horizon-zero-dawn.png',
    },
];

export default class ViewStore {
    @observable games = GAMES;
    @observable selectedGame = null;
    @observable gamepads = [];
    gamepadInstance = null;

    constructor() {
        const config = new Config({ configName: 'config', defaults: {} });
        this.selectedGame = this.games[0];

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
