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
    msUntilGem: 400,
    gemLifeTime: 1000,
    pointsEarned: 5,
    msToDifficultyIncrease: 4500,
    missesLeft: 3,
    pointIncrease: .2,
    difficultyIncrease: 10,

    init: function() {
        game.System.resize = false;

        var background = new game.Sprite('background');
        background.scale.x = game.system.width / background.width;
        background.scale.y = game.system.height / background.height;

        this.stage.addChild(background);

        this.world = new game.World(0, 0);
        this.colorToTouch = parseInt(Math.random() * 3);
        var color = "";

        switch (this.colorToTouch)
        {
            case 0:
                color = "STRAWBERRIES";
                break;
            case 1:
                color = "ORANGES";
                break;
            case 2:
                color = "KIWIS";
                break;
        }

        var text = new game.BitmapText("Touch the " + color, {font: 'Arialwhite'});

        this.missesText = new game.BitmapText("", {font: 'Arialred'});

        this.stage.addChild(this.missesText);

        this.scoreSprite = new game.Sprite('score');
        this.scoreSprite.position.x = (game.system.width / 2) - (this.scoreSprite.width / 2);
        this.scoreSprite.position.y = game.system.height - (this.scoreSprite.height * 2);

        this.stage.addChild(this.scoreSprite);

        this.scoreText = new game.BitmapText("" + this.score, {font:'Arialwhite'});
        this.scoreText.position.x = this.scoreSprite.position.x + 130;
        this.scoreText.position.y = this.scoreSprite.position.y - 2;

        this.stage.addChild(this.scoreText);

        text.position.x = (game.system.width / 2) - (text.textWidth / 2);
        text.position.y = game.system.height / 2 - text.textHeight;

        text.dispose = function () {
            game.scene.stage.removeChild(this);
        }
        this.stage.addChild(text);
        this.addTimer(1500, text.dispose.bind(text), false);
        this.gemTimer = this.addTimer(this.msUntilGem + 1500, this.createGem.bind(this), false);
        this.difficultyTimer = this.addTimer(this.msToDifficultyIncrease, this.increaseDifficulty.bind(this), false);
    },

    createGem: function() {
        var gem = new Gem();

        this.gemTimer = this.addTimer(this.msUntilGem, this.createGem.bind(this), false);
    },

    increaseDifficulty: function() {
        this.pointsEarned += parseInt(this.pointsEarned * this.pointIncrease);

        this.gemLifeTime -= this.difficultyIncrease;

        this.msUntilGem -= this.difficultyIncrease;

        this.difficultyTimer = this.addTimer(this.msToDifficultyIncrease, this.increaseDifficulty.bind(this), false);
    },

    mistakeMade: function() {
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
            this.missesText.position.x = (game.system.width / 2) - (this.missesText.textWidth / 2)
            this.missesText.position.y = 10;
        }

    },

    gameOver: function()
    {
        this.removeTimer(this.gemTimer, false);
        this.removeTimer(this.difficultyTimer, false);
        this.clearStage();

        var background = new game.Sprite('background');
        background.scale.x = game.system.width / background.width;
        background.scale.y = game.system.height / background.height;

        this.stage.addChild(background);

        var scoreBoard = new game.Sprite('scoreboard');

        scoreBoard.position.x = (game.system.width / 2) - (scoreBoard.width / 2);
        scoreBoard.position.y = game.system.height / 2 - scoreBoard.height;

        var scoreText = new game.BitmapText("" + this.score, {font: 'Arialwhite'});

        scoreText.position.x = scoreBoard.position.x + 250;
        scoreText.position.y = scoreBoard.position.y + 181;

        scoreText.scale.x = .8
        scoreText.scale.y = .8

        var highScore = parseInt(game.storage.get('highScore')) || 0;
        if (this.score > highScore) game.storage.set('highScore', this.score);

        var highScoreText = new game.BitmapText(highScore.toString(), {font: 'Arialwhite'});

        highScoreText.position.x = scoreText.position.x;
        highScoreText.position.y = scoreText.position.y + 51;

        highScoreText.scale.x = scoreText.scale.x
        highScoreText.scale.y = scoreText.scale.y

        var restartButton = new game.Sprite('retrybutton', 0, 0, { interactive: true,
                mousedown: function() {
                game.analytics.event('restart');
                game.system.setScene(SceneGame);
            }
        });

        restartButton.position.x = (game.system.width / 2) - (restartButton.width / 2);
        restartButton.position.y = (game.system.height / 2) + 20;

        this.stage.addChild(scoreBoard);
        this.stage.addChild(scoreText);
        this.stage.addChild(highScoreText);
        this.stage.addChild(restartButton);
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

        for (var i = 0; i < game.scene.objects.length; i++)
        {
            var temp = this.objects[i].sprite;
            var gemX = temp.position.x + temp.width / 2;
            var gemY = temp.position.y + temp.height / 2;

            if (Math.abs(position.x - gemX) < temp.width / 2 &&
                Math.abs(position.y - gemY) < temp.height / 2)
            {
                if (this.objects[i].color == this.colorToTouch)
                {
                    this.score += this.pointsEarned;
                    this.scoreText.setText("" + this.score);

                    var text = new game.BitmapText('+' + this.pointsEarned, {font: 'Arial'});
                    text.position.x = gemX - (text.textWidth / 2);
                    text.position.y = gemY - 20;
                    text.dispose = function () {
                        if (this.parent)
                            game.scene.stage.removeChild(this);
                    }

                    this.stage.addChild(text);

                    this.addTimer(800, text.dispose.bind(text), false);

                    this.objects[i].disposeTouched();

                    //game.audio.playSound('glass');
                }
                else
                {
                    this.mistakeMade();

                    var text = new game.BitmapText("X", {font: 'Arialred'});
                    text.position.x = gemX - (text.textWidth / 2);
                    text.position.y = gemY - 20;
                    text.dispose = function () {
                        if (this.parent)
                            game.scene.stage.removeChild(this);
                    }

                    this.stage.addChild(text);

                    this.addTimer(800, text.dispose.bind(text), false);

                    this.objects[i].disposeTouched();
                }
            }
        }
    }

    });

});