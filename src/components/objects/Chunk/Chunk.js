import { Group } from 'three';
import { TerrainPlane } from '../TerrainPlane';


class Chunk extends Group {
  constructor(parent, xOffset, yOffset, zOffset, plane_geometry) {
      // console.log("CONSTRUCTOR CHUNK x: " + xOffset + " t: " + yOffset + " z: " + zOffset)
      // Call parent Group() constructor
      super();

      // Init state
      this.state = {
          gui: parent.state.gui,
          parent:parent,

      };

      // feed in the parent (chunk manager) as it has the proper terrain variables
      this.terrain = new TerrainPlane(parent, xOffset, yOffset, zOffset, plane_geometry)
      this.add(this.terrain);

      this.position.x = xOffset;
      this.position.z = zOffset;
  }

  updateNoise() {
    this.terrain.updateNoise();
  }

  updateTerrainGeo() {
    this.terrain.updateTerrainGeo();
  }

  setChunkPosition(x, y, z) {
    this.position.x = x;
    this.position.z = z;
    this.position.y = y;
  }

  disposeOf() {
    this.remove(this.terrain)

    return this.terrain.disposeOf()
  }

}

export default Chunk;
