import { Group, Vector3, AnimationMixer, NumberKeyframeTrack, AnimationClip, Euler} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stork from './stork.glb';
import Parrot from './parrot.glb';
import Flamingo from './flamingo.glb';

class Bird extends Group {
  constructor(parent, camera) {
      // Call parent Group() constructor
      super();

      console.log("BIRD CONSTRUCTOR")

      // Init state
      this.state = {
        gui: parent.state.gui,
        bird: 'Stork',
        model: null,
        mixer: null,
        prevTimeStamp: null,
        camera: camera,
        speed: 1000,
        upTime: 0,
        downTime: 0,
        rightTime: 0,
        leftTime: 0,
        forwardTime: 0,
        backwardTime: 0,
        keyTime: 0,
        parent: parent,
        animation: null,
        action: null,
        newAnimate: false,
        xRotate: 0,
        yRotate: 0,
        zRotate: 0,
        velocity: 10,
      };

      this.name = 'bird';

      // Load stork as default
      this.onLoad('Stork');

      // Populate GUI
      this.state.gui.add(this.state, 'bird', ['Stork', 'Parrot', 'Flamingo']).onChange((bird) => this.onLoad(bird));
      this.state.gui.add(this.state, 'velocity', 0, 20).onChange((e) => {this.state.velocity = e});

      // window listeners to rotate bird
      window.addEventListener('keydown', (e) => {this.windowResizeHandler(e)}, false);

      // Add update list
      parent.addToUpdateList(this);
  }

  // rotate bird based on wasd keys pressed
  windowResizeHandler(e) {
    // bird goes down
    if (e.key == "q") {
      this.state.upTime = e.timeStamp;
      this.state.keyTime =  e.timeStamp;

      if (this.state.xRotate >= -0.5) {
        this.state.xRotate -= 0.01;
      }

      if (this.state.speed >= 700) {
        this.state.speed -= 100;
      }

      // update terrain position
      this.state.parent.state.y -= this.state.velocity;
    }

    // bird goes up
    if (e.key == "e") {
      this.state.downTime = e.timeStamp;
      this.state.keyTime =  e.timeStamp;

      if (this.state.xRotate <= 0.5) {
        this.state.xRotate += 0.01;
      }

      let animation = this.state.animation.clone();
      let track =  animation.tracks[0];
      let values = track.values;

      // if (this.state.bird != 'Flamingo'){
      let vals = [11,24,36,48,60,73,86,99,112,126,140,154,168,178];
      for (let i = 0; i < values.length; i++) {
        values[i] = 0;
      }

      if (!e.repeat) {
        const action = this.state.mixer.clipAction(animation);
        this.state.action = this.state.action.crossFadeTo(action, 1, true);
        this.state.action.play();
        this.state.newAnimate = true;
      }

      // Update terrain position
      this.state.parent.state.y += this.state.velocity;
    }

    // Bird goes forward
    if (e.key == "w") {
      // Update parent terrain
      this.state.parent.state.z += this.state.velocity * Math.cos(this.state.yRotate);
      this.state.parent.state.x += this.state.velocity * Math.sin(this.state.yRotate);
    }

    // bird goes to the left
    if (e.key == "a") {
      this.state.rightTime = e.timeStamp;
      this.state.keyTime =  e.timeStamp;
      if (this.state.zRotate <= 0.5) {
        this.state.zRotate += 0.01;
      }

      // Keep rotations between 0 and 2 * PI;
      this.state.yRotate += 0.01;
      this.state.yRotate = this.state.yRotate % (2 * Math.PI);

      // Update Terrain
      this.state.parent.state.x -= this.state.velocity * Math.cos(this.state.yRotate);
      this.state.parent.state.z -= this.state.velocity * Math.sin(this.state.yRotate);
    }

    if (e.key == "d") {
      this.state.leftTime = e.timeStamp;
      this.state.keyTime =  e.timeStamp;
      if (this.state.zRotate >= -0.5) {
        this.state.zRotate -= 0.01;
      }
      this.state.yRotate -= 0.01;

      // Keep rotations between 0 and 2 * PI;
      if (this.state.yRotate <= 0) {
        this.state.yRotate = 2 * Math.PI;
      }

      // update terrain
      this.state.parent.state.x -= this.state.velocity * Math.cos(this.state.yRotate);
      this.state.parent.state.z -= this.state.velocity * Math.sin(this.state.yRotate);
    }
  }


