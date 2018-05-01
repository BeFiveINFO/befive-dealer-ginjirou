/*
	rom: sprite
	Used for preload
*/

// Make Rom if it does not exist yet (to deal with load order issue here).
if(!Rom) var Rom = {};

// burn rom
if(!Rom.sprite) Rom.sprite = {};

/**
 * Indent
 */

 /**
 * Dices (Game Bet Phase)
 */
Rom.sprite.indent_bet_phase_dices = {
	new: function () {
		Register.groupInstances.indent_bet_phase_dices = Game.add.group();
		// left
		Register.spriteInstances.indent_bet_phase_dices_left = Game.add.sprite(-130, 0, 'dices_spritesheet');
		Register.spriteInstances.indent_bet_phase_dices_left.anchor.setTo(0.5, 0.5);
		Register.spriteInstances.indent_bet_phase_dices_left.scale.setTo(0.51);
		// right
		Register.spriteInstances.indent_bet_phase_dices_right = Game.add.sprite(130, 0, 'dices_spritesheet');
		Register.spriteInstances.indent_bet_phase_dices_right.anchor.setTo(0.5, 0.5);
		Register.spriteInstances.indent_bet_phase_dices_right.scale.setTo(0.51);
		// group
		Register.groupInstances.indent_bet_phase_dices.add(Register.spriteInstances.indent_bet_phase_dices_left);
		Register.groupInstances.indent_bet_phase_dices.add(Register.spriteInstances.indent_bet_phase_dices_right);
		// visibility
		// Register.groupInstances.indent_bet_phase_dices.visible = false;

		/**
		 * Clocks
		 */
		 // End this indent
		PCB.clock.setTimeoutClock({
			'id': 'endBetPhaseDices', // _clock_id
			'timeout': 1300,
			callback: function () { // _callback
				PCB.audio.play('dice_in',undefined, 1);
				var $_targetGroup = Register.groupInstances.indent_bet_phase_dices;
				var _tween = Game.add.tween($_targetGroup).to( { alpha: 0 , y: Game.stage.height + 100 }, 200, Phaser.Easing.Cubic.In, true);
				_tween.onComplete.add(function () {
					$_targetGroup.visible = false;
				}, this);
			}
		});
	},
	update: function () {

		var $_targetGroup = Register.groupInstances.indent_bet_phase_dices;
		var $_tagetSprite_left = Register.spriteInstances.indent_bet_phase_dices_left;
		var $_tagetSprite_right = Register.spriteInstances.indent_bet_phase_dices_right;
		/* registers */
		var _reelRegister_0_currentStop = Register.reels[0].currentStop;
		var _reelRegister_1_currentStop = Register.reels[1].currentStop;
		$_tagetSprite_left.frame = _reelRegister_0_currentStop - 1;
		$_tagetSprite_right.frame = _reelRegister_1_currentStop - 1;
		/* show fade */
		$_targetGroup.x = Game.world.centerX;
		$_targetGroup.y = -100;
		$_targetGroup.alpha = 0;
		$_targetGroup.visible = true;
		var _tween = Game.add.tween($_targetGroup).to( { alpha: 1, y:  Game.world.centerY + 255}, 400, Phaser.Easing.Cubic.Out, true);
		/** priority */
		Game.world.bringToTop($_tagetSprite_left);
		Game.world.bringToTop($_tagetSprite_right);
		Game.world.bringToTop($_targetGroup);
		// timer
		PCB.clock.start('endBetPhaseDices');
	}
}

/**
 * Fight
 */
