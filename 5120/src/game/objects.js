game.module (
    'game.objects'
)
.require(
    'engine.sprite'
)

.body(function() {

    Box = game.Class.extend({
        doubling: false,

        init: function(moveTime)
        {
            this.moveTime = moveTime

            if (parseInt(Math.random() * 2) == 1)
            {
                this.sprite = new game.Sprite('5');
                this.number = 5;
            }
            else
            {
                this.sprite = new game.Sprite('10');
                this.number = 10;
            }

            while (true)
            {
                this.x = parseInt(Math.random() * 4);
                this.y = parseInt(Math.random() * 4);

                if (game.scene.boxes[this.x][this.y] === 0)
                    break;
            }

            this.sprite.position.x = game.scene.spaces[this.x][this.y].position.x + (this.sprite.width / 2);
            this.sprite.position.y = game.scene.spaces[this.x][this.y].position.y + (this.sprite.height / 2);

            this.sprite.scale.x = .3
            this.sprite.scale.y = .3

            this.sprite.anchor.x = .5
            this.sprite.anchor.y = .5

            var tween = new game.Tween(this.sprite.scale)
                .to({ x: 1, y: 1 }, 100)
            tween.start();

            game.scene.addTimer(101, this.resetAnchor.bind(this), false)

            game.scene.stage.addChild(this.sprite);

            game.scene.boxes[this.x][this.y] = this;
        },

        resetAnchor: function()
        {
            this.sprite.position.x = game.scene.spaces[this.x][this.y].position.x;
            this.sprite.position.y = game.scene.spaces[this.x][this.y].position.y;

            this.sprite.anchor.x = 0
            this.sprite.anchor.y = 0
        },

        double: function()
        {
            if (this.sprite.parent)
            {
                game.scene.stage.removeChild(this.sprite)

                if (this.number == 5)
                {
                    this.number = 10;
                    this.sprite = new game.Sprite('10');
                    game.scene.addPoints(10);
                }
                else if (this.number == 10)
                {
                    this.number = 20;
                    this.sprite = new game.Sprite('20');
                    game.scene.addPoints(20);
                }
                else if (this.number == 20)
                {
                    this.number = 40;
                    this.sprite = new game.Sprite('40');
                    game.scene.addPoints(40);
                }
                else if (this.number == 40)
                {
                    this.number = 80;
                    this.sprite = new game.Sprite('80');
                    game.scene.addPoints(80);
                }
                else if (this.number == 80)
                {
                    this.number = 160;
                    this.sprite = new game.Sprite('160');
                    game.scene.addPoints(160);
                }
                else if (this.number == 160)
                {
                    this.number = 320;
                    this.sprite = new game.Sprite('320');
                    game.scene.addPoints(320);
                }
                else if (this.number == 320)
                {
                    this.number = 640;
                    this.sprite = new game.Sprite('640');
                    game.scene.addPoints(640);
                }
                else if (this.number == 640)
                {
                    this.number = 1280;
                    this.sprite = new game.Sprite('1280');
                    game.scene.addPoints(1280);
                }
                else if (this.number == 1280)
                {
                    this.number = 2560;
                    this.sprite = new game.Sprite('2560');
                    game.scene.addPoints(2560);
                }
                else if (this.number == 2560)
                {
                    this.number = 5120;
                    this.sprite = new game.Sprite('5120');
                    game.scene.addPoints(10);

                    game.scene.ending = "You won!"
                    game.scene.over = true
                    game.scene.addTimer(1500, game.scene.gameOverScreen.bind(game.scene), false)
                }

                this.sprite.position.x = game.scene.spaces[this.x][this.y].position.x + (this.sprite.width / 2);
                this.sprite.position.y = game.scene.spaces[this.x][this.y].position.y + (this.sprite.height / 2);

                this.sprite.anchor.x = .5
                this.sprite.anchor.y = .5

                game.scene.stage.addChild(this.sprite)

                var tween = new game.Tween(this.sprite.scale)
                    .to({ x: 1.2, y: 1.2 }, 80)
                tween.start();

                game.scene.addTimer(82, this.tweenBack.bind(this), false)
            }


        },

        tweenBack: function()
        {
            var tween = new game.Tween(this.sprite.scale)
                .to({ x: 1, y: 1 }, 80)
            tween.start();

            this.resetAnchor()
        },

        moveTo: function(x, y, double)
        {
            game.scene.boxes[this.x][this.y] = 0

            this.x = x
            this.y = y

            game.scene.boxes[x][y] = this

            var toX = game.scene.spaces[x][y].position.x;
            var toY = game.scene.spaces[x][y].position.y;

            var tween = new game.Tween(this.sprite)
                .to({ x: toX, y: toY }, this.moveTime)
            tween.start();

            if (double)
            {
                game.scene.addTimer(this.moveTime, this.double.bind(this), false)
                this.doubling = true
            }
        },

        overlap: function()
        {
            game.scene.addTimer(this.moveTime, this.dispose.bind(this), false)
        },

        dispose: function()
        {
            if (this.sprite.parent)
            {
                game.scene.stage.removeChild(this.sprite)
            }
        }

    });

});