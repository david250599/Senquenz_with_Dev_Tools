import React        from 'react';
import                   '../../css/Dialog.css';

import {Button}     from './Button';

export class Dialog extends React.PureComponent{
    constructor(props) {
        super(props);

        this.state = {
            visible: true
        };
    }



    render() {
        return(
            <div className="popup">
                <h3>Microphone Settings</h3>
                <Button name={this.props.name} onClick={ () => this.props.onClick()} />

            </div>
        )
    }
}