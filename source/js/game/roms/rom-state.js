/*
 * rom: state
 * Holds different states in one object
 * Boot and Assets states are excluded for the sake of maintenanceability
 * The state Rom has anything to do with events for input, sound play and main tweening.
 * Anything to do with screen details are in the screen rom.
 **/
// Make Rom if it does not exist yet (to deal with load order issue here).
if (!Rom) var Rom = {};
if (!Rom.hasOwnProperty('state')) Rom.state = {};

// Comapny Logo Splash
Rom.state.logoSplash = {
	init: function () {
		// set the world alpha to zero
		Game.world.alpha = 0;
		// stop all the sound here just to make sure
		PCB.audio.stop();
		// clock removal
		PCB.clock.removeAll();
		// Keep 5 key pressed down to enter test mode.
		if (Game.input.keyboard.isDown(Phaser.KeyCode.FIVE) === false) {
			Game.state.start('Test');
			return false;
		}
		// Some sprites may not show up without this.
		PCB.sprite({ 'destroy_all': true });
	},
	create: function () {
		/**
		 * Fade in the flash, play sound (wait for about 4 seconds) then fade out. show the title screen after.
		*/
		// title_screen is shown after company_logo_flash (controled by the PCB screen)
		PCB.screen.show({ 'id': 'company_logo_flash' });
		// fade in / out screen
		var _tween = Game.add.tween(Game.world).to({ alpha: 1 }, 200, Phaser.Easing.Quadratic.In, true);
		// touch screen to skip. adding input event for the screen.
		Game.input.onDown.add(function () {
			// now change to the next screen
			Game.state.start('TitleLoop');
		});

		// tween on complete callback
		_tween.onComplete.add(function () {
			if (Register.game_attraction_sound === true && Rom.nvram.readMuteState() === false) {
				// play sound if attraction sound is enabled
				PCB.audio.play('befive_id',undefined,0.5);
			}
			Game.time.events.add(Phaser.Timer.SECOND * 2,
				function () {
					// the removal needs to be here to avoid awkward double events
					Game.input.onDown.removeAll();
					var _tween_after = Game.add.tween(Game.world).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
					_tween_after.onComplete.add(function () {
						// now change to the next screen
						Game.state.start('TitleLoop');
					}, this);
				}, this);
		}, this);
	}
};

// Title
Rom.state.titleLoop = {
	init: function () {
		// set the world alpha to zero
		Game.world.alpha = 0;
		// stop all the sound here just to make sure
		PCB.audio.stop();
		// clock removal
		PCB.clock.removeAll();
		// init credit count and settings
		Rom.nvram.init();
		// destroy (init) sprite system
		PCB.sprite({ 'destroy_all': true });
	},
	create: function () {
		/**
		 * Fade in the title
		*/
		// show the title screen
		PCB.screen.show({ 'id': 'title_screen' });
		// add tween for the game screen fade
		Game.add.tween(Game.world).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true);
		if (Register.game_attraction_sound === true) {
			// play sound if attraction sound is enabled
			PCB.audio.play('opening',undefined,0.4);
			PCB.clock.setTimeoutClock({
				'id': 'waitForOpeningSoundComplete', // _clock_id
				'timeout': 6900,
				callback: function () { // _callback
					PCB.audio.pause('main_theme', '', true, 0.2);

					PCB.clock.start('waitForOpeningCallSoundComplete');
				}
			});
			PCB.clock.setTimeoutClock({
				'id': 'waitForOpeningCallSoundComplete', // _clock_id
				'timeout': 5300,
				callback: function () { // _callback
					PCB.audio.play('title_call',undefined,0.9);
				}
			});
			PCB.clock.start('waitForOpeningSoundComplete');
		}
		// timer for the no credits dialog
		PCB.clock.setTimeoutClock({
			'id': 'closeNoCreditDialog', // _clock_id
			'timeout': 4000,
			callback: function () { // _callback
				PCB.sprite({'id':'dialog_no_credits',arguments:false});
			}
		});
		// add input event for the title image.
		Register.spriteInstances.title_image_background.inputEnabled = true;
		Register.spriteInstances.title_image_background.events.onInputDown.add(function () {
			// Check up for insufficient credit
			if (Register.creditCount < 1) {
				PCB.clock.start('closeNoCreditDialog');
				PCB.sprite({'id':'dialog_no_credits',arguments:true});
			} else {
				// okay to start game
				Game.tweens.removeAll();
				PCB.clock.removeAll();
				/**
				 * fadein needs to complete before the stage is moved onto the next,
				 * Otherwise the sound will continue to be played. (because all the tweens are removed before or after
				 * a new stage starts
				 */
				PCB.audio.fadeTo(undefined, 780);
				var _tween = Game.add.tween(Game.world).to({ alpha: 0 }, 800, Phaser.Easing.Linear.None, true);
				_tween.onComplete.add(function () {
					Game.state.start('GameOpening')
				});
			}
		});

		// timer for Replenishment. Note: this is for the title loop.
		PCB.clock.setIntervalClock({
			'id': 'replenishmentObserver',
			'interval': 1000,
			'iteration': -1,
			action: function () {
				var _message = '';
				var _unixTime = PCB.clock.unixTime();
				var _replenishmentTime = Register.replenishmentTime;
				var _replenishment_max = Number(Register.replenishment_max);

				if (
					_unixTime > _replenishmentTime
				) {
					Rom.nvram.updateReplenishment();
					PCB.sprite({ 'id': 'dynamic_text_creditCount' });
				}

				if (Register.creditCount < 1) {
					var _excessTime = Math.abs(_unixTime - _replenishmentTime);
					_message = 'Service Credits in ' + PCB.clock.convertUnixTimeToHMS(_excessTime);
					PCB.sprite({ 'id': 'dynamic_text_creditCount', 'arguments': _message });
				}
			}
		});
		PCB.clock.start('replenishmentObserver');
	}
};