  // Converts glb files to gltf
  // Adapted from https://discoverthreejs.com/book/first-steps/load-models/
  onLoad(bird) {
    // Previous position of the bird
    let prevBirdPosition;

    if (this.state.model !== null) {
      prevBirdPosition = this.state.model;
      this.remove(this.state.model);
      this.state.model.geometry.dispose();
      this.state.model.material.dispose();
      this.state.mixer = null;
      this.state.prevTimeStamp = null;
      this.state.model = null;
      this.state.speed = 1000;
      this.state.upTime = 0;
      this.state.downTime = 0;
      this.state.rightTime = 0;
      this.state.leftTime = 0;
      this.state.keyTime = 0;
      this.state.animation =  null;
      this.state.action = null;
      this.statenewAnimate = false;
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

      // If there was a previous bird, set it to that position and not the
      // origin
      if (prevBirdPosition == null) {
        model.position.copy(new Vector3(0, 0, 0));
      }
      else {
        model.position.copy(prevBirdPosition.position);
        model.rotation.copy(prevBirdPosition.rotation);
      }

      // copy rotations into state
      model.rotation.reorder('YXZ');
      this.state.xRotate = model.rotation.x;
      this.state.yRotate = model.rotation.y;
      this.state.zRotate = model.rotation.z;

      this.state.animation = gltf.animations[0];

      // add mixer to state
      const mixer = new AnimationMixer(model);
      this.state.mixer = mixer;

      this.state.action = this.state.mixer.clipAction(this.state.animation);
      this.state.action.play();

      // set model to state
      this.state.model = model;

      // add model to scene
      this.add(model);
    })
  };

  update(timeStamp, x, y, z) {
    if (this.state.model != null) {
      // update rotation of the bird;
      this.state.model.rotation.x = this.state.xRotate;
      this.state.model.rotation.y = this.state.yRotate;
      this.state.model.rotation.z = this.state.zRotate;

      // reposition bird if wasd were pressed and isn't currently being pressed
      if (this.state.upTime + 1000 < timeStamp && this.state.keyTime + 1000 < timeStamp) {
        if (this.state.xRotate <= 0.005) {
          this.state.xRotate += 0.005;
        }
        if (this.state.speed <= 1000) {
          this.state.speed += 50;
        }
      }
      if (this.state.downTime + 1000 < timeStamp && this.state.keyTime + 1000 < timeStamp) {
        if (this.state.xRotate >= 0.005) {
          this.state.xRotate -= 0.005;
        }
      }
      if (this.state.downTime < timeStamp && this.state.keyTime + 1000 < timeStamp && this.state.newAnimate) {
        this.state.mixer.stopAllAction();
        const action = this.state.mixer.clipAction(this.state.animation);
        this.state.action = this.state.action.crossFadeTo(action, 1, true);
        this.state.action.play();
        this.state.newAnimate = false;
      }
      if (this.state.leftTime + 1000 < timeStamp && this.state.keyTime + 1000 < timeStamp) {
        if (this.state.zRotate <= 0) {
          this.state.zRotate += 0.005;
        }
      }
      if (this.state.rightTime + 1000 < timeStamp && this.state.keyTime + 1000 < timeStamp) {
        if (this.state.zRotate >= 0) {
          this.state.zRotate -= 0.005;
        }
      }

      // Reposition camera
      this.state.camera.position.y = 350 * Math.sin(this.state.xRotate + Math.PI/15);
      this.state.camera.position.z = -300 * Math.cos(this.state.yRotate);
      this.state.camera.position.x = 300 * Math.sin(-this.state.yRotate);
      this.state.camera.lookAt(this.state.model.position);
    }

    // animate the bird
    if (this.state.mixer !== null) {
      // set previous time stamp if null
      if (this.state.prevTimeStamp === null) {
        this.state.prevTimeStamp = timeStamp;
      }

      // calculate delta
      const delta = (timeStamp - this.state.prevTimeStamp) / this.state.speed;

      // update previous time stamp
      this.state.prevTimeStamp = timeStamp;

      // update animation
      this.state.mixer.update(delta);
    }
  }
}

export default Bird;
