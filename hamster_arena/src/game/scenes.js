game.module(
    'game.scenes'
)
.require(
    'engine.scene',
    'engine.renderer'
)
.body(function() {

    SceneGame = game.Scene.extend({
        backgroundColor: 0xCBE8E6,
        pelletSpeed: 2500,
        score: 0,
        missesLeft: 3,

        init: function() {
            var floor = new game.Sprite('floor');

            floor.position.y = game.system.height - floor.height;

            this.stage.addChild(floor);

            var hoop = new game.Sprite('hoop');

            hoop.position.x = game.system.width - hoop.width;
            hoop.position.y = floor.position.y + 20 - hoop.height;

            this.stage.addChild(hoop);

            var banner = new game.Sprite('banner');

            banner.position.x = -20;
            banner.position.y = 30;

            this.stage.addChild(banner);

            this.hamster = new game.MovieClip([game.Texture.fromImage('hamster0'),
            game.Texture.fromImage('hamster1'),
            game.Texture.fromImage('hamster2')]);

            this.hamster.position.x = (game.system.width / 2) - (this.hamster.width / 2);
            this.hamster.position.y = floor.position.y + 20 - this.hamster.height;

            this.hamster.animationSpeed = .1;
            this.stage.addChild(this.hamster);

            this.scoreSprite = new game.Sprite('score');
            this.scoreSprite.position.x = (game.system.width / 2) - (this.scoreSprite.width / 2);
            this.scoreSprite.position.y = game.system.height - (this.scoreSprite.height * 2);

            this.stage.addChild(this.scoreSprite);

            this.scoreText = new game.BitmapText("" + this.score, {font:'Pixel'});
            this.scoreText.position.x = this.scoreSprite.position.x + 140;
            this.scoreText.position.y = this.scoreSprite.position.y - 7;

            this.stage.addChild(this.scoreText);

            this.startNewPellet();

            this.missesText = new game.BitmapText("", {font: 'Arialred'});

            this.stage.addChild(this.missesText)
        },

        startNewPellet: function() {

            if (this.missesLeft >= 0)
            {
                this.addTimer(600, this.newPellet.bind(this));
                this.hamster.gotoAndPlay(0);
            }
        },

        pelletMissed: function() {
            this.missesLeft -= 1;

            if (this.missesLeft == 2)
            {
                this.missesText.setText("X");
            }
            else if (this.missesLeft == 1)
            {
                this.missesText.setText("X X");
            }
            else if (this.missesLeft == 0)
            {
                this.missesText.setText("X X X");
            }
            else
            {
                this.gameOver();
            }

            if (this.missesText.parent)
            {
                this.missesText.updateTransform();
                this.missesText.position.x = (game.system.width / 2) - (this.missesText.textWidth / 2);
                this.missesText.position.y = 10;
            }
        },

        gameOver: function() {

            this.stage.removeChild(this.missesText);

            var scoreBoard = new game.Sprite('scoreboard', 0, 0, {interactive: true,
                mousedown: function() {
                game.analytics.event('restart');
                game.system.setScene(SceneGame);
            }});
            scoreBoard.position.x = (game.system.width / 2) - (scoreBoard.width / 2);
            scoreBoard.position.y = (game.system.height / 2) - (scoreBoard.height / 2);

            this.stage.addChild(scoreBoard);

            var scoreText = new game.BitmapText("" + this.score, {font: 'Pixel'});

            scoreText.position.x = scoreBoard.position.x + 110 - (scoreText.textWidth / 2);
            scoreText.position.y = scoreBoard.position.y + 155;

            this.stage.addChild(scoreText);

            var highScore = parseInt(game.storage.get('highScore')) || 0;
            if (this.score > highScore) game.storage.set('highScore', this.score);

            var highScoreText = new game.BitmapText("" + highScore, {font: 'Pixel'});

            highScoreText.position.x = scoreBoard.position.x + 310 - (highScoreText.textWidth / 2);
            highScoreText.position.y = scoreText.position.y;

            this.stage.addChild(highScoreText);
        },

        addPoint: function() {
            this.score += 1;
            this.scoreText.setText("" + this.score);
        },

        newPellet: function() {
            new Pellet(this.pelletSpeed);
            this.pelletSpeed -= 75;

            if (this.pelletSpeed < 500) {
                this.pelletSpeed = 500;
            }
            this.hamster.gotoAndStop(0);
        }
    });
});