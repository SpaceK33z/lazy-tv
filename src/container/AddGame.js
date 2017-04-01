import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import FormField from '../component/FormField';
import InputText from '../component/InputText';
import InputExecutable from '../component/InputExecutable';
import Button from '../component/Button';
import GameAddPoster from '../component/GameAddPoster';
import Form from '../component/Form';

import styled from 'styled-components';

const StyledForm = styled(Form)`
    width: 800px;
`;

const Wrapper = styled.div`
    display: flex;
`;

const RightSide = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-left: 20px;
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

    @observable image = null;

    handleInput = (key, value) => {
        this.game[key] = value;
    };

    handleSubmit = () => {
        this.props.store.addGame(this.game, this.image);
        this.props.store.currentView = 'home';
    };

    handleCancel = () => {
        this.props.store.currentView = 'home';
    };

    handleImageChange = image => {
        this.image = image;
    };

    render() {
        return (
            <StyledForm onSubmit={this.handleSubmit}>
                <Wrapper>
                    <GameAddPoster image={this.image} onChange={this.handleImageChange} />
                    <RightSide>
                        <FormField label="Title">
                            <InputText
                                name="title"
                                value={this.game.title}
                                onChange={this.handleInput}
                                autoFocus
                            />
                        </FormField>
                        <FormField label="Program">
                            <InputExecutable
                                name="program"
                                value={this.game.program}
                                onChange={this.handleInput}
                            />
                        </FormField>
                    </RightSide>
                </Wrapper>
                <FormField label="">
                    <Button type="submit">Save</Button>
                    <Button type="button" onClick={this.handleCancel}>Cancel</Button>
                </FormField>
            </StyledForm>
        );
    }
}
