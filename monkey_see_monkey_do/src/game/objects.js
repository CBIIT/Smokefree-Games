game.module (
    'game.objects'
)
.require(
    'engine.sprite'
)

.body(function() {

    Tile = game.Class.extend({

        init: function(x, y)
        {
            this.x = x;
            this.y = y;

            this.on = 0;

            this.sprite = this.getSprite(0);

            this.sprite.position.x = x;
            this.sprite.position.y = y;

            this.sprite.scale.x = 2;
            this.sprite.scale.y = 2;

            game.scene.stage.addChild(this.sprite);
        },

        light: function()
        {

            if (this.on == 0)
            {
                var temp = this.sprite

                game.scene.stage.removeChild(this.sprite)

                this.sprite = this.getSprite(1)

                this.on = 1

                this.sprite.position.x = temp.position.x
                this.sprite.position.y = temp.position.y

                this.sprite.scale.x = 2;
                this.sprite.scale.y = 2;

                game.scene.stage.addChild(this.sprite)

                game.scene.addTimer(400, this.resetColor.bind(this), false)
            }
        },

        resetColor: function()
        {
            var temp = this.sprite

            game.scene.stage.removeChild(this.sprite)

            this.sprite = this.getSprite(0)

            this.on = 0

            this.sprite.position.x = temp.position.x
            this.sprite.position.y = temp.position.y

            this.sprite.scale.x = 2;
            this.sprite.scale.y = 2;

            game.scene.stage.addChild(this.sprite)
        }

    });


    RedTile = Tile.extend({

        getSprite: function(num)
        {
            var sprite

            if (num == 0)
                sprite = new game.Sprite('redtile')
            else
                sprite = new game.Sprite('redtileglow')

            sprite.interactive = true

            sprite.touchstart = function() {
                game.scene.tileTouched(1)
            }

            sprite.mousedown = function()
            {
                game.scene.tileTouched(1)
            }

            return sprite
        }

    })

    BlueTile = Tile.extend({

        getSprite: function(num)
        {
            var sprite

            if (num == 0)
                sprite = new game.Sprite('bluetile')
            else
                sprite = new game.Sprite('bluetileglow')

            sprite.interactive = true

            sprite.touchstart = function() {
                game.scene.tileTouched(2)
            }

            sprite.mousedown = function()
            {
                game.scene.tileTouched(2)
            }

            return sprite
        }

    })

    GreenTile = Tile.extend({

        getSprite: function(num)
        {
            var sprite

            if (num == 0)
                sprite = new game.Sprite('greentile')
            else
                sprite = new game.Sprite('greentileglow')

            sprite.interactive = true

            sprite.touchstart = function() {
                game.scene.tileTouched(0)
            }

            sprite.mousedown = function()
            {
                game.scene.tileTouched(0)
            }

            return sprite
        }

    })

    YellowTile = Tile.extend({

        getSprite: function(num)
        {
            var sprite

            if (num == 0)
                sprite = new game.Sprite('yellowtile')
            else
                sprite = new game.Sprite('yellowtileglow')

            sprite.interactive = true

            sprite.touchstart = function() {
                game.scene.tileTouched(3)
            }

            sprite.mousedown = function()
            {
                game.scene.tileTouched(3)
            }

            return sprite;
        }

    })

});