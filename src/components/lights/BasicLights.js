import { Group, SpotLight, AmbientLight, HemisphereLight } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const dir = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
        const ambi = new AmbientLight(0x404040, 0.5); // overall lighting of the scene, doesn't cast shadows
        // const hemi = new HemisphereLight(0xffffbb, 0x080820, 1.0); // majority of the light (skycolor, groundcolor, intesnity)
        const hemi = new HemisphereLight(0xcce0ff, 0x080820, 1.0);
        hemi.power = 800;
        hemi.decay = 2;

        // SpotLight needs a position and target
        dir.position.set(5, 1, 2);
        dir.target.position.set(0, 0, 0);

        this.add(dir, ambi, hemi);
    }
}

export default BasicLights;
