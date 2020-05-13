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
        parent: parent,
        animation: null,
        action: null,
        newAnimate: false,
        xRotate: 0,
        yRotate: 0,
        zRotate: 0,
        velocity: 2,
        keysPressed: [],
      };

      this.name = 'bird';

      // Load stork as default
      this.onLoad('Stork');

      // Populate Bird GUI
      let folder = this.state.gui.addFolder('BIRD');
      folder.add(this.state, 'bird', ['Stork', 'Parrot', 'Flamingo']).onChange((bird) => this.onLoad(bird));
      folder.add(this.state, 'velocity', 0, 5).onChange((e) => {this.state.velocity = e;});
      folder.open();

      // window listeners to rotate bird
      // set keysPressed true when key is pressed
      window.addEventListener('keydown', (e) => {
        this.state.keysPressed[e.keyCode] = true;
        this.birdHandler(e);
      }, false);


      // set keysPressed to false when key is lifted
      window.addEventListener('keyup', (e) => {
        this.state.keysPressed[e.keyCode] = false;
      }, false);

      // Add update list
      parent.addToUpdateList(this);
  }

  // rotate bird based on wasd keys pressed
  birdHandler(e) {
    // bird goes up
    // w key
    if (this.state.keysPressed[87]) {
      this.state.upTime = e.timeStamp;

      // change x rotation
      if (this.state.xRotate >= -0.5) {
        this.state.xRotate -= 0.01;
      }

      // change bird speed to go faster
      if (this.state.speed >= 700) {
        this.state.speed -= 200;
      }

      // update terrain y position
      this.state.parent.state.y -= this.state.velocity;
    }

    // bird goes down
    // s space key
    if (this.state.keysPressed[83]) {
      this.state.downTime = e.timeStamp;

      if (this.state.xRotate <= 0.5) {
          this.state.xRotate += 0.05;
      }

      let animation = this.state.animation.clone();
      let track =  animation.tracks[0];
      let values = track.values;

      // if (this.state.bird != 'Flamingo'){
      // 0 - hooked wings - maybe
      // 1 - hooked wings - maybe
      // 2 - hooked wings - maybe
      let vals = [];
      if (this.state.bird === 'Stork') {
        vals = [0,13,26,39,58,72,86,103,104,117,136,150,168,169];
      }
      else if (this.state.bird === 'Parrot'){
        vals = [0,12,24,37,50,67,80,93,106,119];
      }
      else if (this.state.bird === 'Flamingo') {
        vals = [4,17,30,43,56,69,82,95,108,121,134,147,160,173];
      }

      for (let i = 0; i < values.length; i++) {
        if (vals.includes(i)) {
          values[i] = 1;
        }
        else {
          values[i] = 0;
        }
      }

      this.state.speed = 1500;
      if (!e.repeat) {
        const action = this.state.mixer.clipAction(animation);
        this.state.action = this.state.action.crossFadeTo(action, 1, true);
        this.state.action.play();
        this.state.newAnimate = true;
      }

      // Update terrain position
      if (this.state.parent.state.y <= -10) {
        this.state.parent.state.y += this.state.velocity;
      }
    }

    // bird goes to the left
    // d key
    if (this.state.keysPressed[68]) {
      this.state.rightTime = e.timeStamp;
      if (this.state.zRotate <= 0.5) {
        this.state.zRotate += 0.01;
      }

      // Keep rotations between 0 and 2 * PI;
      if (this.state.yRotate <= 0) {
        this.state.yRotate = 2 * Math.PI;
      }
      this.state.yRotate -= 0.03;
    }

    // a key
    if (this.state.keysPressed[65]) {
      this.state.leftTime = e.timeStamp;
      if (this.state.zRotate >= -0.5) {
        this.state.zRotate -= 0.01;
      }

      // Keep rotations between 0 and 2 * PI;
      this.state.yRotate += 0.03;
      this.state.yRotate = this.state.yRotate % (2 * Math.PI);

      // Update Terrain
      // this.state.parent.state.x += Math.cos(this.state.yRotate);
      // this.state.parent.state.z -= Math.sin(this.state.yRotate);
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
      this.state.animation =  null;
      this.state.action = null;
      this.state.newAnimate = false;
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

      // move bird foward
      this.state.parent.state.z += this.state.velocity * Math.cos(this.state.yRotate);
      this.state.parent.state.x += this.state.velocity * Math.sin(this.state.yRotate);

      // reposition bird if wasd were pressed and isn't currently being pressed
      if (this.state.upTime + 1000 < timeStamp) {
        if (this.state.xRotate <= 0.005) {
          this.state.xRotate += 0.005;
        }
        if (this.state.speed <= 1000) {
          this.state.speed += 50;
        }
      }
      if (this.state.downTime + 1000 < timeStamp) {
        if (this.state.xRotate >= 0.005) {
          this.state.xRotate -= 0.005;
        }
      }
      if (this.state.downTime + 1000 < timeStamp && this.state.newAnimate) {
        this.state.speed = 1000;
        this.state.mixer.stopAllAction();
        const action = this.state.mixer.clipAction(this.state.animation);
        this.state.action = this.state.action.crossFadeTo(action, 1, true);
        this.state.action.play();
        this.state.newAnimate = false;
      }
      if (this.state.leftTime + 1000 < timeStamp) {
        if (this.state.zRotate <= 0) {
          this.state.zRotate += 0.005;
        }
      }
      if (this.state.rightTime + 1000 < timeStamp) {
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

    // update bird's speed based on its velocity if it is greater than 2
    if (this.state.velocity >= 2 && this.state.downTime + 1000 < timeStamp && this.state.upTime + 1000 < timeStamp){
      if (this.state.velocity >= 4) {
        this.state.speed = 1800 / 4;
      }
      else {this.state.speed = 1800 / this.state.velocity;}
    }

    //  animate the bird
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
