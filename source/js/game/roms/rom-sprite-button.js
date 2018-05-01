/*
	rom: sprite
	Used for preload
*/

// Make Rom if it does not exist yet (to deal with load order issue here).
if(!Rom) var Rom = {};

// burn rom
if(!Rom.sprite) Rom.sprite = {};
/**
 * Game buttons
 */

Rom.sprite.card_even = {
	new: function () {
		/** Group */
		Register.groupInstances.card_even = Game.add.group();
		Register.groupInstances.card_even.visible = false;
		Register.groupInstances.card_even.x = Game.width/2;
		Register.groupInstances.card_even.y = 140;
		/** card 260 x 360 */
		Register.spriteInstances.card_even = Game.add.sprite(0,0,'card_even');
		Register.spriteInstances.card_even.anchor.setTo(0.5, 0.5);
		/** frame boarder */
		Register.spriteInstances.card_border_even = Game.add.sprite(0,0,PCB.sprite.getRectBitmap({width: 280, height: 380}));
		Register.spriteInstances.card_border_even.anchor.setTo(0.5, 0.5);
		/** Grouping */
		Register.groupInstances.card_even.add(Register.spriteInstances.card_border_even);
		Register.groupInstances.card_even.add(Register.spriteInstances.card_even);
		/** event */
		Register.spriteInstances.card_even.inputEnabled = true;
		Register.spriteInstances.card_even.events.onInputDown.add(this.onInputDown, this);
	},
	update: function (mode) {
		var $_target_card_group = Register.groupInstances.card_even;
		var _show = false;
		var _x = Game.width/2, _y = 140;
		var _scale = 1;

		switch(mode){
			case 'show_player': // open
				_show = true;
				_x = 300;
				_y = Game.height/2;
				break;
			case 'show_display': // open
				_scale = 0.5;
				_x = 90;
				_y = 140;
				_show = true;
				break;
			case 'show_solo':
				_show = true;
				_x = 230;
				_y = 223;
				_scale = 0.5;
				break;
			case 'show_spin':
				_show = true;
				_x = 461;
				_y = 576;
				_scale = 0.31;
				break;
			case 'hide':
				_show = false;
				_x = 300;
				_y = 1000;
				break;
		}
		/** change position and scale */
		if(_show == true) {
			$_target_card_group.visible = true;
			Game.add.tween($_target_card_group.scale).to( { x: _scale, y: _scale}, 200, Phaser.Easing.Cubic.In, true);
			var _tween = Game.add.tween($_target_card_group).to( { alpha: 1 , x: _x, y: _y}, 250, Phaser.Easing.Cubic.Out, true);
		} else {
			Game.add.tween($_target_card_group.scale).to( { x: _scale, y: _scale}, 200, Phaser.Easing.Cubic.In, true);
			var _tween = Game.add.tween($_target_card_group).to( { alpha: 0 , x: _x, y: _y}, 200, Phaser.Easing.Cubic.In, true);
			_tween.onComplete.add(function () {
				$_target_card_group.visible = false;
			}, this);
		}
		/** sprite priority */
		Game.world.bringToTop($_target_card_group);
		Rom.sprite.modal_settings._bringToTop();
	},
	onInputDown: function () {
		PCB.event.trigger('selectBetParity','even');
	}
}

Rom.sprite.card_odd = {
	new: function () {
		/** Group */
		Register.groupInstances.card_odd = Game.add.group();
		Register.groupInstances.card_odd.visible = false;
		Register.groupInstances.card_odd.x = Game.width/2;
		Register.groupInstances.card_odd.y = 510;
		/** card 260 x 360 */
		Register.spriteInstances.card_odd = Game.add.sprite(0,0,'card_odd');
		Register.spriteInstances.card_odd.anchor.setTo(0.5, 0.5);
		/** frame boarder */
		Register.spriteInstances.card_border_odd = Game.add.sprite(0,0,PCB.sprite.getRectBitmap({width: 280, height: 380}));
		Register.spriteInstances.card_border_odd.anchor.setTo(0.5, 0.5);
		/** Grouping */
		Register.groupInstances.card_odd.add(Register.spriteInstances.card_border_odd);
		Register.groupInstances.card_odd.add(Register.spriteInstances.card_odd);
		/** event */
		Register.spriteInstances.card_odd.inputEnabled = true;
		Register.spriteInstances.card_odd.events.onInputDown.add(this.onInputDown, this);
	},
	update: function (mode) {
		var $_target_card_group = Register.groupInstances.card_odd;
		var _show = false;
		var _x = Game.width/2, _y = 510;
		var _scale = 1;

		switch(mode){
			case 'show_player': // open
				_show = true;
				_x = 750;
				_y = Game.height/2;
				break;
			case 'show_display': // open
				_scale = 0.5;
				_x = 90;
				_y = 510;
				_show = true;
				break;
			case 'show_solo':
				_show = true;
				_x = 230;
				_y = 223;
				_scale = 0.5;
				break;
			case 'show_spin':
				_show = true;
				_x = 461;
				_y = 576;
				_scale = 0.31;
				break;
			case 'hide':
				_show = false;
				_x = 750;
				_y = 1000;
				break;
		}
		/** change position and scale */
		if(_show == true) {
			$_target_card_group.visible = true;
			Game.add.tween($_target_card_group.scale).to( { x: _scale, y: _scale}, 200, Phaser.Easing.Cubic.In, true);
			var _tween = Game.add.tween($_target_card_group).to( { alpha: 1 , x: _x, y: _y}, 250, Phaser.Easing.Cubic.Out, true);
		} else {
			Game.add.tween($_target_card_group.scale).to( { x: _scale, y: _scale}, 200, Phaser.Easing.Cubic.In, true);
			var _tween = Game.add.tween($_target_card_group).to( { alpha: 0 , x: _x, y: _y}, 200, Phaser.Easing.Cubic.In, true);
			_tween.onComplete.add(function () {
				$_target_card_group.visible = false;
			}, this);
		}
		/** sprite priority */
		Game.world.bringToTop($_target_card_group);
		Rom.sprite.modal_settings._bringToTop();
	},
	onInputDown: function () {
		PCB.event.trigger('selectBetParity','odd');

	}
}

