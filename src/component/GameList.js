import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const StyledList = styled.div`
    display: flex;
    width: 100vw;
    padding: 35px;
    overflow-y: hidden;
    overflow-x: scroll;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const ListWrapper = styled.div`
    display: flex;
    padding: 0 100px;
    align-items: center;
`;

@observer
export default class GameList extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        innerRef: PropTypes.func,
    };

    render() {
        return (
            <StyledList innerRef={this.props.innerRef}>
                <ListWrapper>
                    {this.props.children}
                </ListWrapper>
            </StyledList>
        );
    }
}
