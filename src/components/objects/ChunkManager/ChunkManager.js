import { Group, Color } from 'three';
import  SimplexNoise  from 'simplex-noise';

import { Chunk } from '../Chunk';

/*
      [0][1][2]
      [3][4][5]
      [6][7][8]

USING THIS ARRAY STRUCTURE

*/

// SET THESE TO CHANGE CHUNK DIMENSIONS
const startYBelow = 200;
const chunkPxWidth = 1000;
const chunkVertexWidth = 100;

class ChunkManager extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        console.log("CHUNK MANAGER CONSTRUCTOR")
        this.name = "ChunkManager"

        // Init state
        this.state = {
            gui: parent.state.gui,
            parent: parent,
            chunks: [],
            chunkWidth: chunkPxWidth,
            chunkVertWidth: chunkVertexWidth,
            simplex: {},
            totalVertWidth: chunkVertexWidth*3, // chunkVertWidth * 3
            currentXOffset: 0,
            currentZOffset: 0,

            power: 1,
            octaves: 16,
            exaggeration: 20,
            waterLevel: 0,
            waterColor: new Color(50, 90, 145),
            bankColor: new Color(0, 255, 0),
            middleColor: new Color(255, 0, 0),
            peakColor: new Color(0, 0, 255),
            colorWiggle: 0.1,
            middleGradient: 0.5,
            randSeed: 4,
            freq: 1,
            terraced: false,
            terraces: 15,
        };

        this.state.simplex = new SimplexNoise(this.state.randSeed);

        const chunk0 = new Chunk(this, this.state.chunkWidth, 0, this.state.chunkWidth);
        this.add(chunk0);
        this.state.chunks.push(chunk0);
        chunk0.setChunkPosition(this.state.chunkWidth, 0, this.state.chunkWidth);

        const chunk1 = new Chunk(this, 0, 0, this.state.chunkWidth);
        this.add(chunk1);
        this.state.chunks.push(chunk1);
        chunk1.setChunkPosition(0, 0, this.state.chunkWidth);

        const chunk2 = new Chunk(this, -this.state.chunkWidth, 0, this.state.chunkWidth);
        this.add(chunk2);
        this.state.chunks.push(chunk2);
        chunk2.setChunkPosition(-this.state.chunkWidth, 0, this.state.chunkWidth);

        const chunk3 = new Chunk(this, this.state.chunkWidth, 0, 0);
        this.add(chunk3);
        this.state.chunks.push(chunk3);
        chunk3.setChunkPosition(this.state.chunkWidth, 0, 0);

        const chunk4 = new Chunk(this, 0, 0, 0);
        this.add(chunk4);
        this.state.chunks.push(chunk4);
        chunk4.setChunkPosition(0, 0, 0);

        const chunk5 = new Chunk(this, -this.state.chunkWidth, 0, 0);
        this.add(chunk5);
        this.state.chunks.push(chunk5);
        chunk5.setChunkPosition(-this.state.chunkWidth, 0, 0);

        const chunk6 = new Chunk(this, this.state.chunkWidth, 0, -this.state.chunkWidth);
        this.add(chunk6);
        this.state.chunks.push(chunk6);
        chunk6.setChunkPosition(this.state.chunkWidth, 0, -this.state.chunkWidth);

        const chunk7 = new Chunk(this, 0, 0, -this.state.chunkWidth);
        this.add(chunk7);
        this.state.chunks.push(chunk7);
        chunk7.setChunkPosition(0, 0, -this.state.chunkWidth);

        const chunk8 = new Chunk(this, -this.state.chunkWidth, 0, -this.state.chunkWidth);
        this.add(chunk8);
        this.state.chunks.push(chunk8);
        chunk8.setChunkPosition(-this.state.chunkWidth, 0, -this.state.chunkWidth);

