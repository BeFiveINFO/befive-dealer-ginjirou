/*
	rom: boot

	Initializes the game... check up supported technologies, show loading screen
	*/
// Make Rom if it does not exist yet (to deal with load order issue here).
if(!Rom) var Rom = {};

// burn rom
/**
 * This is one of those stages, separated from the stages in the Rom
 * to make maintanance easier
 * Loads least required assets (preloading) before moving onto the assets stage
*/
Rom.boot = {
	// properties
	// methods
	init: function() {
		// it needs to set advancedTiming to true otherwise the fps is not updated
		Game.time.advancedTiming = true;
		// Game screen background color
		Game.stage.backgroundColor = '#444444';
		// call screen scaling function at boot
		PCB.screen.setUpScreenScaling();
		// PCB.screen.screenScaling();
		// Game screen size init
		Game.input.maxPointers = 1;
		// system check up
		// check up audio support. Ogg by default
		if(navigator.userAgent.match(/Windows Phone/i) === true) {
			// disable sound support on windows phone
			Register.audioType = false;
		} else if(Modernizr.audio.ogg) {
			Register.audioType = 'ogg';
		} else {
			// for IE or Safari  (AAC)
			Register.audioType = 'm4a';
		}
		// detect touch support with the browser
		if(Modernizr.touch) {
			Register.touchDevice = true;
		}
		Game.add.text(0,0,"SYSTEM INITIALIZING ...",{ font: "bold 28px Arial", fill: "#FFFFFF"});
		/**
		 * This may not work.
		 * full screen by default if this program is running on either iOS or Android (mobile phones)
		 */
		if(Phaser.Device.iOS === true || Phaser.Device.iOS.android === true) {
			PCB.screen.toggleFullScreen(false);
		}
		// adding an event listner here in case of network error. This listener will be removed in WebFontConfig, main.js
		Game.load.onFileError.add(this.onFileError, this);
	},
	preload: function() {
		//  Load the Google WebFont Loader script
		Game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		Game.load.image('company_logo', 'images/logo/company_logo.png');
		Game.load.image('fullScreen_off', 'images/ui/fullScreen_off.png');
		Game.load.image('fullScreen_on', 'images/ui/fullScreen_on.png');
	},
	create: function () {
		// Note Game.state.start('Assets'); called in WebFontConfig, in main.js
	},
	render: function () {
		Game.debug.text( Game.time.fps + ' FPS', 15, Game.world.height - 15, undefined, 'bold 28px' );
	},
	onFileError: function () {
		Game.add.text(0,30,"ERROR: This game system needs to be run on webserver",{ font: "bold 28px Arial", fill: "#FF0000"});
		console.log("FILE COULD NOT BE LOADED FROM INTERNET.");
	}
};
