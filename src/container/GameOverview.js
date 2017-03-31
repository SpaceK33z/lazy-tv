import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { throttle, debounce } from 'lodash';
import scrollToWithAnimation from 'scrollto-with-animation';
import GameList from '../component/GameList';
import GameItem from '../component/GameItem';
import keydown, { Keys } from 'react-keydown';
import HorizontalCenter from '../component/HorizontalCenter';

const GAME_ITEM_WIDTH = 410;
const SCROLL_ANIMATION_MS = 300;
const AXIS_DEBOUNCE_MS = 100;
const AXIS_DEBOUNCE_WAIT_MS = 200;
const AXIS_MOVE_TRESHOLD = .75;
const START_GAME_DEBOUNCE_MS = 1000;

@observer
export default class GameOverview extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    listRef = null;

    selectGame = throttle((direction) => {
        const { store } = this.props;
        store.changeGame(direction);
        this.scrollToGame();
    }, SCROLL_ANIMATION_MS, { leading: true });

    scrollToGame = () => {
        const index = this.props.store.selectedGameIndex
        const scrollX = (index * GAME_ITEM_WIDTH);
        scrollToWithAnimation(this.listRef, 'scrollLeft', scrollX, SCROLL_ANIMATION_MS, 'easeInOutSine');
    };

    handleGameClick = (game) => {
        const { store } = this.props;
        store.selectedGame = game;
        this.scrollToGame();
    };

    setListRef = (ref) => {
        this.listRef = ref;
    };

    selectGameFromAxis = debounce((direction) => {
        this.selectGame(direction);
    }, AXIS_DEBOUNCE_MS, { maxWait: AXIS_DEBOUNCE_WAIT_MS, immediate: true });

    @keydown(Keys.enter)
    startGameFromEnter(e) {
        e.preventDefault();
        this.startGame();
    };

    startGame = debounce(() => {
        console.log('START game');
    }, START_GAME_DEBOUNCE_MS, { leading: true, trailing: false });

    componentDidMount() {
        const { gamepadInstance } = this.props.store;
        gamepadInstance.on('hold', 'stick_axis_left', e => {
            const [ x ] = e.value;
            if (x > AXIS_MOVE_TRESHOLD) {
                this.selectGameFromAxis('right');
            }
            if (x < -AXIS_MOVE_TRESHOLD) {
                this.selectGameFromAxis('left');
            }
        });

        // Note that this also reacts on keyboard arrow left!
        gamepadInstance.on('hold', 'd_pad_left', () => {
            this.selectGameFromAxis('left');
        });

        // And this on keyboard arrow right as well!
        gamepadInstance.on('hold', 'd_pad_right', () => {
            this.selectGameFromAxis('right');
        });

        // And this also reacts on SPACE
        gamepadInstance.on('press', 'button_1', () => {
            this.startGame();
        });
    }

    renderGame = (game) => {
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
        return (
            <HorizontalCenter>
                <GameList innerRef={this.setListRef}>
                    {store.games.map(this.renderGame)}
                </GameList>
            </HorizontalCenter>
        );
    }
}
