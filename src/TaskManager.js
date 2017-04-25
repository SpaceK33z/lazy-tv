import { childProcess, process, shell, app, path, IS_PROD } from './electron';
import csvParse from 'csv-parse/lib/sync';

// To run an executable that is in our public/ folder, we need to exclude it from the ASAR archive in package.json first,
// and then adjust the path to the public folder to get it to run.
let publicDir = path.join(`${app.getAppPath()}.unpacked`, 'public/');
if (!IS_PROD) {
    publicDir = path.join('public');
}

const CHECK_RUN_INTERVAL = 6000;

export default class TaskManager {
    games = [];
    interval = null;
    // Keep track of running jobs, so we don't do multiple at once.
    checkRunning = false;

    constructor() {
        this.interval = setInterval(() => {
            this.checkTasks();
        }, CHECK_RUN_INTERVAL);
    }

    setGames(games) {
        this.games = games;
        this.checkTasks();
    }

    destroy() {
        clearInterval(this.interval);
    }

    checkTasks() {
        if (this.checkRunning || process.platform !== 'win32') {
            console.log('prevented running')
            return Promise.resolve();
        }
        this.checkRunning = true;
        return new Promise((resolve) => {
            childProcess.exec(`tasklist /fo:csv`, (err, stdout, stderr) => {
                if (err) console.error(err);
                const output = csvParse(stdout, { columns: true });
                const tasks = output.map(task => {
                    return {
                        pid: task.PID,
                        name: task['Image Name'],
                    };
                });
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
        this.checkTasks()
        .then(() => {
            if (game.pid) {
                const runScript = `"${path.join(publicDir, 'activate-window-by-pid.exe')}" ${game.pid}`;
                console.log('Game already started, trying to focus it...', game.pid);
                childProcess.exec(runScript, (err, stdout, stderr) => {
                    if (err) console.error(err);
                });
            } else {
                console.log('Game seems not active, starting...');
                childProcess.spawn('cmd', ['/c', 'start', '""', game.program]);
            }
        });
    }
}
