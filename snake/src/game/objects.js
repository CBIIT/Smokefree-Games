game.module (
    'game.objects'
)
.require(
    'engine.sprite'
)

.body(function() {

    Snake = game.Class.extend({

        init: function()
        {
            this.bodyParts = [];
            this.movements = [];

            this.bodyParts.push(new BodyPart(0, 2));
            this.bodyParts.push(new BodyPart(0, 1));
            this.bodyParts.push(new BodyPart(0, 0));
        },

        addMovement: function(dir)
        {
            var existingMovement = false

            for (var i = 0; i < this.movements.length; i++)
            {
                if (this.movements[i].position == 0)
                    existingMovement = true
            }

            if (!existingMovement)
                this.movements.push(new Movement(dir));
        },

        move: function()
        {
            for (var i = this.movements.length - 1; i >= 0; i--)
            {
                if (this.movements[i].position == this.bodyParts.length)
                    this.movements.splice(i, 1);

            }

            for (var i = 0; i < this.movements.length; i++)
            {

                var direction = this.bodyParts[this.movements[i].position].direction;

                if (this.checkDirection(direction, this.movements[i].direction))
                {
                    this.bodyParts[this.movements[i].position].direction = this.movements[i].direction;
                }
                this.movements[i].position++;
            }

            var count = this.bodyParts.length;

            for (var i = 0; i < count; i++)
            {
                this.bodyParts[i].move();
            }
        },

        checkDirection: function(direction1, direction2)
        {
            var result = true;

            if (direction1 == "down" && direction2 == "up")
                result = false;
            else if (direction1 == "left" && direction2 == "right")
                result = false;
            else if (direction1 == "up" && direction2 == "down")
                result = false;
            else if (direction1 == "right" && direction2 == "left")
                result = false;

            return result;
        },

        addBody: function()
        {
            var bodyPart = this.bodyParts[this.bodyParts.length - 1];

            var newX = bodyPart.x;
            var newY = bodyPart.y;

            if (bodyPart.direction == "up")
            {
                newY += 1;
            }
            else if (bodyPart.direction == "down")
            {
                newY -= 1;
            }
            else if (bodyPart.direction == "left")
            {
                newX += 1;
            }
            else if (bodyPart.direction == "right")
            {
                newX -= 1;
            }

            var newBodyPart = new BodyPart(newX, newY);
            newBodyPart.direction = bodyPart.direction;

            this.bodyParts.push(newBodyPart);
        }

    });

    Movement = game.Class.extend({

        init: function(direction)
        {
            this.direction = direction;
            this.position = 0;
        }

    });

    BodyPart = game.Class.extend({

        init: function(x, y)
        {
            this.x = x;
            this.y = y;

            this.grow = false;

            game.scene.grid[x][y] = this;

            this.sprite = new game.Sprite('snake_body');

            this.moveSprite();

            game.scene.stage.addChild(this.sprite);

            this.direction = "down"
        },

        move: function()
        {
            game.scene.grid[this.x][this.y] = 0;

            if (this.direction == "up")
            {
                this.y -= 1;
            }
            else if (this.direction == "down")
            {
                this.y += 1;
            }
            else if (this.direction == "left")
            {
                this.x -= 1;
            }
            else if (this.direction == "right")
            {
                this.x += 1;
            }

            if (this.x < 0 || this.y < 0 ||
                this.x > game.scene.grid_width - 1 || this.y > game.scene.grid_height - 1)
            {
                game.scene.gameOverScreen();
                return;
            }

            if (game.scene.grid[this.x][this.y] != 0)
            {
                if (game.scene.grid[this.x][this.y] instanceof Food)
                {
                    game.scene.grid[this.x][this.y].eaten();
                    game.scene.snake.bodyParts[game.scene.snake.bodyParts.length - 1].grow = true;
                }
                else if (game.scene.grid[this.x][this.y] instanceof BodyPart)
                {
                    game.scene.gameOverScreen();
                    return;
                }
            }

            game.scene.grid[this.x][this.y] = this;

            if (this.grow)
            {
                game.scene.snake.addBody();
                this.grow = false;
            }

            this.moveSprite();
        },

        moveSprite: function()
        {
            this.sprite.position.x = (this.x * 65) + game.scene.grid_offset_x;
            this.sprite.position.y = (this.y * 65) + game.scene.grid_offset_y;
        }

    });

    Food = game.Class.extend({

        init: function()
        {
            var x = -1;
            var y = -1;

            while (x == -1 || y == -1 || game.scene.grid[x][y] != 0)
            {
                var x = parseInt(Math.random() * game.scene.grid_width);
                var y = parseInt(Math.random() * game.scene.grid_height);
            }

            this.x = x;
            this.y = y;

            game.scene.grid[x][y] = this;

            this.sprite = new game.Sprite('food');

            this.sprite.position.x = (x * 65) + game.scene.grid_offset_x;
            this.sprite.position.y = (y * 65) + game.scene.grid_offset_y;

            game.scene.stage.addChild(this.sprite);
        },

        eaten: function()
        {
            new Food();

            game.scene.stage.removeChild(this.sprite);
            game.scene.grid[this.x][this.y] = 0;
            game.scene.addPoints(1);
        }

    });


});