import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import Game from '../Game';
import FormField from '../component/FormField';
import InputExecutable from '../component/InputExecutable';
import Checkbox from '../component/Checkbox';
import Button from '../component/Button';
import GameAddPoster from '../component/GameAddPoster';
import Form from '../component/Form';
import imageCropper from '../patch/imageCropper';
import { nativeImage } from 'electron';

import styled from 'styled-components';

const StyledForm = styled(Form)`
    width: 900px;
`;

const Wrapper = styled.div`
    display: flex;
`;

const RightSide = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
`;

const FormButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-right: -20px;
`;

const IMAGE_MAX_WIDTH = 400;
const IMAGE_MAX_HEIGHT = 600;
const IMAGE_ASPECT = IMAGE_MAX_WIDTH / IMAGE_MAX_HEIGHT;
const IMAGE_CROP = {
    width: 100,
    height: 100,
    aspect: IMAGE_ASPECT,
    x: 0,
    y: 0,
};

@observer
export default class AddGame extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    @observable game = new Game();

    @observable image = null;
    @observable crop = IMAGE_CROP;
    @observable submitting = false;

    handleInput = (key, value) => {
        this.game[key] = value;
    };

    handleSubmit = () => {
        if (!this.image || !this.game.program) {
            this.props.store.addNotification({
                message: 'Add a poster and fill in the program.',
                key: 'addGameFail',
            });
            return;
        }
        this.submitting = true;
        imageCropper(this.image.toDataURL(), this.crop, IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT)
        .then((image) => {
            return nativeImage.createFromDataURL(image);
        })
        .then((nativeImage) => {
            return this.props.store.addGame(this.game, nativeImage);
        })
        .then(() => {
            this.props.store.currentView = { screen: 'editGames' };
        })
        .catch((err) => {
            if (err) console.error(err);
            this.submitting = false;
        });
    };

    handleCancel = () => {
        this.props.store.currentView = { screen: 'editGames' };
    };

    @action handleImageChange = image => {
        this.crop = IMAGE_CROP;
        this.image = image;
    };

    handleCropChange = crop => {
        this.crop = crop;
    };

    render() {
        return (
            <StyledForm onSubmit={this.handleSubmit}>
                <Wrapper>
                    <GameAddPoster
                        image={this.image}
                        crop={this.crop}
                        onCropChange={this.handleCropChange}
                        onImageChange={this.handleImageChange}
                    />
                    <RightSide>
                        <FormField label="Program">
                            <InputExecutable
                                name="program"
                                value={this.game.program}
                                placeholder="Click to select a game"
                                onChange={this.handleInput}
                            />
                        </FormField>
                        <FormField>
                            <Checkbox
                                name="disableSmartStart"
                                label="Start new window every time (not recommended)"
                                value={this.game.disableSmartStart}
                                onChange={this.handleInput}
                            />
                        </FormField>
                        <FormButtons>
                            <Button type="submit" disabled={this.submitting}>Save</Button>
                            <Button type="button" onClick={this.handleCancel}>Cancel</Button>
                        </FormButtons>
                    </RightSide>
                </Wrapper>
            </StyledForm>
        );
    }
}
