import React, { useRef, useMemo}    from 'react';
import {useFrame}                   from '@react-three/fiber';
import * as THREE                   from 'three';

export function Scene1_old(props) {




    const backColor = new THREE.Color(1, 1, 1);
    const frontColor = new THREE.Color(0, 0, 0);

    const moveVec = new THREE.Vector3();
    let speed = props.visualsParameter.speed;




    const backObjects = useRef();
    const frontObjects = useRef();

    const {vec, transform, positions, objectAmount, objectSize, spacing, vertices} = useMemo(() => {
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


        return {vec, transform, positions, objectAmount, objectSize, spacing, vertices}
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


/////////////////////////////////////////////////////////////////////////////ä

import React, { useRef, useMemo}    from 'react';
import {useFrame}                   from '@react-three/fiber';
import * as THREE                   from 'three';


export function TestScene(props){
    const ref = useRef();

    let speed = props.speed;


    const { vec, transform, positions, distances } = useMemo(() => {
        const vec           = new THREE.Vector3();
        const transform     = new THREE.Matrix4();
        const positions     = [...Array(10000)].map((_, i) => {
            const position  = new THREE.Vector3();

            //Grid
            position.x      = (i % 200) - 100;
            position.y      = Math.floor(i / 100) - 50;

            //Offset every 2. column


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
            const scale = 1 + wave * speed;
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
            <circleBufferGeometry args={[0.2, 30]}/>
            <meshBasicMaterial/>
        </instancedMesh>
    )

}

//////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////

this.scene = new THREE.Scene();
this.testScene = new THREE.Scene();

//Setup parameter with the location data
const c_scene1 = this.props.config.scene1;
this.oAmount     = this.props.visualsParameter.structureSize * c_scene1.maxAmount + c_scene1.minAmount;
this.oSize       = c_scene1.theMoreTheLes * this.props.visualsParameter.structureSize * c_scene1.maxSize
    + c_scene1.minSize;
this.oVertices   = Math.floor(c_scene1.theMoreTheLes * this.props.visualsParameter.hilly *
    c_scene1.maxVertices + c_scene1.maxVertices);
this.spacing     = c_scene1.theMoreTheLes * this.props.visualsParameter.urban *8 +6 + this.oSize*2;

//Setup objects of the Scene
const geometry = new THREE.CircleGeometry(this.oSize, this.oVertices);
const color = new THREE.Color(this.props.visualsParameter.brightness,0,0);
const material = new THREE.MeshBasicMaterial({color: color});

this.group = new THREE.Group();
let positionX = 0;
for(let i = 0; i < this.oAmount; i++){
    let circle = new THREE.Mesh(geometry, material);
    circle.position.x = positionX;
    this.group.add(circle);
    positionX += this.spacing;
}


this.test = new THREE.Group();
for(let i = 0; i < 1000; i++){
    let circle = new THREE.Mesh(geometry, material);
    circle.position.x = 50;
    this.test.add(circle);
}
this.testScene.add(this.test);

this.scene.add(this.group);

