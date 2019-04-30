game.module(
    'game.assets'
)
.require(
    'engine.audio'
)
.body(function() {

// Sprites
game.addAsset('snake_body.png', 'snake_body');
game.addAsset('food.png', 'food');
game.addAsset('tryagainbutton.png', 'retrybutton');

// Font
game.addAsset('arialblack.fnt');

// Sound
//game.addAudio('squish.m4a', 'squish');

});