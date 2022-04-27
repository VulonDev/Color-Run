//this is the pickup item that makes the player temporarily all colors
class ColorsItem extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, color) {
        super(scene, x, y, texture, frame);
        this.color = color;
        this.moveSpeed = game.settings.obstacleSpeed;
        scene.physics.add.existing(this);
    }

    update() {
        this.body.setAllowGravity(false);
        this.setPushable(false); 
        this.setMaxVelocity(0,0);
        //move right to left across the screen, then destroy when offscreen on the left
        this.x -= this.moveSpeed;
        if(this.x <= 0 - this.width) {
            this.destroy();
        }
    }
}