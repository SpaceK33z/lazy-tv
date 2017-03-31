import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import GameItemPoster from './GameItemPoster';

const StyledItem = styled.button`
    background: transparent;
    border: 0;
    display: block;
    padding: 0;
    margin: 0 .5em;
    box-shadow: 0px 0px 11px 1px rgba(0, 0, 0, 0.6);
    transition: 350ms ease;
    outline: 0;
    cursor: pointer;
    ${props => props.selected && `
        box-shadow: 0px 0px 9px 5px rgba(36, 242, 242, 1);
    `}
`;

const StyledPoster = styled(GameItemPoster)`
    display: block;
`;

@observer
export default class GameItem extends Component {
    static propTypes = {
        game: PropTypes.object.isRequired,
        selected: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired,
    };

    handleClick = () => {
        this.props.onClick(this.props.game);
    };

    render() {
        const { game } = this.props;
        return (
            <StyledItem
                type="button"
                selected={this.props.selected}
                onClick={this.handleClick}
            >
                <StyledPoster game={game} />
            </StyledItem>
        );
    }
}
