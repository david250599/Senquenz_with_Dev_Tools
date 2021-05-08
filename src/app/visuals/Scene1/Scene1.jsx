import React, { useRef, useMemo}    from 'react';
import {useFrame}                   from '@react-three/fiber';
import * as THREE                   from 'three';


export function Scene1(){
    const ref = useRef();

    const { vec, transform, positions, distances } = useMemo(() => {
        const vec           = new THREE.Vector3();
        const transform     = new THREE.Matrix4();
        const positions     = [...Array(10000)].map((_, i) => {
            const position  = new THREE.Vector3();

            //Grid
            position.x      = (i % 100) - 50;
            position.y      = Math.floor(i / 100) - 50;

            //Offset every 2. column
            position.y      += (i % 2) * 0.5;

            //Add some noise
            position.x      += Math.random() * 0.3;
            position.y      += Math.random() * 0.3;
            return position
        });
        const distances = positions.map(pos => pos.length())

        return {vec, transform, positions, distances}
    }, []);

    useFrame(({clock}) => {

        for (let i = 0; i < 10000; ++i){
            const t = clock.elapsedTime - distances[i] / 80;
            const wave = roundedSquareWave(t, 0.1, 1, 1 /3);
            const scale = 1 + wave * 0.3;
            vec.copy(positions[i]);
            vec.multiplyScalar(scale);
            transform.setPosition(vec);
            ref.current.setMatrixAt(i, transform);

        }
        ref.current.instanceMatrix.needsUpdate = true;


    });

    const roundedSquareWave = (t, delta, a, f) => {
        return ((2 * a) / Math.PI) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta)
    }



    return(
        <instancedMesh
            ref={ref}
            args={[null, null, 10000]}>
            <circleBufferGeometry args={[0.15]}/>
            <meshBasicMaterial/>
        </instancedMesh>
    )

}