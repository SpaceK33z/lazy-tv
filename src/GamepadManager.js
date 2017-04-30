import Gamepad from './patch/gamepad';
import { remote } from 'electron';

const getCurrentWindow = remote.getCurrentWindow;

// http://keycode.info/
const GAMEPAD_KEYBOARD_MAPPING = {
    button_1: [32, 13],
    button_2: [8, 46],
    d_pad_up: [38, 87],
    d_pad_down: [40, 83],
    d_pad_left: [37, 65],
    d_pad_right: [39, 68],
    start: 27,
};

export default class GamepadManager {
    _gp = null;

    constructor() {
        this._gp = new Gamepad();
        this._gp.setCustomMapping('keyboard', GAMEPAD_KEYBOARD_MAPPING);

        getCurrentWindow().on('focus', this.resume);
        getCurrentWindow().on('blur', this.pause);
    }

    on(...args) {
        this._gp.on(...args);
    }

    off(...args) {
        this._gp.off(...args);
    }

    pause = () => {
        this._gp.pause();
    };

    resume = () => {
        this._gp.resume();
    };
}
