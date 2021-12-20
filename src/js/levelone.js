class PlayScene extends Phaser.Scene {
    constructor() {
        super('LevelOne');
    }

    init(data) {
        this.mapkye = data.mapkye;
    }

    preload() {
        this.load.image('star', '/assets/images/star.png');
    }


    create() {
        this.timeTilDef = 0;

        const map = this.make.tilemap({ key: this.mapkye});
        
        const tileset = map.addTilesetImage('jefrens_platformer', 'tiles');

        this.initAnims();

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

        this.player = this.physics.add.sprite(this.spawn.x, this.spawn.y-30, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.player, false, 0.5, 0.5);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.colison);

        this.coletibuls = this.add.group({
            allowGravity: false,
            immovable: true
        });
        
        map.getObjectLayer('colektibul').objects.forEach((obj) => {
            const objspri = this.physics.add.sprite(obj.x, obj.y, 'star').setOrigin(0);
            objspri.body.allowGravity = false;
            this.coletibuls.add(objspri);
        });
        
        this.physics.add.overlap(this.player, this.coletibuls, this.playerhiting, null, this)
    }

    update() {
        this.timeTilDef += 1;
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else {
            this.player.setVelocityX(0);
            if (this.player.body.onFloor()) {
                this.player.play('idle', true);
            }
        }

        if (
            (this.cursors.space.isDown || this.cursors.up.isDown) &&
            this.player.body.onFloor()
        ) {
            this.player.setVelocityY(-350);
            this.player.play('jump', true);
        }

        if (this.player.body.velocity.x > 0) {
            this.player.setFlipX(false);
        } else if (this.player.body.velocity.x < 0) {
            // otherwise, make them face the other side
            this.player.setFlipX(true);
        }
        if (this.timeTilDef >= 1000) {
            console.log('död');
        }
    }

    playerhiting(player, coletibul) {
        coletibul.disableBody(true, true);
        this.timeTilDef = 0;
    }

    initAnims() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'jefrens_',
                start: 1,
                end: 4
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 'jefrens_2' }],
            frameRate: 10
        });

        this.anims.create({
            key: 'jump',
            frames: [{ key: 'player', frame: 'jefrens_5' }],
            frameRate: 10
        });
    }
    
}

export default PlayScene;