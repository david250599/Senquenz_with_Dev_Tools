import React                            from 'react';
import                                       '../../css/TextInput.css'
import {ReactComponent as SvgSearch}    from '../../img/search.svg';

export class TextInput extends React.PureComponent{
    render() {
        return(
            <div className={this.props.className} id={this.props.id}>
                <input id="textInput"
                       type="text"
                       name={this.props.name}
                       value={this.props.value}
                       onChange={this.props.onChange}
                       onClick ={this.props.onClick}
                />
                <SvgSearch id="svgSearch"/>
            </div>


        )
    }
}