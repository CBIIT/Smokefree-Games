game.module (
    'game.objects'
)
.require(
    'engine.sprite'
)

.body(function() {

    Gem = game.Class.extend({
        color: 0,

        init: function() {
            var color = parseInt(Math.random() * 3);
            this.color = color;

            switch (color)
            {
                case 0:
                    this.sprite = new game.Sprite('redgem');
                    break;
                case 1:
                    this.sprite = new game.Sprite('bluegem');
                    break;
                case 2:
                default:
                    this.sprite = new game.Sprite('greengem');
            }

            while (true)
            {
                var x = parseInt(Math.random() * (game.system.width - (this.sprite.width)));
                //x += this.sprite.width / 4;
                var y = parseInt(Math.random() * (game.system.height - (this.sprite.height)));
                //y += this.sprite.height / 4;

                var loop = false;

                for (var i = 0; i < game.scene.objects.length; i++)
                {
                    var temp = game.scene.objects[i].sprite;
                    if (Math.abs(x - temp.position.x) < this.sprite.width &&
                        Math.abs(y - temp.position.y) < this.sprite.height)
                        loop = true;
                }

                var temptext = game.scene.missesText;

                if (Math.abs(x - temptext.position.x) < temptext.textWidth &&
                    Math.abs(y - temptext.position.y) < temptext.textHeight)
                    loop = true;

                if (!loop)
                    break;
            }

            this.sprite.position.x = x;
            this.sprite.position.y = y;

            game.scene.stage.addChild(this.sprite);
            game.scene.addObject(this);

            this.timer = game.scene.addTimer(game.scene.gemLifeTime, this.dispose.bind(this), false);
        },

        dispose: function() {
            if (this.sprite.parent)
            {
                game.scene.stage.removeChild(this.sprite);
                game.scene.removeObject(this);

                if (this.color === game.scene.colorToTouch)
                {
                    game.scene.mistakeMade();
                }
            }
        },

        disposeTouched: function() {
            if (this.sprite.parent)
            {
                game.scene.stage.removeChild(this.sprite);
                game.scene.removeObject(this);
                game.scene.removeTimer(this.timer, false);
            }
        }

    });

});