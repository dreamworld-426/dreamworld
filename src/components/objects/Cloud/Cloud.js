import { Group, Geometry, IcosahedronGeometry, MeshStandardMaterial, Mesh} from 'three';

class Cloud extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        let radius = 1;
        let detail = 1;

        // Inspired by this to combine shapes to make clouds: https://medium.com/@joshmarinacci/procedural-geometry-low-poly-clouds-b86a0e66bcad
        var geometry = new Geometry();

        // create three sections of cloud
        var section1 = new IcosahedronGeometry(radius, detail);
        var section2 = new IcosahedronGeometry(radius, detail);
        var section3 = new IcosahedronGeometry(radius, detail);

        // translate sections
        section1.translate(-1,0,0);
        section3.translate(1, 0,0);

        geometry.merge(section1);
        geometry.merge(section2);
        geometry.merge(section3);

        var material = new MeshStandardMaterial( { color: 0xffffff, transparent: true, opacity: 0.5} );
        //material.opacity = 0.3;
        var cloud = new Mesh( geometry, material );
        this.add(cloud);
    }
}

export default Cloud;
