// TODO: yes, this is stupid. I need to find a better workaround...
const electron = window.require('electron');

export const app = electron.remote.app;
export const fs = electron.remote.require('fs');
export const path = electron.remote.require('path');
export const childProcess = electron.remote.require('child_process');
export const process = electron.remote.process;
export const nativeImage = electron.remote.nativeImage;
export const dialog = electron.remote.dialog;
export const shell = electron.remote.shell;