Rom.sprite.indent_fight = {
	/* properties */
	'emitter_sakura': null,
	/* methods */
	new: function () {
		Register.groupInstances.indent_fight = Game.add.group();
		// tileSprite , "Game.width*2, Game.height*2" is  used to avoid mask problem on MacOS Safari
		// Register.spriteInstances.indent_fight_background = Game.add.tileSprite(0, 0, Game.width*2, Game.height*2, 'pattern_cloud_wave');
		Register.spriteInstances.indent_fight_background = Game.add.tileSprite(0, 0, Game.width*2, Game.height*2, 'pattern_cloud_wave');
		Register.spriteInstances.indent_fight_background.alpha = 0;
		// cap fight
		PCB.sprite({'id':'caption_shoubu'});

		// group
		Register.groupInstances.indent_fight.add(Register.spriteInstances.indent_fight_background);
		Register.groupInstances.indent_fight.add(Register.spriteInstances.caption_shoubu);
		Register.groupInstances.indent_fight.visible = false;
		// Fade out cap timer
		PCB.clock.setTimeoutClock({
			'id': 'fadeOutCapFight', // _clock_id
			'timeout': 1800,
			callback: function () { // _callback
				var $_caption_shoubu = Register.spriteInstances.caption_shoubu;
				var _tween = Game.add.tween($_caption_shoubu).to( { alpha: 0}, 1500, Phaser.Easing.Cubic.Out, true);
			}
		});
		// End this indent
		PCB.clock.setTimeoutClock({
			'id': 'endIndentFight', // _clock_id
			'timeout': 2200,
			callback: function () { // _callback
				var _tween = Game.add.tween(Register.spriteInstances.indent_fight_background).to( { alpha: 0}, 800, Phaser.Easing.Cubic.Out, true);
				PCB.event.trigger('endIndentFightCall');
			}
		});
	},
	update: function () {
		Register.groupInstances.indent_fight.visible = true;
		// background
		Register.spriteInstances.indent_fight_background.alpha = 0;
		Register.spriteInstances.indent_fight_background.tilePosition.x = 0;
		Register.spriteInstances.indent_fight_background.tilePosition.y = 0;
		Game.add.tween(Register.spriteInstances.indent_fight_background).to( { alpha: 1}, 800, Phaser.Easing.Cubic.Out, true);
		Game.add.tween(Register.spriteInstances.indent_fight_background.tilePosition).to( { x: 1500, y: 1500}, 4000, Phaser.Easing.Linear.None, true);
		// caption
		PCB.sprite({'id':'caption_shoubu','arguments':true});
		var $_caption_shoubu = Register.spriteInstances.caption_shoubu;
		$_caption_shoubu.scale.setTo(0.1);
		Game.add.tween($_caption_shoubu.scale).to( { x: 1.5 , y: 1.5}, 2000, Phaser.Easing.Cubic.Out, true);
		// timer
		PCB.clock.start('fadeOutCapFight');

		// priority fix
		if(Register.groupInstances.indent_fight) Game.world.bringToTop(Register.groupInstances.indent_fight);
		if(Register.spriteInstances.dynamic_text_game_creditCount) Game.world.bringToTop(Register.spriteInstances.dynamic_text_game_creditCount);
		// timer to end this indent (if there is no input to terminate)
		PCB.clock.start('endIndentFight');
		// play sound
		PCB.audio.play('voices_people', 'ginji_iza_shoubu', 0.55);
	},
}


/**
 * You Lose
 */
Rom.sprite.indent_you_lose = {
	/* properties */
	/* methods */
	new: function () {
		Register.groupInstances.indent_you_lose = Game.add.group();
		Register.spriteInstances.indent_you_lose_background = Game.add.tileSprite(0, 0,Game.width*2, Game.height*2, 'pattern_kiku_wave');
		Register.spriteInstances.indent_you_lose = Game.add.sprite(Game.width/2, Game.height/2, 'hanko_lose');
		Register.spriteInstances.indent_you_lose.anchor.setTo(0.5, 0.5);
		// group
		Register.groupInstances.indent_you_lose.add(Register.spriteInstances.indent_you_lose_background);
		Register.groupInstances.indent_you_lose.add(Register.spriteInstances.indent_you_lose);
		Register.groupInstances.indent_you_lose.visible = false;
		// End this indent
		PCB.clock.setTimeoutClock({
			'id': 'endIndentLose', // _clock_id
			'timeout': 1700,
			callback: function () { // _callback
				var $_indent_you_lose_group = Register.groupInstances.indent_you_lose;
				var _tween = Game.add.tween($_indent_you_lose_group).to( { alpha: 0}, 800, Phaser.Easing.Cubic.Out, true);
				_tween.onComplete.add(function () {
					$_indent_you_lose_group.visible = false;
					PCB.event.trigger('endIndentLose');
				}, this);
			}
		});
	},
	update: function () {
		var $_indent_you_lose = Register.spriteInstances.indent_you_lose;
		var $_indent_you_lose_group = Register.groupInstances.indent_you_lose;
		$_indent_you_lose_group.alpha = 0;
		$_indent_you_lose_group.visible = true;

		Game.add.tween($_indent_you_lose_group).to({ alpha: 1}, 800, Phaser.Easing.Cubic.Out, true);
		$_indent_you_lose.scale.setTo(4);
		$_indent_you_lose.angle = 0;
		Game.add.tween($_indent_you_lose.scale).to( { x: 1 , y: 1}, 900, Phaser.Easing.Bounce.Out, true);
		Game.add.tween($_indent_you_lose).to( { angle: 5}, 500, Phaser.Easing.Linear.None, true);
		// priority fix
		Game.world.bringToTop($_indent_you_lose_group);
		if(Register.spriteInstances.dynamic_text_game_creditCount) {
			Game.world.bringToTop(Register.spriteInstances.dynamic_text_game_creditCount);
		}

		// play sound
		PCB.audio.play('vibraslap');

		// timer
		PCB.clock.start('endIndentLose');
	},
}

