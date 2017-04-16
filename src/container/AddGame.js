import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import FormField from '../component/FormField';
import InputText from '../component/InputText';
import InputExecutable from '../component/InputExecutable';
import Button from '../component/Button';
import GameAddPoster from '../component/GameAddPoster';
import Form from '../component/Form';
import imageCropper from '../patch/imageCropper';
import { nativeImage } from '../electron';

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

    @observable game = {
        title: '',
        program: '',
    };

    @observable image = null;
    @observable crop = IMAGE_CROP;
    @observable submitting = false;

    handleInput = (key, value) => {
        this.game[key] = value;
    };

    handleSubmit = () => {
        if (!this.game.title || !this.game.program) {
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
            this.props.store.currentView = 'editGames';
        })
        .catch(() => {
            this.submitting = false;
        });
    };

    handleCancel = () => {
        this.props.store.currentView = 'editGames';
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
                        <FormField label="Title">
                            <InputText
                                name="title"
                                value={this.game.title}
                                onChange={this.handleInput}
                                placeholder="Choose a title"
                                autoFocus
                            />
                        </FormField>
                        <FormField label="Program">
                            <InputExecutable
                                name="program"
                                value={this.game.program}
                                placeholder="Click to select a game"
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
