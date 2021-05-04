import React from 'react';
import '../../css/DInfo.css';
import {Slider} from './Slider';

export class DevelopInfo extends React.Component{



    render() {
        return(
            <div className="devInfoPop">
                <h6>Dev Tools</h6>
                <Slider
                className = "devSlider"
                name      = "intensity"
                min       = "0"
                max       = "1"
                step      = "0.01"
                value     = {this.props.intensity}
                onChange  = {(event) => this.props.eventHandler(event)}
                />
                <p>{'Intensity: '+ this.props.intensity}</p>

                <Slider
                    className = "devSlider"
                    name      = "brightness"
                    min       = "0"
                    max       = "1"
                    step      = "0.01"
                    value     = {this.props.brightness}
                    onChange  = {(event) => this.props.eventHandler(event)}
                />
                <p>{'Brightness: '+ this.props.brightness}</p>

                <Slider
                    className = "devSlider"
                    name      = "hilly"
                    min       = "0"
                    max       = "1"
                    step      = "0.01"
                    value     = {this.props.hilly}
                    onChange  = {(event) => this.props.eventHandler(event)}
                />
                <p>{'Hilly: '+ this.props.hilly}</p>

                <Slider
                    className = "devSlider"
                    name      = "water"
                    min       = "0"
                    max       = "1"
                    step      = "0.01"
                    value     = {this.props.water}
                    onChange  = {(event) => this.props.eventHandler(event)}
                />
                <p>{'Water: '+ this.props.water}</p>

                <Slider
                    className = "devSlider"
                    name      = "urban"
                    min       = "0"
                    max       = "1"
                    step      = "0.01"
                    value     = {this.props.urban}
                    onChange  = {(event) => this.props.eventHandler(event)}
                />
                <p>{'Urban: '+ this.props.urban}</p>

                <Slider
                    className = "devSlider"
                    name      = "structureSize"
                    min       = "0"
                    max       = "1"
                    step      = "0.01"
                    value     = {this.props.structureSize}
                    onChange  = {(event) => this.props.eventHandler(event)}
                />
                <p>{'Structure Size: '+ this.props.structureSize}</p>


            </div>
        )
    }
}