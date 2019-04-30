game.module(
    'game.assets'
)
.require(
    'engine.audio'
)
.body(function() {

// Sprites
game.addAsset('diamond.png', 'blackbutton');
game.addAsset('coal.png', 'redbutton');
game.addAsset('win.png', 'tryagain');
game.addAsset('logo.png', 'logo');
game.addAsset('help.png', 'help');
game.addAsset('back.png', 'back');

// Font
game.addAsset('arial.fnt');
game.addAsset('arialred.fnt');
game.addAsset('impact_black.fnt');
game.addAsset('impact_white.fnt');


// Sound
//game.addAudio('button.m4a', 'button');

});

