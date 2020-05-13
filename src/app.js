/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */

import { WebGLRenderer, PerspectiveCamera, Vector3, AudioListener, Audio, AudioLoader, AudioAnalyser, PCFShadowMap, Color } from 'three';
import { SeedScene } from 'scenes';
// import { Sky } from 'three-sky/src/Sky.js';
var ColorTween = require('color-tween');
var THREE = require('three');
const Sky = require('three-sky');

const renderer = new WebGLRenderer({ antialias: true, alpha: true});
const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
const scene = new SeedScene(renderer, camera);

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

// function initSky() {
//         // scene.background = new Color(0xffffff);
// 				// Add Sky
// 				var sky = new Sky();
// 				sky.scale.setScalar( 450000 );
// 				scene.add( sky );
//
// 				// Add Sun Helper
// 				var sunSphere = new THREE.Mesh(
// 					new THREE.SphereBufferGeometry( 20000, 16, 8 ),
// 					new THREE.MeshBasicMaterial( { color: 0xffffff } )
// 				);
// 				sunSphere.position.y = - 700000;
// 				sunSphere.visible = false;
// 				scene.add( sunSphere );
//
// 				/// GUI
//         var effectController = {
// 					turbidity: 10,
// 					rayleigh: 2,
// 					mieCoefficient: 0.005,
// 					mieDirectionalG: 0.8,
// 					luminance: 1,
// 					inclination: 0.49, // elevation / inclination
// 					azimuth: 0.25, // Facing front,
// 					sun: ! true
// 				};
//
// 				var distance = 400000;
//
//         function guiChanged() {
//
//           var uniforms = sky.material.uniforms;
//           uniforms[ "turbidity" ].value = effectController.turbidity;
//           uniforms[ "rayleigh" ].value = effectController.rayleigh;
//           uniforms[ "mieCoefficient" ].value = effectController.mieCoefficient;
//           uniforms[ "mieDirectionalG" ].value = effectController.mieDirectionalG;
//           uniforms[ "luminance" ].value = effectController.luminance;
//
//           var theta = Math.PI * ( effectController.inclination - 0.5 );
//           var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );
//
//           sunSphere.position.x = distance * Math.cos( phi );
//           sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
//           sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
//
//           sunSphere.visible = effectController.sun;
//
//           uniforms[ "sunPosition" ].value.copy( sunSphere.position );
//
//           renderer.render( scene, camera );
//
//         }
//
//         var gui = scene.state.gui;
//
//         let folder = gui.addFolder('SKY1');
// 				folder.add(effectController, "turbidity", 1.0, 20.0, 0.1 ).onChange( guiChanged );
// 			  folder.add( effectController, "rayleigh", 0.0, 4, 0.001 ).onChange( guiChanged );
// 	     folder.add( effectController, "mieCoefficient", 0.0, 0.1, 0.001 ).onChange( guiChanged );
// 			folder.add( effectController, "mieDirectionalG", 0.0, 1, 0.001 ).onChange( guiChanged );
// 				folder.add( effectController, "luminance", 0.0, 2 ).onChange( guiChanged );
// 				folder.add( effectController, "inclination", 0, 1, 0.0001 ).onChange( guiChanged );
// 				folder.add( effectController, "azimuth", 0, 1, 0.0001 ).onChange( guiChanged );
// 				folder.add( effectController, "sun" ).onChange( guiChanged );
//         folder.open();
// 				guiChanged();
//         // stuff
// }


function loopSkyTween() {
  // change sky color
  var tween = new ColorTween('#000', '#FFF')
              .onUpdate(someFn)
              .easing('Quadratic')
              .duration(5000)
              .start(animate);
  // tween.onComplete(() => loopSkyTween());
}

// Set up camera
camera.position.y = 60;
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
