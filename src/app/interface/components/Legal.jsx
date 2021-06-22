import React from 'react';
import            '../../../css/component/Legal.css';

export class Legal extends React.PureComponent{

render() {
    return(
        <div className = {this.props.className}>
            <p className = "legalBlock">
                <a href = "../../../legal/Impressum.html" target = "_blank">Impressum</a> |
               <a href = "../../../legal/Datenschutz.html" target = "_blank"> Datenschutz</a>
            </p>
        </div>
    )
}
}
