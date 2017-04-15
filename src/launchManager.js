import { childProcess, process, shell, app, path, IS_PROD } from './electron';
import csvParse from 'csv-parse/lib/sync';

// To run an executable that is in our public/ folder, we need to exclude it from the ASAR archive in package.json first,
// and then adjust the path to the public folder to get it to run.
let publicDir = path.join(`${app.getAppPath()}.unpacked`, 'public/');
if (!IS_PROD) {
    publicDir = path.join('public');
}

export function startGame(program) {
    if (process.platform !== 'win32') {
        shell.openItem(program);
        return;
    }
    const programPathSplit = program.split('\\');
    const programExe = programPathSplit[programPathSplit.length - 1];
    childProcess.exec(`tasklist /fo:csv`, (err, stdout, stderr) => {
        if (err) console.error(err);
        const output = csvParse(stdout, { columns: true });
        const activeProgram = output.find(data => data['Image Name'] === programExe);
        if (activeProgram) {
            const programId = activeProgram['PID'];
            const runScript = `"${path.join(publicDir, 'activate-window-by-pid.exe')}" ${programId}`;
            console.log('Game already started, trying to focus it...', activeProgram);
            childProcess.exec(runScript, (err, stdout, stderr) => {
                if (err) console.error(err);
            });
        } else {
            console.log('Game seems not active, starting...');
            childProcess.spawn('cmd', ['/c', 'start', '""', program]);
        }
    });
}
