import { Group, PlaneBufferGeometry, MeshStandardMaterial, Mesh} from 'three';

class Terrain extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        let geometry = new PlaneBufferGeometry(2000, 2000);
        let material = new MeshStandardMaterial({
            color: 0xccffcc,
            metalness: 0.7,
          });


        var terrain = new Mesh( geometry, material );

        // adapted from a5 starter code for ground
        let groundY = -249;
        terrain.position.y = groundY - 1;
        terrain.rotation.x = -Math.PI / 2;
        terrain.receiveShadow = true;

        this.add(terrain);

    }
}

export default Terrain;
