import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { COLOR_WHITE, COLOR_PRIMARY } from '../styles';

export const StyledInput = styled.input`
    flex: 1;
    color: ${COLOR_WHITE};
    font-size: 1.5em;
    background: transparent;
    border: 3px solid ${COLOR_WHITE};
    border-radius: 2px;
    padding: 5px;
    outline: none;

    &:focus {
        border-color: ${COLOR_PRIMARY};
    }

    &::-webkit-input-placeholder {
        color: ${COLOR_WHITE};
        font-style: italic;
    }
`;

@observer
export default class InputText extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        value: PropTypes.string,
        placeholder: PropTypes.string,
        autoFocus: PropTypes.bool,
    };

    static defaultProps = {
        value: '',
    };

    handleChange = e => {
        this.props.onChange(this.props.name, e.target.value);
    };

    render() {
        return (
            <StyledInput
                name={this.props.name}
                value={this.props.value}
                placeholder={this.props.placeholder}
                onChange={this.handleChange}
                autoFocus={this.props.autoFocus}
            />
        );
    }
}
