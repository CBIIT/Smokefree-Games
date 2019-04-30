game.module(
    'game.scenes'
)
.require(
    'engine.scene',
    'engine.renderer'
)
.body(function() {

    SceneGame = game.Scene.extend({
        backgroundColor: 0x000000,

        init: function() {

            this.over = false;

            var padding = 120;

            var startX = (game.system.width / 2) - ((padding * 5) / 2) + 15;
            var startY = (game.system.height / 2) - ((padding * 5) / 2);

            var logo = new game.Sprite('logo');

            logo.position.x = (game.system.width / 2) - (logo.width / 2);
            logo.position.y = 20;

            this.stage.addChild(logo);

            this.buttons = [];

            for (var i = 0; i < 5; i++)
            {
                this.buttons.push([]);
            }

            for (var i = 0; i < 5; i++)
            {
                for (var j = 0; j < 5; j++)
                {
                    var button = new Button(startX + (j * padding),
                                             startY + (i * padding),
                                             i, j);
                    this.buttons[i].push(button);
                }
            }

            var reductions = [[0, 4], [1, 3], [0, 1, 2], [2, 3, 4], [0, 2, 3], [1, 2, 4], [0, 1, 3, 4]];

            var reductionNum = parseInt(Math.random() * 6);

            var reduction = reductions[reductionNum];

            for (var i = 0; i < reduction.length; i++)
            {
                this.buttons[4][reduction[i]].toggle();
            }

            var numToggle = parseInt(Math.random() * 7) + 10;

            for (var i = 0; i < numToggle; i++)
            {
                var xPos = parseInt(Math.random() * 5);
                var yPos = parseInt(Math.random() * 5);

                this.buttonPressed(xPos, yPos);
            }

            var helpButton = new game.Sprite('help');

            helpButton.position.x = 305.25;
            helpButton.position.y = 886;

            helpButton.scale.x = 1.5;
            helpButton.scale.y = 1.5;

            helpButton.interactive = true;

            helpButton.touchstart = function() {
                game.system.setScene(HelpScreen);
            }

            this.stage.addChild(helpButton);


        },


        mousedown: function(event) {

            if (!this.over)
            {
                var position = event.global;

                for (var i = 0; i < this.objects.length; i++)
                {
                    var button = this.objects[i].sprite;
                    var buttonX = button.position.x + button.width / 2;
                    var buttonY = button.position.y + button.height / 2;

                    if (Math.abs(position.x - buttonX) < button.width / 2 &&
                        Math.abs(position.y - buttonY) < button.height / 2)
                    {
                        this.buttonPressed(this.objects[i].posX, this.objects[i].posY);
                        this.checkGoal();
                    }
                }
            }
        },

        buttonPressed: function(x, y)
        {
//            game.audio.playSound('button');

            this.buttons[x][y].toggle();

            if (x - 1 >= 0)
            {
                this.buttons[x - 1][y].toggle();
            }

            if (x + 1 < 5)
            {
                this.buttons[x + 1][y].toggle();
            }

            if (y - 1 >= 0)
            {
                this.buttons[x][y - 1].toggle();
            }

            if (y + 1 < 5)
            {
                this.buttons[x][y + 1].toggle();
            }
        },

        checkGoal: function()
        {
            var result = true;

            for (var i = 0; i < this.objects.length; i++)
            {
                if (this.objects[i].on == 1)
                {
                    result = false;
                }
            }

            if (result)
            {
                this.gameOver()
            }
        },

        gameOver: function()
        {
            this.over = true;

            this.clearStage();

            var restartButton = new game.Sprite('tryagain', 0, 0, { interactive: true,
                    scale: {x: 1.5, y: 1.5},
                    mousedown: function() {
                    game.analytics.event('restart');
                    game.system.setScene(SceneGame);
                }
            });

            restartButton.scale.x = .8
            restartButton.scale.y = .8

            restartButton.position.x = (game.system.width / 2) - (restartButton.width / 2);
            restartButton.position.y = (game.system.height / 2) - (restartButton.height / 2);

            this.stage.addChild(restartButton);
        },

        clearStage: function()
        {
            while(this.stage.children.length > 0)
            {
                this.stage.removeChild(this.stage.children[0]);
                this.removeObject(this.objects[0]);
            }

        }

    });

    HelpScreen = game.Scene.extend({
        backgroundColor: 0x000000,

        init: function() {

            var helpText = new game.BitmapText("In this game,\nyour goal is to\nturn the entire\n5x5 grid into\ndiamonds.\n\nWhen you tap\non a grid tile,\nthat tile and all\nsurrounding tiles\nwill be flipped.",
                {font: 'Arialwhite', align: 'center'});

            helpText.position.x = (game.system.width / 2) - (helpText.textWidth / 2);
            helpText.position.y = (game.system.height / 2) - (helpText.textHeight / 2);

            backButton = new game.Sprite('back');

            backButton.scale.x = 1.5;
            backButton.scale.y = 1.5;

            backButton.interactive = true;
            backButton.touchstart = function() {
                game.system.setScene(SceneGame);
            }

            backButton.position.x = (game.system.width / 2) - (backButton.width / 2);
            backButton.position.y = helpText.position.x + helpText.textHeight + 50;

            this.stage.addChild(helpText);
            this.stage.addChild(backButton);
        }
    });

});