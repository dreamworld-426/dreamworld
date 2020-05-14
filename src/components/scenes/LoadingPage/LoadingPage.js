import { Scene, Color, SphereGeometry, SpotLight, BoxGeometry } from 'three';


class LoadingPage extends Scene{
  constructor() {
    super();

    let box = document.createElement("DIV");
    box.className = 'Loading Page';

    box.style.position = 'absolute';
    box.style.top = '0';
    box.style.bottom = '0';
    box.style.width = '100%';
    box.style.height = '100%';
    box.style.left = '0';
    box.style.backgroundColor = 'pink';
    box.style.opacity = '100%';
    box.style.alignItems = 'center';
    document.body.appendChild(box);

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

    let text = document.createElement("DIV");
    text.className = 'Dream World';
    text.innerText = 'Welcome to Dream World!';
    text.style.color = 'white';
    text.style.textAlign =  'center';
    text.style.marginTop = '20%';
    text.style.fontSize = '40px';
    text.style.textDecoration = 'underline';
    box.appendChild(text);

    let simulate = document.createElement("DIV");
    simulate.className = 'Meditation Simulation';
    simulate.innerText = 'A Meditation Simulation';

    simulate.style.color = 'white';
    simulate.style.textAlign = 'center';
    simulate.style.fontSize = '20px';
    box.appendChild(simulate);

    let enter = document.createElement("BUTTON");
    enter.className = 'Enter Button'
    enter.innerText = 'Press to Enter';

    enter.style.cursor = 'pointer';
    enter.style.position = 'absolute';
    enter.style.padding = '16px';
    enter.style.backgroundColor = 'pink';
    enter.style.color = 'white';
    enter.style.border = '2px solid white';
    enter.style.top = '50%';
    enter.style.left = '43%';
    enter.onclick = function() {
      document.body.removeChild(box);
    }
    // ORIGINAL CSS
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

    // Camera and Bird Titles
    let titles = document.createElement("DIV");
    titles.style.textAlign = 'center';
    titles.style.paddingTop = '30px';
    // titles.style.display = 'inline-block';
    box.appendChild(titles);

    let bird_title = document.createElement("P");
    bird_title.display = 'absolute';
    bird_title.style.textAlign = 'center';
    bird_title.style.fontSize = '20px';
    bird_title.style.color = 'white';
    bird_title.style.fontFamily = "Orbitron";
    bird_title.style.paddingTop = '10px';
    bird_title.style.paddingRight = '230px';
    bird_title.style.display = 'inline-block';
    bird_title.innerText = 'Bird';
    titles.appendChild(bird_title);

    let camera_title = document.createElement("P");
    camera_title.display = 'absolute';
    camera_title.style.textAlign = 'center';
    camera_title.style.fontSize = '20px';
    camera_title.style.color = 'white';
    camera_title.style.fontFamily = "Orbitron";
    camera_title.style.paddingTop = '10px';
    camera_title.style.display = 'inline-block';
    camera_title.innerText = 'Camera';
    titles.appendChild(camera_title);

    // Add bird control keys
    let keys = document.createElement("DIV");
    keys.style.textAlign = 'center';
    keys.style.paddingTop = '30px';
    keys.style.display = 'inline-block';
    keys.style.marginRight = '30px';
    // keys.verticalAlign = 'middle';
    // keys.innerText = 'Bird Controls';
    box.appendChild(keys);

    // ------------ Add camera controls -------------//

    let camera_keys = document.createElement("DIV");
    camera_keys.style.textAlign = 'center';
    camera_keys.style.paddingTop = '30px';
    camera_keys.style.display = 'inline-block';
    box.appendChild(camera_keys);

    let upKey = document.createElement("canvas");
    upKey.width = 100;
    upKey.height = 100;
    let ctx = upKey.getContext('2d');
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(50, 90);
    ctx.lineTo(50, 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(20, 40);
    ctx.lineTo(50, 10);
    ctx.lineTo(80, 40);
    ctx.stroke();

    camera_keys.appendChild(upKey);
    upKey.style.fontFamily = "Orbitron";
    upKey.className = 'keys';

    let upExp = document.createElement("P")
    camera_keys.appendChild(upExp);
    upExp.innerText = 'UP';
    upExp.className = 'text';
    upExp.style.fontFamily = "Orbitron";

    // left
    let leftKey = document.createElement("SPAN");
    camera_keys.appendChild(leftKey);
    leftKey.innerText = '<-';
    leftKey.style.fontFamily = "Orbitron";
    leftKey.className = 'keys';

    let leftExp = document.createElement("P")
    camera_keys.appendChild(leftExp);
    leftExp.innerText = 'LEFT';
    leftExp.className = 'text';
    leftExp.style.fontFamily = "Orbitron";

    let leftSpan = document.createElement("SPAN");
    leftSpan.style.display = 'inline-block';
    camera_keys.appendChild(leftSpan);
    leftSpan.appendChild(leftKey);
    leftSpan.appendChild(leftExp);

    // down
    let downKey = document.createElement("canvas");
    camera_keys.appendChild(downKey);
    downKey.width = 100;
    downKey.height = 100;
    ctx = downKey.getContext('2d');
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(50, 10);
    ctx.lineTo(50, 60);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(20, 60);
    ctx.lineTo(50, 90);
    ctx.lineTo(80, 60);
    ctx.stroke();

    downKey.style.fontFamily = "Orbitron";
    downKey.className = 'keys';

    let downExp = document.createElement("P")
    camera_keys.appendChild(downExp);
    downExp.innerText = 'DOWN';
    downExp.className = 'text';
    downExp.style.fontFamily = "Orbitron";

    let downSpan = document.createElement("SPAN");
    downSpan.style.display = 'inline-block';
    camera_keys.appendChild(downSpan);
    downSpan.appendChild(downKey);
    downSpan.appendChild(downExp);

    // right
    let rightKey = document.createElement("SPAN");
    camera_keys.appendChild(rightKey);
    rightKey.innerText = '->';
    rightKey.style.fontFamily = "Orbitron";
    rightKey.className = 'keys';

    let rightExp = document.createElement("P")
    camera_keys.appendChild(rightExp);
    rightExp.innerText = 'RIGHT';
    rightExp.className = 'text';
    rightExp.style.fontFamily = "Orbitron";

    let rightSpan = document.createElement("SPAN");
    rightSpan.style.display = 'inline-block';
    camera_keys.appendChild(rightSpan);
    rightSpan.appendChild(rightKey);
    rightSpan.appendChild(rightExp);

    // -----------BIRD CONTROLS ----------- //

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

    // a key
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

    // play music key
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
    box.appendChild(enter);
  }

    let texts = document.getElementsByClassName("text");
    for (let i = 0; i < texts.length; i++){
      texts[i].style.color = 'grey';
    }

    // show button after a certain period of time
    setTimeout(addButton, 3000);

    // add 'ENTER' button
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
  update(timeStamp) {

  }
}

export default LoadingPage;
