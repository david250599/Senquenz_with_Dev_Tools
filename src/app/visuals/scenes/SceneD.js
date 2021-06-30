import * as THREE           from 'three';


export class SceneD {
    constructor(config) {
        this.config = config;
        this.scene = new THREE.Scene();
    }

    load(visualsParameter, colors){
        this.timer        = this.config.timer;
        this.switch       = false;
        this.xyHalf       = this.config.xyWindow / 2;
        this.zHalf        = this.config.zWindow / 2;

        this.oAmount    = visualsParameter.urban * this.config.maxAmount + this.config.minAmount;
        this.minDist    = visualsParameter.hilly * this.config.maxDist + this.config.minDist;
        this.maxConnect = visualsParameter.structureSize * this.config.maxConnect + this.config.minConnect;
        this.overallConnections = visualsParameter.structureSize * this.config.maxOverall + this.config.minOverall;
        this.oSize      = this.config.size;

        this.groupA = new THREE.Group();

        // Setup materials
        this.scene.background = colors.backgroundColor;
        let colorPoint, colorLineA, colorLineB;

        if( visualsParameter.brightness > 0.6 && this.scene.background.r !== 0){
            colorPoint  = colors.wColor;
            colorLineA  = colors.wColor;
            colorLineB  = colors.wColor;
        }else{
            colorPoint  = colors.randomColorA;
            colorLineA  = colors.wColor;
            colorLineB  = colors.randomColorA;
        }

        this.pointMaterial = new THREE.PointsMaterial({
            color:              colorPoint,
            size:               this.oSize,
            sizeAttenuation:    false,
        });
        this.colorLineA = colorLineA;
        this.colorLineB = colorLineB;

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

        // Particle system
        this.particlesGeometry  = new THREE.BufferGeometry();
        this.particlesGeometry.setDrawRange(0, this.oAmount);
        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3).setUsage(THREE.DynamicDrawUsage));

        this.points = new THREE.Points(this.particlesGeometry, this.pointMaterial);
        this.groupA.add(this.points);


        // Setup lines
        this.linePositions  = new Float32Array(this.overallConnections * 3 * 2);
        this.lineColors     = new Float32Array(this.overallConnections * 3 * 2);

        this.lineGeometry = new THREE.BufferGeometry();
        this.lineGeometry.setAttribute( 'position', new THREE.BufferAttribute(this.linePositions, 3).setUsage(THREE.DynamicDrawUsage));
        this.lineGeometry.setAttribute( 'color', new THREE.BufferAttribute(this.lineColors, 3).setUsage(THREE.DynamicDrawUsage));

        this.lineGeometry.computeBoundingSphere();
        this.lineGeometry.setDrawRange(0, 0);

        this.lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true
        });

        this.lines = new THREE.LineSegments( this.lineGeometry, this.lineMaterial);
        this.groupA.add(this.lines);

        this.groupA.position.z = this.config.boxPositionZ;

        this.scene.add(this.groupA);
    }

    onRender(beat, avg){
        let lineIndex       = 0;
        let colorIndex      = 0;
        let overallConnect  = 0;

        // Offset between the colors
        let deltaR = this.colorLineB.r - this.colorLineA.r;
        let deltaG = this.colorLineB.g - this.colorLineA.g;
        let deltaB = this.colorLineB.b - this.colorLineA.b;

        // Reset connections
        for( let i = 0; i < this.oAmount; i++){
            this.particlesData[i].numConnect = 0;
        }

        // Go through all particles
        for( let i = 0; i < this.oAmount; i++){

            let particleData = this.particlesData[i];


            // Move particles
            if(this.timer < 0){
                this.switch =! this.switch;
                this.timer = this.config.timer;
            }
            if(this.switch){
                this.particlePositions[i * 3]     += particleData.speed.x * beat * 2;
            }else{
                this.particlePositions[i * 3 + 1] += particleData.speed.y * beat * 2;
            }
            this.particlePositions[i * 3 + 2]     += particleData.speed.z * avg * 4;

            // Check collision with outside limits
            if( this.particlePositions[i * 3] > this.xyHalf || this.particlePositions[i * 3] < -this.xyHalf){
                particleData.speed.x = - particleData.speed.x;
            }
            if( this.particlePositions[i * 3 + 1] > this.xyHalf || this.particlePositions[i * 3 + 1] < -this.xyHalf){
                particleData.speed.y = - particleData.speed.y;
            }
            if( this.particlePositions[i * 3 + 2] > this.zHalf || this.particlePositions[i * 3 + 2] < -this.zHalf){
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

                            let pFactor = dist / this.minDist;

                            this.lineColors[ colorIndex ++] = this.colorLineA.r + deltaR * pFactor;
                            this.lineColors[ colorIndex ++] = this.colorLineA.g + deltaG * pFactor;
                            this.lineColors[ colorIndex ++] = this.colorLineA.b + deltaB * pFactor;

                            this.lineColors[ colorIndex ++] = this.colorLineA.r + deltaR * pFactor;
                            this.lineColors[ colorIndex ++] = this.colorLineA.g + deltaG * pFactor;
                            this.lineColors[ colorIndex ++] = this.colorLineA.b + deltaB * pFactor;

                            overallConnect++;
                        }
                    }
                }
            }
        }

        this.timer --;

        this.lines.geometry.setDrawRange(0, overallConnect * 2);
        this.lines.geometry.attributes.position.needsUpdate = true;
        this.lines.geometry.attributes.color.needsUpdate = true;
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
