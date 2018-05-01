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

// GameOpening
Rom.state.opening = {
	/** properties */
	'females': null,
	'males': null,
	'animals': null,
	'avatar_instances': [],
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
		// init props
		this.females = this.males = this.animals = null;
		this.avatar_instances = [];
		// important. reset user avatar id or the game halts
		Register.user_avatar_id = '';

	},
	create: function () {
		var _self = this;
		/**
		 * Fade in the title
		*/
		// show the title screen
		PCB.screen.show({ 'id': 'game_opening' });
		// add tween for the game screen fade
		Game.add.tween(Game.world).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true);

		PCB.audio.play('game_start',undefined,0.5);

		PCB.clock.setTimeoutClock({
			'id': 'openingTimeLimit', // _clock_id
			'timeout': 14000,
			callback: function () { // _callback
				PCB.event.trigger('forceSelectAvatar');
			}
		});

		/** force selection of avatar */
		PCB.event.add('forceSelectAvatar', function () {
			/** force select */
			var _random_index_num = PCB.rng.generate_range(0,14);
			/** trigegr start game */
			_self.selectAvatar(_self.avatar_instances[_random_index_num]);
		});

		/** event to get to the game stage */
		PCB.event.add('startGame', function () {
			Game.tweens.removeAll();
			PCB.clock.removeAll();
			PCB.audio.fadeTo(undefined, 200);
			var _tween = Game.add.tween(Game.world).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
			_tween.onComplete.add(function () {
				Game.state.start('GameLoop');
			});
		});

		/** clocks showAvatarOneByOne */
		PCB.clock.setIntervalClock({
			'id': 'showAvatarOneByOne',
			'interval': 50,
			'iteration': 15,
			action: function (counter) {
				/** invert the counter count */
				counter = 16 - counter;
				/** init variables */
				var _slot = counter % 5;
				var _x = 200 + 160 * _slot;
				var _y = 0;
				var _atlas_id = '';
				/* conditionals, female , male or animals */
				if(counter > 10) {
					_y = 200;
					_atlas_id = _self.females[_slot];
				} else if (counter > 5 ) {
					_y = 360;
					_atlas_id = _self.males[_slot];
				} else {
					_y = 520;
					_atlas_id = _self.animals[_slot];
				}
				/** add sprite on stage */
				var _sprite_group = Game.add.group();
				_sprite_group.x = Game.width/2;
				_sprite_group.y = Game.height + 100;
				var _sprite = Game.add.sprite(0,0,'avatars', _atlas_id);
				_sprite.id = _atlas_id;
				_sprite.anchor.setTo(0.5, 0.5);
				var _sprite_frame = Game.add.sprite(0,0, 'avatar_frame_player');
				_sprite_frame.anchor.setTo(0.5, 0.5);
				_sprite_group.add(_sprite_frame);
				_sprite_group.add(_sprite);
				_sprite_group.scale.set(0.7);
				/** tween */
				var _tween = Game.add.tween(_sprite_group).to({ x: _x, y: _y }, 90, Phaser.Easing.Cubic.Out, true);
				/** input */
				_sprite.inputEnabled = true;
				_sprite.events.onInputDown.add(function (e) {
					_self.selectAvatar(e);
				});
				/** cache for random selection */
				_self.avatar_instances.push(_sprite);
			}
		});

		PCB.clock.start('openingTimeLimit');
		/** now show avatars in the stage */
		this.showAvatars();
	},
	showAvatars: function () {
		this.females = this.getAvatars("f",5);
		this.males = this.getAvatars("m",5);
		this.animals = this.getAvatars("a",5);
		PCB.clock.start('showAvatarOneByOne');
	},
	/**
	 * Gets the avatars.
	 *
	 * @param      string  category  m or f or a
	 * @param      number  number    The number of avatars to return
	 */
	getAvatars: function (category,number) {
		var _avatar_ids = Register.avatars_id;
		return Phaser.ArrayUtils.shuffle(_avatar_ids[category]).slice(0,number);
	},
	selectAvatar: function (target) {
		PCB.clock.stop('openingTimeLimit');
		if(Register.user_avatar_id == ''){
			var _tween = Game.add.tween(target.parent.scale).to({ x: 1, y: 1 }, 200, Phaser.Easing.Cubic.Out, true);
			_tween.onComplete.add(function () {
				PCB.event.trigger('startGame');
			}, this);
			Game.world.bringToTop(target.parent);
			Register.user_avatar_id = target.id;
			// play sound
			PCB.audio.play('hand-drum',undefined,1);
		}

	}
};
