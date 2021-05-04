import React                            from 'react';
import                                       '../../css/Settings.css';
import {ToggleSwitch}                   from './ToggleSwitch';
import {Slider}                         from './Slider';
import {TextInput}                      from './TextInput';
import {ReactComponent as SvgCross}     from '../../img/cross.svg';
import {ReactComponent as SvgFqHigh}    from '../../img/frequenz_high.svg';
import {ReactComponent as SvgFqLow}     from '../../img/frequenz_low.svg';

export class Settings extends React.PureComponent{
    constructor(props) {
        super(props);

        this.state = {
            microphoneState:    false,
            autoSensitivity:    true,
            geoData:            false,
            searchLocation:     'search location',
            partyMode:          false,
            projectionMode:     false
        };
    }

    handleChange(event){

        if(event.target.name === 'autoSensitivity'){
            this.setState({
                [event.target.name]: event.target.checked
            });
            console.log(event.target.name + ' ' + event.target.checked);
        }


        if(event.target.name === 'geoData'){
            this.setState({
                [event.target.name]: event.target.checked
            });
            console.log(event.target.name + ' ' + event.target.checked);
        }

        if(event.target.name === 'searchLocation'){
            this.setState({
                [event.target.name]: event.target.value
            });
            console.log(event.target.name);
        }

        if(event.target.name === 'partyMode'){
            this.setState({
                [event.target.name]: event.target.checked
            });
            console.log(event.target.name + ' ' + event.target.checked);
        }

        if(event.target.name === 'projectionMode'){
            this.setState({
                [event.target.name]: event.target.checked
            });
            console.log(event.target.name + ' ' + event.target.checked);
        }

    }

    deleteInput(event){
        this.setState({
            [event.target.name]: ''
        });
    }

    render() {
        return(
            <div className="sidebar" id={this.props.visible ? "open" : null}>
                <SvgCross id="closeIcon" onClick={this.props.closeSettings}/>
                <h4>Settings</h4>

                <h5 id="catAudio">Audio</h5>
                <ToggleSwitch
                    className   = "switchContainer"
                    id          = "micSwitch"
                    title       = { this.props.audio ? 'Stop microphone' : 'Get microphone input' }
                    name        = "microphoneSwitch"
                    checked     = { !!this.props.audio }
                    onChange    = {this.props.toggleMic}

                />
                <ToggleSwitch
                    className   = "switchContainer"
                    id          = "senSwitch"
                    title       = "Automatic adjustment"
                    name        = "autoSensitivity"
                    checked     = {this.state.autoSensitivity}
                    onChange    = {(event) => this.handleChange(event)}
                />
                <SvgFqLow className="iconLow"/>
                <Slider
                    className   = "sliderContainer"
                    id          = "senSlider"
                    min         = "0"
                    max         = "4"
                    step        = "0.1"
                    name        = "micSensitivity"
                    value       = {this.props.micSensitivity}
                    onChange    = {(event) => this.props.eventHandler(event)}
                />
                <SvgFqHigh className="iconHigh"/>

                <h5 id="catGeodata">Geodata</h5>
                <ToggleSwitch
                    className   = "switchContainer"
                    id          = "geoSwitch"
                    title       = "Location detection"
                    name        = "geoData"
                    checked     = {this.state.geoData}
                    onChange    = {(event) => this.handleChange(event)}
                />
                <TextInput
                    className   = "inputContainer"
                    id          = "geoInput"
                    name        = "searchLocation"
                    value       = {this.state.searchLocation}
                    onChange    = {(event) => this.handleChange(event)}
                    onClick     = {(event) => this.deleteInput(event)}
                />

                <h5 id="catVisuals">Visuals</h5>
                <ToggleSwitch
                    className   = "switchContainer"
                    id          = "partySwitch"
                    title       = "Party mode"
                    name        = "partyMode"
                    checked     = {this.state.partyMode}
                    onChange    = {(event) => this.handleChange(event)}
                />
                <ToggleSwitch
                    className   = "switchContainer"
                    id          = "prjSwitch"
                    title       = "Projection mode"
                    name        = "projectionMode"
                    checked     = {this.state.projectionMode}
                    onChange    = {(event) => this.handleChange(event)}
                />


            </div>



        )
    }
}