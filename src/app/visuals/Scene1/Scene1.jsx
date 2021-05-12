import React, { useRef, useMemo}    from 'react';
import {useFrame}                   from '@react-three/fiber';
import * as THREE                   from 'three';

export function Scene1(props) {




    const backColor = new THREE.Color(1, 1, 1);
    const frontColor = new THREE.Color(0, 0, 0);

    const moveVec = new THREE.Vector3();
    let speed = props.visualsParameter.speed;




    const backObjects = useRef();
    const frontObjects = useRef();

    const {vec, transform, positions, directions, objectAmount, objectSize, spacing, vertices} = useMemo(() => {
        const vec = new THREE.Vector3();
        const transform = new THREE.Matrix4();
        const objectAmount  = props.visualsParameter.structureSize*1200 + 20;
        const objectSize    = -props.visualsParameter.structureSize * 20 +22;
        const spacing       = -props.visualsParameter.urban *8 +8 + (objectSize*2 - objectSize/5);
        const vertices = Math.floor(-props.visualsParameter.hilly * 30 +27);

        let moveX = -150;
        let moveY =-70;
        console.log('memo');


        const positions = [...Array(objectAmount)].map((_, i) => {
            const position = new THREE.Vector3();


            position.x = moveX;
            position.y = moveY;

            moveX = moveX + spacing;

            if(moveX > 150){
                moveX = -150;
                moveY = moveY + spacing;
            }

            return position
        });

        const directions = 0;

        return {vec, transform, positions, directions, objectAmount, objectSize, spacing, vertices}
    }, []);




    useFrame(() => {


        for (let i = 0; i < positions.length; ++i) {
            vec.copy(positions[i]);
            transform.setPosition(vec);
            frontObjects.current.setMatrixAt(i, transform);


            vec.add(moveVec);
            transform.setPosition(vec);
            backObjects.current.setMatrixAt(i, transform);

        }

        if(moveVec.x >= spacing || moveVec.x <= 0){
            moveVec.y += speed;
        }
        if(moveVec.y >= spacing || moveVec.y <= 0){
            moveVec.x += speed;
        }


        if((moveVec.x >= spacing && moveVec.y >= spacing) || (moveVec.x <=0 && moveVec.y <=0)){
            speed = -speed;
        }











        backObjects.current.instanceMatrix.needsUpdate = true;
        frontObjects.current.instanceMatrix.needsUpdate = true;


    });

    return (
        <group>
            <instancedMesh
                ref={backObjects}
                args={[null, null, objectAmount]}>
                <circleBufferGeometry args={[objectSize, vertices]}/>
                <meshBasicMaterial color={backColor}/>
            </instancedMesh>
            <instancedMesh
                ref={frontObjects}
                args={[null, null, objectAmount]}>
                <circleBufferGeometry args={[objectSize/3, vertices]}/>
                <meshBasicMaterial color={frontColor}/>
            </instancedMesh>
        </group>

    )
}


