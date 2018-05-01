/*
	rom: sprite
	Used for preload
*/

// Make Rom if it does not exist yet (to deal with load order issue here).
if(!Rom) var Rom = {};

// burn rom
if(!Rom.sprite) Rom.sprite = {};

/**
 * Images
 */
Rom.sprite.sprite_company_logo = {
	new: function (_arguments) {
		var _scale = _arguments.scale;
		var _x = _arguments.x;
		var _y = _arguments.y;
		if(!_scale) _scale = 1;
		if(!_x) _x = Game.world.centerX;
		if(!_y) _y = Game.world.centerY + 200;
		Register.spriteInstances.sprite_company_logo = Game.add.sprite(_x,_y, 'company_logo');
		Register.spriteInstances.sprite_company_logo.anchor.setTo(0.5, 0.5);
		Register.spriteInstances.sprite_company_logo.scale.setTo(_scale);
	},
	update: function () {
		Game.world.bringToTop(Register.spriteInstances.sprite_company_logo);
	}
}

Rom.sprite.title_image = {
	new: function () {
		Register.spriteInstances.title_image_background = Game.add.sprite(0,0, 'title_image');
	},
	update: function () {
		Game.world.bringToTop(Register.spriteInstances.title_image);
	}
}

Rom.sprite.game_opening_background = {
	new: function () {
		Register.spriteInstances.game_opening_background = Game.add.tileSprite(0, 0, Game.width*2, Game.height*2, 'pattern_sakura_no_mai');
		Register.spriteInstances.game_opening_background.scale.setTo(0.5);
	},
	update: function () {
		Game.world.bringToTop(Register.spriteInstances.game_opening_background);
	}
}

Rom.sprite.game_background = {
	new: function () {
		Register.spriteInstances.game_background = Game.add.tileSprite(0, 0, Game.width*2, Game.height*2, 'pattern_tatami');
		Register.spriteInstances.game_background.scale.setTo(0.5);
	},
	update: function () {
		Game.world.bringToTop(Register.spriteInstances.game_background);
	}
}

Rom.sprite.gameover_background = {
	new: function () {
		Register.spriteInstances.gameover_background = Game.add.tileSprite(0, 0, Game.width*2, Game.height*2, 'pattern_kiku_aonami');
		Register.spriteInstances.gameover_background.scale.setTo(0.5);
	},
	update: function () {
		Game.world.bringToTop(Register.spriteInstances.gameover_background);
	}
}

/**
 * Caps
 */
Rom.sprite.caption_shoubu = {
	new: function () {
		Register.spriteInstances.caption_shoubu = Game.add.sprite(Game.width/2, Game.height/2, 'caption_shoubu');
		Register.spriteInstances.caption_shoubu.anchor.setTo(0.5, 0.5);
		Register.spriteInstances.caption_shoubu.alpha = 0;
	},
	update: function (show) {
		var $_caption_shoubu = Register.spriteInstances.caption_shoubu;
		if(show == true) {
			$_caption_shoubu.alpha = 0;
			var _tween = Game.add.tween($_caption_shoubu).to( { alpha: 1 }, 200, Phaser.Easing.Cubic.In, true);
		} else {
			var _tween = Game.add.tween($_caption_shoubu).to( { alpha: 0 }, 200, Phaser.Easing.Cubic.In, true);
		}
	}
}


/**
 * Han - Cho indication caps
 */

 Rom.sprite.caption_han_cho = {
 	/* props */
 	'tween': null,
 	/* methods */
	new: function () {
		// group
		Register.groupInstances.caption_han_cho = Game.add.group();
		// group settings
		Register.groupInstances.caption_han_cho.x = Game.width/2 - 105;
		Register.groupInstances.caption_han_cho.y = 400;
		// sprite
		Register.spriteInstances.caption_cho = Game.add.sprite(0, 0, 'indicator_even');
		Register.spriteInstances.caption_cho.visible = false;
		Register.spriteInstances.caption_han = Game.add.sprite(0, 0, 'indicator_odd');
		Register.spriteInstances.caption_han.visible = false;
		// add to group
		Register.groupInstances.caption_han_cho.add(Register.spriteInstances.caption_cho);
		Register.groupInstances.caption_han_cho.add(Register.spriteInstances.caption_han);
		// set initial state
		this.tween = Game.add.tween(Register.groupInstances.caption_han_cho).to( { alpha: 0, x: Game.width/2 - 105,y: 400}, 100, Phaser.Easing.Exponential.In, true);
	},
	update: function (mode) {
		var $_caption_han_cho_group = Register.groupInstances.caption_han_cho;
		if(mode !== 'hide' && $_caption_han_cho_group.alhpa != 1 ) {
			if(this.tween) this.tween.stop();
			$_caption_han_cho_group.visible = true;
			// $_caption_han_cho_group.alhpa = 0;
			this.tween = Game.add.tween($_caption_han_cho_group).to( { alpha: 1, x: Game.width/2 - 105,y: Game.height/2 - 315}, 1100, Phaser.Easing.Cubic.In, true);
		} else if (mode === 'hide') {
			if(this.tween) this.tween.stop();
			this.tween = Game.add.tween($_caption_han_cho_group).to( { alpha: 0, x: Game.width/2 - 105,y: 400}, 700, Phaser.Easing.Exponential.In, true);
			this.tween.onComplete.add(function () {
					$_caption_han_cho_group.alhpa = 0;
					$_caption_han_cho_group.visible = false;
				}, this);
			// end here
			return false;
		}
		var $_caption_han = Register.spriteInstances.caption_han;
		var $_caption_cho = Register.spriteInstances.caption_cho;
		if(mode === 'han') {
			$_caption_cho.visible = false;
			$_caption_han.visible = true;
		} else {
			$_caption_cho.visible = true;
			$_caption_han.visible = false;
		}
	}
}
