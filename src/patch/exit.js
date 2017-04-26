import { exec } from 'child_process';

// TODO: One day I want to turn this into a package.

// *RESOURCES*
// For Windows:
// https://superuser.com/questions/463646/is-there-a-command-line-tool-to-put-windows-8-to-sleep/463652#463652
// For macOS:
// https://apple.stackexchange.com/questions/103571/using-the-terminal-command-to-shutdown-restart-and-sleep-my-mac
// For Linux:
// https://askubuntu.com/questions/168879/shutdown-from-terminal-without-entering-password

const unsupported = () => {
    throw new Error(`Unsupported platform: ${process.platform}`);
};

export function shutdown() {
    if (process.platform === 'win32') {
        return exec('Shutdown.exe -s -t 00');
    }
    if (process.platform === 'darwin') {
        return exec(`osascript -e 'tell app "System Events" to shut down'`);
    }
    if (process.platform === 'linux') {
        // TODO: this won't work without sudo, but I don't care for now.
        return exec('shutdown -h now');
    }
    unsupported();
}

export function sleep() {
    if (process.platform === 'win32') {
        return exec('rundll32.exe powrprof.dll,SetSuspendState 0,1,0');
    }
    if (process.platform === 'darwin') {
        return exec('pmset sleepnow');
    }
    if (process.platform === 'linux') {
        return exec('pm-suspend');
    }
    unsupported();
}

export function restart() {
    if (process.platform === 'win32') {
        return exec('Shutdown.exe -r -t 00');
    }
    if (process.platform === 'darwin') {
        return exec(`osascript -e 'tell app "System Events" to restart'`);
    }
    if (process.platform === 'linux') {
        // TODO: this won't work without sudo, but I don't care for now.
        return exec('shutdown -r now');
    }
    unsupported();
}
