const electron = window.require('electron');

export const app = electron.remote.app;
export const fs = electron.remote.require('fs');
export const nativeImage = electron.remote.nativeImage;