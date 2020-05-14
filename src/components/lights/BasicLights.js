import { Group, SpotLight, SpotLightHelper, AmbientLight, HemisphereLight, DirectionalLightHelper, DirectionalLight } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const dir = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
        const ambi = new AmbientLight(0x404040, 0.5); // overall lighting of the scene, doesn't cast shadows
        // const hemi = new HemisphereLight(0xffffbb, 0x080820, 1.0); // majority of the light (skycolor, groundcolor, intesnity)
        const hemi = new HemisphereLight(0xcce0ff, 0x080820, 0.5);
        hemi.power = 800;
        hemi.decay = 2;

        // Add light right above bird
        // const birdLight = new (0xffffff, 10, 20, Math.PI/2, 0, 2);
        var birdLight = new DirectionalLight(0xffffff, 1.75);
        birdLight.power = 800; // 4 * Math.PI
        birdLight.position.set(0, 0, -100);
        birdLight.target.position.set(0, 0, 0);
        birdLight.castShadow = true;
        birdLight.decay = 100;
        birdLight.distance = 200;

        // var helper = new DirectionalLightHelper(birdLight);

        // SpotLight needs a position and target
        dir.position.set(5, 1, 2);
        dir.target.position.set(0, 0, 0);

        this.add(ambi, hemi, birdLight, birdLight.target);
    }
}

export default BasicLights;
