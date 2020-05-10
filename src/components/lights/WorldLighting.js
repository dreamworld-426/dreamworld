import { Group, DirectionalLight, SpotLight, SpotLightHelper, SphereBufferGeometry, MeshStandardMaterial, PointLight, Mesh, DirectionalLightHelper } from 'three';
var ColorTween = require('color-tween');

// const COLORTWEEN = require('color-tween/src/tween.js');

class WorldLighting extends Group {

  constructor(parent) {
      // Invoke parent Group() constructor with our args
      super();

      // Init state
      this.state = {
          gui: parent.state.gui,
          zrotation: 0.0,
      };

      // add sun
      var sunGeometry = new SphereBufferGeometry(10, 25, 25);

      // var sun = new PointLight(0xffee88, 100, 20, 200);
      var sun = new DirectionalLight(0xffee88, 7);
      var sunMat = new MeshStandardMaterial({
					emissive: 0xffffee,
					emissiveIntensity: 2,
					color: 0xffee88
			} );
      sun.add(new Mesh(sunGeometry, sunMat));
      sun.target.position.set(0, 0, 0);
      sun.position.set(0, 100, 500);
			sun.castShadow = true;
      sun.power = 800;
      sun.decay = 2;
      sun.distance = Infinity;

      // Add light right above bird
      var birdLight = new SpotLight(0xffffff, 10, 20, Math.PI/2, 0, 2);
      // var birdLight = new DirectionalLight(0xffee88, 7);
      birdLight.power = 4*Math.PI;
      birdLight.position.set(0, 50, 0);
      birdLight.target.position.set(0, 0, 0);
      birdLight.castShadow = true;

      // add visualization helper for debugging
      const helper = new DirectionalLightHelper(sun);
      // const birdHelper = new SpotLightHelper(birdLight);

      this.add(helper);
      this.add(sun);
      this.add(birdLight);

      // add this object to SeedScene's update list
      parent.addToUpdateList(this);
      this.state.gui.add(this.state, 'zrotation', 0, 180);

      // var tween = new ColorTween('#000', '#FFF')
      //             .onUpdate(someFn)
      //             .easing('linear')
      //             .duration(10000)
      //             .start(animate);
    }

    update(timeStamp) {
      this.rotateZ(0.001);
      // tween.update();
    }


}

export default WorldLighting;
