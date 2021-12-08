class PreloadScene extends Phaser.Scene {
    constructor() {
        super('ChangingScenes');

        this.sceneToStart = {
            namee: '',
            maap: '',
            mapkye: ''
        }
    }

    init(data) {
        this.sceneToStart.namee = data.namee;
        this.sceneToStart.maap = data.maap;
        this.sceneToStart.mapkye = data.mapkye;
    }

    preload() {
        this.load.setBaseURL('/assets');
        this.load.tilemapTiledJSON(this.sceneToStart.mapkye , this.sceneToStart.maap);
    }

    create() {
        this.scene.start(this.sceneToStart.namee, {
            'mapkye': this.sceneToStart.mapkye
        });
    }
}

export default PreloadScene;