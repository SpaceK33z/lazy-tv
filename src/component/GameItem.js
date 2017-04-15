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
    transition: 350ms ease;
    outline: 0;
    cursor: pointer;
    ${props => props.selected && `
        box-shadow: 0px 0px 9px 5px rgba(36, 242, 242, 1);
    `}
`;

const StyledPoster = styled(GameItemPoster)`
    display: block;
    width: 400px;
    height: 600px;
    ${DEFAULT_FONT}
    text-align: center;
    font-size: 3em;
    background: ${COLOR_WHITE};
`;

@observer
export default class GameItem extends Component {
    static propTypes = {
        game: PropTypes.object.isRequired,
        selected: PropTypes.bool.isRequired,
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
        const { game } = this.props;
        return (
            <StyledWrapper>
                {this.props.onClickRemove
                    ? <GameDeleteButton onClick={this.handleClickRemove}>✖</GameDeleteButton>
                    : null}
                <StyledItem type="button" selected={this.props.selected} onClick={this.handleClick}>
                    <StyledPoster game={game} />
                </StyledItem>
            </StyledWrapper>
        );
    }
}
