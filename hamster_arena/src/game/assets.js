game.module(
    'game.assets'
)
.require(
    'engine.audio'
)
.body(function() {

// Sprites
game.addAsset('banner.png', 'banner');
game.addAsset('basketball_floor.png', 'floor');
game.addAsset('basketball.png', 'basketball');
game.addAsset('basketball_hoop.png', 'hoop');
game.addAsset('hamster_000.png', 'hamster0');
game.addAsset('hamster_001.png', 'hamster1');
game.addAsset('hamster_002.png', 'hamster2');
game.addAsset('scoreboard.png', 'scoreboard');
game.addAsset('restart.png', 'restart');
game.addAsset('shadow.png', 'shadow');
game.addAsset('score.png', 'score');


// Font
game.addAsset('arialblack.fnt');
game.addAsset('arialred.fnt');
game.addAsset('font.fnt');

// Sound
//game.addAudio('button.m4a', 'button');

});