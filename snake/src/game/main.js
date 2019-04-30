game.module(
    'game.main'
)
.require(
    'game.assets',
    'game.objects',
    'game.scenes'
)

.body(function() {

    game.start(SceneGame, window.innerWidth * game.device.pixelRatio, window.innerHeight * game.device.pixelRatio);

});
