import { Group, Color, PlaneBufferGeometry, VertexColors, PlaneGeometry, MeshStandardMaterial, MeshLambertMaterial, Mesh} from 'three';
import  SimplexNoise  from 'simplex-noise';

const terrainSize = {width: 1000, height: 1000, vertsWidth: 100, vertsHeight: 100};

class TerrainPlane extends Group {

    constructor(parent, xOffset, yOffset, zOffset, planeGeometry) {
        // console.log("CONSTRUCTOR TERRAIN PLANE")
        // Call parent Group() constructor
        super();


        // Init state
        this.state = {
            gui: parent.state.gui,
            parent: parent,
            chunkWidth: parent.state.chunkWidth,
            chunkVertWidth: parent.state.chunkVertWidth,
            totalVertWidth: parent.state.totalVertWidth,
            xOffset: xOffset,
            yOffset: yOffset,
            zOffset: zOffset,

        };

        this.state.xOffset = xOffset*parent.state.chunkVertWidth/parent.state.chunkWidth;
        this.state.zOffset = zOffset*parent.state.chunkVertWidth/parent.state.chunkWidth;

        // create the plane
        this.geometry = planeGeometry;
        this.geometry.verticesNeedUpdate = true;
        this.geometry.colorsNeedUpdate = true;

        // get perline noise height map and update the geometry
        this.heightMap = this.generateTexture(xOffset, zOffset);
        this.updateTerrainGeo();

        //required for flat shading
        this.geometry.computeFlatVertexNormals()
        this.material = new MeshLambertMaterial({
            // wireframe:true,
            vertexColors: VertexColors,
            //required for flat shading
            flatShading:true,
        });
        const terrain = new Mesh(this.geometry, this.material)

        // update location on the map
        // let groundY = -200 //-249;
        // terrain.position.y = groundY - 1;
        terrain.rotation.x = -Math.PI / 2;
        terrain.rotation.z = -Math.PI / 2;
        terrain.receiveShadow = true;
        terrain.castShadow = true;

        this.add(terrain);

        // Add self to parent's update list
        // parent.addToUpdateList(this);

    }

    updateTerrainGeo() {
      //assign vert heights in geometry
      for(let j = 0; j < this.heightMap.length; j++) {
          for (let i = 0; i < this.heightMap[0].length; i++) {
              const index = (j*(this.heightMap.length)+i)
              const v1 = this.geometry.vertices[index]
              if(this.state.parent.state.terraced == true) {
                v1.z = (Math.round(Math.pow(this.heightMap[j][i], Math.ceil(this.state.parent.state.power)) * this.state.parent.state.terraces)/this.state.parent.state.terraces)*this.state.parent.state.exaggeration*10
              }
              else {
                v1.z = Math.pow(this.heightMap[j][i], Math.ceil(this.state.parent.state.power))*this.state.parent.state.exaggeration*10
              }
              // set to water level if below water
              v1.z = Math.max(this.state.parent.state.waterLevel, v1.z)
          }
      }

      //for every face calculate the color, do some gradient calculations to make it polygons
      this.geometry.faces.forEach(f=>{
          //get three verts for the face
          const a = this.geometry.vertices[f.a]
          const b = this.geometry.vertices[f.b]
          const c = this.geometry.vertices[f.c]

          //return f.color.setRGB(a.x/this.state.chunkWidth, a.y/this.state.chunkWidth, a.y/this.state.chunkWidth);

          //assign colors based on the average point of the face
          var wiggle = this.state.parent.state.colorWiggle * 25;
          const max = (a.z+b.z+c.z)/3
          if(max <= this.state.parent.state.waterLevel) return f.color.setRGB((this.state.parent.state.waterColor.r + Math.random()*wiggle)/255, (this.state.parent.state.waterColor.g + Math.random()*wiggle)/255, (this.state.parent.state.waterColor.b +Math.random()*wiggle)/255)
          if(max - this.state.parent.state.waterLevel > this.state.parent.state.exaggeration*7) return f.color.setRGB((this.state.parent.state.peakColor.r+ Math.random()*wiggle)/255, (this.state.parent.state.peakColor.g+ Math.random()*wiggle)/255, (this.state.parent.state.peakColor.b+ Math.random()*wiggle)/255)

          var ratio = (max - this.state.parent.state.waterLevel)/(this.state.parent.state.exaggeration*7);

          // upper half? blend middle with peak
          if(ratio >= this.state.parent.state.middleGradient) {
            ratio = (ratio-this.state.parent.state.middleGradient)/this.state.parent.state.middleGradient;
            return f.color.setRGB((this.state.parent.state.peakColor.r*ratio + this.state.parent.state.middleColor.r*(1-ratio) + Math.random()*wiggle)/255,
                                    (this.state.parent.state.peakColor.g*ratio + this.state.parent.state.middleColor.g*(1-ratio) + Math.random()*wiggle)/255,
                                    (this.state.parent.state.peakColor.b*ratio + this.state.parent.state.middleColor.b*(1-ratio) + Math.random()*wiggle)/255);
          }

          ratio = (ratio)/this.state.parent.state.middleGradient;
          return f.color.setRGB((this.state.parent.state.middleColor.r*ratio + this.state.parent.state.bankColor.r*(1-ratio) + Math.random()*wiggle)/255,
                                    (this.state.parent.state.middleColor.g*ratio + this.state.parent.state.bankColor.g*(1-ratio) + Math.random()*wiggle)/255,
                                    (this.state.parent.state.middleColor.b*ratio + this.state.parent.state.bankColor.b*(1-ratio) + Math.random()*wiggle)/255);

      })

      this.geometry.verticesNeedUpdate = true;
      this.geometry.colorsNeedUpdate = true;
      this.geometry.computeFlatVertexNormals();
    }


