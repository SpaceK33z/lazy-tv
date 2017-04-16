import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { dialog, app, nativeImage } from '../electron';
import Button from '../component/Button';

const EXTENSION_FILTERS = [
    {
        name: 'Images',
        extensions: ['png', 'jpg'],
    },
];

const DEFAULT_PATH = app.getPath('downloads');

const Image = styled.img`
    width: 400px;
    height: 600px;
    margin-right: 20px;
    margin-top: 20px;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 420px;
    min-height: 600px;
`;

@observer
export default class GameAddPoster extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        image: PropTypes.object,
    };

    handleChange = values => {
        const value = values && values.length ? values[0] : null;
        let image = null;
        if (value) {
            image = nativeImage.createFromPath(value);
        }
        this.props.onChange(image);
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

    renderImage = () => {
        const { image } = this.props;
        return <Image src={image.toDataURL()} />;
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
