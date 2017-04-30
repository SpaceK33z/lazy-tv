import { IS_PROD } from './electron';
import { shell, remote } from 'electron';
import { exec, spawn } from 'child_process';
import path from 'path';
import fkill from 'fkill';
import tasklist from 'tasklist-stream';

const getCurrentWindow = remote.getCurrentWindow;

// To run an executable that is in our public/ folder, we need to exclude it from the ASAR archive in package.json first,
// and then adjust the path to the public folder to get it to run.
let publicDir = path.join(`${remote.app.getAppPath()}.unpacked`, 'public/');
if (!IS_PROD) {
    publicDir = path.join('public');
}

const CHECK_RUN_INTERVAL = 5000;

export default class TaskManager {
    games = [];
    interval = null;
    // Keep track of running jobs, so we don't do multiple at once.
    checkRunning = false;

    constructor() {
        this.setInterval();
        // Disable task interval when in background to save cpu/memory.
        getCurrentWindow().on('focus', this.resume);
        getCurrentWindow().on('blur', this.pause);
    }

    resume = () => {
        this.checkTasks();
        this.setInterval();
    };

    pause = () => {
        this.removeInterval();
    };

    setInterval() {
        this.removeInterval();
        this.interval = setInterval(() => {
            this.checkTasks();
        }, CHECK_RUN_INTERVAL);
    }

    removeInterval() {
        clearInterval(this.interval);
    }

    setGames(games) {
        this.games = games;
        this.checkTasks();
    }

    checkTasks() {
        if (this.checkRunning || process.platform !== 'win32') {
            return Promise.resolve();
        }
        this.checkRunning = true;
        return new Promise(resolve => {
            const t = tasklist();
            const tasks = [];
            t.on('data', task => {
                tasks.push({
                    pid: task.pid,
                    name: task.imageName,
                });
            });
            t.on('finish', () => {
                this._updateGames(tasks);
                this.checkRunning = false;
                resolve();
            });
        });
    }

    _updateGames(tasks) {
        this.games.forEach(game => {
            const programPathSplit = game.program.split('\\');
            const programExe = programPathSplit[programPathSplit.length - 1];
            const relatedTask = tasks.find(task => task.name === programExe);
            game.pid = relatedTask ? relatedTask.pid : undefined;
        });
    }

    start(game) {
        if (process.platform !== 'win32') {
            shell.openItem(game.program);
            return;
        }
        // Before starting, we'll check again if the game is not running.
        // Perhaps one day, we can listen to program start/stop events...
        this.checkTasks().then(() => {
            if (!game.disableSmartStart && game.pid) {
                const runScript = `"${path.join(publicDir, 'activate-window-by-pid.exe')}" ${game.pid}`;
                console.log('Game already started, trying to focus it...', game.pid);
                exec(runScript, (err, stdout, stderr) => {
                    if (err) console.error(err);
                });
            } else {
                console.log('Game seems not active, starting...');
                spawn('cmd', ['/c', 'start', '""', game.program]);
            }
        });
    }

    stop(game) {
        if (game.pid) {
            fkill(game.pid);
        }
    }
}
