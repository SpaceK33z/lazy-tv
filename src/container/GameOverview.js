import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { throttle, debounce } from 'lodash';
import scrollToWithAnimation from 'scrollto-with-animation';
import GameList from '../component/GameList';
import GameItem from '../component/GameItem';
import NoGamesWarning from '../component/NoGamesWarning';
import navigationSound from '../asset/navigationSound.mp3';

const GAME_ITEM_WIDTH = 316;
const SCROLL_ANIMATION_MS = 300;
const AXIS_DEBOUNCE_MS = 100;
const AXIS_DEBOUNCE_WAIT_MS = 200;
const AXIS_MOVE_TRESHOLD = 0.75;
const GAME_ACTION_DEBOUNCE_MS = 1000;

// TODO: This component does way too much at the moment...

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
            this.playSoundEffect();
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

    startGame = debounce(this._startGame, GAME_ACTION_DEBOUNCE_MS, {
        leading: true,
        trailing: false,
    });

    _startGame() {
        console.log('START game');
        this.props.store.openGame();
    }

    stopGame = debounce(this._stopGame, GAME_ACTION_DEBOUNCE_MS, {
        leading: true,
        trailing: false,
    });

    _stopGame() {
        console.log('STOP game');
        this.props.store.stopGame();
    }

    playSoundEffect() {
        const audio = new Audio(navigationSound);
        audio.volume = 0.15;
        audio.play();
    }

    gpLeft = () => {
        this.selectGameFromAxis('left');
    };

    gpRight = () => {
        this.selectGameFromAxis('right');
    };

    gpButton1 = () => {
        this.startGame();
    };

    gpButton2 = () => {
        this.stopGame();
    };

    gpAxis = e => {
        const [x] = e.value;
        if (x > AXIS_MOVE_TRESHOLD) {
            this.selectGameFromAxis('right');
        }
        if (x < -AXIS_MOVE_TRESHOLD) {
            this.selectGameFromAxis('left');
        }
    };

    componentDidMount() {
        const { gamepadManager } = this.props.store;
        gamepadManager.on('hold', 'stick_axis_left', this.gpAxis);
        // Note that this also reacts on keyboard arrow left!
        gamepadManager.on('hold', 'd_pad_left', this.gpLeft);
        // And this on keyboard arrow right as well!
        gamepadManager.on('hold', 'd_pad_right', this.gpRight);
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

    renderGame = game => {
        const selectedGame = this.props.store.selectedGame;
        return (
            <GameItem
                key={game.id}
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
            return <NoGamesWarning />;
        }
    }
}
