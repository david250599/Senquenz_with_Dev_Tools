import React                                from 'react';
import {Background}                         from '../components/Background';
import {Dialog}                             from '../components/Dialog';
import {ReactComponent as SvgLogo}          from '../../../img/logo.svg';
import {Button}                             from '../components/Button';
import {LegalLinks}                              from '../components/LegalLinks';

import                                           '../../../css/module/StartScreen.css';




export class StartScreen extends React.PureComponent{
    constructor(props) {
        super(props);

        this.state = {
            stageOne:   true,
            stageTwo:   false,
            stageThree: false
        }
    }

    buttonHandler(event){
        if(event.target.id === 'stageOne'){
            this.setState({
                stageOne: false,
                stageTwo: true
            })
        }else if(event.target.id === 'stageTwo'){
            this.setState({
                stageTwo: false,
                stageThree: true
            })
        }else if(event.target.id ==='stageThree'){
            this.props.start();
        }
    }





    render() {
        return(
            <div className="startScreen">
                <Background className="background"/>
                {/*}
                <Button
                    id  = "stageThree"
                    onClick = {(event) => this.buttonHandler(event)}
                />
{*/}
                {this.state.stageOne? <div          className = "opener">
                    <p>B E T A</p>
                                        <SvgLogo    className = "logoStart"/>
                                        <p>location-based real-time music visualizer</p>

                                        <Button
                                            className   = "openerButton"
                                            id          = "stageOne"
                                            name        = "GET STARTED"
                                            onClick     = {(event) =>this.buttonHandler(event)}
                                        />
                                     </div>: ''}


                {this.state.stageTwo?  <Dialog
                                                headline        = "Welcome!"
                                                text            = "To get started, you need to activate your device microphone. If you're using several, make sure your preferred browser ticks the right."
                                                switchName      = "microphoneInput"
                                                switchChecked   = {this.props.microphoneInput}
                                                switchOnChange  = {(event)=> this.props.eventHandler(event)}
                                                switchTitle     = { this.props.microphoneInput ? 'Stop microphone' : 'Get microphone input' }
                                                buttonName      = "CONTINUE"
                                                buttonId        = "stageTwo"
                                                buttonDisabled  = {!this.props.microphoneInput}
                                                buttonOnClick   = {(event) => this.buttonHandler(event)}
                                            /> : ''}
                {this.state.stageThree?  <Dialog
                                                headline        = "Customize"
                                                text            = "For the best experience, we would like to access your current location, since it influences the visuals to create a unique show especially for you."
                                                switchName      = "locationDetection"
                                                switchChecked   = {this.props.locationDetection}
                                                switchOnChange  = {(event)=> this.props.eventHandler(event)}
                                                switchTitle     = "Location detection"
                                                buttonName      = "LET'S GO"
                                                buttonId        = "stageThree"
                                                buttonDisabled  = {false}
                                                buttonOnClick   = {(event) => this.buttonHandler(event)}
                                            /> : ''}


            <LegalLinks className = "legalStart"/>
            </div>
        )
    }
}