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

        const tileset = map.addTilesetImage('jefrens_platformer', 'tiles');

        this.initAnims();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);        
        
        map.createLayer('Bakground-1', tileset);
        map.createLayer('Forgroudn-1', tileset);
        map.createLayer('Platforms-Visual', tileset);
        map.createLayer('Vitory-mark', tileset);
        this.platforms = map.createLayer('Platforms-Solid', tileset);
        this.platforms.setCollisionByExclusion(-1, true);

        this.colison = this.add.group({
            allowGravity: false,
            immovable: true
        });

        map.getObjectLayer('Colison').objects.forEach((colisonGrop) => {
            const curentObject = new Phaser.GameObjects.Rectangle(
                this, colisonGrop.x, colisonGrop.y, colisonGrop.width, colisonGrop.height
            ).setOrigin(0);

            this.physics.add.existing(curentObject, true);
            this.colison.add(curentObject);
        });

        this.spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        map.getObjectLayer('Spiks').objects.forEach((spike) => {
            const spikeSprite = this.spikes
                .create(spike.x, spike.y - spike.height, 'spike')
                .setOrigin(0);
            spikeSprite.body
                .setSize(spike.width, spike.height - 20)
                .setOffset(0, 20);
        });

        this.spawn = map.getObjectLayer('Player-Spawn').objects;
        this.spawn = this.spawn[0];

        this.player = this.physics.add.sprite(this.spawn.x, this.spawn.y-30, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        
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
        
        this.physics.add.collider(
            this.player,
            this.spikes,
            this.playerHit,
            null,
            this
        );
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.colison);
        
        this.text = this.add.text(16, 16, '', {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.text.setScrollFactor(0);
        this.updateText();
        
        this.keyObj = this.input.keyboard.addKey('W', true, false);
        //this.stoplavintest = this.input.keyboard.addKey('I', true, false);
                
        this.events.on('pause', function () {
            console.log('Play scene paused');
        });
        this.events.on('resume', function () {
            console.log('Play scene resumed');
        });

        //gör lavinen
        this.lavins = this.physics.add.group({
            allowGravity: false,
            immovable: false
        });

        let lavinbody = new Phaser.GameObjects.Rectangle(
            this, 0, 0, 30, map.heightInPixels
        );
        this.physics.add.existing(lavinbody);
        this.lavins.add(lavinbody);
        this.lavins.setY(map.heightInPixels/2);
        this.physics.add.overlap(this.player, this.lavins.children.entries[0], this.lavinhits, null, this);

        var lavintextur1 = this.add.rectangle(0, -1, 100, 172, 0xffffff).setOrigin(0.5, 0);
        var lavintextur2 = this.add.rectangle(0, 170, 100, 172, 0xffffff).setOrigin(0.5, 0);
        var lavintextur3 = this.add.rectangle(0, 341, 100, 172, 0xffffff).setOrigin(0.5, 0);
        this.lavins.add(lavintextur1);
        this.lavins.add(lavintextur2);
        this.lavins.add(lavintextur3);

        this.physics.add.overlap(this.player, this.vitorychek, this.lodeNextMap, null, this);
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

        this.lavins.setVelocityX(20);
        
    }

    updateText() {
        this.text.setText(
            `Arrow keys to move. Space to jump. W to pause. Spiked: ${this.spiked}`
        );
    }

    playerHit(player, spike) {
        this.spiked++;
        player.setVelocity(0, 0);
        player.setX(this.spawn.x);
        player.setY(this.spawn.y-30);
        player.play('idle', true);
        let tw = this.tweens.add({
            targets: player,
            alpha: { start: 0, to: 1 },
            tint: { start: 0xff0000, to: 0xffffff },
            duration: 100,
            ease: 'Linear',
            repeat: 5
        });
        this.updateText();
        this.lavins.setX(-10);
    }

    lavinhits(player, lavins) {
        player.setVelocity(0, 0);
        player.setX(this.spawn.x);
        player.setY(this.spawn.y-30);
        player.play('idle', true);
        this.lavins.setX(0);
    }

    lodeNextMap() {
        this.scene.start('PreloadScene', {
            'namee': 'LevelOne',
            'maap': '/tilemaps/level-1.json',
            'mapkye': 'mepp'
        });
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