/**
 * You Win
 */
 Rom.sprite.indent_you_win = {
	/* properties */
	'tween_showIndentWinResults': null,
	'tween_endIndentWin': null,
	/* methods */
	new: function () {
		var _self = this;
		Register.groupInstances.indent_you_win = Game.add.group();
		Register.spriteInstances.indent_you_win_background = Game.add.sprite(Game.width/2, Game.height/2, 'hokusai_dragon');
		Register.spriteInstances.indent_you_win_background.anchor.setTo(0.5, 0.5);
		// hanko
		Register.spriteInstances.indent_you_win = Game.add.sprite(Game.width/2, Game.height/2, 'hanko_win');
		Register.spriteInstances.indent_you_win.anchor.setTo(0.5, 0.5);
		// text
		PCB.sprite({ 'id': 'dynamic_text_game_winCount', 'arguments': '---' });
		Register.spriteInstances.dynamic_text_game_winCount.alpha = 0;
		PCB.sprite({ 'id': 'dynamic_text_game_dividentsBreakdown', 'arguments': '---' });
		Register.spriteInstances.dynamic_text_game_dividentsBreakdown.alpha = 0;

		// group
		Register.groupInstances.indent_you_win.add(Register.spriteInstances.indent_you_win_background);
		Register.groupInstances.indent_you_win.add(Register.spriteInstances.indent_you_win);
		Register.groupInstances.indent_you_win.add(Register.spriteInstances.dynamic_text_game_winCount);
		Register.groupInstances.indent_you_win.add(Register.spriteInstances.dynamic_text_game_dividentsBreakdown);
		Register.groupInstances.indent_you_win.visible = false;

		// input event
		// add input event for the background image.
		Register.spriteInstances.indent_you_win_background.events.onInputDown.add(function () {
			Register.spriteInstances.indent_you_win_background.events.inputEnabled = false;
			PCB.event.trigger('endCreditSegmentAnimation');
		});
		// show results
		PCB.clock.setTimeoutClock({
			'id': 'showIndentWinResults', // _clock_id
			'timeout': 600,
			callback: function () { // _callback
				var $_indent_you_win = Register.spriteInstances.indent_you_win;
				var $_indent_you_win_background = Register.spriteInstances.indent_you_win_background;
				var $_dynamic_text_game_winCount = Register.spriteInstances.dynamic_text_game_winCount;
				var $_dynamic_text_game_dividentsBreakdown = Register.spriteInstances.dynamic_text_game_dividentsBreakdown;
				// tween
				Game.add.tween($_dynamic_text_game_dividentsBreakdown).to( { alpha: 1}, 1000, Phaser.Easing.Cubic.Out, true);
				Game.add.tween($_indent_you_win_background).to( { alpha: 1}, 1000, Phaser.Easing.Cubic.Out, true);
				Game.add.tween($_dynamic_text_game_winCount).to( { alpha: 1}, 1000, Phaser.Easing.Cubic.Out, true);
				Game.add.tween($_indent_you_win).to( { alpha: 0}, 1200, Phaser.Easing.Cubic.Out, true);
				// clock
				PCB.clock.start('creditSegmentAnimation');
				// audio
				PCB.audio.play('taiko_session', undefined, 1, true);

				if(Register.is_double_up === true){
					PCB.audio.play('voices_people', 'bookie_give_me_a_break', 1);
				}
			}
		});

		// End this indent (safe stop)
		PCB.clock.setTimeoutClock({
			'id': 'waitForIndentWin', // _clock_id
			'timeout': 5000, // 3 seconds
			callback: function () { // _callback
				PCB.event.trigger('endCreditSegmentAnimation');
			}
		});

		// event to end the animation / end the indent
		PCB.event.add('endCreditSegmentAnimation', function () {
			if(_self.tween_endIndentWin) return;
			PCB.audio.fadeTo('taiko_session',1400,0);
			PCB.clock.start('stopCountingMusic');
			// stop clocks
			PCB.clock.stop('creditSegmentAnimation');
			PCB.clock.stop('waitForIndentWin');
			// update the credit and the display
			PCB.sprite({'id':'dynamic_text_game_creditCount','arguments':Register.pending_current_credits});
			// fade out the indent group
			var $_indent_you_win_group = Register.groupInstances.indent_you_win;
			_self.tween_endIndentWin = Game.add.tween($_indent_you_win_group).to( { alpha: 0}, 800, Phaser.Easing.Cubic.Out, true);
			_self.tween_endIndentWin.onComplete.add(function () {
				// make the win indent invisible
				$_indent_you_win_group.visible = false;
				// make sure to stop all the clock
				PCB.clock.stop('showIndentWinResults');
				PCB.clock.stop('stopCountingMusic');
				PCB.audio.stop('taiko_session');
				// @see rom game state
				PCB.event.trigger('endIndentWin');
			}, this);
		});

		// stop music after fadeOut
		PCB.clock.setTimeoutClock({
			'id': 'stopCountingMusic', // _clock_id
			'timeout': 2000, // 2 seconds
			callback: function () { // _callback
				PCB.audio.stop('taiko_session');
			}
		});
	},
	update: function () {
		// stop clocks once
		PCB.clock.stop('showIndentWinResults');
		PCB.clock.stop('creditSegmentAnimation');
		PCB.clock.stop('waitForIndentWin');
		PCB.clock.stop('stopCountingMusic');
		PCB.audio.stop('taiko_session');

		// reset dynamic text
		PCB.sprite({ 'id': 'dynamic_text_game_winCount', 'arguments': 0 });
		PCB.sprite({ 'id': 'dynamic_text_game_dividentsBreakdown', 'arguments': Rom.state.game.getDividendsBreakdown() });
		// null stop tweens
		this.tween_showIndentWinResults = null;
		this.tween_endIndentWin = null;
		// init sprites
		Register.spriteInstances.indent_you_win_background.alpha = 0;
		Register.spriteInstances.dynamic_text_game_winCount.alpha = 0;
		Register.spriteInstances.dynamic_text_game_dividentsBreakdown.alpha = 0;
		var $_indent_you_win = Register.spriteInstances.indent_you_win;
		var $_indent_you_win_group = Register.groupInstances.indent_you_win;
		$_indent_you_win_group.alpha = 0;
		$_indent_you_win_group.visible = true;
		Game.add.tween($_indent_you_win_group).to({ alpha: 1}, 800, Phaser.Easing.Cubic.Out, true);
		$_indent_you_win.scale.setTo(4);
		$_indent_you_win.alpha = 1;
		Game.add.tween($_indent_you_win.scale).to( { x: 1 , y: 1}, 150, Phaser.Easing.Linear.None, true);
		// priority fix
		Game.world.bringToTop($_indent_you_win_group);
		if(Register.spriteInstances.dynamic_text_game_creditCount) {
			Game.world.bringToTop(Register.spriteInstances.dynamic_text_game_creditCount);
		}

		// play sound
		PCB.audio.play('hand-drum',undefined,1);

		// timer
		PCB.clock.start('showIndentWinResults');

		// enable input
		Register.spriteInstances.indent_you_win_background.inputEnabled = true;
	},
}
