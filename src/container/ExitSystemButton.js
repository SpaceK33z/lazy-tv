import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ButtonIcon from '../component/ButtonIcon';
import IconExit from '../component/icon/Exit';

@observer
export default class ExitSystemButton extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    handleClick = () => {
        const { store } = this.props;
        store.currentView = 'exitSystem';
    };

    render() {
        return (
            <ButtonIcon onClick={this.handleClick}>
                <IconExit />
            </ButtonIcon>
        );
    }
}
