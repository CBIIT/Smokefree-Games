game.module(
    'game.scenes'
)
.require(
    'engine.scene',
    'engine.renderer'
)
.body(function() {

    SceneGame = game.Scene.extend({
        backgroundColor: 0xC0C0C0,
        score: 0,
        started: false,

        init: function() {

            this.playerTurn = 0

            var background = new game.Sprite('background');
            background.scale.x = game.system.width / background.width;
            background.scale.y = game.system.height / background.height;

            this.stage.addChild(background);

            this.greentile = new GreenTile(0, 0)

            this.greentile.sprite.position.x = (game.system.width / 2) - ((this.greentile.sprite.width) + 15)
            this.greentile.sprite.position.y = (game.system.height / 2) - ((this.greentile.sprite.height) + 15) + 100

            this.redtile = new RedTile(0, 0)

            this.redtile.sprite.position.x = this.greentile.sprite.position.x + this.greentile.sprite.width + 30
            this.redtile.sprite.position.y = this.greentile.sprite.position.y

            this.bluetile = new BlueTile(0, 0)

            this.bluetile.sprite.position.x = this.greentile.sprite.position.x
            this.bluetile.sprite.position.y = this.greentile.sprite.position.y + this.greentile.sprite.height + 30

            this.yellowtile = new YellowTile(0, 0)

            this.yellowtile.sprite.position.x = this.bluetile.sprite.position.x + this.bluetile.sprite.width + 30
            this.yellowtile.sprite.position.y = this.bluetile.sprite.position.y

            this.scoreSprite = new game.Sprite('score');
            this.scoreSprite.position.x = (game.system.width / 2) - (this.scoreSprite.width / 2);
            this.scoreSprite.position.y = game.system.height - (this.scoreSprite.height * 2);

            this.stage.addChild(this.scoreSprite);

            this.scoreText = new game.BitmapText("" + this.score, {font:'Arialwhite'});
            this.scoreText.position.x = this.scoreSprite.position.x + (this.scoreSprite.width / 2) - (this.scoreText.textWidth / 2) + 80;
            this.scoreText.position.y = this.scoreSprite.position.y + (this.scoreSprite.height / 2) - (this.scoreText.textHeight / 2) + 2;

            this.stage.addChild(this.scoreText);

            this.sequence = []
            this.sequencePosition = 0
            this.playerSequence = []

            this.startText = new game.BitmapText("Tap to start", {font: 'Arialblack'});
            this.startText.position.x = (game.system.width / 2) - (this.startText.textWidth / 2);
            this.startText.position.y = this.yellowtile.sprite.position.y + this.yellowtile.sprite.height + 5;

            this.stage.addChild(this.startText);

        },

        randomNumber: function()
        {
            return parseInt(Math.random() * 4)
        },

        tileTouched: function(num)
        {
            if (this.playerTurn == 1)
            {
                this.lightTile(num)

                this.playerSequence.push(num)

                var position = this.playerSequence.length - 1

                if (this.playerSequence[position] != this.sequence[position])
                {
                    this.playerTurn = 0
                    this.addTimer(1000, this.gameOverScreen.bind(this), false)
                }

                if (this.playerSequence.length == this.sequence.length)
                {
                    this.addPoints(1)
                    this.playerSequence = []
                    this.startComputerTurn()
                }
            }
        },

        addPoints: function(points)
        {
            this.score += points;
            this.scoreText.setText("" + this.score);
        },

        gameOverScreen: function()
        {
            this.clearStage()

            var background = new game.Sprite('background');
            background.scale.x = game.system.width / background.width;
            background.scale.y = game.system.height / background.height;

            this.stage.addChild(background);

            var gameover = new game.Sprite('gameover', 0, 0, { interactive: true,
                    scale: {x: 2, y: 2},
                    mousedown: function() {
                    game.analytics.event('restart');
                    game.system.setScene(SceneGame);
                }
            });

            gameover.scale.x = 2;
            gameover.scale.y = 2;

            gameover.position.x = (game.system.width / 2) - (gameover.width / 2);
            gameover.position.y = game.system.height / 2 - (gameover.height / 2);

            this.stage.addChild(gameover);

//            if (game.device.android)
//                window.cpjs.sendToAndroid(this.score)
//            else if (game.device.ios)
//                window.location = "NCIGAME://simon_says/" + this.score

            var highScore = parseInt(game.storage.get('highScore')) || 0;
            if (this.score > highScore) game.storage.set('highScore', this.score);

            var scoreText = new game.BitmapText("" + this.score,
                            {font: 'Arialblack'});

            scoreText.scale.x = .6;
            scoreText.scale.y = .6;

            scoreText.position.x = (game.system.width / 2) - (scoreText.textWidth / 2) + 75;
            scoreText.position.y = game.system.height / 2 + 53;

            var highScoreText = new game.BitmapText("" + highScore, {font: 'Arialblack'});

            highScoreText.scale.x = scoreText.scale.x;
            highScoreText.scale.y = scoreText.scale.y;

            highScoreText.position.x = scoreText.position.x;
            highScoreText.position.y = scoreText.position.y + 33;

            this.stage.addChild(scoreText);
            this.stage.addChild(highScoreText);

        },

        clearStage: function()
        {
            while(this.stage.children.length > 0)
            {
                this.stage.removeChild(this.stage.children[0]);
            }

            for(var i = 0; i < this.timers.length; i++)
            {
                this.removeTimer(this.timers[i], false)
            }
        },

        lightSequence: function()
        {
            this.lightTile(this.sequence[this.sequencePosition])

            this.sequencePosition++

            if (this.sequencePosition < this.sequence.length)
            {
                this.addTimer(600, this.lightSequence.bind(this), false)
            }
            else
            {
                this.addTimer(600, this.startPlayerTurn.bind(this), false)
                this.sequencePosition = 0
            }
        },

        startPlayerTurn: function()
        {
            this.playerTurn = 1
        },

        startComputerTurn: function()
        {
            this.playerTurn = 0

            this.sequence.push(this.randomNumber())

            this.addTimer(1200, this.lightSequence.bind(this), false)
        },

        lightTile: function(num)
        {
            if (num == 0)
            {
                this.greentile.light()
            }
            else if (num == 1)
            {
                this.redtile.light()
            }
            else if (num == 2)
            {
                this.bluetile.light()
            }
            else
            {
                this.yellowtile.light()
            }
        },

        mousedown: function(event) {

            if (this.started) {
                return;
            }

            this.stage.removeChild(this.startText);

            this.startComputerTurn();

            this.started = true;

        }


    });

});