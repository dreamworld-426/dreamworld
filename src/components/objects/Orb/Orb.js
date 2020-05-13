import { Group, TextGeometry, MeshBasicMaterial, FontLoader, Mesh, MeshLambertMaterial,TextureLoader, InstancedMesh, DynamicDrawUsage,Object3D, Matrix4 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ORB from './orb.png';
import 'three/examples/fonts/helvetiker_regular.typeface.json';
import FONT_PATH from './font.json';

const PROB_SHOWING = 0.5;
const messages = ["breath", "exhale", "focus", "ohmmm", "free"];

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
            isDisplayed: true,
        };

        this.name = 'orb';

        if(Math.random() > PROB_SHOWING) {
          this.state.isDisplayed = false;
          return;
        }

        // parent.addToUpdateList(this);
        this.updateOrbs(this.state.numOrb);
    }

    updateOrbs() {

      if(this.state.isDisplayed == false) { return; }

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

      var loader = new FontLoader();
      var that = this;
      let font = loader.load(FONT_PATH, function ( font ) {
        //console.log(font)

        let geometry = new TextGeometry( messages[Math.round(Math.random()*4)], {
      		font: font,
      		size: 50,
      		height: 5,

      	} );

        geometry.translate(0, 100, 0);

        let texture = new TextureLoader().load(ORB);
        let material = new MeshLambertMaterial({
          transparent: true,
          opacity: 0.85,
        });

        let sphere = new Mesh( geometry, material );

        // adapted from https://github.com/mrdoob/three.js/blob/master/examples/webgl_instancing_dynamic.html
        let mesh = new InstancedMesh( geometry, material, that.state.parent.state.orbNum);
        // mesh.instanceMatrix.setUsage(DynamicDrawUsage ); // will be updated every frame

        let orientation = new Object3D();
        that.state.orientation = orientation;

        for (let i = 0; i < that.state.parent.state.orbNum; i ++ ) {
            // set position based on qualitative testing of what appears natural
            orientation.position.set(Math.random() * 1000 - 500, Math.random() * 300, Math.random() * 1000 - 500);

            // updated
            orientation.updateMatrix();
            mesh.setMatrixAt( i, orientation.matrix );
        }

        that.state.mesh = mesh;
        that.state.sphere = sphere;
        mesh.rotation.y = Math.PI;
        that.add( mesh );
      });
    }

    disposeOf() {
      if(this.state.isDisplayed == false) {return;}
      if(this.state.mesh != null) {
        this.state.mesh.geometry.dispose()
        this.state.mesh.material.dispose()
        this.remove(this.state.mesh)
      }
    }
}

export default Orb;
