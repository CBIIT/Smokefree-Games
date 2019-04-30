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
        newBox: false,
        moveTime: 140,
        score: 0,
        ending: "Game over.",
        over: false,
        swipeWait: false,

        init: function() {

            var background = new game.Sprite('background');
            background.scale.x = game.system.width / background.width;
            background.scale.y = game.system.height / background.height;

            this.stage.addChild(background);

            var padding = 150;

            var startX = (game.system.width / 2) - ((padding * 4) / 2) + 15;
            var startY = (game.system.height / 2) - ((padding * 4) / 2);

            this.boxes = [];
            this.spaces = [];

            for (var i = 0; i < 4; i++)
            {
                this.boxes.push([]);
                this.spaces.push([]);
            }

            for (var i = 0; i < 4; i++)
            {
                for (var j = 0; j < 4; j++)
                {
                    var sprite = new game.Sprite('space');
                    sprite.position.x = startX + (j * padding);
                    sprite.position.y = startY + (i * padding);

                    this.stage.addChild(sprite);

                    this.spaces[i].push(sprite);

                    this.boxes[i].push(0);
                }
            }

            this.introText = new game.BitmapText("Swipe up, down, left, or right", {font:'Arialblack'});

            this.sizeText(this.introText);

            this.introText.position.x = (game.system.width / 2) - ((this.introText.textWidth * this.introText.scale.x) / 2);
            this.introText.position.y = 70;

            this.scoreSprite = new game.Sprite('score');
            this.scoreSprite.position.x = (game.system.width / 2) - (this.scoreSprite.width / 2);
            this.scoreSprite.position.y = game.system.height - (this.scoreSprite.height * 2);

            this.stage.addChild(this.scoreSprite);

            this.scoreText = new game.BitmapText("" + this.score, {font:'Arialwhite'});
            this.scoreText.position.x = this.scoreSprite.position.x + 130;
            this.scoreText.position.y = this.scoreSprite.position.y - 6;

            this.stage.addChild(this.scoreText);

            var box1 = new Box(this.moveTime);
            var box2 = new Box(this.moveTime);

            var helpButton = new game.Sprite('help');

            helpButton.position.x = 305.25;
            helpButton.position.y = 825;

            helpButton.scale.x = 1.5;
            helpButton.scale.y = 1.5;

            helpButton.interactive = true;

            helpButton.touchstart = function() {
                game.system.setScene(HelpScreen);
            }

            this.stage.addChild(helpButton);

            this.stage.addChild(this.introText);
        },

        addPoints: function(points)
        {
            this.score += points;
            this.scoreText.setText("" + this.score);
        },

        endSwipeWait: function()
        {
            this.swipeWait = false
        },

        swipe: function(dir)
        {
            if (this.introText.parent)
            {
                this.stage.removeChild(this.introText)

                var title = new game.Sprite('title');
                title.position.x = game.system.width / 2 - title.width / 2;
                title.position.y = 30;

                this.stage.addChild(title);
            }

            if (!this.over && !this.swipeWait)
            {
                if (dir === 'up')
                    this.swipeUp()
                else if (dir === 'down')
                    this.swipeDown()
                else if (dir === 'left')
                    this.swipeLeft()
                else if (dir === 'right')
                    this.swipeRight()

                if (this.newBox)
                {
                    this.newBox = false

                    for (var i = 0; i < 4; i++)
                    {
                        for (var j = 0; j < 4; j++)
                        {
                            if (this.boxes[i][j] != 0)
                            {
                                this.boxes[i][j].doubling = false
                            }
                        }
                    }

                    this.addTimer(this.moveTime + 30, this.makeBox.bind(this), false)

                    this.swipeWait = true
                    this.addTimer(250, this.endSwipeWait.bind(this), false)
                }
            }
        },

        checkGameOver: function()
        {
            var gameOver = true

            for (var i = 0; i < 4; i++)
            {
                for (var j = 0; j < 4; j++)
                {
                    if (this.boxes[i][j] != 0)
                    {
                        if ((i > 0 && this.boxes[i][j].number == this.boxes[i - 1][j].number)
                            || (i < 3 && this.boxes[i][j].number == this.boxes[i + 1][j].number)
                            || (j > 0 && this.boxes[i][j].number == this.boxes[i][j - 1].number)
                            || (j < 3 && this.boxes[i][j].number == this.boxes[i][j + 1].number))
                        {
                            gameOver = false
                            break
                        }
                    }
                    else
                    {
                        gameOver = false
                        break
                    }
                }
            }

            if (gameOver)
            {
                this.over = true
                this.addTimer(1500, this.gameOverScreen.bind(this), false)
            }
        },

        gameOverScreen: function()
        {
            this.clearStage()

            var background = new game.Sprite('background');
            background.scale.x = game.system.width / background.width;
            background.scale.y = game.system.height / background.height;

            this.stage.addChild(background);

            var highScore = parseInt(game.storage.get('highScore')) || 0;
            if (this.score > highScore) game.storage.set('highScore', this.score);

            var highScoreText = new game.BitmapText("Highscore: " + highScore, {font: 'Arialblack'});

            var scoreText = new game.BitmapText("You scored " + this.score + " points.",
                            {font: 'Arialblack'});

            scoreText.position.x = (game.system.width / 2) - (scoreText.textWidth / 2);
            scoreText.position.y = game.system.height / 2 - scoreText.textHeight;

            highScoreText.position.x = (game.system.width / 2) - (highScoreText.textWidth / 2);
            highScoreText.position.y = scoreText.position.y + 100;

            var gameOverText = new game.BitmapText(this.ending, {font: 'Arialblack'});

            gameOverText.position.x = (game.system.width / 2) - (gameOverText.textWidth / 2);
            gameOverText.position.y = scoreText.position.y - 100;

            var restartButton = new game.Sprite('retrybutton', 0, 0, { interactive: true,
                    mousedown: function() {
                    game.analytics.event('restart');
                    game.system.setScene(SceneGame);
                }
            });

            restartButton.position.x = (game.system.width / 2) - (restartButton.width / 2);
            restartButton.position.y = highScoreText.position.y + 100;

            this.stage.addChild(scoreText);
            this.stage.addChild(highScoreText);
            this.stage.addChild(restartButton);
            this.stage.addChild(gameOverText);

        },

        makeBox: function()
        {
            var box = new Box(this.moveTime)

            this.checkGameOver()
        },

        keydown: function()
        {
            var num = parseInt(Math.random() * 4)

            if (num == 0)
                this.swipe('up')
            if (num == 1)
                this.swipe('down')
            if (num == 2)
                this.swipe('left')
            if (num == 3)
                this.swipe('right')
        },

        swipeUp: function()
        {
            for (var i = 1; i < 4; i++)
            {
                for (var j = 0; j < 4; j++)
                {
                    if (this.boxes[i][j] != 0)
                    {
                        this.moveUp(i, j)
                    }
                }
            }
        },

        swipeDown: function()
        {
            for (var i = 2; i >= 0; i--)
            {
                for (var j = 3; j >= 0; j--)
                {
                    if (this.boxes[i][j] != 0)
                    {
                        this.moveDown(i, j)
                    }
                }
            }
        },

        swipeLeft: function()
        {
            for (var i = 1; i < 4; i++)
            {
                for (var j = 0; j < 4; j++)
                {
                    if (this.boxes[j][i] != 0)
                    {
                        this.moveLeft(j, i)
                    }
                }
            }
        },

        swipeRight: function()
        {
            for (var i = 2; i >= 0; i--)
            {
                for (var j = 3; j >= 0; j--)
                {
                    if (this.boxes[j][i] != 0)
                    {
                        this.moveRight(j, i)
                    }
                }
            }
        },

        moveUp: function(x, y)
        {
            var box = this.boxes[x][y]

            var toX = x
            var overlap = false

            for (var i = x - 1; i >= 0; i--)
            {
                if (this.boxes[i][y] != 0)
                {
                    if (this.boxes[i][y].number == box.number)
                    {
                        if (this.boxes[i][y].doubling == false)
                        {
                            toX = i
                            overlap = true
                        }
                        break
                    }
                    else
                    {
                        break
                    }
                }

                toX = i
            }

            if (toX != x)
            {
                if (overlap)
                {
                    this.boxes[toX][y].overlap()
                    this.boxes[x][y].moveTo(toX, y, true)
                }
                else
                {
                    this.boxes[x][y].moveTo(toX, y, false)
                }

                this.newBox = true
            }
        },

        moveDown: function(x, y)
        {
            var box = this.boxes[x][y]

            var toX = x
            var overlap = false

            for (var i = x + 1; i < 4; i++)
            {
                if (this.boxes[i][y] != 0)
                {
                    if (this.boxes[i][y].number == box.number)
                    {
                        if (this.boxes[i][y].doubling == false)
                        {
                            toX = i
                            overlap = true
                        }
                        break
                    }
                    else
                    {
                        break
                    }
                }

                toX = i
            }


            if (toX != x)
            {
                if (overlap)
                {
                    this.boxes[toX][y].overlap()
                    this.boxes[x][y].moveTo(toX, y, true)
                }
                else
                {
                    this.boxes[x][y].moveTo(toX, y, false)
                }

                this.newBox = true
            }
        },

        moveLeft: function(x, y)
        {
            var box = this.boxes[x][y]

            var toY = y
            var overlap = false

            for (var i = y - 1; i >= 0; i--)
            {
                if (this.boxes[x][i] != 0)
                {
                    if (this.boxes[x][i].number == box.number)
                    {
                        if (this.boxes[x][i].doubling == false)
                        {
                            toY = i
                            overlap = true
                        }
                        break
                    }
                    else
                    {
                        break
                    }
                }

                toY = i
            }

            if (toY != y)
            {
                if (overlap)
                {
                    this.boxes[x][toY].overlap()
                    this.boxes[x][y].moveTo(x, toY, true)
                }
                else
                {
                    this.boxes[x][y].moveTo(x, toY, false)
                }

                this.newBox = true
            }
        },

        moveRight: function(x, y)
        {
            var box = this.boxes[x][y]

            var toY = y
            var overlap = false

            for (var i = y + 1; i < 4; i++)
            {
                if (this.boxes[x][i] != 0)
                {
                    if (this.boxes[x][i].number == box.number)
                    {
                        if (this.boxes[x][i].doubling == false)
                        {
                            toY = i
                            overlap = true
                        }
                        break
                    }
                    else
                    {
                        break
                    }
                }

                toY = i
            }

            if (toY != y)
            {
                if (overlap)
                {
                    this.boxes[x][toY].overlap()
                    this.boxes[x][y].moveTo(x, toY, true)
                }
                else
                {
                    this.boxes[x][y].moveTo(x, toY, false)
                }

                this.newBox = true
            }
        },



        clearStage: function()
        {
            while(this.stage.children.length > 0)
            {
                this.stage.removeChild(this.stage.children[0]);
                this.removeTimer(this.timers[0], false);
            }
        },

        sizeText: function(bitmapText)
        {
            var screenWidth = game.system.width - 50;

            if (bitmapText.textWidth > screenWidth) {
                var scale = screenWidth / bitmapText.textWidth;
                bitmapText.scale.x = scale;
                bitmapText.scale.y = scale;
            }
        }
    });

    HelpScreen = game.Scene.extend({
        backgroundColor: 0xC0C0C0,

        init: function() {

            var background = new game.Sprite('background');
            background.scale.x = game.system.width / background.width;
            background.scale.y = game.system.height / background.height;

            this.stage.addChild(background);

            var helpText = new game.BitmapText("When two like numbers\n are combined, their\n values are added to\n a new square. For\n example, 5 and 5 make\n a 10. Larger numbers\n earn more points.\n\nCreate a 5120\nsquare to win!",
                {font: 'Arialblack', align: 'center'});

            helpText.position.x = (game.system.width / 2) - (helpText.textWidth / 2);
            helpText.position.y = 100;

            backButton = new game.Sprite('back');

            backButton.scale.x = 1.5;
            backButton.scale.y = 1.5;

            backButton.interactive = true;
            backButton.touchstart = function() {
                game.system.setScene(SceneGame);
            }

            backButton.position.x = (game.system.width / 2) - (backButton.width / 2);
            backButton.position.y = 825;

            this.stage.addChild(helpText);
            this.stage.addChild(backButton);

        }

    });

});