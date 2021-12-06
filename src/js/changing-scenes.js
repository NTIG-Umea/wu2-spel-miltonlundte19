class PreloadScene extends Phaser.Scene {
    constructor() {
        super('ChangingScenes');

        this.sceneToStart = {
            namee: '',
            maap: ''
        }
    }

    init(data) {
        this.sceneToStart.namee = data.namee;
        this.sceneToStart.maap = data.maap;
    }

    preload() {
        this.load.tilemapTiledJSON('map', this.sceneToStart.maap);
    }

    create() {
        this.scene.start(this.sceneToStart.namee);
    }
}

export default PreloadScene;