game.module (
    'game.objects'
)
.require(
    'engine.sprite'
)

.body(function() {

    Pellet = game.Class.extend({
        scale: 1,
        active: true,

        init: function(speedBase)
        {
            var rotation = (Math.random() * 3) + 3;
            var speed = parseInt(Math.random() * 1000) + speedBase;

            this.sprite = new game.Sprite('basketball');
            this.sprite.interactive = true;

            this.sprite.anchor.set(.5, .5);

            this.sprite.scale.x = .1;
            this.sprite.scale.y = .1;

            this.sprite.position.x = game.scene.hamster.position.x + (game.scene.hamster.width / 2) + 20;
            this.sprite.position.y = game.scene.hamster.position.y + 115;

            game.scene.stage.addChild(this.sprite);

            tween = new game.Tween(this.sprite.scale)
                .to({ x: this.scale, y: this.scale }, speed)
                .easing(game.Tween.Easing.Quadratic.In);
            tween.start();

            tween.onComplete(this.complete.bind(this));

            tween2 = game.scene.addTween(this.sprite, {rotation: rotation}, speed);
            tween2.start();

            var x = parseInt(Math.random() * (game.system.width - (this.sprite.width))) + (this.sprite.width / 2);
            var y = parseInt(Math.random() * (game.system.height - (this.sprite.height + 300))) + (this.sprite.width / 2);

            tween3 = new game.Tween(this.sprite.position)
                .to({x: x, y: y}, speed)
                .easing(game.Tween.Easing.Sinusoidal.In);
            tween3.start();

            this.sprite.touchstart = function() {
                if (this.scale.x > .6) {
                    tween.stop();
                    tween2.stop();
                    tween3.stop();
                    tween.onCompleteCallback(true);
                }
            }

            this.shadow = new game.Sprite('shadow');

            this.shadow.anchor.set(.5, .5);

            this.shadow.position.x = this.sprite.position.x;
            this.shadow.position.y = this.sprite.position.y + 195;
            this.shadow.alpha = .3;

            this.shadow.scale.x = .8;
            this.shadow.scale.x = .8;

            shadowTweenScale = new game.Tween(this.shadow.scale)
                .to({ x: (this.scale * 9) - 3, y: (this.scale * 9) - 3 }, speed)
                .easing(game.Tween.Easing.Quadratic.In);
            shadowTweenScale.start();

            shadowTweenPosition = new game.Tween(this.shadow.position)
                .to({x: x, y: game.system.height}, speed)
                .easing(game.Tween.Easing.Sinusoidal.In);
            shadowTweenPosition.start();

            game.scene.stage.addChild(this.shadow);
        },

        complete: function(touched) {

            if (this.active) {
                this.active = false;

                if (touched) {

                    var xPos;

                    if (this.sprite.position.x < game.system.width / 2) {
                        xPos = -500;
                    }
                    else {
                        xPos = game.system.width + 500;
                    }

                    var moveTween = new game.Tween(this.sprite.position)
                        .to({x: xPos, y: 0}, 700);
                    moveTween.start();

                    var scaleTween = new game.Tween(this.sprite.scale)
                        .to({x: .1, y: .1}, 500);
                    scaleTween.start();

                    var spinTween = game.scene.addTween(this.sprite, {rotation: -1}, 700);
                    spinTween.start();

                    game.scene.stage.removeChild(this.shadow);

                    game.scene.addPoint();

                    moveTween.onComplete(this.finished.bind(this));
                }
                else {
                    game.scene.stage.removeChild(this.shadow);

                    game.scene.pelletMissed();

                    this.finished();
                }

                game.scene.startNewPellet();
            }
        },

        finished: function() {
            game.scene.stage.removeChild(this.sprite);
        }
    });
});