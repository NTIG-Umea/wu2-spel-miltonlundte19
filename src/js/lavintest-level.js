class PlayScene extends Phaser.Scene {
    constructor() {
        super('LavinScene');
    }

    init(data) {
        this.mapkey = data.mapkye;
    }

    create() {
        this.spiked = 0;

        const map = this.make.tilemap({ key: this.mapkey });

        console.log(map);

        const tileset = map.addTilesetImage('jefrens_platformer', 'tiles');

        console.log(map);
        this.initAnims();

        this.cursors = this.input.keyboard.createCursorKeys();

        console.log(map.widthInPixels);
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);

        
        
        map.createLayer('Bakground-1', tileset);
        map.createLayer('Forgroudn-1', tileset);
        this.platforms = map.createLayer('Platforms-Solid', tileset);
        this.platforms.setCollisionByExclusion(-1, true);

        this.spawn = map.getObjectLayer('Player-Spawn').objects;

        this.player = this.physics.add.sprite(this.spawn[0].x, this.spawn[0].y, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.platforms);

        this.cameras.main.startFollow(this.player, false, 0.5, 0.5);

        this.vitorychek = this.add.group({
            allowGravity: false,
            immovable: true
        });

        map.getObjectLayer('Vitory').objects.forEach((colisonGrop) => {
            const curentObject = new Phaser.GameObjects.Rectangle(
                this, colisonGrop.x, colisonGrop.y, colisonGrop.width, colisonGrop.height
            ).setOrigin(0);

            this.physics.add.existing(curentObject, true);
            this.vitorychek.add(curentObject);
        });

        console.log(this.vitorychek);
        console.log(this.physics.world);
        console.log(this.cameras.main);

        this.text = this.add.text(16, 16, '', {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.text.setScrollFactor(0);
        this.updateText();

        this.keyObj = this.input.keyboard.addKey('W', true, false);

        this.events.on('pause', function () {
            console.log('Play scene paused');
        });
        this.events.on('resume', function () {
            console.log('Play scene resumed');
        });
    }

    update() {
        if (this.keyObj.isDown) {
            this.scene.pause();
            this.scene.launch('MenuScene', {'namee': 'LavinScene'});
        }

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
    }

    updateText() {
        this.text.setText(
            `Arrow keys to move. Space to jump. W to pause. Spiked: ${this.spiked}`
        );
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