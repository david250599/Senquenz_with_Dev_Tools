import React            from 'react';
import                       '../../../css/component/Dialog.css';

import {Button}         from './Button';
import {ToggleSwitch}   from "./ToggleSwitch";

export class Dialog extends React.PureComponent{

    render() {
        return(
            <div className="dialog">
                <h4>{this.props.headline}</h4>
                <p>{this.props.text}</p>
                <ToggleSwitch
                    className   = "dialogSwitch"
                    name        = {this.props.switchName}
                    checked     = {this.props.switchChecked}
                    onChange    = {(event) => this.props.switchOnChange(event)}
                    title       = {this.props.switchTitle}
                />
                <Button
                    className   = "dialogButton"
                    id          = {this.props.buttonId}
                    name        = {this.props.buttonName}
                    disabled    = {this.props.buttonDisabled}
                    onClick     = {(event) => this.props.buttonOnClick(event)}
                />

            </div>
        )
    }
}