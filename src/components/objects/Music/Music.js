import DEEP from './sounds/deep.mp3';
import JAZZ from './sounds/jazzy.mp3';
import PIANO from './sounds/piano.mp3';
import MEDITATION from './sounds/5minbreathing.mp3';
import SLOW from './sounds/slowmotion.mp3';
import { Group, AudioListener, Audio, AudioLoader, AudioAnalyser} from 'three';

class Music extends Group {
    constructor(parent, camera) {
        // Call parent Group() constructor
        super();

        const library = {
            '1: Jazzy':JAZZ,
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
        };

        this.soundHandler(sound);
        
        // // create an AudioAnalyser, passing in the sound and desired fftSize
        // var analyser = new AudioAnalyser(sound, 32);
        // var data = analyser.getFrequencyData();
        // console.log(data);

        // Choose audio file in GUI
        let folder = this.state.gui.addFolder('AUDIO');
        folder.add(this.state, 'audiofile', ['1: Jazzy', '2: Deep Meditation', '3: Slow', '4: Piano', '5: Breathing Exercise']).onChange((audiofile) => this.updateAudioFile(audiofile));
        folder.open();

        window.addEventListener('keydown', (e) => {
          this.audioHandler(e);
        }, false);

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
}          

export default Music;
