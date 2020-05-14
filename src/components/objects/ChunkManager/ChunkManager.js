import { Group, Color, PlaneGeometry, PlaneBufferGeometry, Vector2, TextureLoader, Reflector, Refractor } from 'three';
import  SimplexNoise  from 'simplex-noise';
import { Chunk } from '../Chunk';
import { Water } from 'three/examples/jsm/objects/water2.js';
import NORM0 from './water/Water_1_M_Normal.jpg';
import NORM1 from './water/Water_2_M_Normal.jpg';


/*
      [0][1][2]
      [3][4][5]
      [6][7][8]

USING THIS ARRAY STRUCTURE

*/

// SET THESE TO CHANGE CHUNK DIMENSIONS
const startYBelow = 200;
const chunkPxWidth = 700;
const chunkVertexWidth = 50;

const PRESET_NAMES = ["Natural Terraces", "Sunset Peaks", "Cotton Candy", "Clouds", "Mars", "Moon", "Atlantis", "Bubble Gum", "Ice World"];

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
            orbNum: 1,
            displayOrbs: false,
            displayClouds: true,

            power: 1,
            octaves: 16,
            exaggeration: 20,
            ogExaggeration: 20,
            waterLevel: 0,
            activeWater: true,
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
            updateWithMusic: false,

            // PRESETS
            preset: "Cotton Candy",

        };

        this.state.simplex = new SimplexNoise(this.state.randSeed);

        const coordinates = [
          [this.state.chunkWidth, 0, this.state.chunkWidth],
          [0, 0, this.state.chunkWidth],
          [-this.state.chunkWidth, 0, this.state.chunkWidth],
          [this.state.chunkWidth, 0, 0],
          [0, 0, 0],
          [-this.state.chunkWidth, 0, 0],
          [this.state.chunkWidth, 0, -this.state.chunkWidth],
          [0, 0, -this.state.chunkWidth],
          [-this.state.chunkWidth, 0, -this.state.chunkWidth]
        ]

        for (let i = 0; i < coordinates.length; i++) {
          let new_plane_geo = new PlaneGeometry(this.state.chunkWidth, this.state.chunkWidth,
                                      this.state.chunkVertWidth - 1, this.state.chunkVertWidth - 1);
          const new_chunk = new Chunk(this, coordinates[i][0], coordinates[i][1], coordinates[i][2], new_plane_geo);
          this.add(new_chunk);
          this.state.chunks.push(new_chunk);
        }

        // Add self to parent's update list
        parent.addToUpdateList(this);

        // add water plane
        this.waterGeometry = new PlaneBufferGeometry( this.state.chunkWidth*3, this.state.chunkWidth*3 );

        var textureLoader = new TextureLoader();

        if (this.state.activeWater === true) {
          this.water = new Water( this.waterGeometry, {
            normalMap0: textureLoader.load(NORM0),
            normalMap1: textureLoader.load(NORM1),
            scale: this.state.waterScale,
            flowDirection: new Vector2( this.state.flowX, this.state.flowY ),
            textureWidth: 1024,
            textureHeight: 1024,
          } );

          //this.water.position.y = this.state.waterLevel - startYBelow;
          this.water.rotation.x = Math.PI * - 0.5;
          this.add( this.water );
        }

        // Populate GUI
        // Related to perlin noise, so call updateNoise which updates everything
        var folder0 = this.state.gui.addFolder( 'TERRAIN GENERATION FACTORS' );
        folder0.add(this.state, 'octaves', 1, 16).name("Jaggedness").onChange(() => this.updateNoise()) ;
        folder0.add(this.state, 'freq', 1, 10).name("Peaks").onChange(() => this.updateNoise());
        folder0.add(this.state, 'randSeed', 0, 10).name("World Seed").onChange(() => this.updateSimplexSeed());

        // Related to the look of the terrain and don't need to recalculate height map again
        let folder = this.state.gui.addFolder( 'TERRAIN LOOK FACTORS' );
        folder.add(this.state, 'ogExaggeration', 0, 70).name("Exaggeration").onChange(() => this.updateExaggeration());
        folder.add(this.state, 'power', 0, 5).name("Valleys").onChange(() => this.updateTerrainGeo());
        folder.add(this.state, 'waterLevel', -200, 200).name("Water Level").onChange(() => this.updateWaterLevel());
        folder.add(this.state, 'displayClouds').name("Display Clouds");
        folder.add(this.state, 'colorWiggle', -1, 1).name("Color Texturing").onChange(() => this.updateTerrainGeo());
        folder.add(this.state, 'middleGradient', 0.1, 1).name("Gradient").onChange(() => this.updateTerrainGeo());
        folder.addColor(this.state, 'waterColor').name("Ocean Color").onChange(() => this.updateTerrainGeo());
        folder.addColor(this.state, 'bankColor').name("Bank Color").onChange(() => this.updateTerrainGeo());
        folder.addColor(this.state, 'middleColor').name("Middle Color").onChange(() => this.updateTerrainGeo());
        folder.addColor(this.state, 'peakColor').name("Peak Color").onChange(() => this.updateTerrainGeo());
        folder.add(this.state, 'terraced').onChange(() => this.updateTerrainGeo());
        folder.add(this.state, 'terraces', 1, 20).name("Num Terraces").onChange(() => this.updateTerrainGeo());
        this.state.gui.add(this.state, 'preset', PRESET_NAMES).name("Terrain Presets").onChange(() => this.loadPreset());
        this.state.gui.add(this.state, 'updateWithMusic').name("Breathing Terrain").onChange(() => this.breathingTerrain());
        this.state.gui.add(this.state, 'displayOrbs').name("Generate Words");
        this.state.gui.add(this.state, 'displayClouds').name("Generate Clouds");
        this.state.gui.add(this.state, 'activeWater').name("Display Water").onChange(() => this.addActiveWater());


        this.loadPreset();
        // folder.open();
    }

    breathingTerrain() {
      if(this.state.updateWithMusic == false) { // became false
        this.updateDisplay(this.state.gui);
      }
      this.updateTerrainGeo();
    }

    loadPreset() {

      if(this.state.preset == "Natural Terraces") {
        this.state.power = 1
        this.state.octaves = 4
        this.state.exaggeration = 30
        this.state.ogExaggeration = 30
        this.state.waterLevel = -13
        this.state.waterColor = new Color(14, 116, 255)
        this.state.bankColor = new Color(183, 181, 82)
        this.state.middleColor = new Color(16, 158, 83)
        this.state.peakColor = new Color(255, 255, 255)
        this.state.colorWiggle = -0.66
        this.state.middleGradient = 0.5
        this.state.randSeed = 4
        this.state.freq = 1.6
        this.state.terraced = true
        this.state.terraces = 13
        this.state.updateWithMusic = false
        this.state.parent.state.skyTexture = 'Dusk'
        this.state.displayClouds = true
        this.state.parent.updateSkyTexture();
      }

      else if(this.state.preset == 'Sunset Peaks') {
        this.state.power = 1
        this.state.octaves = 16
        this.state.exaggeration = 45
        this.state.ogExaggeration = 45
        this.state.waterLevel = 0
        this.state.waterColor = new Color(14, 116, 255)
        this.state.bankColor = new Color(255, 147, 0)
        this.state.middleColor = new Color(255, 13, 13)
        this.state.peakColor = new Color(255,255,255)
        this.state.colorWiggle = 0.1
        this.state.middleGradient = 0.65
        this.state.randSeed = 4
        this.state.freq = 7.1
        this.state.terraced = false
        this.state.terraces = 15
        this.state.updateWithMusic = false
        this.state.parent.state.skyTexture = 'Sunset'
        this.state.displayClouds = true
        this.state.parent.updateSkyTexture();
      }

      else if (this.state.preset == 'Cotton Candy') {
        this.state.power = 1.1
        this.state.octaves = 13
        this.state.exaggeration = 65
        this.state.ogExaggeration = 65
        this.state.waterLevel = 28
        this.state.waterColor = new Color(50,90,145)
        this.state.bankColor = new Color(11,130,209)
        this.state.middleColor = new Color(255,0,197)
        this.state.peakColor = new Color(32,67,214)
        this.state.colorWiggle = 0.82
        this.state.middleGradient = 0.33
        this.state.randSeed = 4
        this.state.freq = 2.7
        this.state.terraced = false
        this.state.terraces = 15
        this.state.updateWithMusic = false
        this.state.parent.state.skyTexture = 'Starry'
        this.state.displayClouds = true
        this.state.parent.updateSkyTexture();
      }

      else if (this.state.preset == 'Clouds') {
        this.state.power = 1
        this.state.octaves = 12
        this.state.exaggeration = 29
        this.state.ogExaggeration = 29
        this.state.waterLevel = -44
        this.state.waterColor = new Color(50,90,145)
        this.state.bankColor = new Color(14,21,112)
        this.state.middleColor = new Color(35,129,169)
        this.state.peakColor = new Color(252,252,252)
        this.state.colorWiggle = 0.1
        this.state.middleGradient = 0.69
        this.state.randSeed = 4
        this.state.freq = 6
        this.state.terraced = false
        this.state.terraces = 15
        this.state.updateWithMusic = false
        this.state.parent.state.skyTexture = 'Starry'
        this.state.displayClouds = true
        this.state.parent.updateSkyTexture();
      }

      else if (this.state.preset == 'Mars') {
        this.state.power = 1.6
        this.state.octaves = 16
        this.state.exaggeration = 26
        this.state.ogExaggeration = 26
        this.state.waterLevel = -200
        this.state.waterColor = new Color(255,255,255)
        this.state.bankColor = new Color(185,5,5)
        this.state.middleColor = new Color(103,0,45)
        this.state.peakColor = new Color(80,0,0)
        this.state.colorWiggle = -1
        this.state.middleGradient = 0.5
        this.state.randSeed = 7
        this.state.freq = 7.3
        this.state.terraced = false
        this.state.terraces = 15
        this.state.updateWithMusic = false
        this.state.parent.state.skyTexture = 'Starry'
        this.state.displayClouds = false
        this.state.parent.updateSkyTexture();
      }

      else if (this.state.preset == 'Moon') {
        this.state.power = 1.6
        this.state.octaves = 4
        this.state.exaggeration = 40
        this.state.ogExaggeration = 40
        this.state.waterLevel = -200
        this.state.waterColor = new Color(0,0,0)
        this.state.bankColor = new Color(195,195,195)
        this.state.middleColor = new Color(50,50,50)
        this.state.peakColor = new Color(210,210,210)
        this.state.colorWiggle = 0.13
        this.state.middleGradient = 0.5
        this.state.randSeed = 4
        this.state.freq = 1.3
        this.state.terraced = true
        this.state.terraces = 20
        this.state.updateWithMusic = false
        this.state.parent.state.skyTexture = 'Starry'
        this.state.displayClouds = false
        this.state.parent.updateSkyTexture();
      }
      else if (this.state.preset == 'Atlantis') {
        this.state.power = 1.6
        this.state.octaves = 16
        this.state.exaggeration = 40
        this.state.ogExaggeration = 40
        this.state.waterLevel = 200
        this.state.waterColor = new Color(0,0,0)
        this.state.bankColor = new Color(42,92,217)
        this.state.middleColor = new Color(63,125,199)
        this.state.peakColor = new Color(96,159,168)
        this.state.colorWiggle = 0.13
        this.state.middleGradient = 0.5
        this.state.randSeed = 4
        this.state.freq = 6.3
        this.state.terraced = false
        this.state.terraces = 20
        this.state.updateWithMusic = false
        this.state.parent.state.skyTexture = 'Dusk'
        this.state.displayClouds = true
        this.state.parent.updateSkyTexture();
      }
      else if (this.state.preset == 'Bubble Gum') {
        this.state.power = 0.6
        this.state.octaves = 1
        this.state.exaggeration = 31
        this.state.ogExaggeration = 31
        this.state.waterLevel = 0.2
        this.state.waterColor = new Color(148,255,255)
        this.state.bankColor = new Color(238,60,227)
        this.state.middleColor = new Color(255,21,145)
        this.state.peakColor = new Color(255,141,187)
        this.state.colorWiggle = 0.8
        this.state.middleGradient = 0.36
        this.state.randSeed = 4
        this.state.freq = 5
        this.state.terraced = false
        this.state.terraces = 20
        this.state.updateWithMusic = false
        this.state.parent.state.skyTexture = 'Dusk'
        this.state.displayClouds = true
        this.state.parent.updateSkyTexture();
      }
      else if (this.state.preset == 'Ice World') {
        this.state.power = 3.1
        this.state.octaves = 1
        this.state.exaggeration = 27
        this.state.ogExaggeration = 27
        this.state.waterLevel = 0.2
        this.state.waterColor = new Color(255,255,255)
        this.state.bankColor = new Color(172,245,255)
        this.state.middleColor = new Color(21,21,225)
        this.state.peakColor = new Color(255,255,255)
        this.state.colorWiggle = 0.5
        this.state.middleGradient = 0.36
        this.state.randSeed = 4
        this.state.freq = 7.2
        this.state.terraced = false
        this.state.terraces = 20
        this.state.updateWithMusic = false
        this.state.parent.state.skyTexture = 'Starry'
        this.state.displayClouds = false
        this.state.parent.updateSkyTexture();
      }

      this.updateNoise();
      this.updateWaterLevel();
      this.updateDisplay(this.state.gui);
    }

    // this doesnt work :()
    updateDisplay(gui) {
        for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
        for (var f in gui.__folders) {
            this.updateDisplay(gui.__folders[f]);
        }
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

    updateExaggeration() {
      this.state.exaggeration = this.state.ogExaggeration;
      this.updateTerrainGeo()
    }

    updateTerrainGeo() {
      for(let chunk of this.state.chunks) {
        chunk.updateTerrainGeo();
      }
    }

    addActiveWater() {
      if (this.state.activeWater === true) {
        var textureLoader = new TextureLoader();

        this.water = new Water( this.waterGeometry, {
          normalMap0: textureLoader.load(NORM0),
          normalMap1: textureLoader.load(NORM1),
          scale: this.state.waterScale,
          flowDirection: new Vector2( this.state.flowX, this.state.flowY ),
          textureWidth: 1024,
          textureHeight: 1024,
        } );


        //this.water.position.y = this.state.waterLevel - startYBelow;
        this.water.rotation.x = Math.PI * - 0.5;
        this.add( this.water );

      }
      else {
        this.remove(this.water);
      }
      this.updateWaterLevel();
    }

    updateWaterLevel() {
      if (this.state.activeWater === true) {
        this.water.position.y = this.state.waterLevel;
        this.updateTerrainGeo();
      }
    }

    update(timeStamp, x, y, z) {
      // console.log("Update in chunk manager. x: " + x + " y: " + y + " z: " + z)
      // make/delete chunks as needed
      // Initialized as a 0 but are actually supposed to be PlaneGeometry objects
      let plane_geos = [0, 0, 0];
      let need_update = (z > this.state.chunkWidth/2) || (z < -this.state.chunkWidth/2)
      || (x > this.state.chunkWidth/2) || (x < -this.state.chunkWidth/2);

      if(z > this.state.chunkWidth/2) {
        this.state.currentZOffset += this.state.chunkWidth;
        this.state.parent.state.z -= this.state.chunkWidth;

        this.remove(this.state.chunks[6])
        this.remove(this.state.chunks[7])
        this.remove(this.state.chunks[8])
        plane_geos[0] = this.state.chunks[6].disposeOf();
        plane_geos[1] = this.state.chunks[7].disposeOf()
        plane_geos[2] = this.state.chunks[8].disposeOf()

        // move everything a row back. Chunks[] help us keep track of this
        this.state.chunks[6] = this.state.chunks[3]
        this.state.chunks[7] = this.state.chunks[4]
        this.state.chunks[8] = this.state.chunks[5]

        this.state.chunks[3] = this.state.chunks[0]
        this.state.chunks[4] = this.state.chunks[1]
        this.state.chunks[5] = this.state.chunks[2]

        // make new chunks with proper offset
        this.state.chunks[0] = new Chunk(this, this.state.chunkWidth + this.state.currentXOffset, 0, this.state.chunkWidth + this.state.currentZOffset, plane_geos
        [0]);
        this.state.chunks[1] = new Chunk(this, this.state.currentXOffset, 0, this.state.chunkWidth + this.state.currentZOffset,plane_geos
        [1]);
        this.state.chunks[2] = new Chunk(this, -this.state.chunkWidth + this.state.currentXOffset, 0, this.state.chunkWidth + this.state.currentZOffset,plane_geos
        [2]);

        this.add(this.state.chunks[0])
        this.add(this.state.chunks[1])
        this.add(this.state.chunks[2])

      }
      else if(z < -this.state.chunkWidth/2) {
        this.state.currentZOffset -= this.state.chunkWidth;
        this.state.parent.state.z += this.state.chunkWidth;

        this.remove(this.state.chunks[0])
        this.remove(this.state.chunks[1])
        this.remove(this.state.chunks[2])
        plane_geos[0] = this.state.chunks[0].disposeOf()
        plane_geos[1] = this.state.chunks[1].disposeOf()
        plane_geos[2] = this.state.chunks[2].disposeOf()


        // move everything a row forward. Chunks[] help us keep track of this
        this.state.chunks[0] = this.state.chunks[3]
        this.state.chunks[1] = this.state.chunks[4]
        this.state.chunks[2] = this.state.chunks[5]

        this.state.chunks[3] = this.state.chunks[6]
        this.state.chunks[4] = this.state.chunks[7]
        this.state.chunks[5] = this.state.chunks[8]

        // make new chunks with proper offset
        this.state.chunks[6] = new Chunk(this, this.state.chunkWidth + this.state.currentXOffset, 0, -this.state.chunkWidth + this.state.currentZOffset,plane_geos
        [0]);
        this.state.chunks[7] = new Chunk(this, this.state.currentXOffset, 0, -this.state.chunkWidth + this.state.currentZOffset,plane_geos
        [1]);
        this.state.chunks[8] = new Chunk(this, -this.state.chunkWidth + this.state.currentXOffset, 0, -this.state.chunkWidth + this.state.currentZOffset,plane_geos
        [2]);

        this.add(this.state.chunks[6])
        this.add(this.state.chunks[7])
        this.add(this.state.chunks[8])

      }


      else if(x > this.state.chunkWidth/2) {

        this.state.currentXOffset += this.state.chunkWidth;
        this.state.parent.state.x -= this.state.chunkWidth;

        this.remove(this.state.chunks[2])
        this.remove(this.state.chunks[5])
        this.remove(this.state.chunks[8])
        plane_geos[0] = this.state.chunks[2].disposeOf()
        plane_geos[1] = this.state.chunks[5].disposeOf()
        plane_geos[2] = this.state.chunks[8].disposeOf()


        // move everything a column right. Chunks[] help us keep track of this
        this.state.chunks[2] = this.state.chunks[1]
        this.state.chunks[5] = this.state.chunks[4]
        this.state.chunks[8] = this.state.chunks[7]

        this.state.chunks[1] = this.state.chunks[0]
        this.state.chunks[4] = this.state.chunks[3]
        this.state.chunks[7] = this.state.chunks[6]

        // make new chunks with proper offset
        this.state.chunks[0] = new Chunk(this, this.state.chunkWidth + this.state.currentXOffset, 0, this.state.chunkWidth + this.state.currentZOffset,plane_geos
        [0]);
        this.state.chunks[3] = new Chunk(this, this.state.chunkWidth + this.state.currentXOffset, 0, this.state.currentZOffset,plane_geos
        [1]);
        this.state.chunks[6] = new Chunk(this, this.state.chunkWidth + this.state.currentXOffset, 0, -this.state.chunkWidth + this.state.currentZOffset,plane_geos
        [2]);

        this.add(this.state.chunks[0])
        this.add(this.state.chunks[3])
        this.add(this.state.chunks[6])

      }

      else if(x < -this.state.chunkWidth/2) {
        this.state.currentXOffset -= this.state.chunkWidth;
        this.state.parent.state.x += this.state.chunkWidth;

        this.remove(this.state.chunks[0])
        this.remove(this.state.chunks[3])
        this.remove(this.state.chunks[6])
        plane_geos[0] = this.state.chunks[0].disposeOf()
        plane_geos[1] = this.state.chunks[3].disposeOf()
        plane_geos[2] = this.state.chunks[6].disposeOf()


        // move everything a column left. Chunks[] help us keep track of this
        this.state.chunks[0] = this.state.chunks[1]
        this.state.chunks[3] = this.state.chunks[4]
        this.state.chunks[6] = this.state.chunks[7]

        this.state.chunks[1] = this.state.chunks[2]
        this.state.chunks[4] = this.state.chunks[5]
        this.state.chunks[7] = this.state.chunks[8]

        // make new chunks with proper offset
        this.state.chunks[2] = new Chunk(this, -this.state.chunkWidth + this.state.currentXOffset, 0, this.state.chunkWidth + this.state.currentZOffset, plane_geos
        [0]);
        this.state.chunks[5] = new Chunk(this, -this.state.chunkWidth + this.state.currentXOffset, 0, this.state.currentZOffset, plane_geos
        [1]);
        this.state.chunks[8] = new Chunk(this, -this.state.chunkWidth + this.state.currentXOffset, 0, -this.state.chunkWidth + this.state.currentZOffset, plane_geos
        [2]);

        this.add(this.state.chunks[2])
        this.add(this.state.chunks[5])
        this.add(this.state.chunks[8])


      }
      if (need_update) {
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
      }

      this.position.x = -x;
      this.position.y = y - startYBelow;
      this.position.z = -z;

    }


}

export default ChunkManager;
