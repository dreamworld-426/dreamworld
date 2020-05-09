import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Bird, Flower, Land, Terrain, Cloud, ChunkManager, Chunk, TerrainPlane } from 'objects';
import { BasicLights } from 'lights';

const THREE = require ('three');

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            audiofile: 'jazzy.mp3',
            updateList: [],
            x: 0,
            y: 0,
            z: 0,
        };

        // Set background to a nice color
        this.background = new Color(0xcce0ff);


        // Add meshes to scene
        console.log("adding lights...")
        const lights = new BasicLights();
        this.add(lights);

        console.log("adding bird...")
        const bird = new Bird(this);
        this.add(bird);

        // add terrain to scene
        console.log("adding chunk manager...")
        const chunkmanager = new ChunkManager(this);
        this.add(chunkmanager);

        this.fog = new THREE.Fog(0xcce0ff, 500, 1100);

        // Add cloud (just one for now for testing)
        const cloud = new Cloud();
        this.add(cloud);
        this.add(cloud);
        this.add(cloud);
        this.add(cloud);
        this.add(cloud);
    }

    addToUpdateList(object) {
        console.log("Adding to SeedScene: ")
        console.log(object)
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { updateList, x, y, z } = this.state;

        // calculate offsets

        // disable rotation
        //this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp, this.state.x, this.state.y, this.state.z);
        }
    }
}

export default SeedScene;
