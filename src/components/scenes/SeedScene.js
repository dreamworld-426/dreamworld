import * as Dat from 'dat.gui';
import { Scene, Color, SphereGeometry, SpotLight, BoxGeometry } from 'three';
import { Bird, Flower, Land, Terrain, Cloud, ChunkManager, Chunk, TerrainPlane, Orb } from 'objects';
import { BasicLights } from 'lights';
import { WorldLighting } from 'lights';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import RED from '../textures/sunset.jpg';
import PURPLE from '../textures/purple.jpeg';
import STARRY from '../textures/starry.jpg';
const THREE = require ('three');

class SeedScene extends Scene {
    constructor(camera) {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            audiofile: 'Deep Meditation',
            skyTexture: 'Dusk',
            updateList: [],
            x: 0,
            y: 0,
            z: 0,
        };

        // Initial sky texture
        // var skyDome = new BoxGeometry(50, 50, 50);
        // var texture  = new THREE.TextureLoader().load(PURPLE);

        // texture.wrapS = THREE.RepeatWrapping;
        // texture.wrapT = THREE.RepeatWrapping;
        // // texture.opacity
        // var material = new THREE.MeshStandardMaterial({
        //   map: texture,
        //   color: 0x34eb46,
        //   wireframe: true,
        //   // side: THREE.BackSide
        // });
        // // this.background = material;
        // var sky = new THREE.Mesh(skyDome, material);
        // // sky.position.set(0, 0, 0);
        // // sky.material.side = THREE.BackSide;
        // this.add(sky);
        // this.background = texture;

        this.background = new THREE.TextureLoader().load(PURPLE);

        // Add meshes to scene
        const worldlights = new WorldLighting(this);
        this.add(worldlights);

        const lights = new BasicLights();
        this.add(lights);

        // add terrain to scene
   

        
        console.log("adding chunk manager...")
        const chunkmanager = new ChunkManager(this);
        this.add(chunkmanager);

        console.log("adding bird...")
        const bird = new Bird(this, camera);
        this.add(bird);
        // add orbs
        // const orb = new Orb(this);
        // this.add(orb);

        this.fog = new THREE.Fog(0xcce0ff, 500, 1100);

        // Add cloud (just one for now for testing)

        // Choose sky texture in GUI
        let folder = this.state.gui.addFolder('SKY');
        folder.add(this.state, 'skyTexture', ['Dusk', 'Starry', 'Sunset']).onChange(() => this.updateSkyTexture());
        folder.open();

        // const cloud = new Cloud();
        // this.add(cloud);
        // this.add(cloud);
        // this.add(cloud);
        // this.add(cloud);
        // this.add(cloud);
    }

    addToUpdateList(object) {
        console.log("Adding to SeedScene: ")
        console.log(object)
        this.state.updateList.push(object);
    }

    updateSkyTexture() {
      if (this.state.skyTexture == 'Sunset') {
        var texture  = new THREE.TextureLoader().load(RED);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.background = texture;
      }
      else if (this.state.skyTexture == 'Dusk'){
          var texture  = new THREE.TextureLoader().load(PURPLE);
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          this.background = texture;
      }
      else if (this.state.skyTexture == 'Starry') {
        var texture  = new THREE.TextureLoader().load(STARRY);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.background = texture;
      }
    }

    update(timeStamp) {
        const { updateList, x, y, z } = this.state;

        // calculate offsets

        // disable rotation
        //this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp, this.state.x, this.state.y, this.state.z);

            // update twice to prevent glitching due to moving terrain
            if (obj.name == "ChunkManager") {
                obj.update(timeStamp, this.state.x, this.state.y, this.state.z);
            }
        }
    }

}

export default SeedScene;
