import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import Button from '../component/Button';
import KeyNavigation from '../component/KeyNavigation';
import FlexColumn from '../component/FlexColumn';
import ContainerMedium from '../component/ContainerMedium';

@observer
export default class ExitSystem extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    @observable activeItem = 'shutdown';

    handleSelect = item => {
        return () => {
            const { store } = this.props;
            switch (item) {
                case 'shutdown':
                    store.currentView = { screen: 'exitSystemConfirm', type: 'shutdown' };
                    break;
                case 'restart':
                    store.currentView = { screen: 'exitSystemConfirm', type: 'restart' };
                    break;
                case 'sleep':
                    store.currentView = { screen: 'exitSystemConfirm', type: 'sleep' };
                    break;
                case 'home':
                    store.currentView = { screen: 'home' };
                    break;
                default:
                    throw new Error(`Unknown item: ${item}`);
            }
        };
    };

    handleActiveItemChange = item => {
        this.activeItem = item;
    };

    handleEnter = () => {
        this.handleSelect(this.activeItem)();
    };

    handleBack = () => {
        this.handleSelect('home')();
    };

    render() {
        const items = ['shutdown', 'restart', 'sleep', 'home'];
        const active = this.activeItem;
        return (
            <ContainerMedium>
                <KeyNavigation
                    store={this.props.store}
                    items={items}
                    activeItem={this.activeItem}
                    onActiveChange={this.handleActiveItemChange}
                    onEnter={this.handleEnter}
                    onBack={this.handleBack}
                >
                    <FlexColumn>
                        <Button
                            onClick={this.handleSelect('shutdown')}
                            selected={active === 'shutdown'}
                        >
                            Shutdown
                        </Button>
                        <Button
                            onClick={this.handleSelect('restart')}
                            selected={active === 'restart'}
                        >
                            Restart
                        </Button>
                        <Button onClick={this.handleSelect('sleep')} selected={active === 'sleep'}>
                            Sleep
                        </Button>
                        <Button onClick={this.handleSelect('home')} selected={active === 'home'}>
                            Go back
                        </Button>
                    </FlexColumn>
                </KeyNavigation>
            </ContainerMedium>
        );
    }
}
