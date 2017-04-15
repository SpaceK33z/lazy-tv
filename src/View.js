import { observable, computed } from 'mobx';
import Gamepad from './patch/gamepad';
import Config from './Config';
import { fs, app, path, shell, childProcess } from './electron';
import csvParse from 'csv-parse/lib/sync';

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
        const programSplit = program.split('\\');
        const programExe = programSplit[programSplit.length-1];
        const programName = programExe.replace('.exe', '');
        childProcess.exec(`tasklist /fo:csv`, (err, stdout, stderr) => {
            if (err) console.error(err);
            const output = csvParse(stdout, { columns: true });
            const activeProgram = output.find((data) => {
                return data['Image Name'] === programExe;
            });
            if (activeProgram) {
                const programId = activeProgram['PID'];
                console.log('Game already started, trying to focus it...', programName, activeProgram);
                childProcess.exec(`.\\public\\activate-window-by-pid.exe ${programId}`, (err, stdout,stderr) => {
                    if (err) console.error(err);
                });
                // childProcess.exec(`powershell.exe "./public/set-active-window.ps1 -process \\"${programId}\\""`, (err, stdout,stderr) => {
                //     if (err) console.error(err);
                // });
                // childProcess.exec(`echo (new ActiveXObject("WScript.Shell")).AppActivate("${programTitle}"); > focus.js && cscript //nologo focus.js && del focus.js`, (err, stdout,stderr) => {
                //     if (err) console.error(err);
                // });
            } else {
                console.log('Game seems not active, starting...');
                childProcess.spawn('cmd', ['/c', 'start', '""', program]);
            }
        });
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
