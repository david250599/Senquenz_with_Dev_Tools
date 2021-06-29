import * as THREE           from 'three';


export class SceneD {
    constructor(config) {
        this.config = config;
        this.scene = new THREE.Scene();
        this.colorMode = 'sw';


    }

    load(visualsParameter, colors){


        this.oAmount    = 500;
        this.oSize      = 3;
        this.minDist    = 50;
        this.maxConnect = 10;
        this.overallConnections = 500;


        this.xyHalf = this.config.xyWindow / 2;
        this.zHalf  = this.config.zWindow / 2;

        this.groupA = new THREE.Group();

        // Setup materials
        if( visualsParameter.water > 0.7 && visualsParameter.brightness > 0.3){
            this.scene.background = colors.colorA;
            this.pointMaterial = new THREE.PointsMaterial({
                color:              colors.colorB,
                size:               this.oSize,
                sizeAttenuation:    false
            });
            this.lineMaterial = new THREE.LineBasicMaterial({
                color:  colors.backgroundColor
            });
        }else{
            this.scene.background = colors.backgroundColor;
            this.pointMaterial = new THREE.PointsMaterial({
                color:              colors.colorA,
                size:               this.oSize,
                sizeAttenuation:    false
            });
            this.lineMaterial = new THREE.LineBasicMaterial({
                color:  colors.colorC
            });
        }


        // Setup points
        this.particlesData      = [];
        this.particlePositions  = new Float32Array(this.oAmount * 3);  // x, y & z position for each point

        for( let i = 0; i < this.oAmount; i++){

            let x = Math.random() * this.config.xyWindow - this.config.xyWindow / 2;
            let y = Math.random() * this.config.xyWindow - this.config.xyWindow / 2;
            let z = Math.random() * this.config.zWindow - this.config.zWindow / 2;

            this.particlePositions[i * 3]       = x;
            this.particlePositions[i * 3 + 1]   = y;
            this.particlePositions[i * 3 + 2]   = z;

            this.particlesData.push( {
                speed:      new THREE.Vector3(-0.5 + Math.random(), -0.5 + Math.random(), -0.5 + Math.random()),
                numConnect: 0
            });
        }


        this.particlesGeometry  = new THREE.BufferGeometry();
        this.particlesGeometry.setDrawRange(0, this.oAmount);
        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3).setUsage(THREE.DynamicDrawUsage));

        // Particle system
        this.points = new THREE.Points(this.particlesGeometry, this.pointMaterial);
        this.groupA.add(this.points);


        // Setup lines this.oAmount * this.oAmount * 3
        this.linePositions = new Float32Array(this.oAmount * this.overallConnections * 3 * 2);    // oAmount * maxConnect * 3 * 2
        console.log(this.linePositions.length);

        this.lineGeometry = new THREE.BufferGeometry();
        this.lineGeometry.setAttribute( 'position', new THREE.BufferAttribute(this.linePositions, 3).setUsage(THREE.DynamicDrawUsage));
        this.lineGeometry.computeBoundingSphere();
        this.lineGeometry.setDrawRange(0, 0);

        this.lines = new THREE.LineSegments( this.lineGeometry, this.lineMaterial);
        this.groupA.add(this.lines);

        this.groupA.position.z = -50;

        this.scene.add(this.groupA);
    }

    onRender(audio, avg){
        let lineIndex       = 0;
        let overallConnect  = 0;

        // Reset connections
        for( let i = 0; i < this.oAmount; i++){
            this.particlesData[i].numConnect = 0;
        }

        // Go through all particles
        for( let i = 0; i < this.oAmount; i++){

            let particleData = this.particlesData[i];


            // Move
            this.particlePositions[i * 3]     += particleData.speed.x * avg * 4;
            this.particlePositions[i * 3 + 1] += particleData.speed.y * avg * 4;
            this.particlePositions[i * 3 + 2] += particleData.speed.z * avg * 4;

            // Check collision with outside limits
            if( this.particlePositions[i * 3] > this.xyHalf || this.particlePositions[i * 3] < -this.xyHalf){
                particleData.speed.x = - particleData.speed.x;
            }
            if( this.particlePositions[i * 3 + 1] > this.xyHalf || this.particlePositions[i * 3 + 1] < -this.xyHalf){
                particleData.speed.y = - particleData.speed.y;
            }
            if( this.particlePositions[i * 3 + 2] > this.zHalf || this.particlePositions[i * 3 + 2] < this.zHalf){
                particleData.speed.z = - particleData.speed.z
            }


            // Draw lines
            if(overallConnect < this.overallConnections){

                // calculate the distance to all other points
                for( let j = i + 1; j < this.oAmount; j++){
                    let particleDataB = this.particlesData[j];

                    if( particleData.numConnect < this.maxConnect && particleDataB.numConnect < this.maxConnect){

                        let dx = this.particlePositions[i * 3] - this.particlePositions[j * 3];
                        let dy = this.particlePositions[i * 3 + 1] - this.particlePositions[j * 3 + 1];
                        let dz = this.particlePositions[i * 3 + 2] - this.particlePositions[j * 3 + 2];

                        let dist = Math.sqrt( dx * dx + dy * dy + dz * dz);

                        // draw line between close points
                        if( dist <= this.minDist){

                            particleData.numConnect ++;
                            particleDataB.numConnect ++;

                            this.linePositions[ lineIndex ++] = this.particlePositions[i * 3];
                            this.linePositions[ lineIndex ++] = this.particlePositions[i * 3 + 1];
                            this.linePositions[ lineIndex ++] = this.particlePositions[i * 3 + 2];

                            this.linePositions[ lineIndex ++] = this.particlePositions[j * 3];
                            this.linePositions[ lineIndex ++] = this.particlePositions[j * 3 + 1];
                            this.linePositions[ lineIndex ++] = this.particlePositions[j * 3 + 2];

                            overallConnect++;
                        }
                    }
                }
            }
        }

        this.lines.geometry.setDrawRange(0, overallConnect *2);
        this.lines.geometry.attributes.position.needsUpdate = true;
        this.points.geometry.attributes.position.needsUpdate = true;

    }

    delete(){
        while (this.scene.children.length > 0){
            this.scene.remove(this.scene.children[0]);
        }

        this.particlesGeometry.dispose();
        this.pointMaterial.dispose();
        this.lineGeometry.dispose();
        this.lineMaterial.dispose();
    }

}
