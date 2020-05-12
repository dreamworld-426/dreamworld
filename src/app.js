/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, AudioListener, Audio, AudioLoader, AudioAnalyser, PCFShadowMap } from 'three';
import { SeedScene } from 'scenes';
import DEEP from './components/sounds/deep.mp3';
import JAZZ from './components/sounds/jazzy.mp3';
import PIANO from './components/sounds/piano.mp3';
import MEDITATION from './components/sounds/5minbreathing.mp3';
import SLOW from './components/sounds/slowmotion.mp3';
var ColorTween = require('color-tween');

const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
const scene = new SeedScene(camera);
// -------------------------- EVENT LISTENER HANDLERS ------------------------//
// Play audio handler
function audioHandler(event) {
  if (event.key == 'p' && !sound.isPlaying) {
    let audioLoader = new AudioLoader();
    let music;
    let audiofile = scene.state.audiofile;
    if ( audiofile == 'Jazzy') {
      music = JAZZ;
    }
    else if (audiofile == 'Deep Meditation') {
      music = DEEP;
      // scene.state.audiofile = audiofile;
    }
    else if (audiofile == 'Slow') {
      music = SLOW;
    }
    else if (audiofile == 'Piano') {
      music = PIANO;
    }
    else if (audiofile == 'Breathing Exercise') {
      music = MEDITATION;
    }

    audioLoader.load(music, function(buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      sound.play();
    });
  }
  else if (event.key == 'p' && sound.isPlaying) {
    sound.pause();
  }


  else return;
}

// update audio when changed in gui
function updateAudioFile() {
  let audioLoader = new AudioLoader();
  let music;
  let audiofile = scene.state.audiofile;

  // stop current audio if playing already
  if (sound.isPlaying) {
    sound.stop();
  }
  // change audio
  if (audiofile == 'Jazzy') {
    music = JAZZ;
    // scene.state.audiofile = audiofile;
  }
  else if (audiofile == 'Deep Meditation') {
    music = DEEP;
    // scene.state.audiofile = audiofile;
  }
  else if (audiofile == 'Slow') {
    music = SLOW;
  }
  else if (audiofile == 'Piano') {
    music = PIANO;
  }
  else if (audiofile == 'Breathing Exercise') {
    music = MEDITATION;
  }

  // audioLoader.load(music, function(buffer) {
  //   sound.setBuffer(buffer);
  //   sound.setLoop(true);
  //   sound.setVolume(0.5);
  //   sound.play();
  // });
}

// animation loop for sky tween
function animate() {
  // if (tween.update()) {
  //   // do some work, then recursively call animate
  //   requestAnimationFrame(animate);
  // }
  // else loopSkyTween();
}

// for sky tween
function someFn(color) {
  var sky_texture = scene.background;
  // var alpha = scene.state.alpha; // add alpha to scene.state, make scene be passed into wordLighting, worldlighting can change the alpha based on the angle of the sun
  // scene.background = new Color(color.hex());
  // background can be any Object: color, cubemap, or texture
}

function loopSkyTween() {
  // change sky color
  var tween = new ColorTween('#000', '#FFF')
              .onUpdate(someFn)
              .easing('Quadratic')
              .duration(5000)
              .start(animate);
  // tween.onComplete(() => loopSkyTween());
}



const renderer = new WebGLRenderer({ antialias: true, alpha: true});

// var tween = new ColorTween('#000', '#FFF')
//             .onUpdate(someFn)
//             .easing('Quadratic')
//             .duration(5000)
//             .start(animate);

// Set up camera
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
var data = analyser.getAverageFrequency();

// Choose audio file in GUI
let folder = scene.state.gui.addFolder('AUDIO');
folder.add(scene.state, 'audiofile', ['Jazzy', 'Deep Meditation', 'Slow', 'Piano', 'Breathing Exercise']).onChange(() => {updateAudioFile()});
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


//Render loop
const onAnimationFrameHandler = (timeStamp) => {

      scene.update && scene.update(timeStamp);
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
