import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { COLOR_WHITE, COLOR_PRIMARY } from '../styles';

export const StyledInput = styled.input`

`;

@observer
export default class InputBool extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        value: PropTypes.string,
    };

    static defaultProps = {
        value: false,
    };

    handleChange = e => {
        this.props.onChange(this.props.name, e.target.checked);
    };

    render() {
        return (
            <StyledInput
                type="checkbox"
                name={this.props.name}
                value={this.props.value}
                onChange={this.handleChange}
            />
        );
    }
}
