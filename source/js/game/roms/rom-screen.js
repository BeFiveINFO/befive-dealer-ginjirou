/*
	rom: screen
	Used for preload
*/
// Make Rom if it does not exist yet (to deal with load order issue here).
if(!Rom) var Rom = {};

// burn rom
Rom.screen = {
	// boot messages.
	boot_screen: function () {
		Game.stage.backgroundColor = '#EEEEEE';
		PCB.sprite({'id':'dynamic_text_bootMessage'});
		PCB.sprite({'id':'sprite_company_logo','arguments':{'scale':0.5}});
		PCB.sprite({'id':'button_fullScreen'});
	},
	company_logo_flash: function () {
		Game.stage.backgroundColor = '#EEEEEE';
		PCB.sprite({'id':'static_text_presentedBy'});
		PCB.sprite({'id':'static_text_versionNumber','arguments':{}});
		PCB.sprite({'id':'sprite_company_logo','arguments':{'scale':1,'y':Game.world.centerY}});
		PCB.sprite({'id':'dynamic_text_serialNumber','arguments':{'serialNumber':Register.serial_number}});
	},
	title_screen: function () {
		Game.stage.backgroundColor = '#000';
		PCB.sprite({'id':'title_image'});
		PCB.sprite({'id':'static_text_touchScreen'});
		// PCB.sprite({'id':'static_text_copyright'});
		// PCB.sprite({'id':'sprite_company_logo','arguments':{'scale':0.4}});
		PCB.sprite({'id':'dynamic_text_serialNumber','arguments':{'x':80,'y':Game.world.bounds.height - 15,'color': '#FFFFFF','fontSize': 18, 'align': 'left'}});
		PCB.sprite({'id':'static_text_versionNumber','arguments':{'x':160,'y':20,'color': '#FFFFFF','fontSize': 18, 'align': 'left'}});
		PCB.sprite({'id':'dynamic_text_creditCount'});
		PCB.sprite({'id':'button_mute'});
		PCB.sprite({'id':'button_fullScreen'});
		/**
		 * Tweens for the graphic elements
		 * Note: to(properties, duration, ease, autoStart, delay, repeat, yoyo). See {Phaser.Tween}
		 */
		// screen message tween
		Register.spriteInstances.static_text_touchScreen.y = Game.world.centerY ;
		Register.spriteInstances.static_text_touchScreen.alpha = 0;
		Game.add.tween(Register.spriteInstances.static_text_touchScreen).to({alpha: 1, y: Game.world.centerY+100 - Register.spriteInstances.static_text_touchScreen.height,}, 1500, Phaser.Easing.Bounce.Out, true, 250, 0);
		// tween scale for the smoother effect
		Game.add.tween(Register.spriteInstances.static_text_touchScreen.scale).to({x: 1.22, y: 1.2},2000, Phaser.Easing.Linear.None, true, 2000, -1, true);

		// no credit dialog
		PCB.sprite({'id':'dialog_no_credits'});
	},
	game_opening: function () {
		Game.stage.backgroundColor = '#000';
		PCB.sprite({'id':'game_opening_background'});
		PCB.sprite({'id':'static_text_choose_avatar'});
		PCB.sprite({'id':'dynamic_text_game_creditCount'});
	},
	game_screen: function () {
		Game.stage.backgroundColor = '#000';
		// background
		PCB.sprite({'id':'game_background'});
		// Reel
		PCB.reels.buildReels();

		// Caps
		PCB.sprite({'id':'card_even'});
		PCB.sprite({'id':'card_odd'});

		// BET Buttons
		PCB.sprite({'id':'bet_selector_module'});

		// Indents
		PCB.sprite({'id':'indent_bet_phase_dices'});
		PCB.sprite({'id':'indent_fight'});
		PCB.sprite({'id':'indent_you_win'});
		PCB.sprite({'id':'indent_you_lose'});

		// text elements
		PCB.sprite({'id':'dynamic_text_game_creditCount'});

		// dialog
		PCB.sprite({'id':'dialog_game_double_up'});

		// cho han indicator
		PCB.sprite({'id':'caption_han_cho'});

		// attendant_button
		PCB.sprite({'id':'attendant_button'});
		// settings menu dialog
		PCB.sprite({ 'id': 'modal_settings'});
	},
	game_over: function () {
		Game.stage.backgroundColor = '#000';
		PCB.sprite({'id':'gameover_background'});
		PCB.sprite({'id':'static_text_gameover'});
	}
};
