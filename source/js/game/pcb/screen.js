/*
	logic: screen
	routines used for screen change, fullscreen
	*/
// Make Printed circuit board if it does not exist yet (to deal with load order issue here).
if(!PCB) var PCB = {};

// print PCB
PCB.screen = {
	/** properties */
	/** methods */
	show: function(_context) {
		var _screen_id = _context.id;
		var _arguments = _context.arguments;
		if(!_screen_id) return false;
		Rom.screen[_screen_id](_arguments);
	},
	/**
	 * set _switch to false to show the game in window. set true for full screen
	 * Game.scale.startFullScreen might give the following error in console depending on your environment.
	 * See @method Phaser.ScaleManager#fullScreenChange
	 + In case of OSX Chrome:
	 * 	"Uncaught TypeError: Cannot read property 'dispatch' of undefined" phaser.js:95194
	 * In case of OSX Firefox (40)
	 * 	TypeError: this.enterFullScreen is undefined
	 * Please ignore if you have caught these above.
	 * Additional note: on mobile devices Automatic full screen
	 * is most likely disabled by manufacturers.
	 * The full screen might not work on iOS. for this reason there is no full screen button displayed on iOS devices.
	 * Try running the game app on remote server instead of local ones just in case ... without any guarantee
	 * (if you are testing the game app on local machines).
	 */
	toggleFullScreen: function (_switch) {
		if(typeof _switch === 'undefined') {
			_switch = (Game.scale.isFullScreen === true) ? false : true;
		}
		if (_switch === true) {
			Game.scale.startFullScreen(false);
		} else {
			Game.scale.stopFullScreen();
		}
		return Game.scale.isFullScreen;
	},
	/**
	 *	see here : [SOLUTION] Scaling for multiple devices,resolution and screens
	 *  http://www.html5gamedevs.com/topic/5949-solution-scaling-for-multiple-devicesresolution-and-screens/
	 */
	setUpScreenScaling: function () {
		var _element = document.getElementsByTagName('canvas')[0];
		// set overflow
		_element.style.overflow = "hidden";
		// init orientation locking
		this.initOrientationLock();
		// scaling
		Game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		Game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		Game.stage.disableVisibilityChange = true; // let the game stop when the tab or window is inactive
		Game.scale.minWidth = Game.width/2;
		Game.scale.minHeight = Game.height/2;
		Game.scale.pageAlignHorizontally = true;
		Game.scale.pageAlignVertically = true;
		// if (Game.device.desktop) {
			// Game.scale.maxWidth = Game.width;
			// Game.scale.maxHeight = Game.height;
		// } else {
		// 	Game.scale.maxWidth = 2048;
		// 	Game.scale.maxHeight = 1228;
		// }
		// Game.paused = true;
		Game.scale.setResizeCallback(PCB.screen.lockScreenOrientation);
	},
	/**
	 * Locking orientation
	 */
	initOrientationLock: function () {
		var $_orientation_message = document.getElementById('orientation_message');
		// determine game screen orientation
		Register.isScreenOrientationLandscape = PCB.screen.findIfScreenOrientationIsLandscape(Game.width, Game.height);
		if($_orientation_message == null) {
			// console.log("div#orientation_message not found.");
			return false;
		}
		if(Register.isScreenOrientationLandscape === true) {
			$_orientation_message.setAttribute('class', 'landscape');
		} else {
			$_orientation_message.setAttribute('class', 'portrait');
		}
		this.lockScreenOrientation();
	},
	lockScreenOrientation: function () {
		var $_orientation_message = document.getElementById('orientation_message');
		var _currentOrientationIsLandscape = PCB.screen.findIfScreenOrientationIsLandscape(window.innerWidth,window.innerHeight);
		// if(_currentOrientationIsLandscape !== Register.isScreenOrientationLandscape) {
		// 	// is different from the game orientation. show the message
		// 	$_orientation_message.style.display="block";
		// 	Game.paused = true;
		// } else if($_orientation_message) {
		// 	// orientation is normal. keep it hidden
		// 	$_orientation_message.style.display="none";
		// 	Game.paused = false;
		// }
	},
	findIfScreenOrientationIsLandscape: function (gameWidth,gameHeight) {
		if( gameWidth > gameHeight ) {
			return true;
		} else {
			return false;
		}
	},
};
