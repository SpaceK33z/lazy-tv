import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { dialog, app, nativeImage } from '../electron';
import Button from '../component/Button';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const EXTENSION_FILTERS = [
    {
        name: 'Images',
        extensions: ['png', 'jpg'],
    },
];

const DEFAULT_PATH = app.getPath('downloads');

const CropWrapper = styled.div`
    width: 400px;
    margin-right: 20px;
    margin-top: 20px;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 420px;
`;

@observer
export default class GameAddPoster extends Component {
    static propTypes = {
        onImageChange: PropTypes.func.isRequired,
        onCropChange: PropTypes.func.isRequired,
        image: PropTypes.object,
        crop: PropTypes.object.isRequired,
    };

    handleChange = values => {
        const value = values && values.length ? values[0] : null;
        let image = null;
        if (value) {
            image = nativeImage.createFromPath(value);
        }
        this.props.onImageChange(image);
    };

    handleClick = e => {
        dialog.showOpenDialog(
            {
                filters: EXTENSION_FILTERS,
                defaultPath: DEFAULT_PATH,
                buttonLabel: 'Use as poster',
                properties: ['openFile'],
            },
            this.handleChange
        );
    };

    handleCropDone = (crop) => {
        this.props.onCropChange(crop);
    };

    renderImage = () => {
        const { image } = this.props;
        return (
            <CropWrapper>
                <ReactCrop
                    src={image.toDataURL()}
                    crop={this.props.crop}
                    onComplete={this.handleCropDone}
                />
            </CropWrapper>
        );
    };

    render() {
        const { image } = this.props;
        return (
            <Wrapper>
                <Button onClick={this.handleClick}>Upload image</Button>
                {image ? this.renderImage() : null}
            </Wrapper>
        );
    }
}
