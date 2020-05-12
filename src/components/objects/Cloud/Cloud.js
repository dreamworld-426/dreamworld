import { Group, TextureLoader, IcosahedronGeometry, Geometry, BufferGeometry, InstancedMesh, MeshLambertMaterial, Object3D} from 'three';
import img from './cloudy3.png';
class Cloud extends Group {
    constructor(parent, kind) {
        // Call parent Group() constructor
        super();
        let scale = 70;
        let xDelta = 150;
        let zDelta = -1000;
        let yDelta = 5;
        let detail = 1;
        let count = 3;

        // Inspired by this to combine shapes to make clouds: https://medium.com/@joshmarinacci/procedural-geometry-low-poly-clouds-b86a0e66bcad
        var geometry = new Geometry();

        // create three sections of cloud
        var section1;
        var section2;
        var section3;
        var section4;
        if (kind == 0) {
            section1 = new IcosahedronGeometry(0.5*scale, detail);
            section2 = new IcosahedronGeometry(0.4*scale, detail);
            section3 = new IcosahedronGeometry(0.3*scale, detail);
            section4 = new IcosahedronGeometry(0.25*scale, detail);

            // translate sections
            section2.translate(xDelta,yDelta,zDelta);
            section1.translate(-0.5*scale + xDelta,yDelta,zDelta);
            section3.translate(0.5*scale + xDelta, yDelta,zDelta);
            section4.translate(-0.8*scale + xDelta, -0.25*scale + yDelta,zDelta);


            // merge 4 cloud parts together
            geometry.merge(section1);
            geometry.merge(section2);
            geometry.merge(section3);
            geometry.merge(section4);
        }
        else {
            section1 = new IcosahedronGeometry(0.4*scale, detail);
            section2 = new IcosahedronGeometry(0.6*scale, detail);
            section3 = new IcosahedronGeometry(0.5*scale, detail);

            // translate sections
            section2.translate(xDelta,yDelta,zDelta);
            section1.translate(-0.6*scale + xDelta,yDelta - 0.2*scale,zDelta);
            section3.translate(0.6*scale + xDelta, yDelta - 0.2*scale,zDelta);


            // merge 4 cloud parts together
            geometry.merge(section1);
            geometry.merge(section2);
            geometry.merge(section3);
        }


        // convert geometry to buffer geometry for instancedmesh
        this.geometry = new BufferGeometry().fromGeometry( geometry );

        // load in a cloudy texture (hand-made in figma)
        var texture = new TextureLoader().load(img);

        this.material = new MeshLambertMaterial({
            map:texture,
            transparent: true,
            opacity: 0.75,
          });
        // instance mesh code very loosely inspired by Three.js example:
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_instancing_dynamic.html
        let mesh = new InstancedMesh(this.geometry, this.material, count );
        let orientation = new Object3D();

        let offset = 100;
        let offsetX  = 100;

        for( let i = 0; i < count; i ++ ) {
            // set position based on qualitative testing of what appears natural
            orientation.position.set(Math.random() * 2000 - 1000, 400 + Math.random() * 100, Math.random() * 2000 - 1000);

            //make half of clouds oriented regularly and the other half flipped
            if (i % 2 == 0) {
                orientation.rotation.y = Math.PI;
            }
            else {
                orientation.rotation.y = -Math.PI;
            }
            //updated
            orientation.updateMatrix();
            mesh.setMatrixAt( i, orientation.matrix );
        }


        this.add( mesh );

    }
    disposeOf() {
        this.material.dispose()
  
        return this.geometry;
      }
}

export default Cloud;
