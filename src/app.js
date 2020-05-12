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
var ColorTween = require('color-tween');

const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
const scene = new SeedScene(camera);


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
