import { Scene, Color, SphereGeometry, SpotLight, BoxGeometry } from 'three';
import BACKGROUND from './background.png';

class LoadingPage extends Scene{
  constructor() {
    super();

    function deleteLandingPage() {
      console.log("got here");
      let loadingPage = document.getElementById('LoadingPage');
      document.body.removeChild(loadingPage);
    }
  }
}

export default LoadingPage;
