import { Group, Vector3, AnimationMixer, NumberKeyframeTrack, AnimationClip} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stork from './stork.glb';
import Parrot from './parrot.glb';
import Flamingo from './flamingo.glb';

class Bird extends Group {
  constructor(parent) {
      // Call parent Group() constructor
      super();

      // Init state
      this.state = {
          gui: parent.state.gui,
          bird: 'Stork',
          model: null,
          mixer: null,
          prevTimeStamp: null,
          position: new Vector3(0, 0, 0),
      };

      this.name = 'bird';

      // Load stork as default
      this.onLoad('Stork');

      // Populate GUI
      this.state.gui.add(this.state, 'bird', ['Stork', 'Parrot', 'Flamingo']).onChange((bird) => this.onLoad(bird));

      // Add update list
      parent.addToUpdateList(this);
  }

  // Converts glb files to gltf
  // Adapted from https://discoverthreejs.com/book/first-steps/load-models/
  onLoad(bird) {

    if (this.state.model !== null) {
      this.remove(this.state.model);
      this.state.model.geometry.dispose();
      this.state.model.material.dispose();
      this.state.mixer = null;
      this.state.prevTimeStamp = null;
      this.state.model = null;
    }

    // Bird loader
    const loader = new GLTFLoader();

    // Type of bird
    let type;

    // Load Bird
    if (bird === 'Stork') {
      type = Stork;
    }
    else if (bird ==='Parrot') {
      type = Parrot;
    }
    else if (bird === 'Flamingo') {
      type = Flamingo;
    }
    else {return;}

    // load the type of bird
    loader.load(type, (gltf) => {
      const model = gltf.scene.children[0];
      model.position.copy(this.state.position);

      const animation = gltf.animations[0];
      // const track =  animation.tracks[0];

      // const times = track.times;
      // let values = track.values;
      // //debugger;
      // for (let i = 0; i < values.length; i++) {
      //   if (i < values.length / 2) {
      //     if (i % 15 == 0){
      //       values[i] = 1;
      //     }
      //     else {
      //       values[i] = 0;
      //     }
      //   }
      //   else {
      //     values[i] = 0;
      //   }
      // }
      // const test = [];
      // test.push(new NumberKeyframeTrack('test', times, values));
      //
      // const clip = new AnimationClip('testing', 1.2999999523162842, test);

      // add mixer to state
      const mixer = new AnimationMixer(model);
      this.state.mixer = mixer;

      const action = mixer.clipAction(animation);
      action.play();

      // set model to state
      this.state.model = model;

      // add model to scene
      this.add(model);
    })
  };

  update(timeStamp) {
    // this.camera.position.set(this.position.clone().add(new Vector3(0, 0, 0)));
    // this.camera.lookAt(new Vector3(0,0,0));
    // this.camera.updateProjectionMatrix();
    // this.position.z += 1;

    // animate the bird
    if (this.state.mixer !== null) {
      // set previous time stamp if null
      if (this.state.prevTimeStamp === null) {
        this.state.prevTimeStamp = timeStamp;
      }

      // calculate delta
      const delta = (timeStamp - this.state.prevTimeStamp) / 1000;

      // update previous time stamp
      this.state.prevTimeStamp = timeStamp;

      // update animation
      this.state.mixer.update(delta);
    }

  }
}

export default Bird;