/*
	rom: sprite
	Used for preload
*/

// Make Rom if it does not exist yet (to deal with load order issue here).
if(!Rom) var Rom = {};

// burn rom
if(!Rom.sprite) Rom.sprite = {};

// static text
Rom.sprite.static_text_presentedBy = {
	new: function () {
		_textString = 'Presented by';
		Register.spriteInstances.static_text_presentedBy = Game.add.text(Game.world.centerX,Game.world.centerY-180,_textString,{ font: "61px Skranji", fill: "#555555", align: "center" });
		Register.spriteInstances.static_text_presentedBy.anchor.setTo(0.5, 0.5);
	},
	update: function () {
		Game.world.bringToTop(Register.spriteInstances.static_text_presentedBy);
	}
}

Rom.sprite.static_text_versionNumber = {
	new: function (_arguments) {
		var _x = _arguments.x;
		var _y = _arguments.y;
		var _fontSize = _arguments.fontSize;
		var _color = _arguments.color;
		var _align = _arguments.align;
		var _versionNumber = 'VERSION: '+ Register.GAME_VRESION;
		var _strokeThickness;
		if(!_fontSize) _fontSize = 30;
		if(!_x) _x = Game.world.centerX;
		if(!_y) _y = Game.world.centerY + 180;
		if(!_color) {
			_color = '#555555';
			_strokeThickness = 0;
		} else {
			_strokeThickness = 3;
		}
		if(!_align) _align = 'center';
		Register.spriteInstances.static_text_versionNumber = Game.add.text(_x, _y,_versionNumber,{ font: _fontSize+"px Skranji", fill: _color,stroke: "#D64E29",strokeThickness: _strokeThickness, align: _align });
		Register.spriteInstances.static_text_versionNumber.anchor.setTo(0.5, 0.5);
	},
	update: function () {
		Game.world.bringToTop(Register.spriteInstances.static_text_versionNumber);
	}
}

Rom.sprite.static_text_touchScreen = {
	new: function () {
		var _textString = 'Please click on the screen';
		if(Register.touchDevice === true) {
			_textString = 'Please touch the screen';
		}
		Register.spriteInstances.static_text_touchScreen = Game.add.text(Game.world.centerX,Game.world.centerY,_textString,{ font: "24px Skranji", fill: "#FF0000", stroke: "#FFFFFF", strokeThickness: 3, align: "center" });
		Register.spriteInstances.static_text_touchScreen.anchor.setTo(0.5, 0.5);
	},
	update: function () {
		Game.world.bringToTop(Register.spriteInstances.static_text_touchScreen);
	}
}

// dynamic text
// boot messages.
Rom.sprite.dynamic_text_bootMessage = {
	new: function ( _textString ) {
		if(!_textString) _textString = "";
		Register.spriteInstances.dynamic_text_bootMessage = Game.add.text(Game.world.centerX,Game.world.centerY,_textString,{ font: "42px Skranji", fill: "#555555", align: "center" });
		Register.spriteInstances.dynamic_text_bootMessage.anchor.setTo(0.5, 0.5);
	},
	update: function (_textString) {
		if(!_textString) _textString = "";
		Register.spriteInstances.dynamic_text_bootMessage.setText(_textString);
		Game.world.bringToTop(Register.spriteInstances.dynamic_text_bootMessage);
	}
}

Rom.sprite.dynamic_text_creditCount = {
	new: function ( _arguments ) {
		if(!_arguments) _arguments = {};
		var _x = _arguments.x;
		var _y = _arguments.y;
		var _fontSize = _arguments.fontSize;
		var _color = _arguments.color;
		if(!_fontSize) _fontSize = 18;
		if(!_x) _x = 0;
		if(!_y) _y = 0;
		if(!_color) _color = '#FFFFFF';
		Register.spriteInstances.dynamic_text_creditCount = Game.add.text(_x, _y, '',{ font: _fontSize+"px Skranji", fill: _color,  stroke: "#D64E29",strokeThickness: 2, boundsAlignH: 'right', boundsAlignV: 'middle' });
		Register.spriteInstances.dynamic_text_creditCount.setTextBounds(0, Game.world.bounds.height - 30, Game.world.width - 15, 30);
		this.update();
	},
	update: function (_message) {
		var _creditDisplayText = '';
		if(_message) {
			_creditDisplayText = _message;
		} else if(Register.free_play === true) {
			_creditDisplayText = 'FREE PLAY';

		} else {
			_creditDisplayText = 'CREDITS: ' + ((Register.creditCount) ? Register.creditCount : 0);
		}
		Register.spriteInstances.dynamic_text_creditCount.setText(_creditDisplayText);
	}
}

