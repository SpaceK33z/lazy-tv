import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { throttle, debounce } from 'lodash';
import scrollToWithAnimation from 'scrollto-with-animation';
import GameList from '../component/GameList';
import GameItem from '../component/GameItem';
import NoGamesWarning from '../component/NoGamesWarning';
import KeyNavigation from '../component/KeyNavigation';

const GAME_ITEM_WIDTH = 316;
const SCROLL_ANIMATION_MS = 300;
const GAME_ACTION_DEBOUNCE_MS = 1000;

@observer
export default class GameOverview extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    listRef = null;

    selectGame = throttle(
        gameId => {
            const { store } = this.props;
            store.selectedGame = store.games.find(game => game.id === gameId);
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
            const items = store.games.map(game => game.id);
            return (
                <KeyNavigation
                    store={store}
                    items={items}
                    activeItem={store.selectedGame.id}
                    onActiveChange={this.selectGame}
                    onEnter={this.startGame}
                    onBack={this.stopGame}
                >
                    <GameList innerRef={this.setListRef}>
                        {store.games.map(this.renderGame)}
                    </GameList>
                </KeyNavigation>
            );
        } else {
            return <NoGamesWarning />;
        }
    }
}
