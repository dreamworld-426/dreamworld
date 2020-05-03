import { Group, IcosahedronGeometry, MeshBasicMaterial, Mesh} from 'three';

class Cloud extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        let radius = 5;
        let detail = 1;
        var geometry = new IcosahedronGeometry(radius, detail);
        var material = new MeshBasicMaterial( { color: 0x00ff00 } );
        var cloud = new Mesh( geometry, material );
        this.add(cloud);
    }
}

export default Cloud;
