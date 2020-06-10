/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { WebGLRenderer, PerspectiveCamera, Vector3, AudioListener, Audio, AudioLoader, AudioAnalyser, PCFShadowMap } from 'three';
import { SeedScene } from 'scenes';
var ColorTween = require('color-tween');
import Shepherd from 'shepherd.js';
// Set up camera
const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
const scene = new SeedScene(camera);
const renderer = new WebGLRenderer({ antialias: true });
renderer.xr.enabled = true;

camera.position.y = 350 * Math.sin(Math.PI / 15);
camera.position.z = -300;
camera.lookAt(new Vector3(0, 50, 0));
document.body.appendChild( VRButton.createButton( renderer ) );

    //TODO: Add styles to header
    let headID = document.getElementsByTagName('head')[0];
    let link = document.createElement("link");
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = "https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap";
    headID.appendChild(link);

    let box = document.createElement("DIV");
    box.id = 'LoadingPage';
    box.height = '100%';
    box.weigth = '100%';

    // adapted from bootstrap docs
    let html = '<style type="text/css">' +
    'body, p, h1, h2, h3, h4, h5, a' +
    '{ font-family: Comfortaa, Helvetica, san-serif; }' +
    '.jumbotron { background: none; }' +
    '.keys { display: inline:block; font-size: 20px;}' +
    'input { max-height: 20px;}' +
    'hr { color: white;}' +
    '.box {z-index: 10; position:absolute; top:0; width: 100%}' +
    '@media only screen and (max-width: 767px) { .p-large { font-size: 1.0rem; } .display-4,.display-5 { font-size: 1.5rem; }}' +
    '@media only screen and (min-width: 768px) { .p-large, { font-size: 1.4rem; } .display-4,.display-5 { font-size: 1.7rem; }}' +
    '@media only screen and (min-width: 992px) { .p-large { font-size: 1.8rem; } .display-4,.display-5 { font-size: 2.6rem; } } }' +
    '</style>' +
    '<div class="container-fluid box text-center" style="background: linear-gradient(90deg, rgba(168,14,62,1) 0%, rgba(255,147,0,1) 100%);">' +
    '<div class="text container p-5" style="color: white;">' +
    '<div class="jumbotron">' +
    '<h1 class="display-4">DreamWorld</h1>' +
    '<p class="lead">Meditation like you\'ve never seen it before.</p>' +
    '<hr class="my-4">' +
    '<p class="p-large">DreamWorld is a ThreeJS-based world simulation for focused meditation. Focused meditation is the practice of meditating with a specific focus on a particular object. With this simulation, we hope to facilitate the meditation process by designing a dream-like world in which users can customize their own calming terrain through the perspective of a flying bird while listening to peaceful music and guided meditations.</p>' +
    '<a class="btn btn-light btn-lg" href="#keys" role="button">Get Started</a>' +
    '<br>' +
    '<hr class="my-4">' +
    '<br>' +

    '<a name ="keys"></a>' +
    '<h1 class="display-5 pt-2">Instructions</h1>' +
    '<p class="lead">Use the following keys to navigate through this simulation:</p>' +
    '<hr class="my-4">' +
    '<div class="row"><div class="col"><span class="keys">W</span><p class="py-3">UP</p></div></div>' +
    '<div class="row " style="padding-left:30%; padding-right:30%"><div class="col"><span><div class="float-sm-left"><span class="keys">A</span><p class="py-3">LEFT</p></div><div class="float-sm-right"><span class="keys">D</span><p class="py-3">RIGHT</p></div></span></div></div>' +
    '<div class="row"><div class="col"><span class="keys">S</span><p class="py-3">DOWN</p></div></div>' +
    '<br>' +
    '<button class="btn btn-light btn-lg begin-btn" href="#" role="button" id="begin-btn">Begin</a>' +
    '</div>' +
    '</div>' +
    '</div>';

    box.innerHTML = html;
    document.body.appendChild(box);


    let shepherd = '<link rel="stylesheet" href="https://shepherdjs.dev/dist/css/shepherd.css" />';
    document.head.innerHTML += shepherd;

    let bootstrap = '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">';
    document.head.innerHTML += bootstrap;

    let guifix = '<style type="text/css">' +
    'input { max-height: 20px; margin:1px!important; padding:1px!important;}' +
    '.dg .cr.number input[type=text], .dg .c input[type=text] { max-height: 20px; margin:1px; padding-bottom:2px;}' +
    '.box {z-index: 10; position:absolute; top:0;}' +
    '</style>';
    document.head.innerHTML += guifix;

    let allKeys = document.getElementsByClassName("keys");
    for (let i = 0; i < allKeys.length; i++){
    allKeys[i].style.display = 'inline-block';
    allKeys[i].style.width = '35px';
    allKeys[i].style.height = '35px';
    allKeys[i].style.border = '1px solid white';
    allKeys[i].style.borderRadius = '2px 2px 2px 2px';
    allKeys[i].style.moxBorderRadius = '2px 2px 2px 2px';
    allKeys[i].style.moxBoxSizing = 'border-box !important';
    allKeys[i].style.webkitBoxSizing = 'border-box !important';
    allKeys[i].style.boxSizing = 'border-box !important';
    allKeys[i].style.webkitBoxShadow = '0px 3px 0px -2px rgba(255,255,255,1), 0px 2px 0px 0px white';
    allKeys[i].style.moxBoxShadow = '0px 3px 0px -2px rgba(255,255,255,1), 0px 2px 0px 0px white';
    allKeys[i].style.boxShadow = '0px 3px 0px -2px rgba(255,255,255,1), 0px 2px 0px 0px white';
    allKeys[i].style.cursor = 'pointer';
    allKeys[i].style.marginLeft = '15px';
    allKeys[i].style.marginRight = '15px';
    }


        // adapted from https://shepherdjs.dev/ example
        const tour = new Shepherd.Tour({
            defaultStepOptions: {
              cancelIcon: {
                enabled: true
              },
              classes: 'shadow-md bg-purple-dark',
              scrollTo: { behavior: 'smooth', block: 'center' }
            }
          });

          tour.addStep({
            title: 'Welcome to DreamWorld',
            text: `Let's get meditating! \ In this GUI you'll be able to select from world presets, meditation tracks, customize your own world, and more.`,
            attachTo: {
                element: '.main',
                on: 'left'
            },
            buttons: [
              {
                action() {
                  return this.back();
                },
                classes: 'shepherd-button-secondary',
                text: 'Back'
              },
              {
                action() {
                  return this.next();
                },
                text: 'Next'
              }
            ],
            id: 'creating'
          });

          tour.addStep({
            title: 'Presets',
            text: `Choose from one of several preset environments or create your own.`,
            attachTo: {
                element: '.step3',
                on: 'left'
            },
            buttons: [
              {
                action() {
                  return this.back();
                },
                classes: 'shepherd-button-secondary',
                text: 'Back'
              },
              {
                action() {
                  return this.next();
                },
                text: 'Next'
              }
            ],
            id: 'creating'
          });

          tour.addStep({
            title: 'Music Responsiveness',
            text: `Select "Breathing" to make the terrain move with the music.`,
            attachTo: {
                element: '.step4',
                on: 'left'
            },
            buttons: [
              {
                action() {
                  return this.back();
                },
                classes: 'shepherd-button-secondary',
                text: 'Back'
              },
              {
                action() {
                  return this.next();
                },
                text: 'Next'
              }
            ],
            id: 'creating'
          });

          tour.addStep({
            title: 'Toggle Water',
            text: `If your simulation is running slowly, it may help to turn running water off.`,
            attachTo: {
                element: '.step7',
                on: 'left'
            },
            buttons: [
              {
                action() {
                  return this.back();
                },
                classes: 'shepherd-button-secondary',
                text: 'Back'
              },
              {
                action() {
                  return this.next();
                },
                text: 'Next'
              }
            ],
            id: 'creating'
          });

          tour.addStep({
            title: 'Select a Bird',
            text: `Choose from one of three birds.`,
            attachTo: {
                element: '.step8',
                on: 'left'
            },
            buttons: [
              {
                action() {
                  return this.back();
                },
                classes: 'shepherd-button-secondary',
                text: 'Back'
              },
              {
                action() {
                  return this.next();
                },
                text: 'Next'
              }
            ],
            id: 'creating'
          });


          tour.addStep({
            title: 'Choose an Audio Track',
            text: `Choose an audio track and press the P key to begin or pause the music.`,
            attachTo: {
                element: '.step9',
                on: 'left'
            },
            buttons: [
              {
                action() {
                  return this.back();
                },
                classes: 'shepherd-button-secondary',
                text: 'Back'
              },
              {
                action() {
                  return this.next();
                },
                text: 'Next'
              }
            ],
            id: 'creating'
          });


          tour.addStep({
            title: 'Generate Custom Terrain',
            text: `Explore many options for customizing the terrain generation! Click Terrain Look Factors to take a peek.`,
            attachTo: {
                element: '.step2',
                on: 'left'
            },
            buttons: [
              {
                action() {
                  return this.back();
                },
                classes: 'shepherd-button-secondary',
                text: 'Back'
              },
              {
                action() {
                  return this.next();
                },
                text: 'Next'
              }
            ],
            id: 'creating'
          });

// Referenced the following:
window.onload=function(){
    document.querySelectorAll(".begin-btn").forEach(function(btn){
    btn.addEventListener("click", function(){
        let loadingPage = document.getElementById('LoadingPage');
        document.body.removeChild(loadingPage);
        document.body.style.overflow = 'hidden'; // Fix scrolling
        tour.start();
      })
      })
    }


// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled;
renderer.shadowMap.type = PCFShadowMap;
const canvas = renderer.domElement;


document.body.insertAdjacentHTML('beforeend', '<div id="info" style="color:white; position: absolute;top: 15px; width: 100%; text-align: center; display:block;">Bird Controls: W - A - S - D Keys | Camera Controls: Arrow Keys | Music Play/Pause: P key</div>');


canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflowY = 'scroll'; // Fix scrolling
document.body.style.overflowX = 'hidden'; // Fix scrolling

document.body.appendChild(canvas);



//Render loop
const onAnimationFrameHandler = (timeStamp) => {
      scene.update && scene.update(timeStamp);
      renderer.render(scene, camera);

    //  scene.update && scene.update(timeStamp);
  //  window.requestAnimationFrame(onAnimationFrameHandler);
};
renderer.setAnimationLoop(onAnimationFrameHandler);
//window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
