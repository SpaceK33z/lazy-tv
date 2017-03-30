import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { throttle } from 'lodash';
import scrollToWithAnimation from 'scrollto-with-animation';
import GameList from '../component/GameList';
import GameItem from '../component/GameItem';
import keydown, { Keys } from 'react-keydown';
import HorizontalCenter from '../component/HorizontalCenter';

const GAME_ITEM_WIDTH = 410;
const SCROLL_ANIMATION_MS = 300;

@observer
export default class GameOverview extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    listRef = null;

    @keydown(Keys.right)
    selectNextGame(e) {
        e.preventDefault();
        this.selectGame('right');
    }

    @keydown(Keys.left)
    selectPreviousGame(e) {
        e.preventDefault();
        this.selectGame('left');
    }

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
