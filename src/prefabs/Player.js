class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, color) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.color = color;
        this.hasPickup = false;
        this.moveSpeed = game.settings.playerSpeed;
        this.jumpTime = game.settings.jumpTime;
        this.pickupDuration = game.settings.pickupDuration; 
    }

    update() {       
        //left/right movement (right now moves player but might move the obstacles/platforms instead later??)
        // left/right dsabled for now (i dont think we want this in the final version?)
        // if(keyLEFT.isDown) {
            // this.setVelocityX(-160);
        // } else if(keyRIGHT.isDown) {
            // this.setVelocityX(160);
        // } else {
            // this.setVelocityX(0);
        // }

        //jumping
        if (keyUP.isDown && this.body.touching.down) {
            this.setVelocityY(-330);
        }

        //handle using ColorsItem
        if(Phaser.Input.Keyboard.JustDown(keyS) && this.hasPickup) {
            this.hasPickup = false;
            let prevColor = color;
            this.color = white;
            this.time.delayedCall(this.pickupDuration, () => {
                this.color = prevColor;
            }, null, this);
        }

        //handle swapping colors
        if(Phaser.Input.Keyboard.JustDown(keyA) && this.color != blue) {
            this.color = blue;
            this.setTexture('player_blue');
        }
        if(Phaser.Input.Keyboard.JustDown(keyW) && this.color != green) {
            this.color = green;
            this.setTexture('player_green');
        }
        if(Phaser.Input.Keyboard.JustDown(keyD) && this.color != red) {
            this.color = red;
            this.setTexture('player_red');
        }

    }
}