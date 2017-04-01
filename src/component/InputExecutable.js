import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { dialog, process } from '../electron';

const StyledInput = styled.input`
    flex: 1;
    cursor: pointer;
`;

const EXTENSION_FILTERS = [{
    name: 'Executables',
    extensions: ['exe', 'app']
}];

const DEFAULT_PATH = process.platform === 'win32' ? '%SystemDrive%\\Program Files' : '/Applications';

@observer
export default class InputExecutable extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        value: PropTypes.string,
    };

    static defaultProps = {
        value: '',
    };

    handleChange = values => {
        const value = values && values.length ? values[0] : '';
        this.props.onChange(this.props.name, value);
    };

    handleClick = e => {
        dialog.showOpenDialog({
            filters: EXTENSION_FILTERS,
            defaultPath: DEFAULT_PATH,
            properties: ['openFile'],
        }, this.handleChange);
    };

    render() {
        return (
            <StyledInput
                name={this.props.name}
                value={this.props.value}
                onChange={() => null}
                onClick={this.handleClick}
                readOnly
            />
        );
    }
}
