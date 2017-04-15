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

    handleGameRemove = (game) => {
        this.props.store.removeGame(game);
    };

    handleGameClick = () => {
        //
    };

    renderGame = game => {
        return (
            <GameItem
                key={game.title}
                game={game}
                onClick={this.handleGameClick}
                onClickRemove={this.handleGameRemove}
                selected={false}
            />
        );
    };

    render() {
        const { store } = this.props;
        if (store.games.length) {
            return (
                <GameList>
                    {store.games.map(this.renderGame)}
                </GameList>
            );
        } else {
            return <NoGamesWarning />;
        }
    }
}
