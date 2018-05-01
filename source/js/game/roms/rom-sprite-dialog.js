/*
	rom: sprite
	Used for preload
*/

// Make Rom if it does not exist yet (to deal with load order issue here).
if(!Rom) var Rom = {};

// burn rom
if(!Rom.sprite) Rom.sprite = {};

/**
 * Dialogs
 */

/**
 * Game Results
 */
Rom.sprite.dialog_game_double_up= {
	new: function (_arguments) {
		Register.spriteInstances.dialog_game_double_up = new Phasetips(Game, {
			context: "I specially offer you one shot deal. You could double your credits or lose all.",
			font: "Merienda One",
			fontSize: 20,
			width: 500,
			fontStroke: "#d7003a",
			fontFill: "#FFFFFF",
			backgroundColor: 0xc9171e,
			strokeColor: 0x192f60,
			strokeWeight: 5,
			roundedCornersRadius: 10,
			x: 167,
			y: 400,
			// x: 402,
			// y: 170,
			disableInputEvents: true,
		});
		this.update(false);
	},
	update: function (_show) {
		if(_show == true) {
			Game.world.bringToTop(Register.spriteInstances.dialog_game_double_up);
			Rom.sprite.modal_settings._bringToTop();
			Register.spriteInstances.dialog_game_double_up.simulateOnHoverOver();
		} else {
			Register.spriteInstances.dialog_game_double_up.simulateOnHoverOut();
		}
	},
}

/**
 * No credits
 */

Rom.sprite.dialog_no_credits = {
	new: function (_arguments) {
		Register.spriteInstances.dialog_no_credits = new Phasetips(Game, {
			context: "You do not have any more credits. Please wait until your credits are replenished.",
			font: "Merienda One",
			fontSize: 20,
			width: 500,
			fontStroke: "#d7003a",
			fontFill: "#FFFFFF",
			backgroundColor: 0xc9171e,
			strokeColor: 0x000,
			strokeWeight: 5,
			roundedCornersRadius: 10,
			x: 410,
			y: 250,
			// x: 402,
			// y: 170,
			disableInputEvents: true,
		});
		this.update(false);
	},
	update: function (_show) {
		if(_show == true) {
			Game.world.bringToTop(Register.spriteInstances.dialog_no_credits);
			Register.spriteInstances.dialog_no_credits.simulateOnHoverOver();
		} else {
			Register.spriteInstances.dialog_no_credits.simulateOnHoverOut();
		}
	},
}

