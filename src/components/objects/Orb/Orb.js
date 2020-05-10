import { Group, SphereBufferGeometry, MeshBasicMaterial, Mesh, MeshLambertMaterial,TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ORB from './orb.png';

class Orb extends Group {
    constructor(parent, xOffset, yOffset, zOffset) {
        // Call parent Group() constructor
        super();

        console.log("ORB CONSTRUCTOR");

        // Init state
        this.state = {
            gui: parent.state.gui,
            numberOrbs: 5,
            orbs: [],
        };

        let folder = this.state.gui.addFolder('ORBS');

        folder.add(this.state, 'numberOrbs', 0, 20);

        let geometry = new SphereBufferGeometry( 5, 32, 500);
        geometry.translate(0, -100, -200);

        let texture = new TextureLoader().load(ORB);
        let material = new MeshLambertMaterial({
          map: texture,
          transparent: true,
          opacity:0.5,
        });

        let sphere = new Mesh( geometry, material );

        this.add(sphere);
    }

    update(timeStamp) {

    }
}

export default Orb;
