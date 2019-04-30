game.module (
    'game.objects'
)
.require(
    'engine.sprite'
)

.body(function() {

    Runner = game.Class.extend({

        init: function()
        {
            this.sprite = new game.MovieClip([
                game.Texture.fromImage('spider1'),
                game.Texture.fromImage('spider2'),
                game.Texture.fromImage('spider3')
            ]);

            game.scene.stage.addChild(this.sprite);
            game.scene.addObject(this);

            this.sprite.animationSpeed = 0.2;
            this.sprite.play();

            var x = parseInt(Math.random() * (game.system.width - this.sprite.width));
            var y = -this.sprite.height - 30;

            this.sprite.position.x = x;
            this.sprite.position.y = y;

            this.body = new game.Body({
                position: { x: x, y: y },
                velocityLimit: { x: 100, y: parseInt(Math.random() * 400) + 150 },
                collideAgainst: 0,
                collisionGroup: 1
            });

            this.body.mass = 1;
            this.body.collide = this.collide.bind(this);
            var shape = new game.Rectangle(this.sprite.width, this.sprite.height);
            this.body.addShape(shape);

            game.scene.world.addBody(this.body);
        },

        collide: function()
        {

            game.scene.score+=10;
            game.scene.scoreText.setText("" + game.scene.score);
            this.dispose();

            return true;
        },

        dispose: function() {
            if (this.sprite.parent)
            {
                game.scene.stage.removeChild(this.sprite);
                game.scene.removeObject(this);
                game.scene.world.removeBody(this.body);
            }
        },

        update: function()
        {
            this.sprite.position.x = this.body.position.x;
            this.sprite.position.y = this.body.position.y;

            if (this.sprite.position.y > game.system.height + this.sprite.height)
            {
                game.scene.missedRunner();
                this.dispose();
            }
        }
    });

    Rock = game.Class.extend({

        init: function()
        {
            this.sprite = new game.Sprite('rock');
            this.sprite.anchor.set(.5, .5);
            this.touched = false;

            var x = (game.system.width / 2);
            var y = game.system.height - 280;

            this.sprite.position.x = x;
            this.sprite.position.y = y;

            game.scene.stage.addChild(this.sprite);
            game.scene.addObject(this);


            this.body = new game.Body({
                position: { x: x - (this.sprite.width / 2),
                            y: y - (this.sprite.height / 2)},
                velocityLimit: { x: 500, y: 700 },
                collideAgainst: 1,
                collisionGroup: 0
            });

            var shape = new game.Rectangle(this.sprite.width, this.sprite.height);
            this.body.addShape(shape);



        },

        dispose: function() {
            if (this.sprite.parent)
            {
                game.scene.stage.removeChild(this.sprite);
                game.scene.removeObject(this);
                game.scene.world.removeBody(this.body);
            }
        },

        touchStart: function() {
            this.touched = true;

            game.scene.world.addBody(this.body);

        },

        update: function()
        {
            if (this.touched)
            {
                this.sprite.position.x = this.body.position.x + (this.sprite.width / 2);
                this.sprite.position.y = this.body.position.y + (this.sprite.height / 2);
            }

            if (this.sprite.position.x < 0 - this.sprite.width ||
                this.sprite.position.x > game.system.width + this.sprite.width ||
                this.sprite.position.y < 0 - this.sprite.height ||
                this.sprite.position.y > game.system.height + this.sprite.height)
                this.dispose();
        }


    });


});