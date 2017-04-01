import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import FormField from '../component/FormField';
import InputText from '../component/InputText';
import InputExecutable from '../component/InputExecutable';
import Button from '../component/Button';
import Form from '../component/Form';

import styled from 'styled-components';

const StyledForm = styled(Form)`
    width: 800px;
`;

@observer
export default class AddGame extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    @observable game = {
        title: '',
        program: '',
    };

    handleInput = (key, value) => {
        this.game[key] = value;
    };

    handleSubmit = () => {
        this.props.store.addGame(this.game);
        this.props.store.currentView = 'home';
    };

    handleCancel = () => {
        this.props.store.currentView = 'home';
    };

    render() {
        return (
            <StyledForm onSubmit={this.handleSubmit}>
                <FormField label="Title">
                    <InputText name="title" value={this.game.title} onChange={this.handleInput} autoFocus />
                </FormField>
                <FormField label="Program">
                    <InputExecutable
                        name="program"
                        value={this.game.program}
                        onChange={this.handleInput}
                    />
                </FormField>
                <FormField label="">
                    <Button type="submit">Save</Button>
                    <Button type="button" onClick={this.handleCancel}>Cancel</Button>
                </FormField>
            </StyledForm>
        );
    }
}
