import React from 'react';
import            '../../../css/component/Button.css';

export class Button extends React.PureComponent{

    render() {
        return(
            <button
                className   = {this.props.className}
                id          = {this.props.id}
                disabled    = {this.props.disabled}
                onClick     = {(event) => this.props.onClick(event)}>
                {this.props.name}
            </button>
        )
    }
}