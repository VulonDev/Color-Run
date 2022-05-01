class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    
    preload() {
        // load assets
        this.load.image('background', './assets/background.png');
        this.load.image('ground', './assets/ground.png');
        this.load.image('player', './assets/player.png');
        this.load.image('ob_red', './assets/obstacle_red.png');
        this.load.image('ob_red_h', './assets/obstacle_red_horiz.png');
        this.load.image('ob_green', './assets/obstacle_green.png');
        this.load.image('ob_green_h', './assets/obstacle_green_horiz.png');
        this.load.image('ob_blue', './assets/obstacle_blue.png');
        this.load.image('ob_blue_h', './assets/obstacle_blue_horiz.png');
        this.load.image('ob_black', './assets/obstacle_black.png');
        this.load.image('ob_black_h', './assets/obstacle_black_horiz.png');
        this.load.image('pt_blue', './assets/points_blue.png');
        this.load.image('pt_red', './assets/points_red.png');
        this.load.image('pt_green', './assets/points_green.png');
        this.load.image('color_item', './assets/item_color.png');

        // load sprite sheet animations
        this.load.spritesheet('player_red_walk', './assets/player_red.png', {frameWidth: 35, frameHeight: 35, startFrame: 0, endFrame: 1});
        this.load.spritesheet('player_green_walk', './assets/player_green.png', {frameWidth: 35, frameHeight: 35, startFrame: 0, endFrame: 1});
        this.load.spritesheet('player_blue_walk', './assets/player_blue.png', {frameWidth: 35, frameHeight: 35, startFrame: 0, endFrame: 1});
        this.load.spritesheet('player_rainbow_glow', './assets/player_rainbow .png', {frameWidth: 40, frameHeight: 40, startFrame: 0, endFrame: 2});

        // load audio
        this.load.audio('background_music', './assets/sfx/game_music.mp3');
    }

    create() {

        // scrolling tile sprite background
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);

        // background music
        this.music = this.sound.add('background_music', { loop: true });
        this.music.play();

        // player score
        this.score = 0;

        // score display
        let scoreConfig = {
            fontFamily: 'Impact',
            fontSize: '16px',
            color: '#b3b3b3',
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
        this.player = new Player(this, 100, 400, 'player', 0, red).setOrigin(0, 0);
        this.player.alpha = 0;
        // create animations
        this.anims.create({
            key: 'red_walk',
            frames: this.anims.generateFrameNumbers('player_red_walk', {start: 0, end: 1, first: 0}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'green_walk',
            frames: this.anims.generateFrameNumbers('player_green_walk', {start: 0, end: 1, first: 0}),
            frameRate: 8,
            repeat: -1
        });       
        this.anims.create({
            key: 'blue_walk',
            frames: this.anims.generateFrameNumbers('player_blue_walk', {start: 0, end: 1, first: 0}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'rainbow_glow',
            frames: this.anims.generateFrameNumbers('player_rainbow_glow', {start: 0, end: 2, first: 0}),
            frameRate: 8,
            repeat: -1
        }); 
        // create animation sprites
        this.red_anim = this.add.sprite(this.player.x, this.player.y, 'player_red_walk').setOrigin(0, 0);
        this.red_anim.play('red_walk');
        this.green_anim = this.add.sprite(this.player.x, this.player.y, 'player_green_walk').setOrigin(0, 0);
        this.green_anim.play('green_walk');
        this.blue_anim = this.add.sprite(this.player.x, this.player.y, 'player_blue_walk').setOrigin(0, 0);
        this.blue_anim.play('blue_walk');
        this.rainbow_anim = this.add.sprite(this.player.x, this.player.y, 'player_rainbow_glow').setOrigin(0, 0);
        this.rainbow_anim.play('rainbow_glow');

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
        this.obstacleTimer = this.time.addEvent({ delay: game.settings.spawnSpeed *5, callback: this.createObstacleLayout, callbackScope: this, loop: true });

        //periodically has a chance of spawning a color item
        this.colorTimer = this.time.addEvent({ delay: game.settings.spawnSpeed, callback: this.createColorsItem, callbackScope: this, loop: true });

        //periodically has a chance to spawn a points item
        this.pointsTimer = this.time.addEvent({ delay: game.settings.spawnSpeed, callback: this.createPointsItem, callbackScope: this, loop: true });

        //periodically increases the game speed/difficulty
        this.difficultyIncreaseEvent = this.time.addEvent ({ delay: game.settings.difficultySpeed, callback: this.increaseSpeed, callbackScope: this, loop: true});
        
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

        // ensures that no color items spawn inside of any obstacles
        this.physics.add.overlap(this.colorItems, this.obstacles, function(item, ob) {
            item.destroy();
        });

        // ensures that no point items spawn inside of any obstacles
        this.physics.add.overlap(this.pointItems, this.obstacles, function(item, ob) {
            item.destroy();
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
            // set animation color
            if (this.player.color == red) {
                this.red_anim.alpha = 1;
                this.green_anim.alpha = 0;
                this.blue_anim.alpha = 0;
                this.rainbow_anim.alpha = 0;
            }
            if (this.player.color == green) {
                this.red_anim.alpha = 0;
                this.green_anim.alpha = 1;
                this.blue_anim.alpha = 0;
                this.rainbow_anim.alpha = 0;
            }
            if (this.player.color == blue) {
                this.red_anim.alpha = 0;
                this.green_anim.alpha = 0;
                this.blue_anim.alpha = 1;
                this.rainbow_anim.alpha = 0;
            }
            if (this.player.color == white) {
                this.red_anim.alpha = 0;
                this.green_anim.alpha = 0;
                this.blue_anim.alpha = 0;
                this.rainbow_anim.alpha = 1;
            }
            // update animation positions
            this.red_anim.x = this.player.x;
            this.red_anim.y = this.player.y;
            this.green_anim.x = this.player.x;
            this.green_anim.y = this.player.y;
            this.blue_anim.x = this.player.x;
            this.blue_anim.y = this.player.y;
            this.rainbow_anim.x = this.player.x;
            this.rainbow_anim.y = this.player.y;

            // update obstacles
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
            // stop increasing speed
            this.difficultyIncreaseEvent.remove();
            // stop animations
            this.red_anim.stop();
            this.green_anim.stop();
            this.blue_anim.stop();
            this.rainbow_anim.stop();
            //stop music
            this.music.stop();
            //SPACE to restart, W for menu
            if(Phaser.Input.Keyboard.JustDown(keySPACE)){
                this.scene.restart();
            }
            if(Phaser.Input.Keyboard.JustDown(keyW)) {
                this.scene.start("menuScene");
            }
        }

    }

    //increase game speed over time to add difficulty scaling
    increaseSpeed() {
        if(game.settings.spawnSpeed > 750) {
            game.settings.obstacleSpeed += 0.05;
            game.settings.spawnSpeed -= 50;
            game.settings.pickupDuration -= 50;
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
    createVerticalObstacle(x, y) {
        this.type = Math.floor(Math.random() * 3);
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
                console.log('create vertical obstacle failure');
        }
    }
    createHorizObstacle(x, y) {
        this.type = Math.floor(Math.random() * 3);
        switch (this.type) {
            case 0:
                this.obstacles.add(new Obstacle(this, x, y, 'ob_red_h', 0, red));
                break;
            case 1:
                this.obstacles.add(new Obstacle(this, x, y, 'ob_blue_h', 0, blue));
                break;
            case 2:
                this.obstacles.add(new Obstacle(this, x, y, 'ob_green_h', 0, green));
                break;
            //case 3:
                //this.obstacles.add(new Obstacle(this, x, y, 'ob_black_h', 0, black));
                //break;
            default:
                console.log('create horizontal obstacle failure');
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
            this.colorItems.add(new ColorsItem(this, 650, 420, 'color_item', 0, white));
        }
    }

    // obstacle layout functions 
    createObstacleLayout0() {
        this.createVerticalObstacle(720, 412);
        this.createVerticalObstacle(970, 412);
        this.createVerticalObstacle(1220, 412);
    }

    createObstacleLayout1() {
        this.createVerticalObstacle(720, 412);
        this.obstacles.add(new Obstacle(this, 970, 412, 'ob_black', 0, black));
        this.createVerticalObstacle(1220, 412);
    }

    createObstacleLayout2() {
        this.createVerticalObstacle(720, 412);
        this.createVerticalObstacle(720, 362);
        this.createHorizObstacle(760, 433);
        this.createHorizObstacle(850, 433);
    }

    createObstacleLayout3() {
        this.createVerticalObstacle(720, 412);
        this.createVerticalObstacle(720, 362);
        this.createVerticalObstacle(970, 412);
        this.createVerticalObstacle(970, 362);
        this.createVerticalObstacle(1220, 412);
        this.createVerticalObstacle(1220, 362);
    }

    createObstacleLayout4(){
        this.createVerticalObstacle(720, 412);
        this.obstacles.add(new Obstacle(this, 720, 362, 'ob_black', 0, black));
        this.createVerticalObstacle(970, 412);
        this.obstacles.add(new Obstacle(this, 970, 362, 'ob_black', 0, black));
        this.createVerticalObstacle(1220, 412);
        this.obstacles.add(new Obstacle(this, 1220, 362, 'ob_black', 0, black));
    }

    createObstacleLayout5(){
        this.obstacles.add(new Obstacle(this, 720, 412, 'ob_black', 0, black));
        this.createVerticalObstacle(720, 362);
        this.createVerticalObstacle(970, 412);
        this.obstacles.add(new Obstacle(this, 970, 362, 'ob_black', 0, black));
        this.obstacles.add(new Obstacle(this, 1220, 412, 'ob_black', 0, black));
        this.createVerticalObstacle(1220, 362);
    }

    // call random obstacle layout function
    createObstacleLayout() {
        this.type = Math.floor(Math.random() * 6);
        switch (this.type) {
            case 0:
                this.createObstacleLayout0();
                break;
            case 1:
                this.createObstacleLayout1();
                break;
            case 2:
                this.createObstacleLayout2();
                break;
            case 3:
                this.createObstacleLayout3();
                break;
            case 4:
                this.createObstacleLayout4();
                break;
            case 5:
                this.createObstacleLayout5();
                break;
            default:
                console.log('create obstacle layout failure');
        }
    }



}