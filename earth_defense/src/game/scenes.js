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
        timeToRunner: 1700,
        timeDecrease: 15,
        timeToDecrease: 1300,
        score: 0,
        missesLeft: 2,
        over: false,

        init: function() {
            this.world = new game.World();

            var background = new game.Sprite('background');
            background.scale.x = game.system.width / background.width;
            background.scale.y = game.system.height / background.height;

            this.stage.addChild(background);

            this.rockGrabbed = false;
            this.lastX = 0;
            this.lastY = 0;

            this.distancesX = [];
            this.distancesY = [];

            this.runnerTimer = this.addTimer(this.timeToRunner + 3000, this.createRunner.bind(this), false);
            this.difficultyTimer = this.addTimer(this.timeToDecrease + 3000, this.decreaseTime.bind(this), false);

            this.createRock();

            this.rockX = this.rock.sprite.position.x;
            this.rockY = this.rock.sprite.position.y;

            this.circle = new game.Sprite('redcircle');

            this.circle.scale.x = 1.5
            this.circle.scale.y = 1.5

            this.circle.position.x = this.rockX - (this.circle.width / 2);
            this.circle.position.y = this.rockY - (this.circle.height / 2) + 50;

            this.missesText = new game.BitmapText("", {font: 'Arialred'});

            this.stage.addChild(this.missesText);

            this.stage.addChild(this.circle);

            var text1 = new game.BitmapText("Swipe the satellite", {font: 'Arialwhite'});
            var text2 = new game.BitmapText("to shoot a laser", {font: 'Arialwhite'});

            text1.dispose = function () {
                game.scene.stage.removeChild(this);
            }

            text2.dispose = function () {
                game.scene.stage.removeChild(this);
            }

            text1.position.x = (game.system.width / 2) - (text1.textWidth / 2);
            text1.position.y = game.system.height / 2 - text1.textHeight / 2;

            text2.position.x = (game.system.width / 2) - (text2.textWidth / 2);
            text2.position.y = game.system.height / 2 + text1.textHeight / 2;

            this.scoreSprite = new game.Sprite('score');
            this.scoreSprite.position.x = 8;
            this.scoreSprite.position.y = 12;

            this.stage.addChild(this.scoreSprite);

            this.scoreText = new game.BitmapText("" + this.score, {font:'Arialwhite'});
            this.scoreText.position.x = this.scoreSprite.position.x + 130;
            this.scoreText.position.y = this.scoreSprite.position.y - 2;

            this.stage.addChild(this.scoreText);

            this.stage.addChild(text1);
            this.stage.addChild(text2);
            this.addTimer(3000, text1.dispose.bind(text1), false);
            this.addTimer(3000, text2.dispose.bind(text2), false);
        },

        createRock: function()
        {
            if (!this.over)
                this.rock = new Rock();
        },

        createRunner: function()
        {
            new Runner();

            this.runnerTimer = this.addTimer(this.timeToRunner, this.createRunner.bind(this), false);
        },

        decreaseTime: function()
        {
            this.timeToRunner -= this.timeDecrease;

            this.difficultyTimer = this.addTimer(this.timeToDecrease, this.decreaseTime.bind(this), false);
        },

        missedRunner: function()
        {
            this.missesLeft -= 1;

            if (this.missesLeft == 1)
            {
                this.missesText.setText("X");
            }
            else if (this.missesLeft == 0)
            {
                this.missesText.setText("X X");
            }
            else if (this.missesLeft == -1)
            {
                this.missesText.setText("X X X");
            }

            if (this.missesText.parent)
            {
                this.missesText.updateTransform();
                this.missesText.position.x = (game.system.width / 2) - (this.missesText.textWidth / 2)
                this.missesText.position.y = 10;
            }

            if (this.missesLeft == -1) {
                this.addTimer(1000, this.gameOver.bind(this), false);
            }
        },

        gameOver: function()
        {
            this.over = true;
            this.rockGrabbed = false;

            this.removeTimer(this.difficultyTimer);
            this.removeTimer(this.runnerTimer);

            this.clearStage();

            var background = new game.Sprite('background');
            background.scale.x = game.system.width / background.width;
            background.scale.y = game.system.height / background.height;

            this.stage.addChild(background);

            var scoreboard = new game.Sprite('scoreboard', 0, 0, { interactive: true,
                    mousedown: function() {
                    game.analytics.event('restart');
                    game.system.setScene(SceneGame);
                }
            });

            scoreboard.position.x = (game.system.width / 2) - (scoreboard.width / 2);
            scoreboard.position.y = (game.system.height / 2) - (scoreboard.height / 2);

            this.stage.addChild(scoreboard);

            var highScore = parseInt(game.storage.get('highScore')) || 0;
            if (this.score > highScore) game.storage.set('highScore', this.score);

            var scoreText = new game.BitmapText("" + this.score,
                            {font: 'Arialwhite'});

            scoreText.position.x = (game.system.width / 2) - (scoreText.textWidth / 2) + 15;
            scoreText.position.y = game.system.height / 2 - 42;

            var highScoreText = new game.BitmapText("" + highScore, {font: 'Arialwhite'});

            highScoreText.position.x = scoreText.position.x;
            highScoreText.position.y = scoreText.position.y + 70;

            this.stage.addChild(scoreText);
            this.stage.addChild(highScoreText);

        },

        clearStage: function()
        {
            while(this.stage.children.length > 0)
            {
                this.stage.removeChild(this.stage.children[0]);
            }
        },

        mousedown: function(event) {

            var position = event.global;
            var rockX = this.rock.sprite.position.x - (this.rock.sprite.width / 2);
            var rockY = this.rock.sprite.position.y - (this.rock.sprite.height / 2);

            if ((Math.abs(position.x - rockX) < this.rock.sprite.width * 3 &&
                Math.abs(position.y - rockY) < this.rock.sprite.height * 3) &&
                !this.rock.touched)
            {
                this.rockGrabbed = true;
                this.rock.touchStart();

                this.lastX = position.x;
                this.lastY = position.y;

                this.rock.body.velocity.x = 0;
                this.rock.body.velocity.y = 0;
            }

        },

        mousemove: function(event) {

            if (this.rockGrabbed)
            {
                var position = event.global;

                var distance = Math.pow((position.x - this.rockX), 2) + Math.pow((position.y - this.rockY), 2);

                distance = Math.sqrt(distance);

                if (distance > this.circle.width / 2)
                {
                    this.mouseup();
                    return;
                }

                this.rock.body.position.x += position.x - this.lastX;
                this.rock.body.position.y += position.y - this.lastY;

                this.distancesX.push(position.x - this.lastX);
                this.distancesY.push(position.y - this.lastY);

                if (this.distancesX.length > 20)
                {
                    this.distancesX.splice(0, 1);
                    this.distancesY.splice(0, 1);
                }

                this.lastX = position.x;
                this.lastY = position.y;

                var curRockX = this.rock.sprite.position.x;
                var curRockY = this.rock.sprite.position.y;

                var distance = Math.pow((curRockX - this.rockX), 2) + Math.pow((curRockY - this.rockY), 2);

                distance = Math.sqrt(distance);

                if (distance > this.circle.width / 2)
                {
                    this.mouseup();
                }
            }
        },

        mouseup: function() {


            var speed = 30;

            if (this.rockGrabbed)
            {
                this.rockGrabbed = false;

                var velocityX = 0;
                var velocityY = 0;

                for (var i = 0; i < this.distancesX.length; i++)
                {
                        velocityX += this.distancesX[i];
                        velocityY += this.distancesY[i];
                }

                if (this.distancesX.length > 0)
                    velocityX /= this.distancesX.length;
                else
                    velocityX = 0;

                if (this.distancesY.length > 0)
                    velocityY /= this.distancesY.length;
                else
                    velocityY = 0;

                velocityX *= speed;
                velocityY *= speed;

                if (velocityX > 700)
                    velocityX = 700;

                if (velocityY > 700)
                    velocityY = 700;

                if (velocityY < -700)
                    velocityY = -700;

                if (velocityX < -700)
                    velocityX = -700;

                this.rock.body.velocity.x = velocityX;
                this.rock.body.velocity.y = velocityY;

                tween = new game.Tween(this.rock.sprite)
                    .to({rotation: 10}, 3000);
                tween.start();

                if (velocityX == 0 && velocityY == 0)
                    this.rock.dispose();

                this.distancesX = [];
                this.distancesY = [];


                this.addTimer(3000, this.rock.dispose.bind(this.rock), false);
                this.addTimer(700, this.createRock.bind(this), false);
            }
        }
    });

});