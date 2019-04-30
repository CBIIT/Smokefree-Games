game.module(
    'game.assets'
)
.require(
    'engine.audio'
)
.body(function() {

// Sprites
game.addAsset('spider1.png', 'spider1');
game.addAsset('spider2.png', 'spider2');
game.addAsset('spider3.png', 'spider3');
game.addAsset('grass.png', 'grass');
game.addAsset('rock.png', 'rock');
game.addAsset('redcircle.png', 'redcircle');
game.addAsset('tryagainbutton.png', 'retrybutton');
game.addAsset('scoreboard.png', 'scoreboard');
game.addAsset('background.png', 'background');
game.addAsset('score.png', 'score');

// Font
game.addAsset('arial.fnt');
game.addAsset('arialred.fnt');
game.addAsset('impact_black.fnt');
game.addAsset('impact_white.fnt');

// Sound
game.addAudio('squish.m4a', 'squish');

});