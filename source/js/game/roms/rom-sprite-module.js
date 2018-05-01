/*
	rom: sprite
	Used for preload
*/

// Make Rom if it does not exist yet (to deal with load order issue here).
if(!Rom) var Rom = {};

// burn rom
if(!Rom.sprite) Rom.sprite = {};
/**
 * Modules
 */

/**
 * Bet Selector
 */
Rom.sprite.bet_selector_module = {
	/**
	 * Properties
	 */
	/**
	 * 0~5 : bet amount button labels. 6: cancel.
	 */
	'bet_button_label_instances': [],
	'state': false,
	/**
	 * Methods
	 */
	new: function () {
		/**
		 * group
		 */
		Register.groupInstances.bet_selector_module = Game.add.group();
		Register.groupInstances.bet_selector_module.visible = false;
		// init
		this.bet_button_label_instances = [];
		/**
		 * buttons. 200 x 108. 3 Rows. 2 Columns
		 */
		// add to group
		var _bet_denomination = [5000,1000,500,100,50,10, 0];
		for (var _i = 0; _i <= 6 ; _i ++) {
			var _buttonGroup = Game.add.group();
			var _currentInstance = Game.add.sprite(0,0, 'japanese_scroll');
			_buttonGroup.bet_amount = _bet_denomination[_i];
			var _label = Game.add.text(0,0,_bet_denomination[_i],{ font: "64px Merienda One", fill: "#343434", align: "center" , boundsAlignH: 'center', boundsAlignV: 'middle'});
			_label.setTextBounds(0, 0, 200, 108);
			_buttonGroup.add(_currentInstance);
			_buttonGroup.add(_label);
			// button event
			_currentInstance.inputEnabled = true;
			_currentInstance.events.onInputDown.add(this.onInputDown, this);
			// position
			var _row = _i % 2;
			var _column;
			if(_i <= 1) {
				_column = 0;
			} else if (_i <= 3){
				_column = 1;
			} else if (_i <= 5){
				_column = 2;
			} else {
				_column = 3;
				_row = 1;
			}
			_buttonGroup.x = _row * 240;
			_buttonGroup.y = _column * 120;
			Register.groupInstances.bet_selector_module.add(_buttonGroup);
			// add an backdoor access route
			this.bet_button_label_instances.push(_label);
		}

		// group position
		Register.groupInstances.bet_selector_module.x = 400;
		Register.groupInstances.bet_selector_module.y = 125;
	},
	update: function (show) {
		var $_bet_selector_module_group = Register.groupInstances.bet_selector_module;
		if(show == true) {
			// update the text label according to the current credit count
			this._updateBetAmountLabels();
			this.state = true;
			$_bet_selector_module_group.visible = true;
			$_bet_selector_module_group.alpha = 0;
			Game.add.tween($_bet_selector_module_group).to( { alpha: 1 }, 200, Phaser.Easing.Cubic.In, true);
		} else {
			this.state = false;
			var _tween = Game.add.tween($_bet_selector_module_group).to( { alpha: 0 }, 200, Phaser.Easing.Cubic.In, true);
			_tween.onComplete.add(function () {
				$_bet_selector_module_group.visible = false;
			}, this);
		}
	},
	onInputDown: function (e) {
		PCB.event.trigger('setBet',e.parent.bet_amount);

	},
	_updateBetAmountLabels: function () {
		var _creditCount = Register.creditCount;
		if(Register.is_double_up === true) {
			for (var _i = 0; _i <= 5 ; _i ++) {
				var $_targetLabel = this.bet_button_label_instances[_i];
				var $_targetParent = $_targetLabel.parent;
				if(_i === 0) {
					$_targetParent.bet_amount = _creditCount;
					var _text_length = String(_creditCount).length;
					var _fontSize;
					if(_text_length >= 6){
						_fontSize = 45;
					} else if(_text_length >= 5){
						_fontSize = 50;
					} else if(_text_length >= 4){
						_fontSize = 55;
					} else {
						_fontSize = 64;
					}
					$_targetParent.visible = true;
					$_targetLabel.setText(_creditCount);
					$_targetLabel.style.font = _fontSize+'px Merienda One';
					_creditCount = Math.floor(_creditCount / 2);
				} else {
					$_targetParent.visible = false;
				}
			}
		} else {
			for (var _i = 0; _i <= 5 ; _i ++) {
				var $_targetLabel = this.bet_button_label_instances[_i];
				var $_targetParent = $_targetLabel.parent;
				if(_creditCount < 1) {
					$_targetParent.visible = false;
				} else {
					$_targetParent.visible = true;
				}
				$_targetParent.bet_amount = _creditCount;
				var _text_length = String(_creditCount).length;
				var _fontSize;
				if(_text_length >= 6){
					_fontSize = 45;
				} else if(_text_length >= 5){
					_fontSize = 50;
				} else if(_text_length >= 4){
					_fontSize = 55;
				} else {
					_fontSize = 64;
				}

				$_targetLabel.setText(_creditCount);
				$_targetLabel.style.font = _fontSize+'px Merienda One';
				_creditCount = Math.floor(_creditCount / 2);
			}
		}
		/** note: button 6 is always 0 which is cancel. */
	}
}

