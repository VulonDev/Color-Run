class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {

    }

    create() {
        let menuConfig = {
            fontFamily: 'Impact',
            fontSize: '28px',
            color: '#FFFFBB',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 500
        }
        this.add.text(game.config.width/2, game.config.height/2, 'color GAME', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/1.5, 'press SPACE to start', menuConfig).setOrigin(0.5);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start("playScene");
        }
    }
}