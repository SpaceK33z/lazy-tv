import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import GameList from '../component/GameList';
import GameItem from '../component/GameItem';
import NoGamesWarning from '../component/NoGamesWarning';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

const SortableItem = SortableElement(props => <GameItem {...props} selected={false} drag />);

const SortableList = SortableContainer(({ items, handleGameClick, handleGameRemove }) => {
    return (
        <GameList>
            {items.map((game, index) => (
                <SortableItem
                    key={game.title}
                    index={index}
                    game={game}
                    onClick={handleGameClick}
                    onClickRemove={handleGameClick}
                />
            ))}
        </GameList>
    );
});

@observer
export default class GameEditOverview extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    handleGameRemove = game => {
        this.props.store.removeGame(game);
    };

    handleGameClick = () => {
        //
    };

    onSortEnd = ({ oldIndex, newIndex }) => {
        const { store } = this.props;
        store.games = arrayMove(store.games, oldIndex, newIndex);
        store.saveGamesToConfig();
    };

    render() {
        const { store } = this.props;
        if (store.games.length) {
            return (
                <SortableList
                    items={store.games}
                    axis="x"
                    lockAxis="x"
                    handleGameClick={this.handleGameClick}
                    handleGameRemove={this.handleGameRemove}
                    onSortEnd={this.onSortEnd}
                />
            );
        } else {
            return <NoGamesWarning />;
        }
    }
}
