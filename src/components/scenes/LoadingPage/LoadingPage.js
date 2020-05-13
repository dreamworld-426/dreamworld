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
    box.appendChild(enter);
  }

  update(timeStamp) {

  }
}

export default LoadingPage;
