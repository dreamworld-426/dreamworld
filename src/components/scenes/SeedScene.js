import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Bird, Flower, Land, Terrain, Cloud } from 'objects';
import { BasicLights } from 'lights';
import { WorldLighting } from 'lights';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
// import { Sky } from 'three/examples/jsm/objects/Sky.js';
import SUNSET from './sunset.jpg';

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
        };

        // Set background to a nice color
        // var texture = new THREE.TextureLoader().load(SUNSET);
        // texture.wrapS = THREE.RepeatWrapping;
        // texture.wrapT = THREE.RepeatWrapping;
        // this.background = texture;
        // texture.repeat.set( 200, 200 );
        // this.background = new Color(0xcce0ff);

        // debugger;
        // var color = new Color(0, 0, 0);
        // var tween = new TWEEN.Tween(color)
        // .to(new Color(1, 1, 1), 1.0, 'Linear')
        // .loop(true)
        // .yoyo(true)
        // .on('update', function () {
        //   this.background = color
        // })
        // .start();

        // Skydome
        // var skyDome = new THREE.SphereGeometry(100000, 32, 32);
        // var texture  = new THREE.TextureLoader().load(SUNSET);
        // texture.wrapS = THREE.RepeatWrapping;
        // texture.wrapT = THREE.RepeatWrapping;
        // var material = new THREE.MeshPhongMaterial({
        //   map: texture,
        // });
        // var sky = new THREE.Mesh(skyDome, material);
        // sky.position.set(0, 0, 0);
        // sky.material.side = THREE.BackSide;
        // this.add(sky);

        // var sky = new Sky();
				// sky.scale.setScalar( 450000 );
				// this.add( sky );

        // add terrain to scene
        const terrain = new Terrain(this);
        this.add(terrain);

        // Add meshes to scene
        //const land = new Land();
        //const flower = new Flower(this);
        const worldlights = new WorldLighting(this);
        this.add(worldlights);

        const lights = new BasicLights();
        this.add(lights);

        const bird = new Bird(this);
        this.add(bird);

        this.fog = new THREE.Fog(0xcce0ff, 500, 1100);

        // Add cloud (just one for now for testing)
        const cloud = new Cloud();
        this.add(cloud);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { updateList } = this.state;

        // disable rotation
        //this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }

}

export default SeedScene;
