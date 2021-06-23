import React  from 'react';
import {Link} from 'react-router-dom';
import             '../../../css/component/LegalLinks.css';


export class LegalLinks extends React.PureComponent{

render() {
    return(
        <div className = {this.props.className}>
            <p className = "legalBlock">
                <Link to = "/Impressum" target = "_blank">Impressum</Link> |
                <Link to = "/Datenschutz" target = "_blank"> Datenschutz</Link>
            </p>
        </div>
    )
}
}
