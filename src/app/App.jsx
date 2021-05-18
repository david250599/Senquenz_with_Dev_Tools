import React                from 'react';
import                           '../css/style.css';


//React Components
import {TopBar}             from './interface/TopBar';
import {BottomBar}          from './interface/BottomBar';
import {Settings}           from './interface/Settings';
import {AudioAnalyser}      from './audio/AudioAnalyser';
import {Background}         from './interface/Background';
import {DevelopInfo}        from './interface/DevelopInfo';
import {BarVisualizer}      from './audio/BarVisualizer';

import {VisualsRoot}        from './visuals/VisualsRoot';

// config
import config               from '../config/config.json';


// link the configuration data
const config_interface          = config.interface;
const config_duration_fadeOut   = config.interface.durationFadeOut;
const config_audio_data         = config.audioAnalyser;
const config_settings           = config.settings;
const config_map                = config_settings.mapSettings;


export class App extends React.PureComponent {
    constructor(props) {
        super(props);

        this.fadeOutInterface = window.setTimeout(() => this.hideInterface(), config_duration_fadeOut);

        this.state = {
            visibleSettings:    config_interface.visibleSettings,
            visibleInterface:   config_interface.visibleInterface,
            visibleVisuals:     config_interface.visibleVisuals,

            //Settings
            microphoneInput:    config_settings.microphoneInput,
            autoSensitivity:    config_settings.autoSensitivity,
            locationDetection:  config_settings.locationDetection,
            partyMode:          config_settings.partyMode,
            projectionMode:     config_settings.projectionMode,

            //Location
            currentLocation: {
                lat:            Math.random() * config_map.maxLat*2 - config_map.maxLat,
                lng:            Math.random() * config_map.maxLng*2 - config_map.maxLng,
                zoom:           config_map.zoomStart
            },
            map:                null,

            //Audio parameter
            audio:              null,
            waveAudioData:      new Uint8Array(0),
            barAudioData:       new Uint8Array(0),
            micSensitivity:     config_audio_data.micSensitivity,

            //Visuals parameter
            visualsParameter: {
                intensity:          0.5,
                brightness:         0.0,
                hilly:              0.5,
                water:              0.5,
                urban:              0.5,
                structureSize:      0.5,
                speed:              0.5
            },

            visualsMount:       true

        };
    }

    // Update state after Input
    handleDevEvent(event){
        if(event.target.type === 'range'){
            this.setState(prevState => {
                let visualsParameter = Object.assign({}, prevState.visualsParameter);
                visualsParameter[event.target.name] = parseFloat(event.target.value);
                return {visualsParameter};
            })
        }

        //Vorläufig
        if (event.target.name === 'update'){
            this.setState({
                visualsMount: !this.state.visualsMount
            })
        }
    }

    //Settings
    handleInputEvent(event){
        if (event.target.type === 'checkbox'){
            if (event.target.name === 'microphoneInput'){
                if (this.state.audio){
                    this.stopMicrophone();
                } else {
                    this.getMicrophone();
                }
            }else if (event.target.name === 'locationDetection'){
                if(event.target.checked){
                    this.getUserLocation();
                }else{
                    this.setState({
                        locationDetection: false
                    })
                }

            }else{
                this.setState({
                    [event.target.name] : event.target.checked
                })
            }
        }

        if(event.target.type === 'range'){
            this.setState({
                [event.target.name]: event.target.value
            })
        }

    }

    // open & close the settings sidebar
    toggleSettings(){
        this.setState(prevState =>{
            let visibleSettings = !prevState.visibleSettings;
            return {visibleSettings}
        })
    }

    // Hide the interface when mouse does not move for a certain amount of time
    handleMouseEvent(event){
        this.showInterface();
        window.clearTimeout(this.fadeOutInterface);
        this.fadeOutInterface = window.setTimeout(() => this.hideInterface(), config_duration_fadeOut);
    }

    // Show and hide the interface components
    hideInterface(){
        if(!this.state.visibleSettings){
            this.setState({ visibleInterface: false });
        }
    }
    showInterface(){
        this.setState({ visibleInterface: true });
    }


    // Get audio input and handle microphone button
    async getMicrophone(){
        const audio = await navigator.mediaDevices.getUserMedia({
            audio: true
        });
        this.setState({
            audio:              audio,
            microphoneInput:    true
        });
    }
    stopMicrophone(){
        this.state.audio.getTracks().forEach(track => track.stop());
        this.setState({
            audio:              null,
            microphoneInput:    false
        });
    }

