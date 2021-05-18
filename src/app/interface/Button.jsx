import React from 'react';
import            '../../css/Button.css';

export class Button extends React.PureComponent{

    render() {
        return(
            <button
                className   = {this.props.className}
                disabled    = {this.props.disabled}
                onClick     = {() => this.props.onClick()}>
                {this.props.name}
            </button>
        )
    }
}