/*
        const chunk9 = new Chunk(this, 0, 0, -2*this.state.chunkWidth);
        this.add(chunk9);
        this.state.chunks.push(chunk9); */

        // Add self to parent's update list
        parent.addToUpdateList(this);

        // Populate GUI
        // Related to perlin noise, so call updateNoise which updates everything
        var folder0 = this.state.gui.addFolder( 'TERRAIN GENERATION FACTORS' );
        folder0.add(this.state, 'octaves', 1, 16).name("Jaggedness").onChange(() => this.updateNoise()) ;
        // folder0.add(this.state, 'amplitude', 0, 10).onChange(() => this.updateNoise());
        folder0.add(this.state, 'freq', 1, 10).name("Peaks").onChange(() => this.updateNoise());
        folder0.add(this.state, 'randSeed', 0, 10).name("World Seed").onChange(() => this.updateSimplexSeed());

        // Related to the look of the terrain and don't need to recalculate height map again
        var folder = this.state.gui.addFolder( 'TERRAIN LOOK FACTORS' );
        folder.add(this.state, 'exaggeration', 0, 70).name("Exaggeration").onChange(() => this.updateTerrainGeo());
        folder.add(this.state, 'power', 0, 5).name("Valleys").onChange(() => this.updateTerrainGeo());
        folder.add(this.state, 'waterLevel', -100, 100).name("Water Level").onChange(() => this.updateTerrainGeo());
        folder.add(this.state, 'colorWiggle', -1, 1).name("Color Texturing").onChange(() => this.updateTerrainGeo());
        folder.add(this.state, 'middleGradient', 0, 1).name("Peak Color Height").onChange(() => this.updateTerrainGeo());
        folder.addColor(this.state, 'waterColor').name("Water Color").onChange(() => this.updateTerrainGeo());
        folder.addColor(this.state, 'bankColor').name("Bank Color").onChange(() => this.updateTerrainGeo());
        folder.addColor(this.state, 'middleColor').name("Middle Color").onChange(() => this.updateTerrainGeo());
        folder.addColor(this.state, 'peakColor').name("Peak Color").onChange(() => this.updateTerrainGeo());
        folder.add(this.state, 'terraced').onChange(() => this.updateTerrainGeo());
        folder.add(this.state, 'terraces', 1, 20).name("Num Terraces").onChange(() => this.updateTerrainGeo());

        folder.open();

    }

    updateSimplexSeed() {
      this.state.simplex = new SimplexNoise(this.state.randSeed);

      this.updateNoise();
    }

    updateNoise() {
      for(let chunk of this.state.chunks) {
        chunk.updateNoise();
      }
    }

    updateTerrainGeo() {
      for(let chunk of this.state.chunks) {
        chunk.updateTerrainGeo();
      }
    }

    update(timeStamp, x, y, z) {
      // console.log("Update in chunk manager. x: " + x + " y: " + y + " z: " + z)
      // make/delete chunks as needed

      // TRYING TO SOLVE GLITCH
      if(z > this.state.chunkWidth/2) {
        console.log("Trig Z")
        this.state.currentZOffset += this.state.chunkWidth;
        this.state.parent.state.z -= this.state.chunkWidth;

        var remove1 = this.state.chunks[6]
        var remove2 = this.state.chunks[7]
        var remove3 = this.state.chunks[8]

        this.remove(remove1)
        this.remove(remove2)
        this.remove(remove3)

        // move everything a row back. Chunks[] help us keep track of this
        this.state.chunks[6] = this.state.chunks[3]
        this.state.chunks[7] = this.state.chunks[4]
        this.state.chunks[8] = this.state.chunks[5]

        this.state.chunks[3] = this.state.chunks[0]
        this.state.chunks[4] = this.state.chunks[1]
        this.state.chunks[5] = this.state.chunks[2]

        // middle row
        this.state.chunks[3].setChunkPosition(this.state.chunkWidth, 0, 0)
        this.state.chunks[4].setChunkPosition(0, 0, 0)
        this.state.chunks[5].setChunkPosition(-this.state.chunkWidth, 0, 0)
        // bottom row
        this.state.chunks[6].setChunkPosition(this.state.chunkWidth, 0, -this.state.chunkWidth)
        this.state.chunks[7].setChunkPosition(0, 0, -this.state.chunkWidth)
        this.state.chunks[8].setChunkPosition(-this.state.chunkWidth, 0, -this.state.chunkWidth)

        this.position.x = -x;
        this.position.y = y - startYBelow;
        this.position.z = -z;

        // make new chunks with proper offset
        this.state.chunks[0] = new Chunk(this, this.state.chunkWidth + this.state.currentXOffset, 0, this.state.chunkWidth + this.state.currentZOffset);
        this.state.chunks[1] = new Chunk(this, this.state.currentXOffset, 0, this.state.chunkWidth + this.state.currentZOffset);
        this.state.chunks[2] = new Chunk(this, -this.state.chunkWidth + this.state.currentXOffset, 0, this.state.chunkWidth + this.state.currentZOffset);

        // move all pieces to correct position relative to center block
        // top row
        this.state.chunks[0].setChunkPosition(this.state.chunkWidth, 0, this.state.chunkWidth)
        this.state.chunks[1].setChunkPosition(0, 0, this.state.chunkWidth)
        this.state.chunks[2].setChunkPosition(-this.state.chunkWidth, 0, this.state.chunkWidth)

        remove1.disposeOf()
        remove2.disposeOf()
        remove3.disposeOf()
        this.add(this.state.chunks[0])
        this.add(this.state.chunks[1])
        this.add(this.state.chunks[2])

        return;

      }
      else if(z < -this.state.chunkWidth/2) {
        this.state.currentZOffset -= this.state.chunkWidth;

        this.remove(this.state.chunks[0])
        this.remove(this.state.chunks[1])
        this.remove(this.state.chunks[2])
        this.state.chunks[0].disposeOf()
        this.state.chunks[1].disposeOf()
        this.state.chunks[2].disposeOf()

        // move everything a row forward. Chunks[] help us keep track of this
        this.state.chunks[0] = this.state.chunks[3]
        this.state.chunks[1] = this.state.chunks[4]
        this.state.chunks[2] = this.state.chunks[5]

        this.state.chunks[3] = this.state.chunks[6]
        this.state.chunks[4] = this.state.chunks[7]
        this.state.chunks[5] = this.state.chunks[8]

        // make new chunks with proper offset
        this.state.chunks[6] = new Chunk(this, this.state.chunkWidth + this.state.currentXOffset, 0, -this.state.chunkWidth + this.state.currentZOffset);
        this.state.chunks[7] = new Chunk(this, this.state.currentXOffset, 0, -this.state.chunkWidth + this.state.currentZOffset);
        this.state.chunks[8] = new Chunk(this, -this.state.chunkWidth + this.state.currentXOffset, 0, -this.state.chunkWidth + this.state.currentZOffset);

        this.add(this.state.chunks[6])
        this.add(this.state.chunks[7])
        this.add(this.state.chunks[8])

        // move all pieces to correct position relative to center block
        // top row
        this.state.chunks[0].setChunkPosition(this.state.chunkWidth, 0, this.state.chunkWidth)
        this.state.chunks[1].setChunkPosition(0, 0, this.state.chunkWidth)
        this.state.chunks[2].setChunkPosition(-this.state.chunkWidth, 0, this.state.chunkWidth)
        // middle row
        this.state.chunks[3].setChunkPosition(this.state.chunkWidth, 0, 0)
        this.state.chunks[4].setChunkPosition(0, 0, 0)
        this.state.chunks[5].setChunkPosition(-this.state.chunkWidth, 0, 0)
        // bottom row
        this.state.chunks[6].setChunkPosition(this.state.chunkWidth, 0, -this.state.chunkWidth)
        this.state.chunks[7].setChunkPosition(0, 0, -this.state.chunkWidth)
        this.state.chunks[8].setChunkPosition(-this.state.chunkWidth, 0, -this.state.chunkWidth)

        this.state.parent.state.z += this.state.chunkWidth;
      }


      else if(x > this.state.chunkWidth/2) {

        this.state.currentXOffset += this.state.chunkWidth;

        this.remove(this.state.chunks[2])
        this.remove(this.state.chunks[5])
        this.remove(this.state.chunks[8])
        this.state.chunks[2].disposeOf()
        this.state.chunks[5].disposeOf()
        this.state.chunks[8].disposeOf()

        // move everything a column right. Chunks[] help us keep track of this
        this.state.chunks[2] = this.state.chunks[1]
        this.state.chunks[5] = this.state.chunks[4]
        this.state.chunks[8] = this.state.chunks[7]

        this.state.chunks[1] = this.state.chunks[0]
        this.state.chunks[4] = this.state.chunks[3]
        this.state.chunks[7] = this.state.chunks[6]

        // make new chunks with proper offset
        this.state.chunks[0] = new Chunk(this, this.state.chunkWidth + this.state.currentXOffset, 0, this.state.chunkWidth + this.state.currentZOffset);
        this.state.chunks[3] = new Chunk(this, this.state.chunkWidth + this.state.currentXOffset, 0, this.state.currentZOffset);
        this.state.chunks[6] = new Chunk(this, this.state.chunkWidth + this.state.currentXOffset, 0, -this.state.chunkWidth + this.state.currentZOffset);

        this.add(this.state.chunks[0])
        this.add(this.state.chunks[3])
        this.add(this.state.chunks[6])

        // move all pieces to correct position relative to center block
        // top row
        this.state.chunks[0].setChunkPosition(this.state.chunkWidth, 0, this.state.chunkWidth)
        this.state.chunks[1].setChunkPosition(0, 0, this.state.chunkWidth)
        this.state.chunks[2].setChunkPosition(-this.state.chunkWidth, 0, this.state.chunkWidth)
        // middle row
        this.state.chunks[3].setChunkPosition(this.state.chunkWidth, 0, 0)
        this.state.chunks[4].setChunkPosition(0, 0, 0)
        this.state.chunks[5].setChunkPosition(-this.state.chunkWidth, 0, 0)
        // bottom row
        this.state.chunks[6].setChunkPosition(this.state.chunkWidth, 0, -this.state.chunkWidth)
        this.state.chunks[7].setChunkPosition(0, 0, -this.state.chunkWidth)
        this.state.chunks[8].setChunkPosition(-this.state.chunkWidth, 0, -this.state.chunkWidth)

        this.state.parent.state.x -= this.state.chunkWidth;
      }

      else if(x < -this.state.chunkWidth/2) {
        this.state.currentXOffset -= this.state.chunkWidth;

        this.remove(this.state.chunks[0])
        this.remove(this.state.chunks[3])
        this.remove(this.state.chunks[6])
        this.state.chunks[0].disposeOf()
        this.state.chunks[3].disposeOf()
        this.state.chunks[6].disposeOf()


        // move everything a column left. Chunks[] help us keep track of this
        this.state.chunks[0] = this.state.chunks[1]
        this.state.chunks[3] = this.state.chunks[4]
        this.state.chunks[6] = this.state.chunks[7]

        this.state.chunks[1] = this.state.chunks[2]
        this.state.chunks[4] = this.state.chunks[5]
        this.state.chunks[7] = this.state.chunks[8]

        // make new chunks with proper offset
        this.state.chunks[2] = new Chunk(this, -this.state.chunkWidth + this.state.currentXOffset, 0, this.state.chunkWidth + this.state.currentZOffset);
        this.state.chunks[5] = new Chunk(this, -this.state.chunkWidth + this.state.currentXOffset, 0, this.state.currentZOffset);
        this.state.chunks[8] = new Chunk(this, -this.state.chunkWidth + this.state.currentXOffset, 0, -this.state.chunkWidth + this.state.currentZOffset);

        this.add(this.state.chunks[2])
        this.add(this.state.chunks[5])
        this.add(this.state.chunks[8])

        // move all pieces to correct position relative to center block
        // top row
        this.state.chunks[0].setChunkPosition(this.state.chunkWidth, 0, this.state.chunkWidth)
        this.state.chunks[1].setChunkPosition(0, 0, this.state.chunkWidth)
        this.state.chunks[2].setChunkPosition(-this.state.chunkWidth, 0, this.state.chunkWidth)
        // middle row
        this.state.chunks[3].setChunkPosition(this.state.chunkWidth, 0, 0)
        this.state.chunks[4].setChunkPosition(0, 0, 0)
        this.state.chunks[5].setChunkPosition(-this.state.chunkWidth, 0, 0)
        // bottom row
        this.state.chunks[6].setChunkPosition(this.state.chunkWidth, 0, -this.state.chunkWidth)
        this.state.chunks[7].setChunkPosition(0, 0, -this.state.chunkWidth)
        this.state.chunks[8].setChunkPosition(-this.state.chunkWidth, 0, -this.state.chunkWidth)

        this.state.parent.state.x += this.state.chunkWidth;
      }

      this.position.x = -x;
      this.position.y = y - startYBelow;
      this.position.z = -z;

    }
}

export default ChunkManager;
