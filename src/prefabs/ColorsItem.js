//this is the pickup item that makes the player temporarily all colors
class ColorsItem extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, color) {
        super(scene, x, y, texture, frame);
        this.color = color;
        this.moveSpeed = game.settings.obstacleSpeed;
    }

    update() {
        //move right to left across the screen, then destroy when offscreen on the left
        this.x -= this.moveSpeed;
        if(this.x <= 0 - this.width) {
            this.destroy();
        }
    }
}