    // Global Audio
    setAudioData(audioData, wave){
        if(wave){
            this.setState({
                waveAudioData: audioData
            });
        }else{
            this.setState({
                barAudioData: audioData
            });
        }
    }

    // Global Location Data
    setLocation(lat, lng, zoom){
        this.setState({
            currentLocation: {lat, lng, zoom}
        });
    }

    getMap(map){
        this.setState({
            map: map
        })
    }

    getUserLocation(){
        navigator.geolocation.getCurrentPosition(position => {
            this.setState({
                locationDetection: true,
                currentLocation: {
                    lat:    position.coords.latitude,
                    lng:    position.coords.longitude,
                    zoom:   config_map.zoomSearch

                }
            });
            if(this.state.map){
                this.state.map.setCenter([position.coords.longitude, position.coords.latitude]);
                this.state.map.setZoom(config_map.zoomSearch);
            }

        }, error => {
            alert('Could not get current location, '  + error.code + ': ' + error.message);
        });
    }


    /*
    async getGeoData(){
        let query = 'https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v8/tilequery/' + this.state.lng + ',' + this.state.lat + '.json?' +
            'radius=1000&limit=50&dedupe&access_token=' + mapboxgl.accessToken;

        let response = await fetch(query);

        if(response.ok){
            let data = await response.json();
            let allFeatures = data.features
            console.log(allFeatures);

            let elevations = [];

            for(let i = 0; i<allFeatures.length; i++){
                elevations.push(allFeatures[i].properties.ele);
            }
            console.log(elevations);

        }else{
            alert('HTTP-Error: ' + response.status + ', Could not load geodata');
        }

    }
*/


  render(){
    return (
        <div className="rootContainer" onMouseMove={(event) => this.handleMouseEvent(event)}>
            <div className="interface" id={this.state.visibleInterface ? null : 'fadeOut'}>

                <TopBar
                    openSettings        = {() => this.toggleSettings()}
                />

                <Settings
                    config              = {config_settings}
                    visible             = {this.state.visibleSettings}

                    microphoneInput     = {this.state.microphoneInput}
                    audio               = {this.state.audio}
                    autoSensitivity     = {this.state.autoSensitivity}
                    micSensitivity      = {this.state.micSensitivity}

                    locationDetection   = {this.state.locationDetection}
                    currentLocation     = {this.state.currentLocation}
                    setLocation         = {(la, ln, z) => this.setLocation(la, ln, z)}
                    getMap              = {(map) => this.getMap(map)}

                    partyMode           = {this.state.partyNode}
                    projectionMode      = {this.state.projectionMode}

                    closeSettings       = {() => this.toggleSettings()}
                    eventHandler        = {(event) => this.handleInputEvent(event)}
                />
                <BottomBar
                    audioData           = {this.state.waveAudioData}
                    audio               = {this.state.audio}
                />

            </div>

            {this.state.visualsMount?
                                <VisualsRoot
                                    className           = "visualsRoot"
                                    visualsParameter    = {this.state.visualsParameter}
                                />
                                : ''}

            <DevelopInfo
                eventHandler    = {(event) => this.handleDevEvent(event)}
                intensity       = {this.state.visualsParameter.intensity}
                brightness      = {this.state.visualsParameter.brightness}
                hilly           = {this.state.visualsParameter.hilly}
                water           = {this.state.visualsParameter.water}
                urban           = {this.state.visualsParameter.urban}
                structureSize   = {this.state.visualsParameter.structureSize}
                visualsMount    = {this.state.visualsParameter.visualsMount}
                speed           = {this.state.visualsParameter.speed}
            />

            {this.state.audio ? <div>
                                <AudioAnalyser
                                    audio           = {this.state.audio}
                                    sendAudioData   = {(data, wave) => this.setAudioData(data, wave)}
                                    micSensitivity  = {this.state.micSensitivity}
                                    configData      = {config_audio_data}
                                />
                                <BarVisualizer
                                    className       = "barVisualiser"
                                    audioData       = {this.state.barAudioData}
                                />
                                </div>

                                : ''}
            <Background/>


        </div>

    );
  }


}


