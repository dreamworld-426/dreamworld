import { Group, Color, TextureLoader, IcosahedronGeometry, PlaneBufferGeometry, Geometry, MeshBasicMaterial, MeshLambertMaterial, ShaderMaterial, Mesh, FrontSide} from 'three';
import img from './cloudy3.png';

class Cloud extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        let radius = 0.5;
        let detail = 1;

        // Inspired by this to combine shapes to make clouds: https://medium.com/@joshmarinacci/procedural-geometry-low-poly-clouds-b86a0e66bcad
        var geometry = new Geometry();

        // create three sections of cloud
        var section1 = new IcosahedronGeometry(radius, detail);
        var section2 = new IcosahedronGeometry(0.4, detail);
        var section3 = new IcosahedronGeometry(0.3, detail);
        var section4 = new IcosahedronGeometry(0.25, detail);

        // translate sections
        section2.translate(0,0,-2);
        section1.translate(-0.5,0,-2);
        section3.translate(0.5, 0,-2);
        section4.translate(-0.8, -0.25,-2);


        // merge 4 cloud parts together
        geometry.merge(section1);
        geometry.merge(section2);
        geometry.merge(section3);
        geometry.merge(section4);


        let uniforms = {
            colorB: {type: 'vec3', value: new Color(0xb4c1c6)},
            colorA: {type: 'vec3', value: new Color(0xe1f1f7)}
        }

        // Jitter function (used only for testing): https://medium.com/@joshmarinacci/procedural-geometry-low-poly-clouds-b86a0e66bcad
        // remap value from the range of [smin,smax] to [emin,emax]
        const map = (val, smin, smax, emin, emax) => (emax-emin)*(val-smin)/(smax-smin) + emin;
        // randomly displace the x,y,z coords by the `per` value
        const jitter = (geometry,per) => geometry.vertices.forEach(v => {
            v.x += map(Math.random(),0,1,-per,per);
            v.y += map(Math.random(),0,1,-per,per);
            v.z += map(Math.random(),0,1,-per,per);
        })
        //jitter(geometry,0.1);


        var texture = new TextureLoader().load(img);

        let material = new MeshLambertMaterial({
            map:texture,
            transparent: true,
            opacity: 0.95,
            side: FrontSide,
          });

          

        var cloud = new Mesh( geometry, material );

        this.add(cloud);

    }
}

export default Cloud;
