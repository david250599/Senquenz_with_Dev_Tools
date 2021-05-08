import React        from 'react';
import {Canvas}     from '@react-three/fiber';
import {Scene1}     from './Scene1/Scene1';
import {Effects}    from './Effects';

export class VisualsRoot extends React.Component{

    render() {
        return(
            <Canvas perspective camera={{ zoom: 0.15 }} colorManagement={false}>
                <color attach="background" args={['black']} />
                <Scene1/>
                <Effects/>
            </Canvas>
        )
    }
}