// Holds all important setting components
// The events are getting handled in the main component

import React                            from 'react';
import                                       '../../../css/module/Settings.css';

import {ToggleSwitch}                   from '../components/ToggleSwitch';
import {Slider}                         from '../components/Slider';
import {Map}                            from '../components/Map';
import {Button}                         from '../components/Button';
import {LegalLinks}                     from '../components/LegalLinks';

import {ReactComponent as SvgCross}     from '../../../img/cross.svg';
import {ReactComponent as SvgFqHigh}    from '../../../img/frequenz_high.svg';
import {ReactComponent as SvgFqLow}     from '../../../img/frequenz_low.svg';

export class Settings extends React.PureComponent{

    render() {
        return(
            <div className = "sidebar" id={this.props.visible ? "open" : null}>
                <SvgCross id = "closeIcon" onClick={this.props.closeSettings}/>
                <h4>Settings</h4>

                <h5 id = "catAudio">Audio</h5>
                <ToggleSwitch
                    className   = "switchContainer"
                    id          = "micSwitch"
                    title       = { this.props.microphoneInput ? 'Stop microphone' : 'Get microphone input' }
                    name        = "microphoneInput"
                    checked     = { this.props.microphoneInput }
                    onChange    = {(event) => this.props.eventHandler(event)}
                />
                <ToggleSwitch
                    className   = "switchContainer"
                    id          = "senSwitch"
                    title       = "Automatic adjustment"
                    name        = "autoSensitivity"
                    checked     = {this.props.autoSensitivity}
                    onChange    = {(event) => this.props.eventHandler(event)}
                />
                <SvgFqLow className = "iconLow"/>
                <Slider
                    className   = "sliderContainer"
                    id          = "senSlider"
                    disabled    = {!!this.props.autoSensitivity}
                    min         = {this.props.config.sliderSen.min}
                    max         = {this.props.config.sliderSen.max}
                    step        = {this.props.config.sliderSen.step}
                    name        = "micSensitivity"
                    value       = {this.props.micSensitivity}
                    onChange    = {(event) => this.props.eventHandler(event)}
                />
                <SvgFqHigh className="iconHigh"/>

                <h5 id = "catGeodata">Geodata</h5>
                <ToggleSwitch
                    className   = "switchContainer"
                    id          = "geoSwitch"
                    title       = "Location detection"
                    name        = "locationDetection"
                    checked     = {this.props.locationDetection}
                    onChange    = {(event) => this.props.eventHandler(event)}
                />

                {this.props.locationDetection?          <div className="hideMap"/> : ''}
                {this.props.locationDetection? '' :     <Button
                                                                className = "buttonSetLocation"
                                                                name      = "SET LOCATION"
                                                                onClick   = {(event)=> this.props.eventHandler(event)}
                                                        />}

                <Map
                    className           = "locationMap"
                    id                  = {this.props.locationDetection? 'locationSet': null}
                    mapToken            = {this.props.config.mapSettings.token}
                    mapStyle            = {this.props.config.mapSettings.style}
                    getMap              = {(map) => this.props.getMap(map)}
                    currentLocation     = {this.props.currentLocation}
                    setLocation         = {(la, ln, z) => this.props.setLocation(la, ln, z)}
                />


                <h5 id = "catVisuals">Visuals</h5>
                <ToggleSwitch
                    className   = "switchContainer"
                    id          = "partySwitch"
                    title       = "Party mode"
                    name        = "partyMode"
                    checked     = {this.props.partyMode}
                    onChange    = {(event) => this.props.eventHandler(event)}
                />
                <ToggleSwitch
                    className   = "switchContainer"
                    id          = "prjSwitch"
                    title       = "Projection mode"
                    name        = "projectionMode"
                    checked     = {this.props.projectionMode}
                    onChange    = {(event) => this.props.eventHandler(event)}
                />

                <LegalLinks className = "legal"/>
            </div>

        )
    }
}