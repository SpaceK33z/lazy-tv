import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
export default class AddGame extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        return (
            <div>Hoi</div>
        );
    }
}
