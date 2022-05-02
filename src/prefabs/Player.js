class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, color) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.color = color;
        this.moveSpeed = game.settings.playerSpeed;
        this.pickupDuration = game.settings.pickupDuration; 
        this.hasPickup = false;
        this.jumpSFX = scene.sound.add('jump');
        this.powerupSFX = scene.sound.add('activate_powerup');
        this.colorswapSFX = scene.sound.add('color_swap');
    }

    update() { 

        //jumping
        if (Phaser.Input.Keyboard.JustDown(keySPACE) && this.body.touching.down) {
            this.setVelocityY(this.moveSpeed + (this.moveSpeed/8));
            this.jumpSFX.play();
        }

        //handle using ColorsItem
        if(Phaser.Input.Keyboard.JustDown(keyS) && this.hasPickup && this.color != white) {
            this.powerupSFX.play();
            this.hasPickup = false;
            this.prevColor = this.color;
            this.color = white;
            this.scene.time.delayedCall(this.pickupDuration, () => {
                this.color = this.prevColor;
            }, null, this.scene);
        }

        //handle swapping colors
        if(this.color != white) {
            if(Phaser.Input.Keyboard.JustDown(keyD) && this.color != blue) {
                this.color = blue;
                this.colorswapSFX.play();
                //this.setTexture('player_blue');
            }
            if(Phaser.Input.Keyboard.JustDown(keyW) && this.color != green) {
                this.color = green;
                this.colorswapSFX.play();
                //this.setTexture('player_green');
            }
            if(Phaser.Input.Keyboard.JustDown(keyA) && this.color != red) {
                this.color = red;
                this.colorswapSFX.play();
                //this.setTexture('player_red');
            }
        }
    }
}