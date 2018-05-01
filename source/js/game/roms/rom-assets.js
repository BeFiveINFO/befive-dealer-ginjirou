/*
	rom: assets
	Used for preload
*/
// Make Rom if it does not exist yet (to deal with load order issue here).
if(!Rom) var Rom = {};

// burn rom
/**
 * This is one of those stages, separated from the stages in rom
 * to make maintanance easier
 * Loads assets (preloadin)
 * Merge config settings
 * Reflect the settings
 * Start Rom, either title or company logo splash
*/
Rom.assets = {
	// properties
	manifest: {
		// setting files - id as key and full relative path without json ext. under the config dir to the json file
		json: {
			'settings': 'settings',
		},
		// images. id as key and full relative path under the images dir to the image file
		image: {
			'mute_off': 'ui/mute_off.png',
			'mute_on': 'ui/mute_on.png',
			/* title */
			'title_image': 'others/title_image.jpg',
			/* dice reel */
			'dice_roulette': 'others/dice_roulette.png',
			/* dices */
			'dices': 'others/dices.png',
			/* avatar frame */
			'avatar_frame_player': 'others/avatar_frame_player.png',
			'avatar_frame_rival': 'others/avatar_frame_rival.png',
			/* pattern */
			'pattern_tatami': 'others/tatami.jpg',
			'pattern_sakura_no_mai': 'others/pattern_sakura_no_mai.png',
			'pattern_cloud_wave': 'others/pattern_cloud_wave.png',
			'pattern_kiku_wave': 'others/pattern_kiku_wave.png',
			'pattern_kiku_aonami': 'others/pattern_kiku_aonami.png',
			/* background */
			/* needle */
			'needle': 'others/needle.png',
			/* coin */
			/* hanko */
			'hanko_lose': 'others/hanko_lose.png',
			'hanko_win': 'others/hanko_win.png',
			/** cho han indicator */
			'indicator_even': 'others/indicator_even.png',
			'indicator_odd': 'others/indicator_odd.png',
			/* scroll, used for bet button */
			'japanese_scroll': 'others/japanese_scroll.png',
			/* caps */
			'caption_shoubu': 'others/caption_shoubu.png',
			/* cho han cards */
			'card_even': 'others/card_chou.png',
			'card_odd': 'others/card_han.png',
			/* background */
			'hokusai_dragon': 'others/hokusai_dragon.png'
		},
		spritesheet: {
			/**
			 * symbols
			 * Maybe a bug in Phaser.js. there needs to be one additional blank frame in the last
			 * so that the last one (seven) can be used
			 * Size of each symbol : 234 x 160
			 * Make sure to set Register.reelSymbol_width, Register.reelSymbol_height respectively
			 * If you ever need to change the symbol height / width.
			 */
			'spin_button': ['ui/button_red.png',140, 140],
			'attendant_button': ['ui/button_attendant.png',100, 100, 3],
			/* dices */
			'dices_spritesheet': ['others/dices.png',130,130,8],
		},
		atlasHash : [
			'avatars'
		],
		// regular audio - id as key and sound without extension as value
		audio: {
			'befive_id': 'befive_id',
			'opening': 'opening',
			'main_theme': 'enka',
			'game_over': 'game_over',
			'reel_spin': 'nigiwai',
			'panic': 'panic',
			'game_start': 'shoubu',
			'key_type': 'key_type',
			'title_call': 'title_call',
			'taiko01': 'taiko01',
			'taiko02': 'taiko02',
			'taiko03': 'taiko03',
			'taiko_session': 'taiko_session',
			'hand-drum': 'hand-drum',
			'vibraslap': 'vibraslap',
			'dice_in': 'dice_in',
		},
		// audio sprite
		audiosprite: {
			'voices_people': {
				// relative path to the sound file without extension (appropriate extension is automatically added)
				'path': 'voices_people',
				'audioJSON': { // audio sprite informtion
					'spritemap': {
						'customer_1_chou' : { start: 0.000, end: 0.450, loop: false } ,
						'customer_2_chou' : { start: 0.450, end: 1.100, loop: false } ,
						'customer_f_chou' : { start: 1.100, end: 1.723, loop: false } ,
						'customer_f_han' : { start: 1.723, end: 2.291, loop: false } ,
						'customer_1_han' : { start: 2.291, end: 2.582, loop: false } ,
						'customer_2_han' : { start: 2.582, end: 3.142, loop: false } ,
						'ginji_hairimasu' : { start: 3.142, end: 3.827, loop: false } ,
						'ginji_iza_shoubu' : { start: 3.827, end: 4.952, loop: false } ,
						'ginji_chou_han_soroimashita' : { start: 4.952, end: 7.117, loop: false } ,
						'bookie_please_come_again' : { start: 7.117, end: 9.270, loop: false } ,
						'bookie_give_me_a_break' : { start: 9.270, end: 12.240, loop: false } ,
						'bookie_we_are_not_npo' : { start: 12.240, end: 16.667, loop: false } ,
						'bookie_one_shot_deal' : { start: 16.667, end: 22.618, loop: false } ,
						'yaku_hankata' : { start: 22.618, end:23.560, loop: false } ,
						'yaku_choukata' : { start: 23.560, end: 24.570, loop: false } ,
						'yaku_place_your_bet_now' : { start: 24.570, end: 25.870, loop: false } ,
						'ginji_are_you_ready' : { start: 25.870, end: 29.1, loop: false } ,
					}
				}
			},
			'ginji_deme': {
				'path': 'ginji_deme',
				'audioJSON': {
					'spritemap': {
						'e1-1' : { start: 0.000, end: 1.515, loop: false },
						'e1-3' : { start: 1.515, end: 3.021, loop: false },
						'e1-5' : { start: 3.021, end: 4.538, loop: false },
						'e2-2' : { start: 4.538, end: 5.946, loop: false },
						'e2-4' : { start: 5.946, end: 7.282, loop: false },
						'e2-6' : { start: 7.282, end: 8.634, loop: false },
						'e3-3' : { start: 8.634, end: 10.266, loop: false },
						'e3-5' : { start: 10.266, end: 11.720, loop: false },
						'e4-4' : { start: 11.720, end: 13.200, loop: false },
						'e4-6' : { start: 13.200, end: 14.724, loop: false },
						'e5-5' : { start: 14.724, end: 16.261, loop: false },
						'e6-6' : { start: 16.261, end: 18.000, loop: false },
						'o1-2' : { start: 18.000, end: 19.375, loop: false },
						'o1-4' : { start: 19.375, end: 20.800, loop: false },
						'o1-6' : { start: 20.800, end: 22.456, loop: false },
						'o2-3' : { start: 22.456, end: 24.069, loop: false },
						'o2-5' : { start: 24.069, end: 25.479, loop: false },
						'o3-4' : { start: 25.479, end: 26.925, loop: false },
						'o3-6' : { start: 26.925, end: 28.533, loop: false },
						'o4-5' : { start: 28.533, end: 30.000, loop: false },
						'o5-6' : { start: 30.000, end: 31.341, loop: false },
					}
				}
			}
		}
	},
	// methods for pahser.js
	init: function () {
		PCB.screen.show({'id':'boot_screen'});
	},
	preload: function () {
		// set up listners
		PCB.assets.addPreloadListners(this);
		PCB.assets.enqueuePreloadAssets(this.manifest);
		// start loading now
		Game.load.start();
	},
	loadStart: function () {
		PCB.sprite({'id':'dynamic_text_bootMessage','arguments':'Loading assets ...'});
	},
	/**
	 * Note: onFileError does not seens to catch 404s on sound files (as of Phaser version. 2.4.2)
	 */
	onFileError: function(_fileKey, _file) {
		PCB.sprite({'id':'dynamic_text_bootMessage','arguments':'Error Occurred in loading files'});
		PCB.assets.removePreloadListners();
	},
	fileComplete: function (_progress, _cacheKey, _success, _totalLoaded, _totalFiles) {
		PCB.sprite({'id':'dynamic_text_bootMessage','arguments':'Now loading ... ' + _totalLoaded + "/" + _totalFiles});
	},
	loadComplete: function () {
		if(PCB.assets.postPreloadHandlings(this)){
			// init reels (bonus jackpot custom) , reel_settings
			PCB.reels.init();
			// init ad provider
			// PCB.adProvider.init();
			// init ad banner
			// PCB.adBanner.init();
			// to the next Stage
			if(Register.test_switch === true) {
				// set test_switch to true by settings.json to enter the test mode
				Game.state.start('Test');
			} else if(Register.show_company_logo_flash === false && Register.show_splash_and_title === false) {
				Game.state.start('GameLoop');
			} else if(Register.show_company_logo_flash === true) {
				Game.state.start('LogoSplash'); // moves onto TitleLoop after
			} else {
				// it is possible not to show the company logo flash with config
				Game.state.start('TitleLoop');
			};
		} else {
			PCB.sprite({'id':'dynamic_text_bootMessage','arguments':'Error Occurred'});
			console.log("Error");
		}
	},
};
