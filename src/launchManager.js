import { childProcess, process, shell } from './electron';
import csvParse from 'csv-parse/lib/sync';

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
            const runScript = `.\\public\\activate-window-by-pid.exe ${programId}`;
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
