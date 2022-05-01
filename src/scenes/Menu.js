class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {

    }

    create() {
        //used for creating rainbow effect on title text
        this.colorVar = 0;
        this.colorWheel = Phaser.Display.Color.HSVColorWheel();

        let titleConfig = {
            fontFamily: 'Impact',
            fontSize: '84px',
            color: '#000000',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 600,
            fixedHeight: 0,
            stroke: '#ffffff',
            strokeThickness: 12
        }
        this.titleText = this.add.text(game.config.width/2, 100, 'COLOR GAME', titleConfig).setOrigin(0.5);

        let menuConfig = {
            fontFamily: 'BarlowCondensed-Regular',
            fontSize: '36px',
            color: '#000000',
            backgroundColor: '#DDDDDD',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 600,
            fixedHeight: 0,
        }
        this.add.text(game.config.width/2, 200, 'Press SPACE to play!', menuConfig).setOrigin(0.5);

        //How to Play/Controls backgrounds + header text
        menuConfig.fixedWidth = 290;
        menuConfig.fixedHeight = 220;
        menuConfig.fontSize = '28px';
        this.add.text(165, 350, 'How to Play:', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 + 155, 350, 'Controls:', menuConfig).setOrigin(0.5);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //How to Play text
        menuConfig.backgroundColor = '';
        menuConfig.align = 'left';
        menuConfig.fontSize = '24px';
        menuConfig.color = '#DD0000';
        menuConfig.fixedWidth = 250
        this.add.text(165, 380, '> Swap colors to move \n   through obstacles', menuConfig).setOrigin(0.5);
        menuConfig.color = '#00DD00';
        this.add.text(165, 439, '> Jump to avoid obstacles \n   and grab powerups', menuConfig).setOrigin(0.5);
        menuConfig.color = '#0000DD';
        this.add.text(165, 500, '> Stay alive and grab point \n   items to increase your score', menuConfig).setOrigin(0.5);

        //Controls text (I could not find a better way to do this >_>)
        menuConfig.color = '#000000'
        this.add.text(475, 380, '>', menuConfig).setOrigin(0.5);
        menuConfig.color = '#00DD00'
        this.add.text(490, 380, 'W', menuConfig).setOrigin(0.5);
        menuConfig.color = '#000000'
        this.add.text(505, 380, ' + ', menuConfig).setOrigin(0.5);
        menuConfig.color = '#DD0000'
        this.add.text(520, 380, ' A ', menuConfig).setOrigin(0.5);
        menuConfig.color = '#000000'
        this.add.text(535, 380, ' + ', menuConfig).setOrigin(0.5);
        menuConfig.color = '#0000DD'
        this.add.text(550, 380, ' D ', menuConfig).setOrigin(0.5);
        menuConfig.color = '#000000'
        this.add.text(565, 380, ' to swap colors', menuConfig).setOrigin(0.5);
        this.add.text(475, 439, '> SPACE to jump', menuConfig).setOrigin(0.5);
        this.add.text(475, 500, '> S to use powerup', menuConfig).setOrigin(0.5);


    }

    update() {
        //Makes title text rainbow!!
        var top = this.colorWheel[this.colorVar].color;
        var bottom = this.colorWheel[359 - this.colorVar].color;
        this.titleText.setTint(top, bottom, top, bottom);
        this.colorVar++;
        if (this.colorVar == 360) {
            this.colorVar = 0;
        }

        //start game when spacebar pressed
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start("playScene");
        }
    }
}