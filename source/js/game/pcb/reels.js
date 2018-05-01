/*
	logic: reels
	for Bonus Jackpot
*/
// Make Printed circuit board if it does not exist yet (to deal with load order issue here).
if(!PCB) var PCB = {};

// print PCB
PCB.reels = {
	/**
	 * Local properties
	 */
	'countup_amount': 50,
	/**
	 * Methods
	 */
	/**
	 * Init
	 */
	init: function () {
		/**
		 * Register Initialiazation
		 */
		// var to store winning combinations
		Register.reelHasSlowedDown = false;
		Register.reelCountDownMusicStarted = false;
		Register.reelCountDownStarted = false;
		// Holds all the reel units and dices
		Register.reel_unit = {'group': null}
		// reel data init
		for ( var _reelID = 0; _reelID < 1; _reelID++ ) {
			Register.reels[_reelID] = {
				'currentStop': 0,
				'previousStop': -1,
				'currentAngle': 0,
				'hasSlowedDown': false,
				'disc': null,
				'dice': null,
				'needle': null,
				'group': null,
				'isSpinning': false,
			};
		}

		/**
		 * Reel Movement Clock
		 */

		// Stop the reel spin music with fadeing.
		PCB.clock.setTimeoutClock({
			'id': 'stopReelSpinMusic', // _clock_id
			'timeout': 2000, // the handpay bell lasts for about 5625 milliseconds
			callback: function () { // _callback
				PCB.audio.stop('reel_spin');
				PCB.audio.stop('panic');
			}
		});

		// Give 800 ms moment to make sure that the reel has stopped.
		PCB.clock.setTimeoutClock({
			'id': 'finalReelSpinStopWait', // _clock_id
			'timeout': 800, // the handpay bell lasts for about 5625 milliseconds
			callback: function () { // _callback
				/** play the last sound */
				PCB.audio.play('taiko02',undefined, 0.8);
				PCB.clock.start('readTheResult');
			}
		});

		// Game result
		PCB.clock.setTimeoutClock({
			'id': 'readTheResult', // _clock_id
			'timeout': 800, // the handpay bell lasts for about 5625 milliseconds
			callback: function () { // _callback
				/** Evaluate */
				PCB.reels.evaluateGameResult();
				/** soft reset the reel */
				PCB.reels.resetReel();
				/** Event. */
				PCB.clock.start('triggerReelSpinComplete');
			}
		});
		// wait till the read out ends.
		PCB.clock.setTimeoutClock({
			'id': 'triggerReelSpinComplete', // _clock_id
			'timeout': 2100,
			callback: function () { // _callback
				PCB.event.trigger('reelSpinComplete');
			}
		});

		/**
		 * Events
		 */
	},
	/**
	 * Reel Display Management
	 */
	/**
	 * Build Reels
	 *
	 * To show, use method PCB.reels.showReel()
	 * To hide, use method PCB.reels.hideReel()
	 */
	buildReels: function () {
		// reel_unit group init
		Register.reel_unit.group = Game.add.group();
		// init position
		Register.reel_unit.group.y = 700;
		/** roulette X position coordinates */
		var _roulette_x_positions = [20, 533];
		/** loop through */
		for(var _reelID in Register.reels) {
			/** hard reset once */
			this.resetReel(true);
			this.addDiceRoulette(_reelID);
			/** adjust the roulette module position */
			Register.reels[_reelID].group.x = _roulette_x_positions[_reelID]
			// add the reel to the unit group (holding all the reels)
			Register.reel_unit.group.add(Register.reels[_reelID].group);
		}
	},
	/**
	 * Add dice and disc to a reel
	 *
	 * @param       number  reelID  The reel id
	 */
	addDiceRoulette: function (reelID) {
		Register.reels[reelID].group = Game.add.group();
		Register.reels[reelID].disc = Game.add.sprite(238, 238, 'dice_roulette');
		Register.reels[reelID].disc.anchor.setTo(0.5, 0.5);
		/** needles */
		Register.reels[reelID].needle = Game.add.sprite(238, -25, 'needle');
		Register.reels[reelID].needle.scale.set(0.27);
		Register.reels[reelID].needle.anchor.setTo(0.5, 0);
		/* dice */
		Register.reels[reelID].dice = Game.add.sprite(174, 174, 'dices'); // 174
		/** mask the dice so that only 130^2 space is shown */
		var _mask = Game.add.graphics(174, 174);
		_mask.beginFill(0xffffff);
		_mask.drawRect(0,0,130, 130);
		_mask.endFill();
		Register.reels[reelID].dice.mask = _mask;
		/* the disc and dice is in the same group */
		Register.reels[reelID].group.add(Register.reels[reelID].disc);
		Register.reels[reelID].group.add(Register.reels[reelID].dice);
		Register.reels[reelID].group.add(Register.reels[reelID].needle);
		Register.reels[reelID].group.add(_mask);
	},
	// resets reel settings
	resetReel: function (_hardReset) {
		Register.reelCountDownStarted = false;
		Register.reelCountDownMusicStarted = false;
		Register.reelHasSlowedDown = false;
		/** reel registers */
		for(var _reelID in Register.reels) {
			var _reelRegister = Register.reels[_reelID];
			_reelRegister.isSpinning = false;
			/** hard reset */
			if(_hardReset === true) {
				_reelRegister.currentStop = 1;
				_reelRegister.previousStop = -1;
				var $_targetDisc = _reelRegister.disc;
				if($_targetDisc) {
					$_targetDisc.angle = 0;
				}
			}
		}
	},
	/**
	 * Removes all the reels and hard reset
	 */
	removeReel: function () {
		this.resetReel(true);
		if(Register.reel_unit.group){
			Register.reel_unit.group.removeAll(true);
		}
	},
	/**
	 * Shows / hide the reels.
	 */
	showReels: function () {
		var $_reelUnit = Register.reel_unit.group;
		Game.world.bringToTop($_reelUnit);
		if(Register.groupInstances.caption_han_cho) Game.world.bringToTop(Register.groupInstances.caption_han_cho);
		Rom.sprite.modal_settings._bringToTop();
		var _tween = Game.add.tween($_reelUnit).to( { y: 90 }, 900, Phaser.Easing.Cubic.In, true);
	},
	hideReels: function () {
		var $_reelUnit = Register.reel_unit.group;
		var _tween = Game.add.tween($_reelUnit).to( { y: 700 }, 900, Phaser.Easing.Cubic.Out, true);
	},
	/**
	 * Reel Operation Management
	 */
	startGame: function() {
		/** start spinning the reels */
		this.spinReel(0);
		this.spinReel(1);
		/** start the music */
		this.startReelSpinMusic();
		/** Event. onStartReelSpin */
		PCB.event.trigger('onStartReelSpin');
	},
	/**
	 * Reel Audio Management
	 */
	startReelSpinMusic: function () {
		Register.reelCountDownMusicStarted = true;
		if(Register.is_double_up === false) {
			PCB.audio.play('reel_spin', undefined, 0.5, true);
		}
	},
	startFadingReelSpinMusicAndStop: function () {
		if(Register.is_double_up === false) {
			PCB.audio.fadeTo('reel_spin', 2000, 0);
		} else {
			PCB.audio.fadeTo('panic', 2000, 0);
		}
		PCB.clock.start('stopReelSpinMusic');
	},
	/**
	 * Dice Movements
	 */
	/**
	 * Change the current dice display to a specified index number.
	 *
	 * @example    PCB.reels.changeCurrentDiceDisplayTo(0,2);
	 *
	 * @param      number  diceIndex  The dice index (1 ~ 6)
	 */
	changeCurrentDiceDisplayTo: function ( reelID, diceIndex , forceTween ) {
		var $_targetDice = Register.reels[reelID].dice;
		var _targetPosition_y = 174 - (diceIndex - 1) * 130;
		var _do_tween = false;
		// $_targetDice.y = _targetPosition_y;
		if(!Register.reels[reelID].dice.tween) {
			_do_tween = true;
		} else if(forceTween === true) {
			Register.reels[reelID].dice.tween.stop();
			_do_tween = true;
		} else if(Register.reels[reelID].dice.tween.isRunning === false) {
			_do_tween = true;
		}

		if(_do_tween === true) {
			Register.reels[reelID].dice.tween = Game.add.tween($_targetDice).to( { y: _targetPosition_y }, 250, Phaser.Easing.Bounce.Out, true);
		}
	},
	/**
	 * Advance dice slot by distance.
	 * Each dice height is 130. Dice frame * 6 + 1 (index 1 for looping) + 1 (empty).
	 *
	 * @example    PCB.reels.advanceDiceSlotSpin(1,-10);
	 *
	 * @param      number  distance  The distance
	 */
	advanceDiceSlotSpin: function ( reelID, distance ) {
		var $_targetDice = Register.reels[reelID].dice;
		var _currentPosition_y = $_targetDice.y;
		var _MAX_HEIGHT = -606; // 174 - 130 * 6
		var _targetPosition_y = _currentPosition_y - distance;
		/** offset target position */
		if(_targetPosition_y < _MAX_HEIGHT) {
			_targetPosition_y = 174 - (_MAX_HEIGHT - _targetPosition_y);
		} else if (_targetPosition_y > 174 ){
			_targetPosition_y = _MAX_HEIGHT + _targetPosition_y - 174;
		}
		$_targetDice.y = _targetPosition_y;
	},
	// routine for the reels, calculations
	spinReel: function ( reelID ) {
		/** _self */
		var _self = this;
		/** return if the reel is already in motion */
		if(Register.reels[reelID].isSpinning === true) return;
		/** set the spin state immediately */
		Register.reels[reelID].isSpinning = true;

		/** define variables */
		var $_targetDisc = Register.reels[reelID].disc;

		/** randomize angle and duration of spinning */
		var _rand_angle = Math.floor(PCB.rng.generate(1000));
		var _rand_time = Math.floor(Math.random() * 2000) + 6000;
		/** using tween to spin the wheel */
		var _tween = Game.add.tween($_targetDisc).to({
			angle: 4080 + _rand_angle
		}, 11000 + _rand_time, function(k) {
			_self.getCurrentStopID(reelID);
			if(k > 0.5 && Register.reelCountDownStarted === false) {
				Register.reelCountDownStarted = true;
			}
			if(k > 0.5 && Register.reelHasSlowedDown === false) {
				Register.reelHasSlowedDown = true;
			}
			return --k * k * k + 1;
		}, true);

		_tween.onComplete.add(_findFinalResult, this);

		function _findFinalResult() {
			// reset once to the degree under 360
			$_targetDisc.angle = Math.ceil($_targetDisc.angle % 360);
			Register.reels[reelID].isSpinning = false;
			_self.getCurrentStopID(reelID,true);
			/** make sure that this is the last one */
			if(
				Register.reels[0].isSpinning === false &&
				Register.reels[1].isSpinning === false
			) {
				// make sure that the ChoHanIndicator is update once again
				this.updateChoHanIndicator();
				/** the 'onCompleteGame' event triggered when the clock is fired */
				PCB.clock.start('finalReelSpinStopWait');
			}

			/** trigger event */
			PCB.event.trigger('onCompleteSpinReel');
		}
	},
	/**
	 * Get current stop ID and set to register
	 * Change the dice display
	 * play sound
	 * animate needle
	 */
	getCurrentStopID: function ( reelID , lastTick ) {
		var $_targetReel = Register.reels[reelID];
		var $_targetDisc = $_targetReel.disc;
		var _reelCountDownStarted = Register.reelCountDownStarted;
		var _reelHasSlowedDown = Register.reelHasSlowedDown;
		var _reelCountDownMusicStarted = Register.reelCountDownMusicStarted;
		// rotation
		var _currentAngle = Math.floor(($_targetDisc.angle + 360) % 360);
		$_targetReel.currentAngle = _currentAngle;
		var _currentPocketNum = 6 - Math.floor(_currentAngle / 60);
		$_targetReel.currentStop = _currentPocketNum;
		lastTick = (!lastTick) ? false : true;

		var _hasPocketHasChanged = $_targetReel.previousStop != _currentPocketNum;

		// update the register
		$_targetReel.previousStop = _currentPocketNum;

		// pocket_bets
		if (_reelCountDownStarted === false) {
			this.advanceDiceSlotSpin(reelID, 20);
		} else if(_hasPocketHasChanged === true) {
			this.changeCurrentDiceDisplayTo(reelID,_currentPocketNum, lastTick);
			if ( Register.reelCountDownStarted === true ) {
				if(reelID == 0) PCB.audio.play('taiko01',undefined, 0.6);
				if(reelID == 1) PCB.audio.play('taiko03',undefined, 0.6);
				//  cho han indicator
				this.updateChoHanIndicator();
			}
		}

		/**
		 * needle movement
		 */
		if(_hasPocketHasChanged === true) {
			this.animateNeedle(reelID, lastTick, _currentAngle % 60);
		}

		/**
		 * Final count down
		 */
		if(_reelHasSlowedDown === true && _reelCountDownMusicStarted === true) {
			Register.reelCountDownMusicStarted = false;
			PCB.reels.startFadingReelSpinMusicAndStop();
		}
	},
	animateNeedle: function (reelID , lastTick, atBorder) {
		var $_targetNeedle = Register.reels[reelID].needle;
		if(lastTick === true && atBorder == 0) {
			$_targetNeedle.angle = 0;
			Game.add.tween($_targetNeedle).to( { angle: 10 }, 100, Phaser.Easing.Bounce.Out, true);
		} else {
			$_targetNeedle.angle = -10;
			Game.add.tween($_targetNeedle).to( { angle: 0 }, 100, Phaser.Easing.Bounce.Out, true);
		}
	},
	updateChoHanIndicator: function () {
		var _currentParity = this.findCurrentChoHan();
		if(_currentParity === 'even') {
			PCB.sprite({'id':'caption_han_cho',arguments:'cho'});
		} else {
			PCB.sprite({'id':'caption_han_cho',arguments:'han'});
		}
	},
	/**
	 * Evaluate results then read aloud.
	 */
	evaluateGameResult: function () {
		var $_targetReel_1 = Register.reels[0];
		var $_targetReel_2 = Register.reels[1];
		var _diceCombination = [];
		_diceCombination.push($_targetReel_1.currentStop,$_targetReel_2.currentStop);
		/** sort ASC */
		_diceCombination.sort(function(a,b){
			if( a < b ) return -1;
			if( a > b ) return 1;
			return 0;
		});
		var _total_sum = _diceCombination[0] + _diceCombination[1]
		var _parity = (_total_sum % 2 == 0) ? 'even' : 'odd';
		Register.last_reel_parity = _parity;
		var _audio_marker_name = _parity.charAt(0) + _diceCombination[0] + '-' + _diceCombination[1];
		PCB.audio.play('ginji_deme', _audio_marker_name, 0.55);
		/** judge the game result */
		if(Register.bet_parity === '') {
			// no game played
			Register.game_result = null;
		} else if(_parity === Register.bet_parity) {
			Register.game_result = true;
		} else {
			Register.game_result = false;
		}
	},
	findCurrentChoHan: function () {
		var $_targetReel_1 = Register.reels[0];
		var $_targetReel_2 = Register.reels[1];
		var _total_sum = $_targetReel_1.currentStop + $_targetReel_2.currentStop;
		return (_total_sum % 2 == 0) ? 'even' : 'odd';;
	}
};