import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { DEFAULT_FONT, COLOR_WHITE } from '../styles';
import GameItemPoster from './GameItemPoster';
import GameDeleteButton from './GameDeleteButton';

const StyledWrapper = styled.div`
    margin: 0 .5em;
    position: relative;
`;

const StyledItem = styled.button`
    background: transparent;
    border: 0;
    display: block;
    padding: 0;
    margin: 0;
    box-shadow: 0px 0px 11px 1px rgba(0, 0, 0, 0.6);
    transition: 280ms ease;
    outline: 0;
    cursor: ${props => props.drag ? 'move' : 'pointer'};
    width: 300px;
    max-height: 600px;
    ${props => props.selected && `
        box-shadow: 0px 0px 18px 10px rgba(36, 242, 242, 1);
        width: 400px;
    `}
`;

const StyledPoster = styled(GameItemPoster)`
    display: block;
    ${DEFAULT_FONT}
    width: 100%;
    text-align: center;
    font-size: 3em;
    background: ${COLOR_WHITE};
`;

@observer
export default class GameItem extends Component {
    static propTypes = {
        game: PropTypes.object.isRequired,
        selected: PropTypes.bool.isRequired,
        drag: PropTypes.bool,
        onClick: PropTypes.func.isRequired,
        onClickRemove: PropTypes.func,
    };

    handleClick = () => {
        this.props.onClick(this.props.game);
    };

    handleClickRemove = () => {
        this.props.onClickRemove(this.props.game);
    };

    render() {
        const { game, drag } = this.props;
        return (
            <StyledWrapper>
                {this.props.onClickRemove
                    ? <GameDeleteButton onClick={this.handleClickRemove}>✖</GameDeleteButton>
                    : null}
                <StyledItem drag={drag} type="button" selected={this.props.selected} onClick={this.handleClick}>
                    <StyledPoster game={game} />
                </StyledItem>
            </StyledWrapper>
        );
    }
}
