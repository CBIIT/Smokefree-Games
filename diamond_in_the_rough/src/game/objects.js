game.module (
    'game.objects'
)
.require(
    'engine.sprite'
)

.body(function() {

    Button = game.Class.extend({

        init: function(x, y, posX, posY)
        {
            this.x = x;
            this.y = y;
            this.posX = posX;
            this.posY = posY;

            this.on = 0;

            this.sprite = new game.Sprite('blackbutton');

            this.sprite.position.x = x;
            this.sprite.position.y = y;

            this.sprite.scale.x = .5
            this.sprite.scale.y = .5

            game.scene.stage.addChild(this.sprite);
            game.scene.addObject(this);
        },

        toggle: function()
        {
            game.scene.stage.removeChild(this.sprite);

            if (this.on == 1)
            {
                this.sprite = new game.Sprite('blackbutton');
            }
            else
            {
                this.sprite = new game.Sprite('redbutton');
            }

            this.on = this.on ^ 1;


            this.sprite.position.x = this.x;
            this.sprite.position.y = this.y;

            this.sprite.scale.x = .5
            this.sprite.scale.y = .5

            game.scene.stage.addChild(this.sprite);
        }

    });

});