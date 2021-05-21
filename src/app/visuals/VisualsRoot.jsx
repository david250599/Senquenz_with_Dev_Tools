import React        from 'react';
import {Canvas}     from '@react-three/fiber';
import {TestScene}     from './TestScene';
import {Effects}    from './Effects';

import {Scene1_old}     from './Scene1/Scene1_old';

export class VisualsRoot extends React.Component{
    constructor(props) {
        super(props);

        this.brightness = this.props.visualsParameter.brightness;
    }



    render() {
        return(
            <Canvas className={this.props.className} perspective camera={{ zoom: 0.08 }} colorManagement={false}>


                <Effects/>
                <TestScene visualsParameter ={this.props.visualsParameter}/>

                {/*}
                <Scene1_old visualsParameter = {this.props.visualsParameter}/>
                <color attach="background" args={[this.brightness/2, 0, 0]} />
                {*/}


            </Canvas>
        )
    }
}