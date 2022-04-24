class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    
    preload() {
        this.load.image('background', './assets/background.png');
        this.load.image('ground', './assets/ground.png');
        this.load.image('player_red', './assets/player_red.png');
        this.load.image('player_blue', './assets/player_blue.png');
        this.load.image('player_green', './assets/player_green.png');
        this.load.image('ob_red', './assets/obstacle_red.png');
        this.load.image('ob_green', './assets/obstacle_green.png');
        this.load.image('ob_blue', './assets/obstacle_blue.png');
        this.load.image('ob_black', './assets/obstacle_black.png');
    }

    create() {

        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);
        
        //platform group for checking collisions
        this.platforms = this.physics.add.staticGroup();

        //test floor platform
        this.platforms.create(320, 460, 'ground');

        //player character
        this.player = new Player(this, 50, 410, 'player_red', 0, red)
        //makes it so player collides with platforms
        this.physics.add.collider(this.player, this.platforms);

        //game over flag (made gameover a global var so it can accessed by collider function)
        gameOver = false;

        // obstacle group
        this.ob1 = new Obstacle(this, 400, 410, 'ob_green', 0, green);
        this.ob2 = new Obstacle(this, 520, 410, 'ob_blue', 0, blue);
        this.ob3 = new Obstacle(this, 620, 410, 'ob_red', 0, red);
        this.ob4 = new Obstacle(this, 720, 410, 'ob_black', 0, black);
        this.obstacles = this.physics.add.group();
        this.obstacles.add(this.ob1);
        this.obstacles.add(this.ob2);
        this.obstacles.add(this.ob3);
        this.obstacles.add(this.ob4);
        this.obstacles.getChildren().forEach(function (obstacle) {
            obstacle.body.setAllowGravity(false);
            obstacle.setPushable(false);
        }, this);
    
        
        //checks if the test ob and player overlap, if so then it calls the function defined beneath it
        this.physics.add.overlap(this.player, this.obstacles, function(objA, objB) {
            if(objA.color == white || objB.color == white ) {
                //dont need to do anything
                return;
            }
            else if (objA.color == objB.color) {
                //dont need to do anything
                return;
            }
            else {
                //colors were diff so set gameover = true
                gameOver = true;
            }
        });

        //define keys
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        //init score
        this.score = 0;

        //gameover text config
        let textConfig = {
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
        this.gameOverText = this.add.text(game.config.width/10, game.config.height/2, '', textConfig);

    }

    update() {

        //update currently living sprites while game isn't over
        if(!gameOver) {
            this.background.tilePositionX += game.settings.obstacleSpeed;
            this.player.update();
            this.ob1.update();
            this.ob2.update();
            this.ob3.update();
            this.ob4.update();
        }
        //if the game is over, sprite update stops
        //now display game over screen and listen for restart
        else {
            //game over text
            this.gameOverText.text = 'GAME OVER \n SPACE to restart or W for menu';
            //SPACE to restart, W for menu
            if(Phaser.Input.Keyboard.JustDown(keySPACE)){
                this.scene.restart();
            }
            if(Phaser.Input.Keyboard.JustDown(keyW)) {
                this.scene.start("menuScene");
            }
        }

    }
}