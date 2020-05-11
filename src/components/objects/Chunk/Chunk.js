import { Group } from 'three';
import { TerrainPlane } from '../TerrainPlane';
import { Orb } from '../Orb';
import { Cloud } from '../Cloud';

class Chunk extends Group {
  constructor(parent, xOffset, yOffset, zOffset, plane_geometry) {
      // console.log("CONSTRUCTOR CHUNK x: " + xOffset + " t: " + yOffset + " z: " + zOffset)
      // Call parent Group() constructor
      super();

      // Init state
      this.state = {
          gui: parent.state.gui,
          parent:parent,
          orbNum: 10,
      };

      // feed in the parent (chunk manager) as it has the proper terrain variables
      this.terrain = new TerrainPlane(parent, xOffset, yOffset, zOffset, plane_geometry)
      this.add(this.terrain);

      this.orb = new Orb(parent);
      this.updateOrbs(this.state.orbNum);
      this.add(this.orb);

      this.cloud = new Cloud(parent);
      this.add(this.cloud);

      this.position.x = -1000;
      this.position.z = -1000;
  }

  updateNoise() {
    this.terrain.updateNoise();
  }

  updateTerrainGeo() {
    this.terrain.updateTerrainGeo();
  }

  updateOrbs(orbNum) {
    this.orb.updateOrbs(orbNum);
  }

  setChunkPosition(x, y, z) {
    this.position.x = x;
    this.position.z = z;
    this.position.y = y;
    this.updateMatrix();
  }

  disposeOf() {
    this.terrain.disposeOf()
    this.remove(this.terrain)

    return this.terrain.disposeOf()
  }

}

export default Chunk;