Rom.sprite.dynamic_text_serialNumber = {
	new: function ( _arguments ) {
		var _x = _arguments.x;
		var _y = _arguments.y;
		var _fontSize = _arguments.fontSize;
		var _color = _arguments.color;
		var _serialNumber = Register.serial_number;
		var _strokeThickness = 0;
		// S/N : BJAC-01234567890B
		if(!_serialNumber) _serialNumber = 'Please Attach License Sticker';
		if(!_fontSize) _fontSize = 30;
		if(!_x) _x = Game.world.centerX;
		if(!_y) _y = Game.world.centerY + 260;
		if(!_color) {
			_color = '#555555';
			_strokeThickness = 0;
		} else {
			_strokeThickness = 3;
		}
		Register.spriteInstances.dynamic_text_serialNumber = Game.add.text(_x, _y,_serialNumber,{ font: _fontSize+"px Skranji", fill: _color, stroke: "#D64E29",strokeThickness: _strokeThickness, align: "center" });
		Register.spriteInstances.dynamic_text_serialNumber.anchor.setTo(0.5, 0.5);
	},
	update: function (_serialNumber) {
		Game.world.bringToTop(Register.spriteInstances.dynamic_text_serialNumber);
	}
}

/**
 * Opening
 */

 Rom.sprite.static_text_choose_avatar = {
	new: function () {
		_textString = 'Please choose your avatar.';
		Register.spriteInstances.static_text_presentedBy = Game.add.text(Game.world.centerX,Game.world.centerY-260,_textString,{ font: "61px Merienda One", fill: "#000000", align: "center" , stroke: "#fefefe",strokeThickness: 8});
		Register.spriteInstances.static_text_presentedBy.anchor.setTo(0.5, 0.5);
	},
	update: function () {
		Game.world.bringToTop(Register.spriteInstances.static_text_presentedBy);
	}
}

/**
 * Game
 */
Rom.sprite.dynamic_text_game_opening_time_limit = {
	new: function ( arguments ) {
		// group
		Register.groupInstances.dynamic_text_game_opening_time_limit = Game.add.group();
		// sprite
		Register.spriteInstances.dynamic_text_game_opening_time_limit = Game.add.text(0, 0, 'Time: 20',{ font: "24px Merienda One", fill: '#232323', boundsAlignH: 'left', boundsAlignV: 'middle', stroke: "#F83929",strokeThickness: 3 });
		Register.spriteInstances.dynamic_text_game_opening_time_limit.setTextBounds(0, 0, 80, 30);
		// Game.world.centerY
		Register.groupInstances.dynamic_text_game_opening_time_limit.add(Register.spriteInstances.dynamic_text_game_opening_time_limit);
		Register.groupInstances.dynamic_text_game_opening_time_limit.position.setTo(20,Game.world.centerY - 10);
		// update
		this.update(arguments);
	},
	update: function (timeLimitCount) {
		var $_group = Register.groupInstances.dynamic_text_game_opening_time_limit;
		var $_sprite = Register.spriteInstances.dynamic_text_game_opening_time_limit;
		switch (timeLimitCount) {
			case 'show':
				$_group.visible = true;
				break;
			case 'hide':
				$_group.visible = false;
				break;
			default:
				$_sprite.setText('Time: '+timeLimitCount);
				break;
		}

	}
}


