/*
 * rom: test
 **/
// Make Rom if it does not exist yet (to deal with load order issue here).
if(!Rom) var Rom = {};
if(!Rom.hasOwnProperty('state')) Rom.state = {};

// This state Test has all from sprite to screen roms
Rom.state.test = {
	init: function () {
		// set the background color to black
		Game.stage.backgroundColor = '#000000';
		// set the world alpha to 1
		Game.world.alpha = 1;
		// stop all the sound here just to make sure
		PCB.audio.stop();
		// it needs to set advancedTiming to true otherwise the fps is not updated
		Game.time.advancedTiming = true;
		// construct audio asset list
		this.constructAudioAssetList();
	},
	preload: function () {
		// button
		Game.load.spritesheet('button_red', 'images/ui/button_red.png', 140, 140);
		Game.load.spritesheet('button_blue', 'images/ui/button_blue.png', 140, 140);
		Game.load.spritesheet('button_yellow', 'images/ui/button_yellow.png', 140, 140);
	},
	create: function () {
		// set up buttons
		Register.debug = {};
		Register.debug.spriteInstances = {};
		Register.debug.groupInstances = {};
		Register.debug.spriteInstances.button_red = Game.add.button(Game.world.width - 80, Game.world.height-80, 'button_red', this.buttonInput, this, 2, 1, 0);
		Register.debug.spriteInstances.button_blue = Game.add.button(Game.world.width - 80*2, Game.world.height-80, 'button_blue', this.buttonInput, this, 2, 1, 0);
		Register.debug.spriteInstances.button_yellow = Game.add.button(Game.world.width - 80*3, Game.world.height-80, 'button_yellow', this.buttonInput, this, 2, 1, 0);
		Register.debug.spriteInstances.button_red.scale.setTo(0.5);
		Register.debug.spriteInstances.button_blue.scale.setTo(0.5);
		Register.debug.spriteInstances.button_yellow.scale.setTo(0.5);
		Register.debug.groupInstances.button_control = Game.add.group();
		Register.debug.groupInstances.button_control.add(Register.debug.spriteInstances.button_red);
		Register.debug.groupInstances.button_control.add(Register.debug.spriteInstances.button_blue);
		Register.debug.groupInstances.button_control.add(Register.debug.spriteInstances.button_yellow);
		//
		this.currentScreen = 0;
		// first screen
		this.screen_settings();
		// this.currentScreen = 3;
		// this.reel_test();

		// this.indent_you_win();
		// this.leaders_board_test();
		// this.option_menu_panel_test();
		// this.ad_provider_test();
		// this.ad_banner_test();
		// this.network_test();

		// pointer test flag
		// this.pointer_test = false;
		/**
		* Pointers
		*/
		Game.input.addPointer();
		Game.input.addPointer();
		Game.input.addPointer();
		Game.input.addPointer();
	},
	update: function () {
	},
	render: function () {
		// Game.debug.text( , 15, Game.world.height - 30, undefined, 'bold 28px Skranji' );
		// 26
		this.setTestScreenText(25, Game.time.fps + ' FPS',{ font: "24px Skranji", fill: "#ff0000", stroke: "#FFFFFF", strokeThickness: 3, align: "right" });

		if(this.pointer_test === true) {
			//  Just renders out the pointer data when you touch the canvas
			Game.debug.pointer(Game.input.mousePointer);
			Game.debug.pointer(Game.input.pointer1);
			Game.debug.pointer(Game.input.pointer2);
			Game.debug.pointer(Game.input.pointer3);
			Game.debug.pointer(Game.input.pointer4);
			Game.debug.pointer(Game.input.pointer5);
			Game.debug.pointer(Game.input.pointer6);
		}
	},
	/**
	 * Properties
	 */
	'buttonCallbacks': {
		button_red: function() {Rom.state.test.nextScreen();},
		button_blue: function() {console.log('blue');},
		button_yellow: function() {console.log('yellow');},
	},
	'screenOrders': [
		'screen_settings',
		'screen_crossHatch',
		'screen_colors',
		'reel_test',
		'indent_fight',
		'indent_you_lose',
		'indent_you_win',
		// 'ad_provider_test',
		// 'ad_banner',
		'network_test',
	],
	'audioAssetList': {},
	'currentScreen': 0,
	'currentSound': 0,
	/**
	 * methods for test screen
	 */
	 screen_settings: function () {
		this.setTestScreenText(3,'SETTINGS');
		this.setTestScreenText(5,'Company logo flash : '+Register.show_company_logo_flash);
		this.setTestScreenText(7,'Mute sound by default : '+Register.mute_sound);
		this.setTestScreenText(9,'Game difficulty : '+Register.game_difficulty);
		this.setTestScreenText(11,'Price decale : '+Register.price_decale);
		this.setTestScreenText(13,'Freeplay : '+Register.free_play);
		this.setTestScreenText(15,'Serial number : '+Register.serial_number);
		this.setTestScreenText(17,'Test mode : '+Register.test_switch);
		this.setTestScreenText(20,'Sound : Press YELLOW TO Start');
		this.setTestScreenText(22,'Press RED for the next test');
		this.setTestScreenText(23,'RESTART to EXIT TEST MODE');
		this.setTestScreenText(24,'VERSION: '+ Register.GAME_VRESION);

		this.buttonCallbacks.button_yellow = function () {
			Rom.state.test.nextSound();
		};
		this.buttonCallbacks.button_blue = function () {
		};
		Register.debug.spriteInstances.button_blue.visible = false;
		Register.debug.spriteInstances.button_yellow.visible = true;
		PCB.sprite({'id':'button_fullScreen'});
	 },
	 screen_crossHatch: function () {
		this.clearScreen();
		var _graphics = Register.spriteInstances.hatch = Game.add.graphics(0,0); // top left corner as the origin
		// Note: screen size as set in the main.js is 960 x 644. Take edges and line thickness into account
		// four edges top
		_graphics.lineStyle(1, 0xFFFFFF, 1);
		_graphics.moveTo(0, 0);
		_graphics.lineTo(Game.width, 0);
		// bottom
		_graphics.lineStyle(1, 0xFFFFFF, 1);
		_graphics.moveTo(0, Game.height-2);
		_graphics.lineTo(Game.width-1, Game.height-2);
		// left
		_graphics.lineStyle(1, 0xFFFFFF, 1);
		_graphics.moveTo(0, 0);
		_graphics.lineTo(0, Game.height - 2);
		// right
		_graphics.lineStyle(1, 0xFFFFFF, 1);
		_graphics.moveTo(Game.width - 1, 0);
		_graphics.lineTo(Game.width - 1, Game.height - 2);
		// draw horizontal lines 58px (644px)
		var _height = Game.height / 11;
		for ( var _i = 1 ; _i < 11; _i ++) {
			_graphics.lineStyle(2, 0xFFFFFF, 1);
			_graphics.moveTo(0, _height * _i);
			_graphics.lineTo(Game.width, _height * _i);
		}
		// vertical lines 60px (960px)
		var _width = (Game.width)/ 16;
		for ( _i = 1 ; _i < 16; _i ++) {
			_graphics.lineStyle(2, 0xFFFFFF, 1);
			_graphics.moveTo(_width * _i, 0);
			_graphics.lineTo(_width * _i, Game.height - 2);
		}
		Register.debug.spriteInstances.button_blue.visible = false;
		Register.debug.spriteInstances.button_yellow.visible = false;

		this.pointer_test = true;
	 },
	 screen_colors: function () {
		this.clearScreen();
		// gradation
		// RED
		var _bmd_red = Game.add.bitmapData(700, 100);
		var _grd_red = _bmd_red.context.createLinearGradient(0, 100, 700, 100);
		_grd_red.addColorStop(0, '#000000');
		_grd_red.addColorStop(1, '#FF0000');
		_bmd_red.context.fillStyle = _grd_red;
		_bmd_red.context.fillRect(0, 0, 700, 100);
		Game.cache.addBitmapData('red', _bmd_red);
		// GREEN
		var _bmd_green = Game.add.bitmapData(700, 100);
		var _grd_green = _bmd_green.context.createLinearGradient(0, 100, 700, 100);
		_grd_green.addColorStop(0, '#000000');
		_grd_green.addColorStop(1, '#00FF00');
		_bmd_green.context.fillStyle = _grd_green;
		_bmd_green.context.fillRect(0, 0, 700, 100);
		Game.cache.addBitmapData('green', _bmd_green);
		//	BLUE
		var _bmd_blue = Game.add.bitmapData(700, 100);
		var _grd_blue = _bmd_blue.context.createLinearGradient(0, 100, 700, 100);
		_grd_blue.addColorStop(0, '#000000');
		_grd_blue.addColorStop(1, '#0000FF');
		_bmd_blue.context.fillStyle = _grd_blue;
		_bmd_blue.context.fillRect(0, 0, 700, 100);
		Game.cache.addBitmapData('blue', _bmd_blue);
		// WHITE
		var _bmd_white = Game.add.bitmapData(700, 100);
		var _grd_white = _bmd_white.context.createLinearGradient(0, 100, 700, 100);
		_grd_white.addColorStop(0, '#000000');
		_grd_white.addColorStop(1, '#FFFFFF');
		_bmd_white.context.fillStyle = _grd_white;
		_bmd_white.context.fillRect(0, 0, 700, 100);
		Game.cache.addBitmapData('white', _bmd_white);

		// show the barson screen
		Register.spriteInstances.red = Game.add.sprite(200, 100, Game.cache.getBitmapData('red'));
		Register.spriteInstances.green = Game.add.sprite(200, 210, Game.cache.getBitmapData('green'));
		Register.spriteInstances.blue = Game.add.sprite(200, 320, Game.cache.getBitmapData('blue'));
		Register.spriteInstances.white = Game.add.sprite(200, 430, Game.cache.getBitmapData('white'));
		// test
		this.setTestScreenText(2,'COLOR TEST');
		this.setTestScreenText(6,'RED');
		Register.spriteInstances.line_6.x = -440;
		this.setTestScreenText(11,'GREEN');
		Register.spriteInstances.line_11.x = -440;
		this.setTestScreenText(16,'BLUE');
		Register.spriteInstances.line_16.x = -440;
		this.setTestScreenText(20,'WHITE');
		Register.spriteInstances.line_20.x = -440;
		// hide unnecessary buttons
		Register.debug.spriteInstances.button_blue.visible = false;
		Register.debug.spriteInstances.button_yellow.visible = false;
	 },
	 reel_test: function () {
	 	var _self = this;
		// clear screen first
		this.clearScreen();
		// background
		PCB.sprite({'id':'game_background'});
		// Caps
		PCB.sprite({'id':'card_even'});
		PCB.sprite({'id':'card_odd'});
		PCB.sprite({'id':'card_odd',arguments:'show_display'});
		PCB.sprite({'id':'card_even',arguments:'show_display'});
		PCB.sprite({'id':'caption_han_cho'});
		// build and show reels
		PCB.reels.buildReels();
		PCB.reels.showReels();
		// ui text
		// this.setTestScreenText(3,'REEL TEST');
		this.setTestScreenText(1,'Left Reel Degrees: 0');
		this.setTestScreenText(2,'Left Reel Poket #: 0');
		this.setTestScreenText(3,'Right Reel Degrees: 0');
		this.setTestScreenText(4,'Right Reel Pocket #: 0');
		// this.setTestScreenText(9,'Reel Test Mode:');
		// Line horizontally
		// Register.spriteInstances.line_1.x = 300;
		// Register.spriteInstances.line_2.x = 300;
		// Register.spriteInstances.line_3.x = 300;
		// Register.spriteInstances.line_4.x = 300;
		// Register.spriteInstances.line_9.x = 300;
		// show buttons
		Register.debug.spriteInstances.button_blue.visible = true;
		Register.debug.spriteInstances.button_yellow.visible = true;
		Game.world.bringToTop(Register.debug.groupInstances.button_control);

		// keys
		Register.keyinputInstances.reel_toggle_1 = Game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		Register.keyinputInstances.reel_toggle_1.onDown.add(function() {
			var $_targetReel = Register.reels[0];
			$_targetReel.disc.angle -= 1;
			PCB.reels.getCurrentStopID(0);
		}, this);
		Register.keyinputInstances.reel_toggle_2 = Game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		Register.keyinputInstances.reel_toggle_2.onDown.add(function() {
			var $_targetReel = Register.reels[0];
			$_targetReel.disc.angle += 1;
			PCB.reels.getCurrentStopID(0);
		}, this);

		// button callback
		/**
		 * Select mode: game_play (reel_test_game_play == true), keep_rotation (reel_test_game_play == false)
		 */
		this.reel_test_game_play = true;
		this.buttonCallbacks.button_yellow = function () {
			PCB.reels.startGame();
		};
		/**
		 * Toggle Test On / Off, or Execute Test
		 */
		 var _isReelVisible = true;
		this.buttonCallbacks.button_blue= function () {
			if(_isReelVisible === true) {
				PCB.reels.hideReels();
				_isReelVisible = false;
			} else {
				PCB.reels.showReels();
				_isReelVisible = true;
			}

		};
		// update the timer loop
		Game.state.update = function () {

		};

		function updateDebugDisplay() {
			var $_targetReel = Register.reels[0];
			_self.setTestScreenText(1,'Left Reel Degrees: ' + $_targetReel.currentAngle);
			_self.setTestScreenText(2,'Left Reel Poket #' + $_targetReel.currentStop);
			$_targetReel = Register.reels[1];
			_self.setTestScreenText(3,'Right Reel Degrees: ' + $_targetReel.currentAngle);
			_self.setTestScreenText(4,'Right Reel Poket #' + $_targetReel.currentStop);
		}

		// add event for reel system
		PCB.event.add('onStartReelSpin', function () {
			PCB.sprite({'id':'caption_han_cho',arguments:'hide'});
		});
		PCB.event.add('onCompleteSpinReel', function () {
			updateDebugDisplay();
		});
		// now reels can be spinned.
		Register.spinReady = true;
	 },
	 indent_fight: function () {
		this.clearScreen();
		this.setTestScreenText(3,'INDENT FIGHT TEST');
		this.setTestScreenText(15,'PRESS YELLOW BUTTON TO TEST INDENT');
		// init once
		PCB.sprite({'id':'indent_fight'});
		// button callback
		this.buttonCallbacks.button_yellow = function () {
			PCB.sprite({'id':'indent_fight'});
		};
		// test buttons
		Register.debug.spriteInstances.button_blue.visible = false;
		Register.debug.spriteInstances.button_yellow.visible = true;
		Game.world.bringToTop(Register.debug.groupInstances.button_control);
	 },
	 indent_you_lose: function () {
		this.clearScreen();
		this.setTestScreenText(3,'INDENT LOSE TEST');
		this.setTestScreenText(15,'PRESS YELLOW BUTTON TO TEST INDENT');
		// init once
		PCB.sprite({'id':'indent_you_lose'});
		// button callback
		this.buttonCallbacks.button_yellow = function () {
			PCB.sprite({'id':'indent_you_lose'});
		};
		// test buttons
		Register.debug.spriteInstances.button_blue.visible = false;
		Register.debug.spriteInstances.button_yellow.visible = true;
		Game.world.bringToTop(Register.debug.groupInstances.button_control);
	 },
	 indent_you_win: function () {
		this.clearScreen();
		this.setTestScreenText(3,'INDENT WIN TEST');
		this.setTestScreenText(15,'PRESS YELLOW BUTTON TO TEST INDENT');
		// init once
		PCB.sprite({'id':'indent_you_win'});
		// button callback
		this.buttonCallbacks.button_yellow = function () {
			// simulate win
			Register.creditCount = 0;
			Register.winCount = 0;
			Register.pending_current_credits = 10000;
			Register.pending_current_win = 10000;
			// start the indent event
			PCB.sprite({'id':'indent_you_win'});
		};
		// test buttons
		Register.debug.spriteInstances.button_blue.visible = false;
		Register.debug.spriteInstances.button_yellow.visible = true;
		Game.world.bringToTop(Register.debug.groupInstances.button_control);
	 },
	/**
	 * Ad Test
	 *
	 */
	// ad_provider_test: function () {
	// 	this.clearScreen();
	// 	// rest
	// 	this.setTestScreenText(3,'AD PROVIDER TEST');
	// 	this.setTestScreenText(10,'PRESS BLUE BUTTON TO TEST AD');
	// 	Register.debug.spriteInstances.button_blue.visible = true;
	// 	Register.debug.spriteInstances.button_yellow.visible = false;
	// 	Game.world.bringToTop(Register.debug.groupInstances.button_control);

	// 	var _self = this;

	// 	// button callback
	// 	this.buttonCallbacks.button_blue = function () {
	// 		if(Register.adProvider_url === '') {
	// 			_self.setTestScreenText(10,'ADPROVIDER URL NOT SET');
	// 		} else {
	// 			_self.setTestScreenText(10,'AD STARTED');
	// 			PCB.adProvider.requestAd();
	// 		}
	// 	};

	// 	// ad finished event
	// 	PCB.event.add('adFinished', function () {
	// 		_self.setTestScreenText(10,'AD FINISHED');
	// 	});
	// },
	// ad_banner_test: function () {
	// 	this.clearScreen();
	// 	// rest
	// 	this.setTestScreenText(3,'AD BANNER TEST');
	// 	this.setTestScreenText(10,'PRESS BLUE BUTTON TO TEST AD');
	// 	Register.debug.spriteInstances.button_blue.visible = true;
	// 	Register.debug.spriteInstances.button_yellow.visible = false;
	// 	Game.world.bringToTop(Register.debug.groupInstances.button_control);

	// 	var _self = this;

	// 	// button callback
	// 	this.buttonCallbacks.button_blue = function () {
	// 		_self.setTestScreenText(10,'AD STARTED');
	// 		PCB.adBanner.showAd();
	// 	};

	// 	// ad finished event
	// 	PCB.event.add('adBannerFinished', function () {
	// 		_self.setTestScreenText(10,'AD FINISHED');
	// 	});
	// },
	network_test: function () {
		this.clearScreen();
		// rest
		this.setTestScreenText(3,'NETWORK TEST');
		this.setTestScreenText(7,'PRESS BLUE BUTTON TO START');
		Register.debug.spriteInstances.button_blue.visible = true;
		Register.debug.spriteInstances.button_yellow.visible = false;
		Game.world.bringToTop(Register.debug.groupInstances.button_control);
		var _self = this;

		var _startTime;
		var _endTime;

		// button callback
		this.buttonCallbacks.button_blue = function () {
			_self.setTestScreenText(12,'');
			_self.setTestScreenText(14,'');
			_self.setTestScreenText(15,'');
			_self.setTestScreenText(16,'');
			if(Register.play_be_net_url === '') {
				_self.setTestScreenText(10,'PLAYBE URL NOT SET');
			} else {
				_self.setTestScreenText(20,'TEST STARTED');
				PCB.network.sendRequest({'ajax_command':'test','serial_number':Register.serial_number});
				_startTime = new Date();
			}
		};

		/** events */
		PCB.event.add('onNetworkSuccess', function ( response ) {
			_endTime = new Date();
			var _resultTime = _endTime - _startTime;
			_self.setTestScreenText(20, 'COMMUNICATION TIME : ' + _resultTime + ' MS');
			var _response = PCB.network.parseResponse(response);
			if(_response !== false) {
				_self.setTestScreenText(12,'LICENSE CODE : ' + _response.serial_number);
				_self.setTestScreenText(14,'SERVER LOAD (01 MIN): '+ _response.server_load[0]);
				_self.setTestScreenText(15,'SERVER LOAD (05 MIN): '+ _response.server_load[1]);
				_self.setTestScreenText(16,'SERVER LOAD (15 MIN): '+ _response.server_load[2]);
				_self.setTestScreenText(18,'REQUEST FREQ. : '+ _response.request_frequency+ ' SEC.');
			}
		});

		PCB.event.add('onNetworkServerError', function () {
			_self.setTestScreenText(10,'SERVER ERROR');

		});

		PCB.event.add('onNetworkError', function () {
			_self.setTestScreenText(10,'NETWORK ERROR');
		});
	},
	 /**
	 * methods for test actions
	 */
	 nextScreen: function () {
		if(this.currentScreen > this.screenOrders.length - 2) {
			this.currentScreen = 0;
		} else {
			this.currentScreen++;
		}
		this.clearScreen();
		var _screenID = this.screenOrders[this.currentScreen];
		this[_screenID]();
	 },
	 clearScreen: function () {
		// clock removal
		PCB.clock.removeAll();
		// event removal
		PCB.event.removeAll();
		// remove all the sprites
		for ( var _key in Register.spriteInstances) {
			if(Register.spriteInstances[_key] && Object.keys(Register.spriteInstances[_key]).length) {
				Register.spriteInstances[_key].destroy();
			}
		}
		for ( var _key in Register.groupInstances) {
			if(Register.groupInstances[_key] && Object.keys(Register.groupInstances[_key]).length) {
				Register.groupInstances[_key].destroy();
			}
		}
		Register.spriteInstances = {};
		Register.groupInstances = {};
		// making sure that there will be no ghost sprites
		PCB.sprite({'destroy_all':true});
		// discard key events
		for ( var _key in Register.keyinputInstances) {
			delete Register.keyinputInstances[_key];
		}
		Game.input.keyboard.reset();
		Register.keyinputInstances = {};
		this.currentSound = 0;
		Game.state.update = function () {};
		PCB.reels.removeReel();
		this.buttonCallbacks.button_yellow = function () {};
		this.buttonCallbacks.button_blue = function () {};
		// pointer test reset
		this.pointer_test = false;
		// clear debug
		Game.debug.reset();
	 },
	 /**
	  * Sprite manupulation
	  */
	 setTestScreenText: function (_lineNum, _textString, _arguments ) {
		var _objectName = 'line_'+_lineNum;
		if(Register.spriteInstances[_objectName]) {
			// Register.spriteInstances[_objectName].destroy();
			Register.spriteInstances[_objectName].setText(_textString);
			return;
		}
		if(!_arguments) {
			_arguments = { font: "24px Skranji", fill: "#ea134b", stroke: "#FFFFFF", strokeThickness: 3, boundsAlignH: 'center', boundsAlignV: 'middle'};
		}
		Register.spriteInstances[_objectName] = Game.add.text(0, 0,_textString,_arguments);
		Register.spriteInstances[_objectName].setTextBounds(0,24*_lineNum,Game.width, 24);
	 },
	 bringToTop_buttons: function () {
		Game.world.bringToTop(Register.groupInstances.button_control);
	 },
	 /**
	  * Input events
	  */
	 buttonInput: function (_reference) {
		var _key = _reference.key;
		this.buttonCallbacks[_key]();
		// this.bringToTop_buttons();
	 },
	/**
	 * methods for testing sound
	 */
	 nextSound: function () {
		var _sound_id = Object.keys(this.audioAssetList)[this.currentSound];
		var _audioSprite = this.audioAssetList[_sound_id];
		PCB.audio.stop();
		if(_audioSprite !== '') {
			// audio sprite
			_currentSound = Register.audioInstances[_audioSprite];
			_currentSound.play(_sound_id);
		} else {
			_currentSound = Register.audioInstances[_sound_id];
			_currentSound.play();
		}
		Register.spriteInstances.line_20.setText('Sound : '+ _sound_id);
		if(this.currentSound > Object.keys(this.audioAssetList).length - 2) {
			this.currentSound = 0;
		} else {
			this.currentSound++;
		}
	 },
	 constructAudioAssetList: function () {
		// this.audioAssetList
		for( var _key in Register.audioInstances ){
			if(Register.audioInstances[_key].hasOwnProperty('sounds')) {
				// this is an audio sprite
				for( var _subkey in Register.audioInstances[_key].sounds){
					this.audioAssetList[_subkey] = _key;
				}
			} else {
				this.audioAssetList[_key] = '';
			}
		}
	 },
	/**
	 * methods for test routines
	 */
	// utils
	toDoubleDigits: function(num) {
		num += "";
		if (num.length === 1) {
			num = "0" + num;
		}
		return num;
	},
};