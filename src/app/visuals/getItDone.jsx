import React, { useRef, useMemo}    from 'react';
import {useFrame}                   from '@react-three/fiber';
import * as THREE                   from 'three';

export function GetItDone(props){

    const instances = [];
    const number = 4;
    const objectSize = 5;
    const itemColor = new THREE.Color(1, 0, 0);
    const vertices  = 30;

    const ref = useRef();

    for(let i = 0; i< number; i++){
        instances.push(
            <mesh position={[i+objectSize*i*2, 0, 0]} key={i}>
                <circleBufferGeometry args={[objectSize, vertices]}/>
                <meshBasicMaterial color={itemColor}/>
            </mesh>)

    }

    useFrame(({clock}) => {
        let time = clock.elapsedTime;


        ref.current.rotation.z = time + props.speed *10;



    })

    return(
        <group ref={ref}>
            {instances}
        </group>
    )
}