class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, color) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.color = color;
        this.isJumping = false;
        this.isFalling = false;
        this.hasPickup = false;
        this.moveSpeed = game.settings.playerSpeed;
        this.jumpTime = game.settings.jumpTime;
        this.pickupDuration = game.settings.pickupDuration;
        
    }

    update() {
        /*
        //listen for jump command
        if(Phaser.Input.Keyboard.JustDown(keySPACE) && !this.isJumping) {
            this.isJumping = true;
            this.time.delayedCall(jumptime, () => {
                this.isJumping = false;
                this.isFalling = true;
            }, null, this);
        }
        

        //move up and down if jummping or falling
        if(this.isJummping) {
            this.y -= this.moveSpeed;
        }
        else if(this.isFalling) {
            this.y += this.moveSpeed;
        }

        */
        //handle using ColorsItem
        //left/right movement (right now moves player but might move the obstacles/platforms instead later??)
        if(keyLEFT.isDown) {
            this.setVelocityX(-160);
        } else if(keyRIGHT.isDown) {
            this.setVelocityX(160);
        } else {
            this.setVelocityX(0);
        }

        //jumping
        if (keyUP.isDown && this.body.touching.down) {
            this.setVelocityY(-330);
        }

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
            //change texture to be the blue guy
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

    /*trying to come up with a system for jumping.
    presently my idea is to have a bool for jumping and calc movement while
    jumping, turning into downward momentum halfway through the jump.
    however, the player needs to theoretically fall indefinitely
    therefore, it may be better to used a delayed call and delayed call progress
    for the upward part of the jump. from there, end the jump and let
    a mechanism by where the player falls if they are not in contact with a floor
    underneath them take over. yeah, we have to code that one too >.< 
    i wonder if theres a library function that does this already? can i have 
    basic gravity physics pls phaser or do i have to do it myself
    */
}