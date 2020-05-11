/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, AudioListener, Audio, AudioLoader, AudioAnalyser, PCFShadowMap } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { SeedScene } from 'scenes';
import DEEP from './components/sounds/deep.mp3';
import JAZZ from './components/sounds/jazzy.mp3';
import { Color } from 'three';
var ColorTween = require('color-tween');

const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
const scene = new SeedScene(camera);
// -------------------------- EVENT LISTENER HANDLERS ------------------------//
// Play audio handler
function audioHandler(event) {
  if (event.key == 'p' && !sound.isPlaying) {
    let audioLoader = new AudioLoader();
    if (scene.state.audiofile == 'jazzy.mp3') {
      audioLoader.load(JAZZ, function(buffer) {
      	sound.setBuffer(buffer);
      	sound.setLoop(true);
      	sound.setVolume(0.5);
      	sound.play();
      });
    }
    else if (scene.state.audiofile == 'deep.mp3') {
      audioLoader.load(DEEP, function(buffer) {
      	sound.setBuffer(buffer);
      	sound.setLoop(true);
      	sound.setVolume(0.5);
      	sound.play();
      });
    }
  }
  else if (event.key == 'p' && sound.isPlaying) {
    sound.pause();
  }
  else {return;}
}

// update audio when changed in gui
function updateAudioFile(audiofile) {
  let audioLoader = new AudioLoader();
  let music;

  // change audio
  if (audiofile == 'jazzy.mp3') {
    music = JAZZ;
    scene.state.audiofile = audiofile;
  }
  else if (audiofile == 'deep.mp3') {
    music = DEEP;
    scene.state.audiofile = audiofile;
  }

  // stop current audio if playing already
  if (sound.isPlaying) {
    sound.pause();
    audioLoader.load(music, function(buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      sound.play();
    });
  }
}

// animation loop for sky tween
// function animate() {
//   if (tween.update()) {
//     // do some work, then recursively call animate
//     requestAnimationFrame(animate);
//   }
//   else loopSkyTween();
// }
//
// // for sky tween
// function someFn(color) {
//   scene.background = new Color(color.hex());
//   // background can be any Object: color, cubemap, or texture
// }
//
// function loopSkyTween() {
//   // change sky color
//   var tween = new ColorTween('#000', '#FFF')
//               .onUpdate(someFn)
//               .easing('Quadratic')
//               .duration(5000)
//               .start(animate);
//   // tween.onComplete(() => loopSkyTween());
// }

// Initialize core ThreeJS components
// const camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
// camera.position.y = 350;
// camera.position.z = -300;
// camera.position.x = 300;
// const scene = new SeedScene(camera);

const renderer = new WebGLRenderer({ antialias: true });

// var tween = new ColorTween('#000', '#FFF')
//             .onUpdate(someFn)
//             .easing('Quadratic')
//             .duration(5000)
//             .start(animate);

// Set up camera
//camera.position.set(6, 3, -10);
camera.position.y = 60;
camera.position.z = -300;
camera.lookAt(new Vector3(0, 50, 0));

// Add audio
var listener = new AudioListener();
camera.add(listener);

// create a global audio source
var sound = new Audio(listener);

// create an AudioAnalyser, passing in the sound and desired fftSize
var analyser = new AudioAnalyser(sound, 32);
var data = analyser.getFrequencyData();

// Choose audio file in GUI
let folder = scene.state.gui.addFolder('AUDIO');
folder.add(scene.state, 'audiofile', ['jazzy.mp3', 'deep.mp3']).onChange((e) => {updateAudioFile(e)});
folder.open();
window.addEventListener('keydown', audioHandler);

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled;
renderer.shadowMap.type = PCFShadowMap;
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.minDistance = 4;
// controls.maxDistance = 500;
//const controls = new FirstPersonControls(camera, canvas);

// controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
