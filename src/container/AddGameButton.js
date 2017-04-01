import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import ButtonIcon from '../component/ButtonIcon';
import IconAdd from '../component/icon/Add';

@observer
export default class AddGameButton extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    handleClick = () => {
        const { store } = this.props;
        store.currentView = 'addGame';
    };

    render() {
        return (
            <ButtonIcon onClick={this.handleClick}>
                <IconAdd />
            </ButtonIcon>
        );
    }
}
