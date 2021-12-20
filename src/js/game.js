// importera alla scener
import PlayScene from './play-scene';
import PreloadScene from './preload-scene';
import MenuScene from './menu-scene';
import LavinScene from './lavintest-level';
import LevelOne from './levelone';

// spelets config
const config = {
    type: Phaser.AUTO,
    width: 896,
    height: 448,
    pixelArt: true,
    transparent: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    },
    scene: [PreloadScene, PlayScene, MenuScene, LavinScene, LevelOne ],
    parent: 'game'
};

// initiera spelet
new Phaser.Game(config);
