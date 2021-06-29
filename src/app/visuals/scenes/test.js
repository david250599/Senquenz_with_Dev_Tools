import * as THREE           from 'three';


export class Test {
    constructor(config) {
        this.config = config;
        this.scene = new THREE.Scene();
        this.colorMode = 'sw';


    }

    load(visualsParameter, colors){
        const vertices = [];

        for ( let i = 0; i < 10000; i ++ ) {

            const x = THREE.MathUtils.randFloatSpread( 2000 );
            const y = THREE.MathUtils.randFloatSpread( 2000 );
            const z = THREE.MathUtils.randFloatSpread( 2000 );

            vertices.push( x, y, z );

        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        const material = new THREE.PointsMaterial( { color: 0x888888 } );

        const points = new THREE.Points( geometry, material );

        this.scene.add( points );

    }

    onRender(audio, avg){

    }

    delete(){
        while (this.scene.children.length > 0){
            this.scene.remove(this.scene.children[0]);
        }
    }

}