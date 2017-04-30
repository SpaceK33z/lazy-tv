import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { debounce } from 'lodash';
import navigationSound from '../asset/navigationSound.mp3';

const AXIS_DEBOUNCE_MS = 100;
const AXIS_DEBOUNCE_WAIT_MS = 200;
const AXIS_MOVE_TRESHOLD = 0.75;

@observer
export default class KeyNavigation extends Component {
    static propTypes = {
        items: PropTypes.array.isRequired,
        activeItem: PropTypes.string.isRequired,
        onActiveChange: PropTypes.func.isRequired,
        onEnter: PropTypes.func.isRequired,
        onBack: PropTypes.func.isRequired,
        store: PropTypes.object.isRequired,
    };

    static defaultProps = {
        items: [],
        activeItem: '',
        onActiveChange() {},
    };

    playSoundEffect() {
        const audio = new Audio(navigationSound);
        audio.volume = 0.15;
        audio.play();
    }

    _moveTo = (direction) => {
        const { activeItem, items } = this.props;
        const activeIndex = items.indexOf(activeItem);
        if (activeIndex >= 0) {
            const newIndex = direction === 'left' ? (activeIndex - 1) : (activeIndex + 1);
            if (items[newIndex]) {
                this.props.onActiveChange(items[newIndex]);
            }
        }
        this.playSoundEffect();
    };

    gpLeft = () => {
        this.moveToFromAxis('left');
    };

    gpRight = () => {
        this.moveToFromAxis('right');
    };

    moveToFromAxis = debounce(
        direction => {
            this._moveTo(direction);
        },
        AXIS_DEBOUNCE_MS,
        { maxWait: AXIS_DEBOUNCE_WAIT_MS, immediate: true }
    );

    gpButton1 = () => {
        this.props.onEnter();
    };

    gpButton2 = () => {
        this.props.onBack();
    };

    gpAxis = e => {
        const [x] = e.value;
        if (x > AXIS_MOVE_TRESHOLD) {
            this.moveToFromAxis('right');
        }
        if (x < -AXIS_MOVE_TRESHOLD) {
            this.moveToFromAxis('left');
        }
    };

    componentDidMount() {
        const { gamepadManager } = this.props.store;
        gamepadManager.on('hold', 'stick_axis_left', this.gpAxis);
        // Note that this also reacts on keyboard arrow left!
        gamepadManager.on('hold', 'd_pad_left', this.gpLeft);
        gamepadManager.on('hold', 'd_pad_up', this.gpLeft);
        // And this on keyboard arrow right as well!
        gamepadManager.on('hold', 'd_pad_right', this.gpRight);
        gamepadManager.on('hold', 'd_pad_down', this.gpRight);
        // And this also reacts on SPACE
        gamepadManager.on('press', 'button_1', this.gpButton1);
        gamepadManager.on('press', 'button_2', this.gpButton2);
    }

    componentWillUnmount() {
        const { gamepadManager } = this.props.store;
        gamepadManager.off(this.gpAxis);
        gamepadManager.off(this.gpLeft);
        gamepadManager.off(this.gpRight);
        gamepadManager.off(this.gpButton1);
        gamepadManager.off(this.gpButton2);
    }

    render() {
        return this.props.children;
    }
}
