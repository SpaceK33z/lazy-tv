import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { dialog, app, nativeImage } from '../electron';
import ButtonIcon from '../component/ButtonIcon';
import EmptyPosterImg from '../image/empty-poster.png';

const EXTENSION_FILTERS = [{
    name: 'Images',
    extensions: ['png', 'jpg']
}];

const DEFAULT_PATH = app.getPath('downloads');

const Image = styled.img`
    width: 400px;
    height: 600px;
`;

@observer
export default class GameAddPoster extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        image: PropTypes.object,
    };

    static defaultProps = {
        value: '',
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
        dialog.showOpenDialog({
            filters: EXTENSION_FILTERS,
            defaultPath: DEFAULT_PATH,
            properties: ['openFile'],
        }, this.handleChange);
    };

    render() {
        const { image } = this.props;
        return (
            <ButtonIcon type="button" onClick={this.handleClick} width="auto" height="auto">
                <Image src={image ? image.toDataURL() : EmptyPosterImg} />
            </ButtonIcon>
        );
    }
}
