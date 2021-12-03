class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
        this.sceneToStart = {
            namee: 'PlayScene',
            maap: '/tilemaps/biglevel1.json'
        }
    }

    init(data) {
        if (Object.values(data).length > 0) {
            this.sceneToStart.namee = data.namee;
            this.sceneToStart.maap = data.maap;
        }        
    }

    preload() {
        // säg åt phaser att lägga till /assets i alla paths
        this.load.setBaseURL('/assets');
        this.load.image('background', '/images/background.png');
        this.load.image('spike', '/images/spike.png');
        this.load.atlas(
            'player',
            '/images/jefrens_hero.png',
            '/images/jefrens_hero.json'
        );
        this.load.atlas(
            'foe',
            '/images/jefrens_foe.png',
            '/images/jefrens_foe.json'
        );
        this.load.image('tiles', '/tilesets/jefrens_tilesheet.png');
        // här laddar vi in en tilemap med spelets "karta"
        this.load.tilemapTiledJSON('map', this.sceneToStart.maap);
    }

    create() {
        this.scene.start(this.sceneToStart.namee);
    }
}

export default PreloadScene;