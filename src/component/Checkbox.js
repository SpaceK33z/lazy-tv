import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { COLOR_WHITE, DEFAULT_FONT } from '../styles';

export const StyledLabel = styled.label`
    ${DEFAULT_FONT}
    color: ${COLOR_WHITE};
    font-size: 1.5em;
`;

export const StyledInput = styled.input`
    width: 20px;
    height: 20px;
    position: relative;
    top: 1px;
    margin-right: 10px;
`;

@observer
export default class InputBool extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.bool,
    };

    static defaultProps = {
        value: false,
    };

    handleChange = e => {
        this.props.onChange(this.props.name, e.target.checked);
    };

    render() {
        return (
            <StyledLabel>
                <StyledInput
                    type="checkbox"
                    name={this.props.name}
                    value={this.props.value}
                    onChange={this.handleChange}
                />
                {this.props.label}
            </StyledLabel>
        );
    }
}
