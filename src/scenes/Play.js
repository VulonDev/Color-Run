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
        this.load.image('player_rainbow', './assets/player_rainbow.png');
        this.load.image('ob_red', './assets/obstacle_red.png');
        this.load.image('ob_green', './assets/obstacle_green.png');
        this.load.image('ob_blue', './assets/obstacle_blue.png');
        this.load.image('ob_black', './assets/obstacle_black.png');
        this.load.image('pt_blue', './assets/points_blue.png');
        this.load.image('pt_red', './assets/points_red.png');
        this.load.image('pt_green', './assets/points_green.png');
        this.load.image('color_item', './assets/item_color.png');
    }

    create() {

        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);

        // player score
        this.score = 0;

        // score display
        let scoreConfig = {
            fontFamily: 'Impact',
            fontSize: '16px',
            color: '#000000',
            align: 'left',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 500
        }
        this.scoreText = this.add.text(10, 10, "Score: 0", scoreConfig);


        // delayed call score increase - increases score by 10 every second
        this.scoreIncreaseEvent = this.time.addEvent({ delay: 1000, callback: this.increaseScore, callbackScope: this, loop: true });
        
        //platform group for checking collisions
        this.platforms = this.physics.add.staticGroup();

        //test floor platform
        this.platforms.create(320, 460, 'ground');

        //player character
        this.player = new Player(this, 100, 410, 'player_red', 0, red)
        //makes it so player collides with platforms
        this.physics.add.collider(this.player, this.platforms);

        //game over flag (made gameover a global var so it can accessed by collider function)
        gameOver = false;

        //jerry-rigged hack to try and get collecting point items to work
        collectPoint = false;

        //spawn an image to be the icon if a player has a pickup item
        this.colorItemIcon = new ColorIcon(this, 20, 50, 'color_item', 0);

        //group for storing all current color obstacles on screen
        this.obstacles = this.physics.add.group();
        this.physics.add.collider(this.obstacles, this.platforms);

        //group for storing all current point items on screen
        this.pointItems = this.physics.add.group();

        //group for storing all current color items on screen
        this.colorItems = this.physics.add.group();

        //periodically spawns new obstacle
        this.obstacleTimer = this.time.addEvent({ delay: 5000, callback: this.createObstacleLayout, callbackScope: this, loop: true });

        //periodically has a chance of spawning a color item
        this.colorTimer = this.time.addEvent({ delay: game.settings.spawnSpeed, callback: this.createColorsItem, callbackScope: this, loop: true });

        //periodically has a chance to spawn a points item
        this.pointsTimer = this.time.addEvent({ delay: game.settings.spawnSpeed, callback: this.createPointsItem, callbackScope: this, loop: true });
        
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

        //checks if player is picking up a color item
        this.physics.add.overlap(this.player, this.colorItems, function(player, item) {
            if(player.hasPickup) {
                return;
            }
            else {
                item.destroy();
                player.hasPickup = true;
            }
        });

        //checks if player is picking up a points item
        this.physics.add.overlap(this.player, this.pointItems, function(player, item) {
            if (item.color == player.color || player.color == white) {
                item.destroy();
                collectPoint = true;
            }
            else {
                return;
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
            this.colorItemIcon.update();
            this.player.update();
            this.obstacles.getChildren().forEach(function (obstacle) {
                obstacle.update();
            }, this);
            this.pointItems.getChildren().forEach(function(item){
                item.update();
            }, this);
            this.colorItems.getChildren().forEach(function(item){
                item.update();
            }, this);
            if(collectPoint) {
                this.score += game.settings.pickupPoints;
                this.scoreText.text = "Score: " + this.score.toString();
                collectPoint = false;
            }
            if(this.player.hasPickup) {
                this.colorItemIcon.setAlpha(1);
            }
            else{
               this.colorItemIcon.setAlpha(0);
            }
        }
        //if the game is over, sprite update stops
        //now display game over screen and listen for restart
        else {
            //game over text
            this.gameOverText.text = 'GAME OVER \n SPACE to restart or W for menu';
            //stop increasing score
            this.scoreIncreaseEvent.remove();
            //stop spawning new obstacles
            this.obstacleTimer.remove();
            //stop spawing new collectibles
            this.colorTimer.remove();
            this.pointsTimer.remove();
            //SPACE to restart, W for menu
            if(Phaser.Input.Keyboard.JustDown(keySPACE)){
                this.scene.restart();
            }
            if(Phaser.Input.Keyboard.JustDown(keyW)) {
                this.scene.start("menuScene");
            }
        }

    }


    //increases score by 10 and updates it on the screen
    increaseScore() {
        this.score += 10;
        this.scoreText.text = "Score: "+(this.score.toString());
    }
    //increases and updates score when point item is picked up
    collectPointItem() {
        this.score += 50;
        this.scoreText.text = "Score: "+(this.score.toString());
    }

    //creates a new object of random color and adds it to the obstacle group
    createObstacle(x, y) {
        this.type = Math.floor(Math.random() * 3);
       // console.log(this.type);
        switch (this.type) {
            case 0:
                this.obstacles.add(new Obstacle(this, x, y, 'ob_red', 0, red));
                break;
            case 1:
                this.obstacles.add(new Obstacle(this, x, y, 'ob_blue', 0, blue));
                break;
            case 2:
                this.obstacles.add(new Obstacle(this, x, y, 'ob_green', 0, green));
                break;
            //case 3:
                //this.obstacles.add(new Obstacle(this, x, y, 'ob_black', 0, black));
                //break;
            default:
                console.log('create obstacle failure');
        }
    }

    //create a new points pickup item and add it to the points item group
    createPointsItem() {
        this.doSpawn = Math.floor(Math.random() * game.settings.pointSpawnChance);
        let x = 720;
        let y = 350;
        this.doLocation = Math.floor(Math.random() * 3);

        switch(this.doLocation) {
            case 0:
                break;
            case 1:
                x = 675;
                y = 395;
                break;
            case 2:
                x = 800;
                y = 420;
                break;
            default:
                console.log("create points item failure in spawn location");
        }

        if(this.doSpawn == 0) {
            this.type = Math.floor(Math.random() * 3);
            switch (this.type) {
                case 0:
                    this.pointItems.add(new PointsItem(this, x, y, 'pt_green', 0, green));
                    break;
                case 1:
                    this.pointItems.add(new PointsItem(this, x, y, 'pt_blue', 0, blue));
                    break;
                case 2:
                    this.pointItems.add(new PointsItem(this, x, y, 'pt_red', 0, red));
                    break;
                default:
                    console.log("create points item failure");
            }
            
        }


    }

    //create all colors item and add it to the color items group
    createColorsItem() {
        this.doSpawn = Math.floor(Math.random() * game.settings.colorSpawnChance);

        if(this.doSpawn == 0) {
            console.log("spawning color item");
            this.colorItems.add(new ColorsItem(this, 650, 420, 'color_item', 0, white));
        }
    }

    // obstacle layout functions 
    createObstacleLayout0() {
        this.createObstacle(720, 412);
        this.createObstacle(925, 412);
        this.createObstacle(1130, 412);
    }

    createObstacleLayout1() {
        this.createObstacle(720, 412);
        this.obstacles.add(new Obstacle(this, 925, 412, 'ob_black', 0, black));
        this.createObstacle(1130, 412);
    }

    // call random obstacle layout function
    createObstacleLayout() {
        this.type = Math.floor(Math.random() * 2);
       // console.log(this.type);
        switch (this.type) {
            case 0:
                this.createObstacleLayout0();
                break;
            case 1:
                this.createObstacleLayout1();
                break;
            default:
                console.log('create obstacle layout failure');
        }
    }



}