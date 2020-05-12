import { Group, SphereBufferGeometry, MeshBasicMaterial, Mesh, MeshLambertMaterial,TextureLoader, InstancedMesh, DynamicDrawUsage,Object3D, Matrix4 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ORB from './orb.png';

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
        };

        this.name = 'orb';
        
        // parent.addToUpdateList(this);
        this.updateOrbs(this.state.numOrb);
    }

    updateOrbs() {
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
      let mesh = new InstancedMesh( geometry, material, this.state.parent.state.orbNum);
      // mesh.instanceMatrix.setUsage(DynamicDrawUsage ); // will be updated every frame

      let orientation = new Object3D();
      this.state.orientation = orientation;

      for (let i = 0; i < this.state.parent.state.orbNum; i ++ ) {
          // set position based on qualitative testing of what appears natural
          orientation.position.set(Math.random() * 1000 - 500, Math.random() * 300, Math.random() * 1000 - 500);

          // updated
          orientation.updateMatrix();
          mesh.setMatrixAt( i, orientation.matrix );
      }

      this.state.mesh = mesh;
      this.state.sphere = sphere;
      this.add( mesh );
    }
}

export default Orb;