/**
 * Buttons for settings
 */
Rom.sprite.attendant_button = {
	new: function (show) {
		Register.spriteInstances.attendant_button = Game.add.button(Game.world.width - 120, 20, 'attendant_button', this.buttonInput, this, 2, 1, 0);
		Register.spriteInstances.attendant_button.inputEnabled = true;
		Register.spriteInstances.attendant_button.alpha = 0;
	},
	update: function (show) {
		var $_caption_shoubu = Register.spriteInstances.attendant_button;
		if(show == true && Register.spriteInstances.attendant_button.alpha != 1) {
			Register.spriteInstances.attendant_button.frame = 1;
			var _tween = Game.add.tween($_caption_shoubu).to( { alpha: 1 }, 200, Phaser.Easing.Cubic.In, true);
		} else if(show == false) {
			Register.spriteInstances.attendant_button.frame = 0;
			var _tween = Game.add.tween($_caption_shoubu).to( { alpha: 0 }, 200, Phaser.Easing.Cubic.In, true);
		}
	},
	buttonInput: function (_reference) {
		PCB.sprite({ 'id': 'modal_settings', 'arguments': true });
	},
}

Rom.sprite.button_mute = {
	new: function () {
		Register.groupInstances.button_mute = Game.add.group();
		Register.spriteInstances.mute_on = Game.add.sprite(Game.world.centerX,Game.world.centerY, 'mute_on');
		Register.spriteInstances.mute_off = Game.add.sprite(Game.world.centerX,Game.world.centerY, 'mute_off');
		Register.groupInstances.button_mute.add(Register.spriteInstances.mute_on);
		Register.groupInstances.button_mute.add(Register.spriteInstances.mute_off);
		Register.groupInstances.button_mute.x = Game.world.centerX - 100;
		Register.groupInstances.button_mute.y = 30 - Game.world.centerY;
		// set the priority ID so that the input event on the mute buttons will not conflict with the title image underneath.
		Register.spriteInstances.mute_on.priorityID = 1000;
		Register.spriteInstances.mute_off.priorityID = 1000;
		// inputEnabled needs to be set to true otherwise the objects will not accept any input events
		Register.spriteInstances.mute_on.inputEnabled = true;
		Register.spriteInstances.mute_off.inputEnabled = true;
		// add event listeners
		Register.spriteInstances.mute_on.events.onInputDown.add(this.onInputDown, this);
		Register.spriteInstances.mute_off.events.onInputDown.add(this.onInputDown, this);
		this.update();
	},
	update: function () {
		if (Game.sound.mute === true) {
			Register.spriteInstances.mute_on.visible = false;
			Register.spriteInstances.mute_off.visible = true;
		} else {
			Register.spriteInstances.mute_on.visible = true;
			Register.spriteInstances.mute_off.visible = false;
		}
	},
	onInputDown: function () {
		PCB.audio.mute();
		Rom.nvram.updateMuteState(Game.sound.mute);
		this.update();
	}
}

Rom.sprite.button_fullScreen = {
	new: function () {
		Register.groupInstances.button_fullScreen = Game.add.group();
		Register.spriteInstances.fullScreen_on = Game.add.sprite(Game.world.centerX,Game.world.centerY, 'fullScreen_on');
		Register.spriteInstances.fullScreen_off = Game.add.sprite(Game.world.centerX,Game.world.centerY, 'fullScreen_off');
		Register.groupInstances.button_fullScreen.add(Register.spriteInstances.fullScreen_on);
		Register.groupInstances.button_fullScreen.add(Register.spriteInstances.fullScreen_off);
		Register.groupInstances.button_fullScreen.x = 20 - Game.world.centerX;
		Register.groupInstances.button_fullScreen.y = 30 - Game.world.centerY;
		// set the priority ID so that the input event on the mute buttons will not conflict with the title image underneath.
		Register.spriteInstances.fullScreen_on.priorityID = 1000;
		Register.spriteInstances.fullScreen_off.priorityID = 1000;
		// inputEnabled needs to be set to true otherwise the objects will not accept any input events
		Register.spriteInstances.fullScreen_on.inputEnabled = true;
		Register.spriteInstances.fullScreen_off.inputEnabled = true;
		// add event listeners
		Register.spriteInstances.fullScreen_on.events.onInputDown.add(this.onInputDown, this);
		Register.spriteInstances.fullScreen_off.events.onInputDown.add(this.onInputDown, this);
		this.update();
	},
	update: function () {
		if(Phaser.Device.mobileSafari === true ) {
			// hide full screen button in mobile safari
			Register.spriteInstances.fullScreen_on.visible = false;
			Register.spriteInstances.fullScreen_off.visible = false;
		} else if (Game.scale.isFullScreen === true) {
			Register.spriteInstances.fullScreen_on.visible = true;
			Register.spriteInstances.fullScreen_off.visible = false;
		} else {
			Register.spriteInstances.fullScreen_on.visible = false;
			Register.spriteInstances.fullScreen_off.visible = true;
		}
		Game.world.bringToTop(Register.groupInstances.button_fullScreen);
	},
	onInputDown: function () {
		PCB.screen.toggleFullScreen();
		this.update();
	}
}

