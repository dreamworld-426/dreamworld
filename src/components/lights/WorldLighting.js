import { Group, DirectionalLight, TextureLoader, MeshLambertMaterial, SphereBufferGeometry, MeshBasicMaterial, PointLight, Mesh, DirectionalLightHelper, Vector3 } from 'three';
import img from './sunny.png';
import aura_img from './aura.png';

class WorldLighting extends Group {

  constructor(parent) {
      // Invoke parent Group() constructor with our args
      super();

      // Init state
      this.state = {
        sun: null
      }

      // add sun
      var sunGeometry = new SphereBufferGeometry(20, 25, 25);
      var sun = new DirectionalLight(0xffee88, 7);

      // load in a cloudy texture (hand-made in figma)
      var texture = new TextureLoader().load(img);
      var aura_texture = new TextureLoader().load(aura_img);

      var sunMat = new MeshLambertMaterial({
          map: texture,
					//emissive: 0xffffee,
					//emissiveIntensity: 1,
					//color: 0xffee88,
          //transparent: true,
          //depthOrder: 1
			});
      sun.add(new Mesh(sunGeometry, sunMat));
      sun.target.position.set(0, 0, 0);
      sun.position.set(0, 100, 700);
			sun.castShadow = true;
      sun.power = 100;
      sun.decay = 2;
      sun.distance = Infinity;
      this.state.sun = sun;

      // glow aura around sun
      var auraSphere = new SphereBufferGeometry(30, 25, 25);
      var aura = new DirectionalLight(0xffee88, 0.5);
      var glowMat = new MeshBasicMaterial({
          map: aura_texture,
          transparent: true,
          opacity: 0.15,
			} );
      aura.add(new Mesh(auraSphere, glowMat));
      aura.target.position.set(0, 0, 0);
      aura.position.set(0, 100, 720);

      // add visualization helper for debugging
      // const helper = new DirectionalLightHelper(sun);

      var blue = new PointLight(0x0000ff, 1, 20, 2);
      // blue.target.position.set(0, 50, 50);
      var pink = new DirectionalLight(0xFFB6C1, 1, 50, 2);
      // pink.target.position.set(0, 50, 50);

      //this.add(helper);
      this.add(sun);
      this.add(aura);
      this.add(blue);
      this.add(pink);

      // add this object to SeedScene's update list
      parent.addToUpdateList(this);
    }

    // move the sun
    update(timeStamp) {
      this.rotateOnAxis(new Vector3(0, 1, 0).normalize(), 0.005);
      // tween.update();
    }

    // tween stuff

}

export default WorldLighting;
