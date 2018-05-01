
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

// GameOver
Rom.state.gameover = {
	/** properties */
	'click_event': '',
	/** methods */
	init: function () {
		// set the world alpha to zero
		Game.world.alpha = 0;
		// stop all the sound here just to make sure
		PCB.audio.stop();
		// clock removal
		PCB.clock.removeAll();
		// destroy (init) sprite system
		PCB.sprite({ 'destroy_all': true });
	},
	create: function () {
		var _self = this;
		/**
		 * Fade in the title
		*/
		// show the title screen
		PCB.screen.show({ 'id': 'game_over' });
		// add tween for the game screen fade
		Game.add.tween(Game.world).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true);

		PCB.audio.play('game_over',undefined,0.7);

		PCB.clock.setTimeoutClock({
			'id': 'gameoverScreenTimeLimit', // _clock_id
			'timeout': 7900,
			callback: function () { // _callback
				_self.endGameoverSequence();
			}
		});
		PCB.clock.setTimeoutClock({
			'id': 'playBookieVoice', // _clock_id
			'timeout':3300,
			callback: function () { // _callback
				if(Register.is_double_up === false){
					PCB.audio.play('voices_people', 'bookie_please_come_again', 1);
				} else {
					PCB.audio.play('voices_people', 'bookie_we_are_not_npo', 1);
				}
			}
		});

		// add event to screen to skip game over screen
		// add input event for the title image.
		Register.spriteInstances.gameover_background.inputEnabled = true;
		Register.spriteInstances.gameover_background.events.onInputDown.add(function () {
			_self.endGameoverSequence();;
		});

		/** set clocks and begin the game over sequence */
		PCB.clock.start('gameoverScreenTimeLimit');
		PCB.clock.start('playBookieVoice');
	},
	endGameoverSequence: function () {
		Register.spriteInstances.gameover_background.inputEnabled = false;
		Register.spriteInstances.gameover_background.events.onInputDown.removeAll();
		Game.state.start('LogoSplash');
	},
};
