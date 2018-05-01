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

// Game
Rom.state.game = {
	/**
	 * Properties
	 */
	'participants_info': {
		'odd':[],
		'even':[]
	},
	// server response buffer
	'server_user_data_buffer': [],
	// avatar
	'avatar_group_odd': null,
	'avatar_group_even': null,
	'player_avatar_instance': null,
	// Time Limit Counter (bet phase)
	'opening_time_limit': 0,
	// rivals_bet_sequence. 32 array values.
	'rivals_bet_sequence': [],
	'rivals_bet_sequence_queued_counter': 0,
	// 0 ~ 31
	'rivals_bet_voice_queue_number': 0,
	// payout stats
	'dividents_breakdown_pool': 0,
	'dividents_breakdown_player_share': 0,
	'dividents_breakdown_fees': 0,
	/**
	 * Methods
	 */
	init: function () {
		// set the world alpha to zero
		Game.world.alpha = 1;
		// stop all the sound here just to make sure
		PCB.audio.stop();
		// clock removal
		PCB.clock.removeAll();
		// Some sprites may not show up without this.
		PCB.sprite({ 'destroy_all': true });
		// init vars
		Register.is_double_up = false;
	},
	create: function () {
		// var
		var _self = this;

		// show the game_screen and reel
		PCB.screen.show({ 'id': 'game_screen' });

		/** Ranking requested in 3 seconds */
		var _networkRequestTimer = 59;

		// timer for Replenishment
		PCB.clock.setIntervalClock({
			'id': 'gameObserver',
			'interval': 1000,
			'iteration': -1,
			action: function () {
				/**
				 * Time Limit Counter
				 */
				if(_self.opening_time_limit > -1) {
					PCB.sprite({'id':'dynamic_text_game_opening_time_limit',arguments: _self.opening_time_limit});
					_self.opening_time_limit --;
				}
			}
		});
		PCB.clock.start('gameObserver');

		// space for spin
		Register.keyinputInstances.reel_start = Game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		Register.keyinputInstances.reel_start.onDown.add(function () {
			// PCB.event.trigger('spinAction');
		}, this);

		Register.keyinputInstances.reset_cookie = Game.input.keyboard.addKey(Phaser.Keyboard.C);
		Register.keyinputInstances.reset_cookie.onDown.add(function () {
			//
		}, this);

		// update the timer loop
		Game.state.update = function () {};

		/**
		 * Network events
		 */
		/** events */
		PCB.event.add('onNetworkSuccess_getParticipants', function (response) {
			var _response = PCB.network.parseResponse(response);
			if (_response ) {
				if(_response.rivals !== false) {
					_self.server_user_data_buffer = _response.rivals;
				} else {
					_self.server_user_data_buffer = [];
				}
				// update user id
				if(_response.user_id){
					var _user_id = Register.user_id = _response.user_id;
					Rom.nvram.updateUserID(_user_id);
				}
			} else {
				_self.server_user_data_buffer = [];
			}
		});
		PCB.event.add('onNetworkServerError_getParticipants', function () {
			/* reset */
			console.log("onNetworkServerError");

		});
		PCB.event.add('onNetworkError_getParticipants', function () {
			/* reset */
			console.log("onNetworkError");
		});

		/**
		 * Game Sequence Clocks
		 */
		PCB.clock.setTimeoutClock({
			'id': 'betPhase', // _clock_id
			'timeout': 12300, // wait for 12 seconds, max
			callback: function () { // _callback
				// end bet phase
				PCB.event.trigger('startDeal');
			}
		});
		PCB.clock.setTimeoutClock({
			'id': 'voicePlaceYourBet', // _clock_id
			'timeout': 2500,
			callback: function () { // _callback
				if(Register.is_double_up === true){
					PCB.audio.play('voices_people', 'bookie_one_shot_deal', 1);
					PCB.clock.start('playPanicMusic');
					// show dialog
					PCB.sprite({'id':'dialog_game_double_up',arguments:true});
				} else {
					PCB.audio.play('voices_people', 'yaku_place_your_bet_now', 1);
				}
				if(Rom.sprite.bet_selector_module.state === false) {
					_self.showChoHanOnDisplay(true);
				}
				// set both cards state to open (@todo hot mode to be added later)
				if(Register.is_double_up === true) {
					Register.card_odd_state = Register.card_even_state = 'hot';
				} else {
					Register.card_odd_state = Register.card_even_state = 'open';
				}
				// update the card border color state
				_self.updateCardsState();
			}
		});

		PCB.clock.setTimeoutClock({
			'id': 'playPanicMusic', // _clock_id
			'timeout': 5700, //
			callback: function () { // _callback
				PCB.audio.play('panic', undefined, 0.5, true);
			}
		});

		/**
		 * Sets how many rivals are to bet each queue.
		 */
		PCB.clock.setTimeoutClock({
			'id': 'rivalsStartBetting', // _clock_id
			'timeout': 2800,
			callback: function () { // _callback
				// Rivals do not bet when the double up event is going on.
				if(Register.is_double_up == false) {
					// Populate _self.rivals_bet_sequence with random sampling.
					if(_self.server_user_data_buffer) {
						_self.rivals_bet_sequence_queued_counter = 0;
						_self.rivals_bet_sequence = [];
						var _totalCount = Object.keys(_self.server_user_data_buffer).length; // 1 based
						var _remainingCount = _totalCount;
						for(var _index = 0; _index < 8;_index++) {
							var _queueNum = Math.ceil(PCB.rng.generate(_remainingCount/8));
							if(_queueNum > 0) {
								_self.rivals_bet_sequence.push(_queueNum);
								_remainingCount = _remainingCount - _queueNum;
							} else {
								_self.rivals_bet_sequence.push(0);
							}
						}
						// any remaining.
						_self.rivals_bet_sequence.push(_remainingCount);
					}
					PCB.clock.start('rivalBettingQueue');
				}
			}
		});

		/**
		 * Rival's betting. From 2800 ms ~ 6000 ms from the beginning of bet phase.
		 */
		PCB.clock.setIntervalClock({
			'id': 'rivalBettingQueue',
			'interval': 300,
			'iteration': 9, // 390ms * 8 = 2400 ms in total
			action: function (loopCounter) {
				// index is 1 based, 1 ~ 32. 0 is a dummy value.
				if(_self.rivals_bet_sequence[loopCounter] > 0) {
					for(var _count = 0; _count < _self.rivals_bet_sequence[loopCounter];_count++) {
						var _currentUser = _self.server_user_data_buffer[_self.rivals_bet_sequence_queued_counter];
						var _currentUserParity = _currentUser.bet_parity;
						var _currentUserBetAmount = _currentUser.bet_amount;
						var _currenrUserAvatarID = _currentUser.user_avatar_id;
						var _currenrUserID = _currentUser.user_id;
						_self.addAvatar('rival',_currentUserParity, _currentUserBetAmount, _currenrUserID, _currenrUserAvatarID);
						// play sound
						if(_count == 0) {
							var _voice_ids_odd = ['customer_1_han','customer_2_han','customer_f_han'];
							var _voice_ids_even = ['customer_1_chou','customer_2_chou','customer_f_chou'];
							var _rndNumVoiceIndex = PCB.rng.generate(2);
							var _voice_id = (_currentUserParity === 'odd') ? _voice_ids_odd[_rndNumVoiceIndex] : _voice_ids_even[_rndNumVoiceIndex];
							var _delayTimer = Game.time.create(false);
							_delayTimer.add(PCB.rng.generate(500), function() {
								PCB.audio.play('voices_people', _voice_id, 0.5, false, true);
							}, this);
							_delayTimer.start();
						}
						_self.rivals_bet_sequence_queued_counter ++;
					}
				}
			}
		});

		/** also checks up odd / even bet balance */
		PCB.clock.setTimeoutClock({
			'id': 'chohan_callout_a', // _clock_id
			'timeout': 6000,
			callback: function () { // _callback
				var _even_length = _self.participants_info.even.length;
				var _odd_length = _self.participants_info.odd.length;
				/* Returns: true, false, even, odd */
				var _chohan_balance = _self.checkupChoHanBalance(_even_length, _odd_length);
				switch(_chohan_balance) {
					case false:
						PCB.audio.play('voices_people', 'yaku_hankata', 1);
						break;
					case 'even':
						PCB.audio.play('voices_people', 'yaku_hankata', 1);
						// Register.card_even_state = 'closed';
						_self.updateCardsState();
						break;
					case 'odd':
						PCB.audio.play('voices_people', 'yaku_choukata', 1);
						// Register.card_odd_state = 'closed';
						_self.updateCardsState();
						break;
					case true:
						break;
				}

			}
		});
		PCB.clock.setTimeoutClock({
			'id': 'chohan_callout_b',
			'timeout': 7300,
			callback: function () { // _callback
				// Making sure that the player is not betting alone.
				var _isPlayerBettingAlone = _self.isPlayerBettingAlone();
				if(_isPlayerBettingAlone !== false) {
					if(_isPlayerBettingAlone === 'even') {
						_self.addAvatar('rival','even', Register.bet_amount, -1, 'm-warrior');
						PCB.audio.play('voices_people', 'customer_2_chou', 1);
					} else if (_isPlayerBettingAlone === 'odd') {
						_self.addAvatar('rival','odd', Register.bet_amount, -1, 'm-warrior');
						PCB.audio.play('voices_people', 'customer_2_han', 1);
					}
				} else {
					var _even_length = _self.participants_info.even.length;
					var _odd_length = _self.participants_info.odd.length;
					/* Returns: true, false, even, odd */
					var _chohan_balance = _self.checkupChoHanBalance(_even_length, _odd_length);
					if(_chohan_balance === false) {
						PCB.audio.play('voices_people', 'yaku_choukata', 1);
					}
				}
			}
		});

		PCB.clock.setTimeoutClock({
			'id': 'voiceReady', // _clock_id
			'timeout': 9000, // wait for 9.5 seconds, max
			callback: function () { // _callback
				PCB.audio.play('voices_people', 'ginji_are_you_ready', 1);
			}
		});

		/**
		 * Credit Counter Movement Clock
		 */
		PCB.clock.setIntervalClock({
			'id': 'creditSegmentAnimation',
			'interval': 40,
			'iteration': -1,
			action: function () {
				PCB.sprite({'id':'dynamic_text_game_creditCount','arguments':Register.creditCount});
				PCB.sprite({'id':'dynamic_text_game_winCount','arguments':Register.winCount});
				// count up has ended
				if(Register.pending_current_credits <= Register.creditCount) {
					// remove any VFX
					// Gframe.vfx.eraseVFX();
					// stop timer
					PCB.clock.start('waitForIndentWin');
					PCB.clock.stop('creditSegmentAnimation');
				} else {
					Register.creditCount += PCB.reels.countup_amount;
					Register.winCount += PCB.reels.countup_amount;
					if(Register.creditCount >= Register.pending_current_credits) {
						Register.creditCount = Register.pending_current_credits;
						Register.winCount = Register.pending_current_win;
					}
					PCB.event.trigger('onSegmentAnimation');
				}
			}
		});

		/**
		 * Game Sequences Events
		 */
		// open the game
		PCB.event.add('openGame', function () {
			// init
			_self.rival_bet_queue = null;

			/**
			 * Credit Check up. If the credit is zero at this point, end the game.
			 */
			if(Register.creditCount <= 0) {
				Game.state.start('GameOver');
				return false;
			}
			// Set Double up flag here, because it is used in the game over screen.
			// Double Up probability is 10%
			var _double_up_prob = PCB.rng.generate(10);
			if(
				Register.creditCount > 1000 &&
				_double_up_prob > 8
			) {
				Register.is_double_up = true;
			} else {
				Register.is_double_up = false;
			}
			/**
			 * Reset
			 */
			// reset avatar holder
			if(_self.avatar_group){
				// @todo make sure that all the groups and sprites are cleared
				_self.avatar_group_even.callAll('destroy');
				_self.avatar_group_even.callAll('destroy');
				_self.avatar_group_even.destroy();
				_self.avatar_group_odd.callAll('destroy');
				_self.avatar_group_odd.callAll('destroy');
				_self.avatar_group_odd.destroy();
			}
			_self.avatar_group_even = Game.add.group();
			_self.avatar_group_odd = Game.add.group();
			_self.participants_info = {'odd':[],'even':[]};
			// var _tween = Game.add.tween(_self.avatar_group).to({ alpha: 0 }, 90, Phaser.Easing.Cubic.Out, true);
			// _tween.onComplete.add(function () {
			// 	_self.avatar_group.visible = false;
			// }, this);
			if(_self.player_avatar_instance) {
				// needs to do twice to clear all
				_self.player_avatar_instance.callAll('destroy');
				_self.player_avatar_instance.callAll('destroy');
				_self.player_avatar_instance.destroy();
			}
			_self.player_avatar_instance = null;
			// reset the bet parity and amount and game result flag
			Register.bet_parity = '';
			Register.bet_amount = 0;
			Register.game_result = null;
			// reset all other Registers
			Register.pending_current_credits = null;
			Register.pending_current_win = null;
			Register.pending_bet_parity = null;
			//
			_self.dividents_breakdown_pool = 0;
			_self.dividents_breakdown_player_share = 0;
			_self.dividents_breakdown_fees = 0;
			// set both cards state to closed (@todo hot mode to be added later)
			Register.card_odd_state = Register.card_even_state = 'closed';
			// reset Time Limit Counter
			_self.opening_time_limit = 10;

			/**
			 * Contact Server only if the buffer is empty
			 */
			if(_self.server_user_data_buffer == false || _self.server_user_data_buffer.length === 0) {
				_self.sendServerCurrentUserGameStatus();
			}

			/**
			 * show UI
			 */
			// attendant button
			PCB.sprite({'id':'attendant_button','arguments':true});
			// update the card border color state
			_self.updateCardsState();
			// show the parity card buttons
			_self.showChoHanCards('all');
			// indent dice
			PCB.sprite({'id':'indent_bet_phase_dices'});
			// hide the bet button
			_self.showBetButtons(false);
			// show time limit
			PCB.sprite({'id':'dynamic_text_game_opening_time_limit',arguments: 'show'});
			PCB.sprite({'id':'dynamic_text_game_opening_time_limit',arguments: 10});
			// play voice
			PCB.audio.play('voices_people', 'ginji_hairimasu', 1);
			// start betPhase clock. Ordered by execution time
			PCB.clock.start('betPhase');
			PCB.clock.start('voicePlaceYourBet');
			PCB.clock.start('rivalsStartBetting');
			if(Register.is_double_up === false) {
				PCB.clock.start('chohan_callout_a');
				PCB.clock.start('chohan_callout_b'); // canceled in chohan_callout_a if not necessary
			}
			PCB.clock.start('voiceReady');
		});
		// Bet Select
		PCB.event.add('selectBetParity', function (bet_parity) {
			// bet_parity must Not be set in the register.
			if(
				Register.bet_parity !== '' ||
				Register.card_odd_state ==='closed' ||
				Register.card_even_state === 'closed'
			) {
				return;
			}
			Register.pending_bet_parity = bet_parity;
			if(bet_parity === 'even') {
				PCB.audio.play('taiko01',undefined, 0.8);
			} else {
				PCB.audio.play('taiko03',undefined, 0.8);
			}
			/* place the selected parity card to where it is supposed to be */
			_self.showChoHanCards(bet_parity);
			/* show the bet buttons */
			_self.showBetButtons(true);
		});
		// Bet Select
		PCB.event.add('setBet', function (bet_amount) {
			Register.bet_amount = bet_amount;
			/* hide the bet buttons */
			_self.showBetButtons(false);
			if(bet_amount == 0) {
				// cancel
				PCB.audio.play('vibraslap',undefined, 0.8);
				Register.bet_parity = '';
				_self.showChoHanOnDisplay(true);
			} else {
				// check up if the credit is sufficient
				var _isCreditSufficient = Register.creditCount - bet_amount;
				if(_isCreditSufficient < 0) {
					PCB.audio.play('vibraslap',undefined, 0.8);
					Register.bet_parity = '';
					_self.showChoHanOnDisplay(false);
					// hide dialog
					PCB.sprite({'id':'dialog_game_double_up',arguments:false});
					// game over
					Game.state.start('GameOver');
				} else {
					// hide dialog
					PCB.sprite({'id':'dialog_game_double_up',arguments:false});
					// set both cards state to closed
					Register.card_odd_state = Register.card_even_state = 'closed';
					// update the card frame border to show that the card cannot be clicked.
					_self.updateCardsState();
					// confirm the bet parity choice
					Register.bet_parity = Register.pending_bet_parity;
					// bet confirmed. Decrement the credits.
					_self.chargeCredits();
					// the credit will be deducted just before the reel is started.
					PCB.audio.play('taiko02',undefined, 0.8);
					_self.showChoHanOnDisplay(true);
					_self.registerPlayerBet();
				}
			}
		});

		// start deal
		PCB.event.add('startDeal', function (bet_amount) {
			/**
			 * Contact Server
			 */
			_self.sendServerCurrentUserGameStatus();
			// set both cards state to closed (fail safe)
			Register.card_odd_state = Register.card_even_state = 'closed';
			// update the card frame border to show that the card cannot be clicked. (fail safe)
			_self.updateCardsState();
			/** hide the time limit counter text */
			PCB.sprite({'id':'dynamic_text_game_opening_time_limit',arguments: 'hide'});
			// hide the cho han card button accordingly
			_self.showChoHanCards('spin');
			// hide the bet button (just in case the buttons are still shown)
			_self.showBetButtons(false);
			// hide dialog
			PCB.sprite({'id':'dialog_game_double_up',arguments:false});
			/** tween */
			var _tween = Game.add.tween(_self.avatar_group_even).to({ alpha: 0 }, 90, Phaser.Easing.Cubic.Out, true);
			Game.add.tween(_self.avatar_group_odd).to({ alpha: 0 }, 90, Phaser.Easing.Cubic.Out, true);
			_tween.onComplete.add(function () {
				_self.avatar_group_even.visible = false;
				_self.avatar_group_odd.visible = false;
			}, this);
			// indent
			PCB.sprite({'id':'indent_fight'});
		});
		PCB.event.add('endIndentFightCall', function (bet_amount) {
			PCB.reels.showReels();
			// start reel spin
			PCB.reels.startGame();
		});
		// reel spin ended
		PCB.event.add('reelSpinComplete', function (bet_amount) {
			// hide han cho indicator
			PCB.sprite({'id':'caption_han_cho',arguments:'hide'});
			// hide the reel
			PCB.reels.hideReels();
			/** Award or console the player */
			_self.awardPlayer();
		});
		// events for post results
		PCB.event.add('endIndentLose', function () {
			PCB.event.trigger('openGame');
		});
		PCB.event.add('endIndentWin', function () {
			// update the credit and the display
			Register.creditCount = Register.pending_current_credits;
			PCB.sprite({'id':'dynamic_text_game_creditCount','arguments':Register.creditCount});
			// open a new game.
			PCB.event.trigger('openGame');
		});

		/**
		 * Game Sequences
		 */
		PCB.event.trigger('openGame');
	},
	/**
	 * UI
	 */
	/**
	 * Shows the cho han cards.
	 *
	 * @param      string  odd or even or spin or hide. Both if omitted.
	 */
	showChoHanCards: function ( traget_card ) {
		if(traget_card === 'all') {
			PCB.sprite({'id':'card_odd',arguments:'show_player'});
			PCB.sprite({'id':'card_even',arguments:'show_player'});
		} else if(traget_card === 'odd') {
			PCB.sprite({'id':'card_odd',arguments:'show_solo'});
			PCB.sprite({'id':'card_even',arguments:'hide'});
		} else if(traget_card === 'even') {
			PCB.sprite({'id':'card_odd',arguments:'hide'});
			PCB.sprite({'id':'card_even',arguments:'show_solo'});
		} else if(traget_card === 'spin') {
			var _bet_parity = Register.bet_parity;
			if(this.player_avatar_instance) {
				Game.add.tween(this.player_avatar_instance.scale).to( { x: 0.47, y: 0.47}, 200, Phaser.Easing.Cubic.Out, true);
				Game.add.tween(this.player_avatar_instance).to( { x: 570, y: 566}, 1000, Phaser.Easing.Cubic.InOut, true);
			}
			switch(_bet_parity){
				case 'odd':
					PCB.sprite({'id':'card_odd',arguments:'show_spin'});
					PCB.sprite({'id':'card_even',arguments:'hide'});
					break;
				case 'even':
					PCB.sprite({'id':'card_odd',arguments:'hide'});
					PCB.sprite({'id':'card_even',arguments:'show_spin'});
					break;
				default:
					// Ken (pass)
					PCB.sprite({'id':'card_odd',arguments:'hide'});
					PCB.sprite({'id':'card_even',arguments:'hide'});
					break;
			}
		} else {
			PCB.sprite({'id':'card_odd',arguments:'hide'});
			PCB.sprite({'id':'card_even',arguments:'hide'});
		}
	},
	/**
	 * Shows the cho han on display.
	 *
	 * @param      {boolean}  show    show / hide
	 */
	showChoHanOnDisplay: function( show ) {
		if(show == true) {
			PCB.sprite({'id':'card_odd',arguments:'show_display'});
			PCB.sprite({'id':'card_even',arguments:'show_display'});
		} else {
			PCB.sprite({'id':'card_odd',arguments:'hide'});
			PCB.sprite({'id':'card_even',arguments:'hide'});
		}
	},
	/**
	 * Shows the bet buttons.
	 *
	 * @param      boolean  show    true to show. false to hide.
	 */
	showBetButtons: function( show ) {
		PCB.sprite({'id':'bet_selector_module',arguments:show});
	},
	/**
	 * Update card states
	 */
	updateCardsState: function() {
		var $_card_odd_border = Register.spriteInstances.card_border_odd;
		var $_card_even_border = Register.spriteInstances.card_border_even;
		$_card_odd_border.tint = Register.BET_CARD_OPEN_COLOR[Register.card_odd_state];
		$_card_even_border.tint = Register.BET_CARD_OPEN_COLOR[Register.card_even_state];
	},
	/**
	 * Register player
	 * For registering rivals, use this.addAvatar('rival',_bet_parity, _bet_amount, player_id, user_avatar_id);
	 */
	registerPlayerBet: function () {
		var _bet_parity = Register.bet_parity;
		var _bet_amount = Register.bet_amount;
		this.addAvatar('player',_bet_parity, _bet_amount);
	},
	/**
	 * Avatars
	 */
	addAvatar: function ( type, bet_parity, bet_amount , player_id , user_avatar_id) {
		if(type === 'player') {
			// the player is always added to the head of array
			// the player id is always 1
			this.participants_info[bet_parity].unshift({'id':1,'bet_parity':bet_parity,'bet_amount':bet_amount});
			player_id = 1;
			user_avatar_id = Register.user_avatar_id;
		} else {
			// rivals
			this.participants_info[bet_parity].push({'id':player_id,'bet_parity':bet_parity,'bet_amount':bet_amount});
		}

		/**
		 * Sprite
		 */
		/** add sprite on stage */
		var _sprite_group = Game.add.group();
		// init position
		_sprite_group.x = Game.width/2;
		_sprite_group.y = Game.height + 100;
		_sprite_group.player_id = player_id;
		// avatar
		var _sprite = Game.add.sprite(0,0,'avatars', user_avatar_id);
		_sprite.anchor.setTo(0.5, 0.5);
		// frame
		var _sprite_frame = Game.add.sprite(0,0, 'avatar_frame_'+type);
		_sprite_frame.anchor.setTo(0.5, 0.5);
		// text
		var _label = Game.add.text(0,0,'BET:'+bet_amount,{ font: "24px Merienda One", fill: "#343434", align: "center" , boundsAlignH: 'center', boundsAlignV: 'middle',stroke: "#D64E29",strokeThickness: 3});
		_label.setTextBounds(0, 135, 0, 0);
		// _label.anchor.setTo(0.5, 0.5);
		// grouping
		_sprite_group.add(_sprite_frame);
		_sprite_group.add(_sprite);
		_sprite_group.add(_label);
		_sprite_group.scale.set(0.7);

		/** add to group and set positions */
		var _slot;
		var _offset_x = 0;
		if(player_id === 1) {
			_slot = 0;
			_offset_x = 250;
			this.player_avatar_instance = _sprite_group;
		} else if(bet_parity === 'even') {
			_slot = this.avatar_group_even.children.length;
			this.avatar_group_even.add(_sprite_group);
		} else if(bet_parity === 'odd') {
			_slot = this.avatar_group_odd.children.length;
			this.avatar_group_odd.add(_sprite_group);
		}
		/** align update once */
		this.alignAvatars();
		/** set position */
		var _x = _offset_x + 90 * _slot;
		var _y = (bet_parity === 'even') ? 130 : 500;
		/** tween */
		var _tween = Game.add.tween(_sprite_group).to({ x: _x, y: _y }, 90, Phaser.Easing.Cubic.Out, true);
	},
	alignAvatars: function () {
		var _bet_parity = Register.bet_parity;
		switch(_bet_parity) {
			case 'even':
				Game.add.tween(this.avatar_group_even).to({ x: 390}, 90, Phaser.Easing.Cubic.Out, true);
				Game.add.tween(this.avatar_group_odd).to({ x: 250}, 90, Phaser.Easing.Cubic.Out, true);
				break;
			case 'odd':
				Game.add.tween(this.avatar_group_even).to({ x: 250}, 90, Phaser.Easing.Cubic.Out, true);
				Game.add.tween(this.avatar_group_odd).to({ x: 390}, 90, Phaser.Easing.Cubic.Out, true);
				break;
			default:
				Game.add.tween(this.avatar_group_even).to({ x: 250}, 90, Phaser.Easing.Cubic.Out, true);
				Game.add.tween(this.avatar_group_odd).to({ x: 250}, 90, Phaser.Easing.Cubic.Out, true);
				break;
		}
		// make sure that they are always on the top of any other sprites.
		Game.world.bringToTop(Register.groupInstances.bet_selector_module);
		Game.world.bringToTop(Register.spriteInstances.attendant_button);
	},
	/**
	 * Game Play Monitor
	 */
	 /**
	  * Checkup Cho Han Balance and return judgement result
	  *
	  * @example    var _even_length = this.participants_info.even.length;
					var _odd_length = this.participants_info.odd.length;
					this.checkupChoHanBalance(_even_length, _odd_length);
	  * @test		var a = [
					  // * even
					  [6,0],[5,0],[4,0],[3,0],[2,0],[1,0],
					  // false
					  [0,0],
					  // odd
					  [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
					  // true
					  [1,1],[2,2],[3,3],[4,4],[5,5],[6,6],
					  // even
					  [6,1],[6,2],[6,3],
					  // true
					  [6,4],[6,5],
					  // odd
					  [1,6],[2,6],[3,6],
					  // true
					  [4,6],[5,6],[6,6]
					  ]
	  *
	  * @return     mixed  false: no bets. odd: too few participants betting on odd. even: too few evens. true: evenly balanced.
	  */
	checkupChoHanBalance: function (even_length, odd_length) {
		/**
		 * Rate of difference between even and odd participants.
		 * @param      number	Positive float number: Inclined to Even. Negative: Inclined to odd.
		 */
		var _difference_rate = (even_length - odd_length) / (even_length + odd_length);
		if(even_length + odd_length == 0) {
			return false;
		} else if(_difference_rate > 0 && Math.abs(_difference_rate) > 0.2) {
			// even
			return 'even';
		} else if(_difference_rate < 0 && Math.abs(_difference_rate) > 0.2) {
			// odd
			return 'odd';
		} else {
			return true;
		}
	},
	/**
	 * credit deduction.
	 */
	chargeCredits: function () {
		Register.creditCount -= Register.bet_amount;
		Rom.nvram.updateCredit(Register.creditCount);
		PCB.sprite({'id':'dynamic_text_game_creditCount','arguments':Register.creditCount});
	},
	seizeAllCredits: function () {
		Register.creditCount = 0;
		Rom.nvram.updateCredit(Register.creditCount);
		PCB.sprite({'id':'dynamic_text_game_creditCount','arguments':Register.creditCount});
	},
	/**
	 * Award Player
	 */
	awardPlayer: function () {
		var _bet_amount = Register.bet_amount;
		var _won_credits;
		/** Calculate the won amount */
		if (Register.game_result !== true) {
			// do nothing and skip the following 2 conditions.
		} else if(Register.is_double_up === true) {
			// double up
			_won_credits = _bet_amount * 2;
			this.dividents_breakdown_pool = _won_credits;
			this.dividents_breakdown_player_share = "100";
			/** fees (terasen 10%) */
			this.dividents_breakdown_fees = Math.ceil(_won_credits * 0.1);
			/** player's dividend after the fee */
			_won_credits -= this.dividents_breakdown_fees;
		} else {
			/** get data of both sides */
			var _lost_parity = (Register.last_reel_parity === 'odd') ? 'even': 'odd';
			var _winners = this.participants_info[Register.last_reel_parity];
			var _losers = this.participants_info[_lost_parity];
			/** get sum of pool */
			for(var _i in _losers) {
				this.dividents_breakdown_pool += parseInt(_losers[_i].bet_amount);
			}
			/** get sum of bet amount of winners */
			var _sumOfWinnerBetAmount = 0;
			for(var _i in _winners) {
				_sumOfWinnerBetAmount += parseInt(_winners[_i].bet_amount);
			}
			/** share of player */
			this.dividents_breakdown_player_share = _bet_amount / _sumOfWinnerBetAmount;
			/** player's dividents before fee deduction */
			_won_credits = _bet_amount + Math.ceil(this.dividents_breakdown_pool * this.dividents_breakdown_player_share);
			/** make share rate to percentage */
			this.dividents_breakdown_player_share = this.dividents_breakdown_player_share * 100;
			this.dividents_breakdown_player_share = this.dividents_breakdown_player_share.toFixed(2).replace('.00','');
			/** fees (terasen 10%) */
			this.dividents_breakdown_fees = Math.ceil(_won_credits * 0.1);
			/** player's dividend after the fee */
			_won_credits -= this.dividents_breakdown_fees;
		}
		/** Event. Conditional upon game result */
		switch(Register.game_result) {
			case true:
				// add pending credit here.
				Register.winCount = 0;
				Register.pending_current_credits = Register.creditCount + _won_credits;
				Rom.nvram.updateCredit(Register.pending_current_credits);
				Register.pending_current_win = _won_credits;
				// start the indent event
				PCB.sprite({'id':'indent_you_win'});
				break;
			case false:
				//
				if(Register.is_double_up === true) {
					this.seizeAllCredits();
				}
				// hide all in case of gameover
				if(Register.creditCount <= 0) {
					PCB.sprite({ 'id': 'modal_settings', 'arguments': false });
					PCB.sprite({'id':'attendant_button','arguments':false});
					Register.spriteInstances.game_background.alpha = 0;
					this.showChoHanOnDisplay(false);
					if(this.player_avatar_instance) {
						this.player_avatar_instance.y = -140;
					}
				}

				// credit deducted already. Returning to the game after the indent.
				PCB.sprite({'id':'indent_you_lose'});
				break;
			default:
				// no game played
				PCB.event.trigger('openGame');
				break;
		}
	},
	getDividendsBreakdown: function() {
		var _pool = this.dividents_breakdown_pool;
		var _playerShare = this.dividents_breakdown_player_share;
		var _fees = this.dividents_breakdown_fees;
		var _breakdown = {'pool': _pool, 'player_share': _playerShare, 'fees': _fees};
		return _breakdown;
	},
	/**
	 * Testers
	 */
	/**
	 * Determines if player is betting alone.
	 *
	 * @return     {(boolean|string)}  Returns odd or even if a rival is needed to join, False player is not betting alone or not particpating.
	 */
	isPlayerBettingAlone: function () {
		// the player has not bet yet.
		if(Register.bet_parity === '') {
			return false;
		}
		var _participants_info = this.participants_info;
		var _participants_total_num = _participants_info.odd.length + _participants_info.even.length;
		// there are more than 1 (player) participants.
		if(_participants_total_num > 1) {
			return false;
		}
		if(_participants_info.odd.length === 0) {
			// odd rival needed
			return 'odd';
		} else if (_participants_info.even.length === 0) {
			// even rival needed
			return 'even';
		} else {
			// something else we do not know
			return false;
		}
	},
	/**
	 * Network Com
	 */
	sendServerCurrentUserGameStatus: function() {
		PCB.network.sendRequest({
			'ajax_command':'DG_getParticipants',
			'user_id': Register.user_id,
			'user_avatar_id': Register.user_avatar_id,
			'bet_parity': Register.bet_parity,
			'bet_amount': Register.bet_amount,
		}, '_getParticipants');
	},
};
