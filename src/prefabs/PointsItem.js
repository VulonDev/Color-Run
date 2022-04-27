//this is the pickup item that grants points if the player is the right color
class PointsItem extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, color) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //is 'existing' some kind of list of currently living sprites? if so thats hella useful. check docs.
        this.points = game.settings.pickupPoints;
        this.color = color;
        this.moveSpeed = game.settings.obstacleSpeed;
        scene.physics.add.existing(this);
    }

    update() {
        this.body.setAllowGravity(false);
        this.setPushable(false);
        this.setMaxVelocity(0,0);
        //move right to left across screen and then destroy when off screen on the left
        this.x -= this.moveSpeed;
        if(this.x <= 0 - this.width) {
            this.destroy();
        }
    }
}