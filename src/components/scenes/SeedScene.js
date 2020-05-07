import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Bird, Flower, Land, Terrain, Cloud } from 'objects';
import { BasicLights } from 'lights';
const THREE = require ('three');

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0xcce0ff);

        // add terrain to scene
        const terrain = new Terrain(this);
        this.add(terrain);

        // Add meshes to scene
        //const land = new Land();
        //const flower = new Flower(this);
        const lights = new BasicLights();
        const bird = new Bird(this);
        this.add(lights, bird);

        this.fog = new THREE.Fog(0xcce0ff, 500, 1100);

        // Add cloud (just one for now for testing)
        const cloud = new Cloud();
        this.add(cloud);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;

        // disable rotation
        //this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default SeedScene;