    updateSimplexSeed() {
      // this.simplex = new SimplexNoise(this.state.randSeed);

      this.updateNoise();
    }

    updateNoise() {
      this.heightMap = this.generateTexture();

      this.updateTerrainGeo();
    }

    // from https://medium.com/@joshmarinacci/low-poly-style-terrain-generation-8a017ab02e7b
    noise(nx, ny, simplex) {
        // Is in range -1.0:+1.0
        return simplex.noise2D(nx,ny);
    }
    //stack some noisefields together
    octave(nx,ny,octaves, simplex, xOffset, zOffset) {
        let val = 0;
        let freq = this.state.parent.state.freq;
        let max = 0;
        let amp = 1; //this.state.amplitude;
        for(let i=0; i<octaves; i++) {
            val += this.noise(nx*freq, ny*freq, simplex)*amp;
            max += amp;
            amp /= 2;
            freq  *= 2;
        }
        return val/max;
    }

    //generate noise
    generateTexture() {

        // console.log("terrain with offset " + this.state.xOffset + " " + this.state.zOffset)
        // make 2d array
        var simplex = this.state.parent.state.simplex;

        const canvas = new Array(this.state.chunkVertWidth);
        for (var i = 0; i < canvas.length; i++) {
          canvas[i] = new Array(this.state.chunkVertWidth);
        }

        for(let i=0; i<this.state.chunkVertWidth; i++) {
            for(let j=0; j<this.state.chunkVertWidth; j++) {
                let v =  this.octave((i - this.state.chunkVertWidth - this.state.xOffset + 1 + Math.floor(this.state.xOffset/this.state.chunkVertWidth))/(this.state.totalVertWidth-3),
                                     (j + this.state.chunkVertWidth + this.state.zOffset - 1 - Math.floor(this.state.zOffset/this.state.chunkVertWidth))/(this.state.totalVertWidth-3),
                                      this.state.parent.state.octaves, simplex)
                canvas[i][j] = v
            }
        }
        return canvas
    }

    disposeOf() {
      this.material.dispose()
      this.remove(this.children[0])

      return this.geometry;
    }

}

export default TerrainPlane;
