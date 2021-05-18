import React    from 'react';
import               '../../css/Slider.css';

export class Slider extends React.PureComponent{

    render() {
        return(
            <div className={this.props.className} id={this.props.id}>
                <input type         ="range"
                       disabled     = {this.props.disabled}
                       min          = {this.props.min}
                       max          = {this.props.max}
                       step         = {this.props.step}
                       className    = "slider"
                       id           = "myRange"
                       name         = {this.props.name}
                       value        = {this.props.value}
                       onChange     = {this.props.onChange}
                />
            </div>
        )
    }
}