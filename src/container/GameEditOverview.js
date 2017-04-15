import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import GameList from '../component/GameList';
import GameItem from '../component/GameItem';
import NoGamesWarning from '../component/NoGamesWarning';

@observer
export default class GameEditOverview extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    handleGameClick = game => {
    };

    setListRef = ref => {
        this.listRef = ref;
    };

    renderGame = game => {
        return (
            <GameItem
                key={game.title}
                game={game}
                onClick={this.handleGameClick}
                selected={false}
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
