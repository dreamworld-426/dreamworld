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
const loadingPage = new LoadingPage();

camera.position.y = 60;
camera.position.z = -300;
camera.lookAt(new Vector3(0, 50, 0));


    //TODO: Add styles to header
    let headID = document.getElementsByTagName('head')[0];
    let link = document.createElement("link");
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = "https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap";
    headID.appendChild(link);

    let box = document.createElement("DIV");
    box.id = 'LoadingPage';
    box.height = '100vh';
    box.overflow= 'hidden';

    // adapted from bootstrap docs
    let html = '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">' +
    '<style type="text/css">' +
    'body, p, h1, h2, h3, h4, h5, a' +
    '{ font-family: Comfortaa; }' +
    '.jumbotron { background: none; }' +
    '.keys { display: inline:block; font-size: 20px;}' +
    'input { max-height: 20px;}' +
    '.box {z-index: 10; position:absolute; top:0;}' +
    '</style>' +
    '<div class="container-fluid box text-center" style="background: linear-gradient(90deg, rgba(168,14,62,1) 0%, rgba(255,147,0,1) 100%);">' +
    '<div class="text container p-5" style="color: white;">' + 
    '<div class="jumbotron">' +
    '<h1 class="display-4">DreamWorld</h1>' +
    '<p class="lead">Meditation like you\'ve never seen it before.</p>' +
    '<hr class="my-4">' +
    '<p>Use the following keys to navigate through this simulation:</p>' +
    '<div class="row"><div class="col"><span class="keys">W</span><p class="py-3">UP</p></div></div>' +
    '<div class="row " style="padding-left:30%; padding-right:30%"><div class="col"><span><div class="float-sm-left"><span class="keys">A</span><p class="py-3">LEFT</p></div><div class="float-sm-right"><span class="keys">S</span><p class="py-3">DOWN</p></div></span></div></div>' +
    '<div class="row"><div class="col"><span class="keys">D</span><p class="py-3">RIGHT</p></div></div>' + 
    '<br>' +
    '<button class="btn btn-light btn-lg begin-btn" href="#" role="button" id="begin-btn">Begin</a>' + 
    '</div>' +
    '</div>' +
    '</div>';

    box.innerHTML = html;
    document.body.appendChild(box);


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


// Referenced the following: 
window.onload=function(){
    document.querySelectorAll(".begin-btn").forEach(function(btn){
    btn.addEventListener("click", function(){
        let loadingPage = document.getElementById('LoadingPage');
        document.body.removeChild(loadingPage);
      })
      })
    }

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


