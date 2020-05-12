import { Group } from 'three';
import { TerrainPlane } from '../TerrainPlane';
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
      };

      // feed in the parent (chunk manager) as it has the proper terrain variables
      this.terrain = new TerrainPlane(parent, xOffset, yOffset, zOffset, plane_geometry)
      this.add(this.terrain);

      this.cloud1 = new Cloud(parent,0);
      this.add(this.cloud1);

      this.cloud2 = new Cloud(parent,1);
      this.add(this.cloud2);

      this.position.x = -1000;
      this.position.z = -1000;
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
    this.updateMatrix();
  }

  disposeOf() {
    this.terrain.disposeOf()
    this.remove(this.terrain)

    this.cloud1.disposeOf()
    this.remove(this.cloud1)

    this.cloud2.disposeOf()
    this.remove(this.cloud2)

    return this.terrain.disposeOf()
  }

}

export default Chunk;
