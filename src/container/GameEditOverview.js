import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import GameList from '../component/GameList';
import GameItem from '../component/GameItem';
import NoGamesWarning from '../component/NoGamesWarning';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

const SortableItem = SortableElement(props => <GameItem {...props} selected={false} drag />);

const SortableList = SortableContainer(({ items, handleGameClick, handleGameRemove, innerRef }) => {
    return (
        <GameList innerRef={innerRef}>
            {items.map((game, index) => (
                <SortableItem
                    key={game.id}
                    index={index}
                    game={game}
                    onClick={handleGameClick}
                    onClickRemove={handleGameRemove}
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

    setListRef = (ref) => {
        this.listRef = ref;
    };

    componentDidMount() {
        // Poorly implemented horizontal scroll when using vertical scroll wheel.
        // Preferably I'd let a package handle this, but I could only find jQuery implementations.
        this.listRef.addEventListener('mousewheel', (e) => {
            if (e.deltaY > 0) {
                this.listRef.scrollLeft += e.deltaY;
            }
            if (e.deltaY < 0) {
                this.listRef.scrollLeft += e.deltaY;
            }
        }, false);
    }

    render() {
        const { store } = this.props;
        if (store.games.length) {
            return (
                <SortableList
                    innerRef={this.setListRef}
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
