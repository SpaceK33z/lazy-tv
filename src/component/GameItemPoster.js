import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import path from 'path';
import { app, nativeImage } from '../electron';

@observer
export default class GameItemPoster extends Component {
    static propTypes = {
        game: PropTypes.object.isRequired,
        className: PropTypes.string,
    };

    handleClick = () => {
        this.props.onClick(this.props.game);
    };

    findPoster() {
        // shit code haha
        const userDataPath = app.getPath('userData');
        const fileName = `${this.props.game.title}`;
        const filePath = path.join(userDataPath, 'posters', fileName);

        const pngImage = nativeImage.createFromPath(`${filePath}.png`);
        if (pngImage.isEmpty()) {
            const jpgImage = nativeImage.createFromPath(`${filePath}.jpg`);
            if (jpgImage.isEmpty()) {
                return null;
            }
            return `${filePath}.jpg`;
        }
        return `${filePath}.png`;
    }

    render() {
        let localPath = this.findPoster();

        return <img src={localPath ? `file://${localPath}` : ''} alt={this.props.game.title} className={this.props.className} />;
    }
}
