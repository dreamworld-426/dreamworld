import { Group, DirectionalLight, SpotLight, SpotLightHelper, SphereBufferGeometry, MeshStandardMaterial, PointLight, Mesh, DirectionalLightHelper, Vector3 } from 'three';
var ColorTween = require('color-tween');

class WorldLighting extends Group {

  constructor(parent) {
      // Invoke parent Group() constructor with our args
      super();

      // Init state
      this.state = {
        sun: null,
        radius: 300,
        spin_rate: 0.005,
        sun_distance: 700
      }

      // add sun
      var sunGeometry = new SphereBufferGeometry(20, 25, 25);
      var sun = new DirectionalLight(0xffee88, 7);
      var sunMat = new MeshStandardMaterial({
					emissive: 0xffffee,
					emissiveIntensity: 2,
					color: 0xffee88,
          transparent: true,
          depthOrder: 1
			});
      sun.add(new Mesh(sunGeometry, sunMat));
      sun.target.position.set(0, 0, 0);
      sun.position.set(0, this.state.radius, this.state.sun_distance);
			sun.castShadow = true;
      sun.power = 800;
      sun.decay = 2;
      sun.distance = Infinity;
      this.state.sun = sun;

      // glow aura around sun
      var auraSphere = new SphereBufferGeometry(35, 25, 25);
      var aura = new DirectionalLight(0xffee88, 0.5);
      var glowMat = new MeshStandardMaterial({
					emissive: 0xffffee,
					emissiveIntensity: 1,
					color: 0xffee88,
          transparent: true,
          wireframe: false,
          opacity: 0.35
			} );
      aura.add(new Mesh(auraSphere, glowMat));
      aura.target.position.set(0, 0, 0);
      aura.position.set(0, this.state.radius, this.state.sun_distance);

      // add visualization helper for debugging
      // const helper = new DirectionalLightHelper(sun);

      // var blue = new PointLight(0x0000ff, 1, 20, 2);
      // blue.target.position.set(0, 50, 50);
      // var pink = new PointLight(0xFFB6C1, 1, 50, 2);
      // pink.target.position.set(0, 50, 50);

      // this.add(helper);
      this.add(sun);
      this.add(aura);
      // this.add(blue);
      // this.add(pink);

      // add this object to SeedScene's update list
      parent.addToUpdateList(this);
    }

    // move the sun
    update(timeStamp) {
      this.rotateOnAxis(new Vector3(0, 0, 1), this.state.spin_rate);

      // tween.update();
    }

    // tween stuff

}

export default WorldLighting;
