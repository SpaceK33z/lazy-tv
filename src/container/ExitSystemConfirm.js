import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import FlexColumn from '../component/FlexColumn';
import { shutdown, sleep, restart } from '../patch/exit';
import Button from '../component/Button';
import Text from '../component/Text';
import ContainerMedium from '../component/ContainerMedium';
import KeyNavigation from '../component/KeyNavigation';

const TIME_BEFORE_ACTION = 5000;

@observer
export default class ExitSystemConfirm extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    interval = null;

    afterTimeout = () => {
        const { store: { currentView } } = this.props;
        clearInterval(this.interval);
        if (currentView.type === 'shutdown') {
            shutdown();
        }
        if (currentView.type === 'restart') {
            restart();
        }
        if (currentView.type === 'sleep') {
            sleep();
        }
        // If the computer resumes, we don't want us hanging on this screen
        this.goToHome();
    };

    @observable timeLeft = TIME_BEFORE_ACTION;

    onInterval = () => {
        this.timeLeft -= 1000;
        if (this.timeLeft <= 0) {
            this.afterTimeout();
        }
    };

    componentDidMount() {
        this.interval = setInterval(this.onInterval, 1000);
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    goToHome = () => {
        this.props.store.currentView = { screen: 'home' };
    };

    goBack = () => {
        this.props.store.currentView = { screen: 'exitSystem' };
    };

    render() {
        const { store: { currentView } } = this.props;
        let text;
        if (currentView.type === 'shutdown') {
            text = 'Shutting down';
        }
        if (currentView.type === 'restart') {
            text = 'Restarting';
        }
        if (currentView.type === 'sleep') {
            text = 'Going to sleep';
        }
        return (
            <ContainerMedium>
                <KeyNavigation store={this.props.store} onEnter={this.goBack} onBack={this.goBack}>
                    <FlexColumn>
                        <Text>{text} in {this.timeLeft / 1000} seconds</Text>
                        <Button onClick={this.goBack} selected>Cancel</Button>
                    </FlexColumn>
                </KeyNavigation>
            </ContainerMedium>
        );
    }
}
