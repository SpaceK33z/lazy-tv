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

    getImage(extension) {
        const userDataPath = app.getPath('userData');
        const fileName = `${this.props.game.title}.${extension}`;
        return nativeImage.createFromPath(path.join(userDataPath, 'posters', fileName));
    }

    findPoster() {
        // shit code haha
        let image = this.getImage('jpg');
        if (image.isEmpty()) {
            image = this.getImage('png');
            if (image.isEmpty()) {
                return null;
            }
            return image.toDataURL();
        }
        return image.toDataURL();
    }

    render() {
        let src = this.findPoster();
        if (src === null) {
            src = '';
        }

        return (
            <img src={src} alt={this.props.game.title} className={this.props.className} />
        );
    }
}
