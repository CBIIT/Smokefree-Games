game.module(
    'game.assets'
)
.require(
    'engine.audio'
)
.body(function() {

// Sprites
game.addAsset('strawberry.png', 'redgem');
game.addAsset('orange.png', 'bluegem');
game.addAsset('kiwi.png', 'greengem');
game.addAsset('restart-button.png', 'retrybutton');
game.addAsset('scoreboard.png', 'scoreboard');
game.addAsset('background.png', 'background');
game.addAsset('score.png', 'score');

// Font
game.addAsset('arial.fnt');
game.addAsset('arialred.fnt');
game.addAsset('impact_black.fnt');
game.addAsset('impact_white.fnt');

// Sound
//game.addAudio('glass.m4a', 'glass');

});