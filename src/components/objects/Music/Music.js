import DEEP from './sounds/deep.mp3';
import JAZZ from './sounds/jazzy.mp3';
import PIANO from './sounds/piano.mp3';
import MEDITATION from './sounds/5minbreathing.mp3';
import SLOW from './sounds/slowmotion.mp3';
import { Group, AudioListener, Audio, AudioLoader, AudioAnalyser, Color} from 'three';

class Music extends Group {
    constructor(parent, camera) {
        // Call parent Group() constructor
        super();

        const library = {
            '1: Jazzy': JAZZ,
            '2: Deep Meditation': DEEP,
            '3: Slow': SLOW,
            '4: Piano': PIANO,
            '5: Breathing Exercise': MEDITATION
        };

        let listener = new AudioListener();
        camera.add(listener);

        let sound = new Audio(listener);
        this.add(sound);

        // Init state
        this.state = {
            gui: parent.state.gui,
            camera: camera,
            library: library,
            audiofile: '2: Deep Meditation',
            audioLoader: new AudioLoader(),
            listener: listener,
            sound: sound,
            analyser: new AudioAnalyser(sound, 32),
            colorLevel:0,
            soundUpdate:0,
            audioPlaying:false,
        };

        //this.soundHandler(sound);

        // Choose audio file in GUI
        let folder = this.state.gui.addFolder('AUDIO');
        folder.add(this.state, 'audiofile', ['1: Jazzy', '2: Deep Meditation', '3: Slow', '4: Piano', '5: Breathing Exercise']).onChange((audiofile) => this.updateAudioFile(audiofile));
        folder.add(this.state, 'audioPlaying').name("Toggle Audio").onChange(() => this.soundHandler(sound));

        folder.open();
        

        window.addEventListener('keydown', (e) => {
          this.audioHandler(e);
        }, false);

        parent.addToUpdateList(this);


    }
    audioHandler(event) {
        if (event.key == 'p') {
          let sound = this.state.sound;
          if (sound) {
            this.soundHandler(sound);
          }
        }
        else return;
    }

    soundHandler(sound) {
      let music = this.state.library[this.state.audiofile];
      if (!sound.isPlaying) {
        this.state.audioLoader.load(music, function(buffer) {
          sound.setBuffer(buffer);
          sound.setLoop(true);
          sound.setVolume(0.5);
          sound.play();
        });
      }
      else {
        sound.pause();
      }
    }

    // update audio when changed in gui
    updateAudioFile(audiofile) {
      // let audioLoader = new AudioLoader();
      //let music = this.state.library[audiofile];
      let sound = this.state.sound;

      // stop current audio if playing already
      if (sound.isPlaying) {
        sound.stop();
      }
      this.soundHandler(sound);
    }
    update() {
      if (this.state.soundUpdate % 5 == 0 && this.parent.chunkmanager.state.updateWithMusic == true) {
        let avg = this.state.analyser.getAverageFrequency();
        //this.state.gui.exaggeration += avg*0.5;
        let chunkManager = this.parent.chunkmanager;
        if (avg > 10) {
          chunkManager.state.exaggeration = chunkManager.state.ogExaggeration*avg/50;
          let factor = avg/500;

          chunkManager.state.bankColor = new Color(chunkManager.state.bankColor.r, chunkManager.state.bankColor.g, chunkManager.state.bankColor.b)
          chunkManager.state.middleColor = new Color(chunkManager.state.middleColor.r, chunkManager.state.middleColor.g, chunkManager.state.middleColor.b)
          chunkManager.state.peakColor = new Color(chunkManager.state.peakColor.r, chunkManager.state.peakColor.g, chunkManager.state.peakColor.b)

          if (this.state.colorLevel == 0) {
            chunkManager.state.bankColor.lerp(chunkManager.state.middleColor,factor);

          }
          else if (this.state.colorLevel == 1) {
            chunkManager.state.middleColor.lerp(chunkManager.state.peakColor,factor);
          } else {
            chunkManager.state.peakColor.lerp(chunkManager.state.bankColor,factor);
          }
          chunkManager.updateTerrainGeo();
        }
      }

      if (this.state.soundUpdate % 300 == 0) {
        this.state.colorLevel = (this.state.colorLevel + 1) % 3;
      }

      this.state.soundUpdate = (this.state.soundUpdate + 1) % 500;
    }
}

export default Music;
