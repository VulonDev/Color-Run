//an icon for displaying whether the player has an item pickup
class ColorIcon extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    update() {
        this.body.setAllowGravity(false);
        this.setPushable(false);
        this.setMaxVelocity(0,0);
    }
}