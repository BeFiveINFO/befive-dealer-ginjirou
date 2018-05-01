/*
	logic: leaders board
	global leaders board manager
*/
// Make Printed circuit board if it does not exist yet (to deal with load order issue here).
if(!PCB) var PCB = {};

/**
 * Leaders Board is show ranking of participating players.
 *
 * When YOU (the player) are within the top 5 ranking, The other 4 players are displayed altogether.
 * If YOU are at the 6th, #1~#3 players are shown from the top, then YOU followed by players at #7 and #8.
 * If YOU are at the 7th or below, #1~#3 players are shown from the top,
 * 		then a player at the ranking right before YOU, and YOU followed by the ranking right after YOU.
 * If there are not enough players they will be hidden (PCB.leaders_board.priv_tag_coords[5]).
 */

// print PCB
PCB.leaders_board = {
	/**
	 * Public Properties
	 */
	'status_network_trigger': -1,
	/**
	 * Private Properties
	 */
	// Triggered every 'request_frequency' seconds. used for top ranking
	'request_frequency' : 60,
	'can_request_ranking': false,
	// Coordinates for tags. The 7th value is reserved for tags without any information to show.
	'priv_tag_coords': [75,142,209,276,343,410,-100],
	// Tag information holder. see reset() for data structure.
	'priv_tags': {},
	// Status board related
	'priv_status': {'mode': 0, 'hours': 0, 'jackpot': 0, 'duration': 3600, 'title': 'Tournament Cup','campaign_id': ''},
	/**
	 * Public Methods
	 */
	init: function() {
		this.reset();
	},
	request_ranking: function () {
		this.can_request_ranking = false;
		PCB.network.sendRequest({
			'ajax_command':'BJ_joinToLeadersBoard',
			'user_id': Register.user_id,
			'user_name': Register.user_name,
			'user_credits': Register.creditCount,
		}, '_top_ranking');
	},
	/**
	 * Updates the top ranking according to data sent from the server (BJ_joinToLeadersBoard).
	 * @uses      {Integer} PCB.leaders_board.request_frequency Server Request Trigger Frequency
	 */
	update_top_ranking: function ( response_data ) {
		var _leaders_board_tag_data_format = [];
		var _received_ranking_data = response_data.ranking;
		var _user_id = Register.user_id = response_data.user_id;
		Rom.nvram.updateUserID(response_data.user_id);
		this.request_frequency = response_data.request_frequency;
		var _target_slot = 0;

		/** tranlsate data format */
		for ( var _key_index in _received_ranking_data ) {
			var _rank = _received_ranking_data[_key_index].rank;
			var _top_player = '';
			/* top player display */
			if( _received_ranking_data[_key_index].user_id == _user_id) {
				_top_player = 'YOU';
			} else if ( _rank < 7 ) {
				_top_player = 'TOP';
			} else {
				_top_player = '';
			}

			_leaders_board_tag_data_format.push({
				'id': Number(_received_ranking_data[_key_index].user_id),
				'credits': Number(_received_ranking_data[_key_index].user_credits),
				'ranking': Number(_rank),
				'tag_name': _received_ranking_data[_key_index].user_name,
				'top_player': _top_player,
				'target_slot': _target_slot,
				});
			_target_slot ++;
		}

		/** update the current data chache */
		this.update_tags(_leaders_board_tag_data_format);
	},
	/**
	 * update data structure :
	 *  [{
	 *		credits: <number>
	 *		id: <string>
	 *		previous_ranking: <number>
	 *		ranking: <number>
	 *		tag_name: <string>
	 *		target_slot: <number>
	 *		top_player: <string>
	 *  }, .... ]
	 */
	update_tags: function( data ) {
		if( Array.isArray( data ) ) {
			// first find if there are any survivors
			var _tags_buffer = [];
			var _tags_used = [];
			var _i = 0;
			while( _i < data.length ) {
				var _current_data = data[_i];
				var _id = _current_data.id;
				var _tag_id = this._doesIDexists(_id);

				// populate data on exisiting
				if(_tag_id !== false) {
					var _current_tag = this.priv_tags[_tag_id];
					var _previous_ranking = _current_tag.ranking;
					// record
					_tags_used.push(_tag_id);

					// reset processed
					_current_tag.processed = {};
					// credits
					if( _current_tag.credits != _current_data.credits ) {
						_current_tag.credits = _current_data.credits;
						_current_tag.processed.credits = true;
					}
					// ranking and ranking_change
					if( _current_data.ranking != _previous_ranking ) {
						if( _current_data.ranking > _previous_ranking ) {
							// up
							_current_tag.ranking_change = 2;
						} else if ( _current_data.ranking < _previous_ranking ) {
							// down
							_current_tag.ranking_change = 0;
						}
						_current_tag.ranking = _current_data.ranking;
						_current_tag.processed.ranking_change = true;
						_current_tag.processed.ranking = true;
					} else {
						// no change
						_current_tag.ranking_change = 1;
						_current_tag.processed.ranking_change = true;
					}

					/* top player display */
					if( _id == Register.user_id) {
						_current_tag.top_player = 'YOU';
					} else if ( _current_data.ranking < 7 ) {
						_current_tag.top_player = 'TOP';
					} else {
						_current_tag.top_player = '';
					}
					_current_tag.processed.top_player = true;
					_current_tag.target_slot = _current_data.target_slot;
					_current_tag.is_new = false;
				} else {
					// non existing data
					var _ranking_change = 1;
					// if( _current_data.ranking > _previous_ranking ) {
					// 	// up
					// 	_ranking_change = 0;
					// } else if ( _current_data.ranking < _previous_ranking ) {
					// 	// down
					// 	_ranking_change = 2;
					// }
					_tags_buffer.push( { 'tag_name': _current_data.tag_name, 'top_player': _current_data.top_player, 'ranking' : _current_data.ranking, 'ranking_change': _ranking_change, 'id': _current_data.id, 'credits': _current_data.credits , 'target_slot': _i, is_new: true, 'processed': {'tag_name':true,'top_player':true,'ranking':true,'ranking_change':true,'credits':true}});
				}
				// increment
				_i = (_i+1)|0;
			}

			// if new players to rewrite existing tags. process each
			var _buffer_counter = 0;
			var _y_position = 0;
			for( var _key in this.priv_tags ) {
				if(_tags_used.indexOf(_key) < 0) {
					// new player
					 this.priv_tags[_key] = _tags_buffer[_buffer_counter];
					_buffer_counter ++;
				}
				// handling in case the server response data has less than 6
				if(!this.priv_tags[_key]) {
					this.priv_tags[_key] = { 'is_new' : null , 'processed': {'is_new':true}};
					this._sendToLeadersBoard( _key , this.priv_tags[_key].target_slot );
				}
				this._sendToLeadersBoard(_key , this.priv_tags[_key].target_slot );
				_y_position ++;
			}
		} else {
			// invalid
			return false;
		};
	},
	/**
	 * Update the status board related data
	 *
	 * @see        'priv_status': {'mode': 0, 'hours': 0, 'jackpot': 0, 'duration': 3600, 'title': 'Tournament Cup','campaign_id': ''},
	 *
	 * @param      object|boolean|null data The data
	 */
	update_status: function( data ) {
		// writable
		var _priv_status = this.priv_status;
		if( typeof data === 'object' ) {
			// campaign_id
			if(data.hasOwnProperty('campaign_id') && _priv_status.campaign_id !== data.campaign_id) {
				_priv_status.campaign_id = data.campaign_id;
			}
			if(data.hasOwnProperty('title') && _priv_status.title !== data.title) {
				_priv_status.title = data.title;
			}
			// mode
			if(data.hasOwnProperty('mode') && _priv_status.mode != data.mode) {
				switch(Number(data.mode)) {
					case 4:
						_priv_status.status = 'See the Results';
						_priv_status.mode = 4;
						break;
					case 3:
						_priv_status.status = 'Calculating Results';
						_priv_status.mode = 3;
						break;
					case 2:
						_priv_status.status = _priv_status.title;
						_priv_status.mode = 2;
						break;
					case 1:
						_priv_status.status = 'Opening Soon';
						_priv_status.mode = 1;
						break;
					default:
						_priv_status.status = 'No Campaign';
						_priv_status.mode = 0;
						_priv_status.campaign_id = '';
						break;
				}
			}
			// the context changes depending on the mode.
			if(data.hasOwnProperty('hours') && _priv_status.hours !== data.hours) {
				_priv_status.hours = data.hours;
			}
			// dependency: mode = 2,4
			if(data.hasOwnProperty('jackpot') && _priv_status.jackpot !== data.jackpot) {
				_priv_status.jackpot = data.jackpot;
			}
			// duration
			// dependency: mode = 2
			if(data.hasOwnProperty('duration') && _priv_status.duration !== data.duration) {
				_priv_status.duration = data.duration;
			}
		} else if (data === false) {
			_priv_status.mode = -1;
			_priv_status.status = 'Offline (Network Error)';
			_priv_status.hours = '--:--:--';
			_priv_status.jackpot = 'Please check connection';
		} else {
			_priv_status.mode = -1;
			_priv_status.status = 'Offline';
			_priv_status.hours = '--:--:--';
			_priv_status.jackpot = 'Awaiting for signal input';
		}
	},
	controlStatusBoard: function () {
		// init
		var _arg_to_send = {};
		// Real life variable
		var _current_unixTime = PCB.clock.unixTime();
		// Use as "read-only"
		var _priv_status = this.priv_status;
		// Use Read / Write
		var _status_network_trigger = this.status_network_trigger;

		/**
		* Tournament Cup related network trigger
		*
		* Triggers every 60 seconds when idle. 5 Seconds before any event cue.
		* Retries every 5 seconds for 10 times in case of network errors.
		*/
		if(_status_network_trigger > -1) {
			// do network call
			console.log(_status_network_trigger);
			_status_network_trigger --;
		}

		/**
		* Handles Display Control according to the current mode
		*/
		switch(Number(_priv_status.mode)) {
			case 4:
				_arg_to_send.status = _priv_status.status;
				_arg_to_send.hours = '';
				_arg_to_send.jackpot = _priv_status.jackpot;
				break;
			case 3:
				_arg_to_send.status = _priv_status.status;
				_arg_to_send.hours = 'Please Wait';
				_arg_to_send.jackpot = _priv_status.jackpot;
				break;
			case 2:
				// time calc / check up
				var _currentTargetTime = _priv_status.hours;
				var _currentCountDownTime = _currentTargetTime - _current_unixTime;
				// set
				if(_currentCountDownTime > 0) {
					_arg_to_send.status = _priv_status.status;
					_arg_to_send.hours = PCB.clock.convertUnixTimeToHMS(_currentCountDownTime);
					_arg_to_send.jackpot = _priv_status.jackpot;
				} else {
					// if the _currentCountDownTime is 0 or less, increment the mode to 3 'Calculating Results'
					this.update_status({mode:3});
					_arg_to_send.hours = 'Session Closed';
				}
				break;
			case 1:
				// time calc / check up
				var _currentTargetTime = _priv_status.hours;
				var _currentCountDownTime = _currentTargetTime - _current_unixTime;
				// set
				if(_currentCountDownTime > 0) {
					_arg_to_send.status = _priv_status.status;
					_arg_to_send.hours = PCB.clock.convertUnixTimeToHMS(_currentCountDownTime);
					_arg_to_send.jackpot = _priv_status.jackpot;
				} else {
					// if the _currentCountDownTime is 0 or less, increment the mode to 2 (opened)
					this.update_status({mode:2, hours: _current_unixTime + _priv_status.duration });
					_arg_to_send.hours = 'Session Started';
				}
				break;
			case 0:
				_arg_to_send.status = _priv_status.status;
				_arg_to_send.hours = '';
				_arg_to_send.jackpot = 'Check out our website.';
				break;
			default:
				_arg_to_send.status = _priv_status.status;
				_arg_to_send.hours = _priv_status.hours;
				_arg_to_send.jackpot = _priv_status.jackpot;
				break;
		}

		/**
		 * Send out control argument to the sprite
		 */
		PCB.sprite({ 'id':'leaders_board_status', 'arguments': _arg_to_send });
	},
	reset: function() {
		// reset tags prop.
		this.priv_tags = {};
		this.priv_tags['tag_1'] = {
			'tag_name': '', 'top_player': '', 'ranking' : '', 'ranking_change': 0, 'id': {}, 'credits': '' , is_new: true,
			'processed': {'tag_name':true,'top_player':true,'ranking':true,'ranking_change':true,'credits':true}
		};
		this.priv_tags['tag_2'] = {'tag_name': '', 'top_player': '', 'ranking' : '', 'ranking_change': 1, 'id': '', is_new: true, 'processed': {'tag_name':true,'top_player':true,'ranking':true,'ranking_change':true,'credits':true}, 'credits': '' };
		this.priv_tags['tag_3'] = {'tag_name': '', 'top_player': '', 'ranking' : '', 'ranking_change': 2, 'id': '', is_new: true, 'processed': {'tag_name':true,'top_player':true,'ranking':true,'ranking_change':true,'credits':true}, 'credits': '' };
		this.priv_tags['tag_4'] = {'tag_name': '', 'top_player': '', 'ranking' : '', 'ranking_change': 0, 'id': '', is_new: true, 'processed': {'tag_name':true,'top_player':true,'ranking':true,'ranking_change':true,'credits':true}, 'credits': '' };
		this.priv_tags['tag_5'] = {'tag_name': '', 'top_player': '', 'ranking' : '', 'ranking_change': 1, 'id': '', is_new: true, 'processed': {'tag_name':true,'top_player':true,'ranking':true,'ranking_change':true,'credits':true}, 'credits': '' };
		this.priv_tags['tag_6'] = {'tag_name': '', 'top_player': '', 'ranking' : '', 'ranking_change': 2, 'id': '', is_new: true, 'processed': {'tag_name':true,'top_player':true,'ranking':true,'ranking_change':true,'credits':true}, 'credits': '' };
		// init sprites. display them all.
		var _y_position = 0;
		for( var _key in this.priv_tags ) {
			this._sendToLeadersBoard(_key , _y_position);
			_y_position ++;
		}
		// status board
		this._sendToLeadersStatusBoard();
		this.update_status();
	},
	update_user_name: function ( new_user_name ) {
		var _tag_id = this._doesIDexists(Register.user_id);
		var _tag = this.priv_tags[_tag_id];
		var _tag_to_send = {};
		_tag_to_send.id = _tag_id;
		_tag_to_send.is_new = false;
		_tag_to_send.tag_name = new_user_name;
		PCB.sprite({ 'id':'leaders_board', 'arguments': _tag_to_send });
	},
	/**
	 * Private Methods
	 */
	_sendToLeadersBoard: function ( _tag_id , _y_position ) {
		var _tag = this.priv_tags[_tag_id];
		// nothing to process
		if(Object.getOwnPropertyNames(_tag.processed).length < 0) return false;
		// init once
		var _tag_to_send = {};
		// start populating
		_tag_to_send.id = _tag_id;
		_tag_to_send.is_new = _tag.is_new;

		// check processed
		if(_tag.processed.tag_name === true) _tag_to_send.tag_name = _tag.tag_name;
		if(_tag.processed.top_player === true) _tag_to_send.top_player = _tag.top_player;
		if(_tag.processed.ranking === true) {
			if (_tag.ranking ==='') {
				_tag_to_send.ranking = '';
			} else {
				_tag_to_send.ranking = 'No. '+  _tag.ranking;
			}
		}
		if(_tag.processed.ranking_change === true) {
			_tag_to_send.ranking_change = _tag.ranking_change;
		}
		_tag_to_send.y = this.priv_tag_coords[_y_position];
		if(_tag.processed.credits === true) {
			if (_tag.credits ==='') {
				_tag_to_send.credits = '';
			} else {
				_tag_to_send.credits = _tag.credits + ' Credits';
			}
		}

		// send
		// console.log(_tag_to_send);
		PCB.sprite({ 'id':'leaders_board', 'arguments': _tag_to_send });
	},
	_doesIDexists: function(needle_id) {
		for(var _key in this.priv_tags ) {
			if(this.priv_tags[_key].id == needle_id ){
				return _key;
			}
		}
		// not found. new user
		return false;
	},
	/**
	 * Status board
	 *
	 * @param      string  _tag_id      The tag identifier
	 * @param      object  _y_position  The y position
	 */
	_sendToLeadersStatusBoard: function ( _tag_id , _y_position ) {
		var _status_to_send = {};
		PCB.sprite({ 'id':'leaders_board_status', 'arguments': _status_to_send });
	},
};