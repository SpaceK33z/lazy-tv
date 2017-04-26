import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ButtonIcon from '../component/ButtonIcon';
import IconEdit from '../component/icon/Edit';

@observer
export default class EditGamesButton extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    handleClick = () => {
        const { store } = this.props;
        store.currentView = { screen: 'editGames' };
    };

    render() {
        return (
            <ButtonIcon onClick={this.handleClick}>
                <IconEdit />
            </ButtonIcon>
        );
    }
}
