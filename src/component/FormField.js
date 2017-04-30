import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { DEFAULT_FONT, COLOR_WHITE } from '../styles';

const StyledField = styled.div`
    display: flex;
    flex-flow: column wrap;
    margin-bottom: 20px;
`;

const StyledWrapper = styled.div`
    display: flex;
`;

const StyledLabel = styled.label`
    ${DEFAULT_FONT}
    color: ${COLOR_WHITE};
    font-size: 1.5em;
    margin-bottom: 7px;
`;

@observer
export default class FormField extends Component {
    static propTypes = {
        label: PropTypes.string,
        children: PropTypes.node.isRequired,
        className: PropTypes.string,
    };

    render() {
        return (
            <StyledField className={this.props.className}>
                {this.props.label ? <StyledLabel>{this.props.label}</StyledLabel> : null}
                <StyledWrapper>
                    {this.props.children}
                </StyledWrapper>
            </StyledField>
        );
    }
}
