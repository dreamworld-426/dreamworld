import * as Dat from 'dat.gui';
import { Scene, Color, SphereGeometry, SpotLight, BoxGeometry } from 'three';
import { Bird, Flower, Land, Terrain, Cloud, ChunkManager, Chunk, TerrainPlane, Text, Music, Orb } from 'objects';
import { BasicLights } from 'lights';
import { WorldLighting } from 'lights';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import RED from '../../textures/sunset.jpg';
import PURPLE from '../../textures/purple.jpeg';
import STARRY from '../../textures/starry.jpg';
import BLUE from '../../textures/misty.jpg';
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
            text: null,
            quotes: false,
        };

        // Set sky background
        this.background = new THREE.TextureLoader().load(PURPLE);

        // add base lighting
        const lights = new BasicLights();
        this.add(lights);

        // add terrain to scene
        const chunkmanager = new ChunkManager(this);
        this.add(chunkmanager);
        this.chunkmanager = chunkmanager;

        const bird = new Bird(this, camera);
        this.add(bird);

        const music = new Music(this, camera);
        this.add(music);

        this.fog = new THREE.Fog(0xcce0ff, 500, 1100);

        // Choose sky texture in GUI
        // Add lights to scene
        const worldlights = new WorldLighting(this);
        this.add(worldlights);

        let folder = this.state.gui.addFolder('SKY');
        folder.add(this.state, 'skyTexture', ['Dusk', 'Starry', 'Sunset', 'Blue']).name('Sky Texture').onChange(() => this.updateSkyTexture());
        folder.open();

        let quotes = this.state.gui.addFolder('QUOTES');
        quotes.add(this.state, 'quotes').name('Quotes').onChange(() => this.updateQuotes());
        quotes.open();

        this.state.gui.__ul.childNodes[1].classList += ' step2';
        this.state.gui.__ul.childNodes[2].classList += ' step3';
        this.state.gui.__ul.childNodes[3].classList += ' step4';
        this.state.gui.__ul.childNodes[4].classList += ' step5';
        this.state.gui.__ul.childNodes[5].classList += ' step6';
        this.state.gui.__ul.childNodes[6].classList += ' step7';
        this.state.gui.__ul.childNodes[7].classList += ' step8';
        this.state.gui.__ul.childNodes[8].classList += ' step9';
        this.state.gui.__ul.childNodes[9].classList += ' step10';
        this.state.gui.__ul.childNodes[10].classList += ' step11';
    }

    updateQuotes() {
      if (this.state.quotes) {
        this.state.quotes = true;
        console.log("add text...")
        const text = new Text();
        this.state.text = text;
      }
      else {
        let quotes = document.getElementById('slideshow');
        document.body.removeChild(quotes);
      }
    }

    addToUpdateList(object) {
        // console.log("Adding to SeedScene: ")
        // console.log(object)
        this.state.updateList.push(object);
    }

    updateSkyTexture() {
      if (this.state.skyTexture == 'Sunset') {
        var texture  = new THREE.TextureLoader().load(RED);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.background = texture;
        this.fog = new THREE.Fog(0xA36DA1, 500, 1000);

      }
      else if (this.state.skyTexture == 'Dusk'){
          var texture  = new THREE.TextureLoader().load(PURPLE);
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          this.fog = new THREE.Fog(0xB294B8, 500, 1000);
          this.background = texture;
      }
      else if (this.state.skyTexture == 'Starry') {
        var texture  = new THREE.TextureLoader().load(STARRY);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.fog = new THREE.Fog(0x17212A, 500, 1000);

        this.background = texture;
      }
      else if (this.state.skyTexture == 'Blue') {
        // Photo by Yuriy Kovalev on Unsplash
        var texture  = new THREE.TextureLoader().load(BLUE);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.fog = new THREE.Fog(0x95a4bd, 500, 1000);

        this.background = texture;
      }
    }

    update(timeStamp) {
        const { updateList, x, y, z } = this.state;

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
