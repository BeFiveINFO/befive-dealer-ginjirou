/*
	rom: sprite
	Used for preload
*/

// Make Rom if it does not exist yet (to deal with load order issue here).
if(!Rom) var Rom = {};

// burn rom
if(!Rom.sprite) Rom.sprite = {};

/**
 * No credits modal
 */
Rom.sprite.modal_settings = {
	new: function (_arguments) {
		var _self = this;
		var _statusLabel_mute = (Game.sound.mute === true) ? 'Play Sound' : 'Mute Sound';
		var _statusLabel_screen = (Game.scale.isFullScreen === true) ? 'Small Screen' : 'Full Screen';
		// create modal
		Register.groupInstances.modal_settings = new gameModal(Game);
		Register.groupInstances.modal_settings.createModal({
			type: "settings",
			includeBackground: true,
			modalCloseOnInput: true,
			itemsArr: [{
				type: "text",
				content: "Game Settings",
				fontFamily: "Skranji",
				color: "0xea134b",
				stroke: "0xffffff",
				strokeThickness: 5,
				fontSize: 52,
				offsetY: -110,
				contentScale: 0.6
			}, {
				type: "text",
				content: _statusLabel_screen,
				fontFamily: "Skranji",
				color: "0x92cd00",
				stroke: "0xffffff",
				strokeThickness: 5,
				fontSize: 52,
				offsetY: 100,
				offsetX: 0,
				contentScale: 0.6,
				callback: function () {
					_self._screenModeToggle();
				}
			}, {
				type: "text",
				content: _statusLabel_mute,
				fontFamily: "Skranji",
				color: "0xff0000",
				stroke: "0xffffff",
				strokeThickness: 5,
				fontSize: 52,
				offsetY: 180,
				offsetX: 0,
				contentScale: 0.6,
				callback: function () {
					_self._soundModeToggle();
				}
			}]
		});
	},
	update: function (show) {
		if(show == true) {
			Register.groupInstances.modal_settings.showModal("settings");
		} else {
			Register.groupInstances.modal_settings.hideModal("settings");
		}
	},
	_screenModeToggle: function () {
		var _screenState = PCB.screen.toggleFullScreen();
		var _statusLabel = '';
		if(_screenState == true) {
			_statusLabel = 'Small Screen';
		} else {
			_statusLabel = 'Full Screen';
		}
		Register.groupInstances.modal_settings.updateModalValue(_statusLabel,'settings',3);
	},
	_soundModeToggle: function() {
		var _statusLabel = '';
		// invert state
		if (Game.sound.mute === true) {
			PCB.audio.mute(false);
			_statusLabel = 'Mute Sound';
			PCB.audio.play('hand-drum',undefined, 0.8);
		} else {
			PCB.audio.mute(true);
			_statusLabel = 'Play Sound';
		}
		//
		Rom.nvram.updateMuteState(Game.sound.mute);
		Register.groupInstances.modal_settings.updateModalValue(_statusLabel,'settings',4);
	},
	_bringToTop: function () {
		if(Register.groupInstances.modal_settings) Register.groupInstances.modal_settings.bringToTop('settings');
	}
}
