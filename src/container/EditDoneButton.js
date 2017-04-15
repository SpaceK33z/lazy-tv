import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ButtonIcon from '../component/ButtonIcon';
import IconDone from '../component/icon/Done';

@observer
export default class EditDoneButton extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    handleClick = () => {
        const { store } = this.props;
        store.currentView = 'home';
    };

    render() {
        return (
            <ButtonIcon onClick={this.handleClick}>
                <IconDone />
            </ButtonIcon>
        );
    }
}
