import { Group, SphereBufferGeometry, MeshBasicMaterial, Mesh, MeshLambertMaterial,
  TextureLoader, InstancedMesh, DynamicDrawUsage,Object3D, Matrix4, Vector3, Color, AudioListener, Audio, AudioLoader} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import ORB from './orb.png';
import DING from './ding.mp3';
// import {Scoreboard} from 'http://gamingJS.com/Scoreboard.js';

class Orb extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            mesh: null,
            sphere: null,
            parent: parent,
            orientation: null,
            parent: parent,
            center: null,
            hit: [],
        };

        this.name = 'orb';

        // parent.addToUpdateList(this);
        this.updateOrbs();

    }

    updateOrbs() {
      this.disposeOf();
      let geometry = new SphereBufferGeometry(20,20,20);
      geometry.translate(0, 100, 0);

      let texture = new TextureLoader().load(ORB);
      let material = new MeshLambertMaterial({
        map: texture,
        transparent: true,
        opacity: 0.85,
      });

      let sphere = new Mesh( geometry, material );

      // adapted from https://github.com/mrdoob/three.js/blob/master/examples/webgl_instancing_dynamic.html
      let mesh = new InstancedMesh( geometry, material, Math.floor(this.state.parent.state.orbNum));
      // mesh.instanceMatrix.setUsage(DynamicDrawUsage ); // will be updated every frame

      let orientation = new Object3D();
      this.state.orientation = orientation;

      for (let i = 0; i < Math.floor(this.state.parent.state.orbNum); i ++ ) {
          // set position based on qualitative testing of what appears natural
          orientation.position.set(Math.random() * 1000 - 500, Math.random() * 300, Math.random() * 1000 - 500);
          // orientation.position.set(100, 0 ,0);
          // updated
          orientation.updateMatrix();
          mesh.setMatrixAt( i, orientation.matrix );
      }

      this.state.mesh = mesh;
      this.state.sphere = sphere;
      this.add( mesh );
      // console.log(this.state.orientation);
    }

    orientation(x, y, z, yOffset) {
      let matrix = new Matrix4();
      for (let i = 0; i < this.state.parent.state.orbNum; i++) {
        this.state.mesh.getMatrixAt(i, matrix);
        let vector = new Vector3(0,0,0);
        vector.setFromMatrixPosition(matrix);
        // console.log(this.state.parent.state.parent.state.z);
        vector.x -= this.state.parent.state.parent.state.x;
        vector.y -= this.state.parent.state.parent.state.y + 100;
        vector.z -= this.state.parent.state.parent.state.z;

        if (!this.state.hit[i] && vector.distanceTo(new Vector3(0,0,0)) < 100) {
          let audioLoader = new AudioLoader();
          let listener = new AudioListener();
          let sound = new Audio(listener);
          audioLoader.load(DING, function(buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(0.5);
            sound.play();
          });
          this.state.hit[i] = true;
          this.state.parent.state.score++;
        }
      }
    }

    disposeOf() {
      if (this.state.mesh != null || this.state.sphere != null) {
        this.remove(this.state.mesh);
        this.state.mesh.geometry.dispose();
        this.state.mesh.material.dispose();
        this.state.sphere.geometry.dispose();
        this.state.sphere.material.dispose();
        this.state.mesh = null;
        this.state.sphere = null;
        this.state.orientation = null;
      }
    }
}

export default Orb;
