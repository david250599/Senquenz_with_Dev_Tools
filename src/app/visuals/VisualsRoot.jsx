import React        from 'react';
import {Canvas}     from '@react-three/fiber';
import {TestScene}     from './TestScene';
import {Effects}    from './Effects';

import {Scene1}     from './Scene1/Scene1';

export class VisualsRoot extends React.Component{
    constructor(props) {
        super(props);

        this.brightness = this.props.visualsParameter.brightness;
    }



    render() {
        return(
            <Canvas className={this.props.className} perspective camera={{ zoom: 0.08 }} colorManagement={false}>
                <color attach="background" args={[this.brightness, this.brightness, this.brightness]} />

                <Effects/>
                <TestScene visualsParameter ={this.props.visualsParameter}/>
                <Scene1 visualsParameter = {this.props.visualsParameter}/>


            </Canvas>
        )
    }
}