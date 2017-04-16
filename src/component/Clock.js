import React, { Component } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { DEFAULT_FONT } from '../styles';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

const StyledClock = styled.div`
    ${DEFAULT_FONT}
    font-size: 2.1em;
    padding: 15px;
    color: #fff;
    position: absolute;
    bottom: 0;
    right: 0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, .6);
    letter-spacing: 4px;
    width: 4em;
`;

@observer
export default class Clock extends Component {
    @observable time = moment();

    componentDidMount() {
        this.interval = setInterval(() => {
            this.time = moment();
        }, 10000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        return (
            <StyledClock>
                {this.time.format('H:mm')}
            </StyledClock>
        );
    }
}
