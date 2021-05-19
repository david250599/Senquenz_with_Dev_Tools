import React    from 'react';
import               '../../../css/component/ToggleSwitch.css';

export class ToggleSwitch extends React.PureComponent{


    render() {
        return(
            <div className={this.props.className} id={this.props.id}>
                <label className    = "switch">
                    <input type     = "checkbox"
                           name     = {this.props.name}
                           checked  = {this.props.checked}
                           onChange = {this.props.onChange}
                    />
                    <span className = "thumb"/>
                </label>
                <h6 className = "switchTitle">{this.props.title}</h6>
            </div>

        )
    }
}
