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
        game_speed: 200,
        score: 0,

        init: function() {
            this.grid = [];

            this.grid_width = Math.ceil(game.system.width / 65) - 2;
            this.grid_height = Math.ceil(game.system.height / 65) - 3;
            this.grid_offset_x = (game.system.width - this.grid_width * 65) / 2;
            this.grid_offset_y = (game.system.height - this.grid_height * 65) / 2;

            for (var i = 0; i < this.grid_width; i++)
            {
                this.grid.push([]);

                for (var j = 0; j < this.grid_height; j++)
                {
                    this.grid[i].push(0);
                }
            }

            var graphics = new game.Graphics();
            graphics.lineStyle(1, 0, 1);
            graphics.drawRect(0, 0, this.grid_width * 65, this.grid_height * 65);
            graphics.position.set(this.grid_offset_x, this.grid_offset_y);
            this.stage.addChild(graphics);

            this.snake = new Snake();
            new Food();

            this.scoreText = new game.BitmapText("Score: " + this.score, {font:'Arialblack'});
            this.scoreText.position.x = (game.system.width / 2) - (this.scoreText.textWidth / 2);
            this.scoreText.position.y = game.system.height - (this.scoreText.textHeight);

            this.stage.addChild(this.scoreText);

            this.introText = new game.BitmapText("Swipe up, down, left, or right", {font:'Arialblack'});

            this.introText.position.x = (game.system.width / 2) - (this.introText.textWidth / 2);
            this.introText.position.y = (game.system.height / 2) - (this.introText.textHeight / 2);

            this.stage.addChild(this.introText);

            this.addTimer(this.game_speed, this.move.bind(this), true);
        },

        gameOverScreen: function()
        {
            this.clearStage()

            var scoreText = new game.BitmapText("You scored " + this.score + " points.",
                            {font: 'Arialblack'});

            scoreText.position.x = (game.system.width / 2) - (scoreText.textWidth / 2);
            scoreText.position.y = game.system.height / 2 - scoreText.textHeight;

            var gameOverText = new game.BitmapText(this.ending, {font: 'Arialblack'});

            gameOverText.position.x = (game.system.width / 2) - (gameOverText.textWidth / 2);
            gameOverText.position.y = scoreText.position.y - gameOverText.textHeight * 2;

            var restartButton = new game.Sprite('retrybutton', 0, 0, { interactive: true,
                    scale: {x: 2, y: 2},
                    mousedown: function() {
                    game.analytics.event('restart');
                    game.system.setScene(SceneGame);
                }
            });

            restartButton.position.x = (game.system.width / 2) - (restartButton.width / 2);
            restartButton.position.y = (game.system.height / 2) + scoreText.textHeight;

            this.stage.addChild(scoreText);
            this.stage.addChild(restartButton);
            this.stage.addChild(gameOverText);
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

        swipe: function(dir)
        {
            this.snake.addMovement(dir);

            if (this.introText.parent)
                this.stage.removeChild(this.introText);
        },

        addPoints: function(points)
        {
            this.score += points;
            this.scoreText.setText("Score: " + this.score);

            this.scoreText.position.x = (game.system.width / 2) - (this.scoreText.textWidth / 2);
            this.scoreText.position.y = game.system.height - (this.scoreText.textHeight);
        },

        move: function()
        {
            this.snake.move();
        }
    });

});