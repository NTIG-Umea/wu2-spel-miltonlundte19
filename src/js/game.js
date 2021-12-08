// importera alla scener
import PlayScene from './play-scene';
import PreloadScene from './preload-scene';
import MenuScene from './menu-scene';
import ChangingScenes from './changing-scenes';
import LavinScene from './lavintest-level';

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
            debug: true
        }
    },
    scene: [PreloadScene, PlayScene, MenuScene, ChangingScenes, LavinScene],
    parent: 'game'
};

// initiera spelet
new Phaser.Game(config);
