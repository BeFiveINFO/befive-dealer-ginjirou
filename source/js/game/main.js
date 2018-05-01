/**
 * main.js: uses the following two categories of files to run the phaser game.
 * Roms : have all the programs to make the game work with helps from the routines stored in logic script files
 * PCB: just routines to be used for the roms.
 * Register: holds variables, settings etc.
 */

// the phaser.js Game instance
var Game = new Phaser.Game(1030,645,Phaser.AUTO,'content');

//  The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {
	//  'active' means all requested fonts have finished loading
	//  We set a 1 second delay before calling 'createText'.
	//  For some reason if we don't the browser cannot render the text the first time it's created.
	active: function() {
		Game.add.text(0,28,"WAIT ...",{ font: "bold 28px Arial", fill: "#FFFFFF"});
		// Game.load.onFileError.add(function() {
		// 	Game.add.text(0,56,"RESULT: NG - WEBFONT CONFIG LOAD ERROR",{ font: "bold 28px Arial", fill: "#FFFFFF"});
		// }, this);
		// the delay timer is necessary to make sure that the webfont works
		Game.time.events.add(Phaser.Timer.SECOND, function () {
			Game.add.text(0,56,"TITLE: " + Register.GAME_TITLE,{ font: "28px Skranji", fill: "#ea134b"});
			Game.add.text(0,84,"VERSION: " + Register.GAME_VRESION,{ font: "28px Skranji", fill: "#ea134b"});
			Game.add.text(0,112,"INITIALIZE OK",{ font: "bold 28px Arial", fill: "#FFFFFF"});
			Game.add.text(0,140,"START ASSET LOAD SEQUENCE",{ font: "bold 28px Arial", fill: "#FFFFFF"});
			setTimeout(function(){Game.state.start('Assets');}, 1000);
			// Game.state.start('Assets');
		}, this);
	},
	fontinactive: function () {
		var _click = (window.ontouchstart === undefined)? 'click' : 'touchstart';
		Game.add.text(0,28,"RESULT: NG - INTERNET CONNECTION TIMEOUT",{ font: "bold 28px Arial", fill: "#FFFFFF"});
		if(_click === 'touchstart') {
			Game.add.text(0,56,"TOUCH SCREEN TO REBOOT",{ font: "bold 28px Arial", fill: "#FFFFFF"});
		} else {
			Game.add.text(0,56,"CLICK SCREEN TO REBOOT",{ font: "bold 28px Arial", fill: "#FFFFFF"});
		}
		Game.canvas.addEventListener(_click, function () {
			document.location.href = document.location.href;
		});
	},
	//  The Google Fonts we want to load (specify as many as you like in the array)
	google: {
	  families: ['Skranji:700','Merienda+One']
	},
};

/**
 * Kickstart upon onLoad of the index.html
 * Note: the code below (DOMContentLoaded) does not work on IE8
*/
document.addEventListener("DOMContentLoaded", function(event) {
	// Set up the initial screen and variables for the game. Also least required images and fonts needed.
	Game.state.add('Boot', Rom.boot);
	// Preload assets e.g. images and sound
	Game.state.add('Assets', Rom.assets);
	// Logo splash for about 4 seconds.
	Game.state.add('LogoSplash', Rom.state.logoSplash);
	// Title loop, waiting for touch or button click by user
	Game.state.add('TitleLoop', Rom.state.titleLoop);
	// Opening
	Game.state.add('GameOpening', Rom.state.opening);
	// The game loop
	Game.state.add('GameLoop', Rom.state.game);
	// The game loop
	Game.state.add('GameOver', Rom.state.gameover);
	// set test_switch to true by settings.json to enter the test mode
	Game.state.add('Test', Rom.state.test);
	// now boot the game
	Game.state.start('Boot');
});

