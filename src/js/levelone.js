class PlayScene extends Phaser.Scene {
    constructor() {
        super('LevelOne');
    }

    init(data) {
        this.mapkey = data.mapkey;
    }

    create() {
        const map = this.mapkey.tilemap({ key: this.mapkey});
        
        const tileset = map.addTilesetImage('jefrens_platformer', 'tiles');

        //this.initAnims();

        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels); 

        map.createLayer('Backround', tileset);
        map.createLayer('colison-visoul', tileset);
        map.createLayer('hauses', tileset);
        this.platforms = map.createLayer('colison-solid', tileset);
        this.platforms.setCollisionByExclusion(-1, true);

        this.colison = this.add.group({
            allowGravity: false,
            immovable: true
        });

        map.getObjectLayer('colison-custom').objects.forEach((colisonGrop) => {
            const curentObject = new Phaser.GameObjects.Rectangle(
                this, colisonGrop.x, colisonGrop.y, colisonGrop.width, colisonGrop.height
            ).setOrigin(0);
            this.physics.add.existing(curentObject, true);
            this.colison.add(curentObject);
        });

        this.spawn = map.getObjectLayer('spawn').objects;
        this.spawn = this.spawn[0];
    }
}