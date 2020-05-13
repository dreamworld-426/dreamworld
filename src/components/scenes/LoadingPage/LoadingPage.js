import { Scene, Color, SphereGeometry, SpotLight, BoxGeometry } from 'three';
import BACKGROUND from './background.png';

class LoadingPage extends Scene{
  constructor() {
    super();

    // Box Element
    let box = document.createElement("DIV");
    box.id = 'LoadingPage';

    // Box CSS
    box.style.position = 'absolute';
    box.style.height = '100%';
    box.style.width = '100%';
    box.style.textAlign = 'center';
    box.style.background = 'pink';
    box.style.overflow = 'auto';
    document.body.appendChild(box);
    //
    // let image = document.createElement("IMG");
    // image.src = BACKGROUND;
    // image.style.opacity = '100%';
    // image.style.width = 'auto';
    // image.style.height = 'auto';
    // box.appendChild(image);

    // Adapted from https://stackoverflow.com/questions/33404458/using-javascript-to-create-a-link-element-and-then-adding-it-to-head-section/33404744
    let headID = document.getElementsByTagName('head')[0];
    let link = document.createElement("link");
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron&display=swap";
    headID.appendChild(link);

    // Welcome to Dream World Message
    let text = document.createElement("P");
    text.className = 'Dream World';
    text.innerText = 'Welcome to Dream World!';

    text.style.color = 'white';
    text.style.textAlign =  'center';
    text.style.fontSize = '60px';
    text.style.textDecoration = 'underline';
    text.style.fontFamily = "Orbitron";
    text.style.transition = "opacity 2s";
    text.style.webkitTransition = "opacity 2s";
    box.appendChild(text);

    // A Meditation Simulation
    let meditation = document.createElement("P")
    meditation.display = 'absolute';
    meditation.className = 'Meditation';
    meditation.innerText = 'A Meditation Simulation';
    meditation.style.textAlign = 'center';
    meditation.style.fontSize = '40px';
    meditation.style.color = 'white';
    meditation.style.fontFamily = "Orbitron";
    box.appendChild(meditation);

    // Add keys
    let keys = document.createElement("DIV");
    keys.style.textAlign = 'center';
    keys.style.paddingTop = '30px';
    box.appendChild(keys);

    // w Key
    let wKey = document.createElement("SPAN");
    keys.appendChild(wKey);
    wKey.innerText = 'w';
    wKey.className = 'keys';

    // w Explanation
    let wExp = document.createElement("P")
    keys.appendChild(wExp);
    wExp.innerText = 'UP';
    wExp.className = 'text';

    let aSpan = document.createElement("SPAN");
    aSpan.style.display = 'inline-block';
    keys.appendChild(aSpan);

    let aKey = document.createElement("SPAN")
    aSpan.appendChild(aKey);
    aKey.innerText = 'a';
    aKey.className = 'keys';

    let aExp = document.createElement("P");
    aSpan.appendChild(aExp);
    aExp.innerText = 'LEFT';
    aExp.className = 'text';

    let sSpan = document.createElement("SPAN");
    sSpan.style.display = 'inline-block';
    keys.appendChild(sSpan);

    let sKey = document.createElement("SPAN")
    sSpan.appendChild(sKey);
    sKey.innerText = 's';
    sKey.className = 'keys';

    let sExp = document.createElement("P");
    sSpan.appendChild(sExp);
    sExp.innerText = 'DOWN';
    sExp.className = 'text';

    let dSpan = document.createElement("SPAN");
    dSpan.style.display = 'inline-block';
    keys.appendChild(dSpan);

    let dKey = document.createElement("SPAN")
    dSpan.appendChild(dKey);
    dKey.innerText = 'd';
    dKey.className = 'keys';

    let dExp = document.createElement("P")
    dExp.innerText = 'RIGHT';
    dExp.className = 'text';
    dSpan.appendChild(dExp);

    let play = document.createElement("DIV");
    box.appendChild(play);
    play.style.textAlign = 'center';

    let pKey = document.createElement("SPAN")
    play.appendChild(pKey);
    pKey.innerText = 'p';
    pKey.className = 'keys';

    let pExp =  document.createElement("P")
    pExp.innerText = 'PLAY/STOP MUSIC';
    pExp.className = 'text';
    play.appendChild(pExp);

    let allKeys = document.getElementsByClassName("keys");
    for (let i = 0; i < allKeys.length; i++){
      allKeys[i].style.display = 'inline-block';
      allKeys[i].style.width = '35px';
      allKeys[i].style.height = '35px';
      allKeys[i].style.border = '1px solid white';
      allKeys[i].style.borderRadius = '2px 2px 2px 2px';
      allKeys[i].style.moxBorderRadius = '2px 2px 2px 2px';
      allKeys[i].style.fontSize = '30px';
      allKeys[i].style.moxBoxSizing = 'border-box !important';
      allKeys[i].style.webkitBoxSizing = 'border-box !important';
      allKeys[i].style.boxSizing = 'border-box !important';
      allKeys[i].style.textAlign = 'center';
      allKeys[i].style.padding = '10px';
      allKeys[i].style.paddingLeft = '10px';
      allKeys[i].style.color = 'white';
      allKeys[i].style.webkitBoxShadow = '0px 3px 0px -2px rgba(255,255,255,1), 0px 2px 0px 0px white';
      allKeys[i].style.moxBoxShadow = '0px 3px 0px -2px rgba(255,255,255,1), 0px 2px 0px 0px white';
      allKeys[i].style.boxShadow = '0px 3px 0px -2px rgba(255,255,255,1), 0px 2px 0px 0px white';
      allKeys[i].style.cursor = 'pointer';
      allKeys[i].style.marginLeft = '15px';
      allKeys[i].style.marginRight = '15px';
    }

    let texts = document.getElementsByClassName("text");
    for (let i = 0; i < texts.length; i++){
      texts[i].style.color = 'grey';
    }

    // show button after a certain period of time
    setTimeout(addButton, 5000);

    function addButton() {
      console.log('added button');
      let button = document.createElement("BUTTON");
      button.innerText = "ENTER";
      button.style.color = "white";
      button.style.background = 'pink';
      button.style.border = '2px solid white';
      button.style.margin = '50px';
      button.style.paddingLeft = '30px'
      button.style.paddingRight = '30px'
      button.style.paddingTop = '15px'
      button.style.paddingBottom = '15px'
      button.onclick = function() {deleteLandingPage()};
      box.appendChild(button);
    }

    function deleteLandingPage() {
      let loadingPage = document.getElementById('LoadingPage');
      document.body.removeChild(loadingPage);
    }
  }
}

export default LoadingPage;
