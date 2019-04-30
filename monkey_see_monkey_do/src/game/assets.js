game.module(
    'game.assets'
)
.require(
    'engine.audio'
)
.body(function() {

// Sprites
game.addAsset('red_tile.png', 'redtile');
game.addAsset('blue_tile.png', 'bluetile');
game.addAsset('green_tile.png', 'greentile');
game.addAsset('yellow_tile.png', 'yellowtile');
game.addAsset('red_tile_glow.png', 'redtileglow');
game.addAsset('blue_tile_glow.png', 'bluetileglow');
game.addAsset('green_tile_glow.png', 'greentileglow');
game.addAsset('yellow_tile_glow.png', 'yellowtileglow');
game.addAsset('tryagainbutton.png', 'retrybutton');
game.addAsset('background.png', 'background');
game.addAsset('score.png', 'score');
game.addAsset('gameover.png', 'gameover');

// Font
game.addAsset('impact_black.fnt');
game.addAsset('impact_white.fnt');

// Sound
//game.addAudio('button.m4a', 'button');

});