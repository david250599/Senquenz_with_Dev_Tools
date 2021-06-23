import React                       from 'react';
import                                  '../css/legal.css';
import {ReactComponent as SvgLogo} from '../img/logo.svg';
import {Link} from "react-router-dom";

export class Impressum extends React.PureComponent{

    render() {
        return(
            <div className="bodyImprint">
                <div className = "logoLegal">
                    <Link to = "/"><SvgLogo/></Link>
                </div>
                <div className="imprintContainer">
                    <h1>Impressum</h1>

                    <h2>Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
                    <p>David Kaipf<br />
                        Siedlungsring<br />
                        59<br />
                        89415 Bayern - Lauingen a.d. Donau</p>

                    <h2>Kontakt</h2>
                    <p>Telefon: +49 176 81658326<br />
                        E-Mail: hello@senquenz.de</p>

                    <p>Quelle: <a href="https://www.e-recht24.de/impressum-generator.html">https://www.e-recht24.de/impressum-generator.html</a></p>
                </div>
            </div>

        )
    }
}