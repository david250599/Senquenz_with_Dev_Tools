import React                from 'react';
import Lottie               from 'react-lottie';
import * as animationData   from '../../../animation/background.json';


export class Background extends React.Component{

    render() {

        const defaultOptions = {
            loop:           true,
            autoplay:       true,
            renderer:       'svg',
            animationData:  animationData.default,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        }

        return(
            <div className  = {this.props.className}>
                <Lottie options = {defaultOptions}/>
            </div>
        )
    }

}