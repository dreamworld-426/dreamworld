/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, AudioListener, Audio, AudioLoader, AudioAnalyser, PCFShadowMap } from 'three';
import { SeedScene, LoadingPage } from 'scenes';
var ColorTween = require('color-tween');

// Set up camera
const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
const scene = new SeedScene(camera);
const renderer = new WebGLRenderer({ antialias: true });
// const loadingPage = new LoadingPage();

camera.position.y = 350 * Math.sin(Math.PI / 15);
camera.position.z = -300;
camera.lookAt(new Vector3(0, 50, 0));

// Set up sky
// var sky = new Sky();
// var uniforms = sky.material.uniforms;
//
// uniforms[ 'turbidity' ].value = 10;
// uniforms[ 'rayleigh' ].value = 2;
// uniforms[ 'luminance' ].value = 1;
// uniforms[ 'mieCoefficient' ].value = 0.005;
// uniforms[ 'mieDirectionalG' ].value = 0.8;
//
// var parameters = {
//   distance: 400,
//   inclination: 0.49,
//   azimuth: 0.205
// };
//
// // scene.add(sky);
// var cubeCamera = new THREE.CubeCamera( 1, 1000, 512 );
// cubeCamera.renderTarget.texture.generateMipmaps = true;
// cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;
// scene.add(cubeCamera);
// scene.background = cubeCamera.renderTarget;
//
// cubeCamera.update( renderer, scene );
// // sky.setVisible( true );
// renderer.render( scene, camera );

// initSky();

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
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
