import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { throttle, debounce } from 'lodash';
import scrollToWithAnimation from 'scrollto-with-animation';
import Gamepad from '../patch/gamepad';
import GameList from '../component/GameList';
import GameItem from '../component/GameItem';
import keydown, { Keys } from 'react-keydown';
import { getCurrentWindow } from '../electron';

const myWindow = getCurrentWindow();

const GAME_ITEM_WIDTH = 410;
const SCROLL_ANIMATION_MS = 300;
const AXIS_DEBOUNCE_MS = 100;
const AXIS_DEBOUNCE_WAIT_MS = 200;
const AXIS_MOVE_TRESHOLD = 0.75;
const GAME_ACTION_DEBOUNCE_MS = 1000;

@observer
export default class GameOverview extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    listRef = null;
    gpInstance = null;

    selectGame = throttle(
        direction => {
            const { store } = this.props;
            store.changeGame(direction);
            this.scrollToGame();
        },
        SCROLL_ANIMATION_MS,
        { leading: true }
    );

    scrollToGame = () => {
        const index = this.props.store.selectedGameIndex;
        const scrollX = index * GAME_ITEM_WIDTH;
        scrollToWithAnimation(
            this.listRef,
            'scrollLeft',
            scrollX,
            SCROLL_ANIMATION_MS,
            'easeInOutSine'
        );
    };

    handleGameClick = game => {
        const { store } = this.props;
        const wasAlreadySelected = game === store.selectedGame;
        store.selectedGame = game;
        // this.scrollToGame();
        if (wasAlreadySelected) {
            this.startGame();
        }
    };

    setListRef = ref => {
        this.listRef = ref;
    };

    selectGameFromAxis = debounce(
        direction => {
            this.selectGame(direction);
        },
        AXIS_DEBOUNCE_MS,
        { maxWait: AXIS_DEBOUNCE_WAIT_MS, immediate: true }
    );

    @keydown(Keys.enter)
    startGameFromEnter(e) {
        e.preventDefault();
        this.startGame();
    }

    @keydown(Keys.del)
    removeGameFromDel(e) {
        e.preventDefault();
        this.removeGame();
    }

    startGame = debounce(this._startGame, GAME_ACTION_DEBOUNCE_MS, {
        leading: true,
        trailing: false,
    });

    _startGame() {
        console.log('START game');
        this.props.store.openGame();
    }

    removeGame = debounce(this._removeGame, GAME_ACTION_DEBOUNCE_MS, {
        leading: true,
        trailing: false,
    });

    _removeGame() {
        console.log('REMOVE game');
        this.props.store.removeGame();
    }

    resumeGpEvents = () => {
        this.gpInstance.resume();
    };

    pauseGpEvents = () => {
        this.gpInstance.pause();
    };

    componentDidMount() {
        this.gpInstance = new Gamepad();
        myWindow.on('focus', this.resumeGpEvents);
        myWindow.on('blur', this.pauseGpEvents);

        this.gpInstance.on('hold', 'stick_axis_left', e => {
            const [x] = e.value;
            if (x > AXIS_MOVE_TRESHOLD) {
                this.selectGameFromAxis('right');
            }
            if (x < -AXIS_MOVE_TRESHOLD) {
                this.selectGameFromAxis('left');
            }
        });

        // Note that this also reacts on keyboard arrow left!
        this.gpInstance.on('hold', 'd_pad_left', () => {
            this.selectGameFromAxis('left');
        });

        // And this on keyboard arrow right as well!
        this.gpInstance.on('hold', 'd_pad_right', () => {
            this.selectGameFromAxis('right');
        });

        // And this also reacts on SPACE
        this.gpInstance.on('press', 'button_1', () => {
            this.startGame();
        });
    }

    componentWillUnmount() {
        if (this.gpInstance) {
            this.gpInstance.destroy();
            this.gpInstance = null;
        }
        myWindow.removeListener('focus', this.resumeGpEvents);
        myWindow.removeListener('blur', this.pauseGpEvents);
    }

    renderGame = game => {
        const selectedGame = this.props.store.selectedGame;
        return (
            <GameItem
                key={game.title}
                game={game}
                selected={game === selectedGame}
                onClick={this.handleGameClick}
            />
        );
    };

    render() {
        const { store } = this.props;
        if (store.games.length) {
            return (
                <GameList innerRef={this.setListRef}>
                    {store.games.map(this.renderGame)}
                </GameList>
            );
        } else {
            return <p>You have no games yet!</p>;
        }
    }
}