Rom.sprite.dynamic_text_game_creditCount = {
	new: function ( _arguments ) {
		if(!_arguments) _arguments = {};
		var _x = _arguments.x;
		var _y = _arguments.y;
		var _fontSize = _arguments.fontSize;
		var _color = _arguments.color;
		if(!_fontSize) _fontSize = 30;
		if(!_x) _x = 0;
		if(!_y) _y = 0;
		if(!_color) _color = '#FFFFFF';
		Register.spriteInstances.dynamic_text_game_creditCount = Game.add.text(_x, _y, '',{ font: _fontSize+"px Skranji", fill: _color, boundsAlignH: 'right', boundsAlignV: 'middle', stroke: "#F83929",strokeThickness: 3 });
		Register.spriteInstances.dynamic_text_game_creditCount.setTextBounds(0, Game.world.bounds.height - 30, Game.world.width - 15, 30);
		this.update((Register.creditCount) ? Register.creditCount : 0);
	},
	update: function (_creditCount) {
		Register.spriteInstances.dynamic_text_game_creditCount.setText('CREDITS ' + _creditCount);
	}
}

/**
 * Used in indent_you_win
 */
Rom.sprite.dynamic_text_game_dividentsBreakdown = {
	new: function ( _arguments ) {
		if(!_arguments) _arguments = {};
		var _x = _arguments.x;
		var _y = _arguments.y;
		var _fontSize = _arguments.fontSize;
		var _color = _arguments.color;
		if(!_fontSize) _fontSize = 50;
		if(!_x) _x = 0;
		if(!_y) _y = 0;
		if(!_color) _color = '#000000';
		Register.spriteInstances.dynamic_text_game_dividentsBreakdown = Game.add.text(_x, _y, '',{ font: _fontSize+"px Merienda One", fill: _color, boundsAlignH: 'left', boundsAlignV: 'middle', stroke: "#F83929",strokeThickness: 8 });
		Register.spriteInstances.dynamic_text_game_dividentsBreakdown.setTextBounds(130, Game.height/2 - 200, Game.width, Game.height/2 - 200);
	},
	update: function (arguments) {
		Register.spriteInstances.dynamic_text_game_dividentsBreakdown.setText('Pool: '+ arguments.pool +'\nYour share: '+arguments.player_share+'%\nFees (10%): '+arguments.fees);
	}
}
Rom.sprite.dynamic_text_game_winCount = {
	new: function ( _arguments ) {
		if(!_arguments) _arguments = {};
		var _x = _arguments.x;
		var _y = _arguments.y;
		var _fontSize = _arguments.fontSize;
		var _color = _arguments.color;
		if(!_fontSize) _fontSize = 70;
		if(!_x) _x = 0;
		if(!_y) _y = 0;
		if(!_color) _color = '#000000';
		Register.spriteInstances.dynamic_text_game_winCount = Game.add.text(_x, _y, '',{ font: _fontSize+"px Merienda One", fill: _color, boundsAlignH: 'center', boundsAlignV: 'middle', stroke: "#F83929",strokeThickness: 8 });
		Register.spriteInstances.dynamic_text_game_winCount.setTextBounds(0, Game.height/2, Game.width, Game.height/2);
	},
	update: function (_winCount) {
		Register.spriteInstances.dynamic_text_game_winCount.setText('You win ' + _winCount + ' credits.');
	}
}

/**
 * Game Over
 */

 Rom.sprite.static_text_gameover = {
	new: function ( _arguments ) {
		if(!_arguments) _arguments = {};
		var _x = _arguments.x;
		var _y = _arguments.y;
		var _fontSize = _arguments.fontSize;
		var _color = _arguments.color;
		if(!_fontSize) _fontSize = 70;
		if(!_x) _x = 0;
		if(!_y) _y = 0;
		if(!_color) _color = '#e6eae3';
		Register.spriteInstances.static_text_gameover = Game.add.text(_x, _y, 'Game Over',{ font: _fontSize+"px Merienda One", fill: _color, boundsAlignH: 'center', boundsAlignV: 'middle', stroke: "#4f455c",strokeThickness: 8 });
		Register.spriteInstances.static_text_gameover.setTextBounds(0, 0, Game.width, Game.height);
		this.update((Register.winCount) ? Register.winCount : 0);
	},
	update: function (_winCount) {
		// Register.spriteInstances.static_text_gameover.setText('You win ' + _winCount + ' credits.');
	}
}
