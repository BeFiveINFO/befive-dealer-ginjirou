/*
	logic: audio
	routines used for audio
*/
// Make Printed circuit board if it does not exist yet (to deal with load order issue here).
if(!PCB) var PCB = {};

// print PCB
PCB.clock = {
	/**
	 * clock management
	 */
	/* interval clock
	 * interval: interval time
	 * iteration: the number of times you want to repeat. inifinite loop by default set to -1 for keeping on looping
	 * action: send function
	 * callback: call back. iteration needs to be set to use this
	 */
	setIntervalClock: function ( _settings ) {
		var _clock_id;
		if(_settings.hasOwnProperty('id')){
			_clock_id = _settings.id;
		} else {
			return false;
		}
		var _action = (!_settings.hasOwnProperty('action')) ? function () {} : _settings.action;
		var _callback = (!_settings.hasOwnProperty('callback')) ? function () {} : _settings.callback;
		var _init = (!_settings.hasOwnProperty('init')) ? null : _settings.init;
		var _interval = (!_settings.hasOwnProperty('interval')) ? 1000 : _settings.interval; // 1 sec by default
		var _iteration = (!_settings.hasOwnProperty('iteration')) ? -1 : _settings.iteration;

		Register.clocks[_clock_id] = {}; // clear first
		Register.clocks[_clock_id].frequency = _interval;
		Register.clocks[_clock_id].iteration = _iteration;
		Register.clocks[_clock_id].init = _init;
		Register.clocks[_clock_id].action = _action;
		Register.clocks[_clock_id].callback = _callback;
		Register.clocks[_clock_id].timerType = 'setInterval';
		Register.clocks[_clock_id].loopCounter = 0; // internal property
		Register.clocks[_clock_id].isActive = false; // internal property
	},
	/* timeout clock
	 * timeout: how long the timer lasts
	 * callback: send function to execute
	 */
	setTimeoutClock: function ( _settings  ) {
		var _clock_id;
		if(_settings.hasOwnProperty('id')){
			_clock_id = _settings.id;
		} else {
			return false;
		}
		var _callback = (!_settings.hasOwnProperty('callback')) ? function () {} : _settings.callback;
		var _init = (!_settings.hasOwnProperty('init')) ? null : _settings.init;
		var _timeout = (!_settings.hasOwnProperty('timeout')) ? 1000 : _settings.timeout; // 1 sec by default

		Register.clocks[_clock_id] = {}; // clear first
		Register.clocks[_clock_id].frequency = _timeout;
		Register.clocks[_clock_id].init = _init;
		Register.clocks[_clock_id].action = _callback;
		Register.clocks[_clock_id].timerType = 'setTimeout';
		Register.clocks[_clock_id].loopCounter = 0; // internal property
		Register.clocks[_clock_id].isActive = false; // internal property
	},
	/**
	 * Make sure Register.clocks[_clock_id] is not empty. No check ups are done
	 */
	start: function (_clock_id, _arguments) {
		var _clock = Register.clocks[_clock_id];
		if(typeof _clock == 'undefined') {
			console.log('Clock ' + _clock_id + 'not found');
			return false;
		}
		var _timerType = Register.clocks[_clock_id].timerType;
		var _arguments = _arguments | false;
		var _frequency = (typeof _clock.frequency === 'function' ) ? _clock.frequency() : _clock.frequency;
		var _iteration = (typeof _clock.iteration === 'function' ) ? _clock.iteration() : _clock.iteration;
		// remove clock instance
		this.remove(_clock_id);
		// reset the loop counter
		_clock.loopCounter = 0;
		// init
		if(typeof _clock.init === 'function') {
			_clock.init(this,_clock_id);
		}

		// Set isActive flag true
		Register.clocks[_clock_id].isActive = true; // internal property
		// action
		_clock.instance = window[_timerType](
			function () {
				if( _timerType == 'setInterval' && _iteration >= 0 ) {
					if(_clock.loopCounter >= _iteration) {
						if(_clock.callback) _clock.callback();
						PCB.clock.stop(_clock_id);
						return false;
					}
					_clock.loopCounter++;
					_clock.action(_clock.loopCounter,_arguments);
				} else {
					_clock.action(_arguments);
				}
			},
			_frequency
		);
	},
	/**
	 * stop() only clears timer while remove() clears timer and removes the timer instance.
	 */
	stop: function (_clock_id) {
		var _clock = Register.clocks[_clock_id];
		if(typeof _clock == 'undefined') return false;
		var _clockInstance = _clock.instance;
		var _timerType = Register.clocks[_clock_id].timerType;
		if(_timerType === 'setInterval' ) {
			clearInterval(_clockInstance);
		} else {
			clearTimeout(_clockInstance);
		}
		Register.clocks[_clock_id].isActive = false;
	},
	remove: function (_clock_id) {
		var _clock = Register.clocks[_clock_id];
		var _clockInstance = (_clock.hasOwnProperty('instance')) ? _clock.instance : null;
		if(!_clockInstance) return false;
		var _timerType = Register.clocks[_clock_id].timerType;
		this.stop(_clock_id);
		_clockInstance = null;
		/* do not get confused - _clock has all the information about timer while the instance holds instance of the moment. when it is not needed, instance can be cleaned while maintaining the clock timer information for later use. */
		_clock.loopCounter = 0;
	},
	// removeAll explicitly to prevent accidents
	removeAll: function () {
		var _timerType;
		for (var _clock_id in Register.clocks) {
			this.remove(_clock_id);
		}
	},
	/**
	 * helper method for timer management
	 */
	/**
	* Public Utilities
	*/
	/**
	 * Returns unixtime
	 *
	 * @return     number  the current unixtime
	 */
	unixTime: function () {
		return Math.round(+new Date()/1000);
	},
	/**
	 * Converts unix time into 0:00:00 format
	 *
	 * @param      number|string seconds The seconds
	 * @return     string Formatted time in string
	 */
	convertUnixTimeToHMS: function (seconds) {
		var sec_num = parseInt(seconds, 10);
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours   < 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		return minutes+':'+seconds;
	},
	/**
	 * Convert time and date into a human readable format from unix time
	 *
	 * @param      number UNIX_timestamp The unix timestamp
	 * @return     string Formatted time in string
	 */
	timeConverter: function (UNIX_timestamp){
		var a = new Date(UNIX_timestamp * 1000);
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var year = a.getFullYear();
		var month = months[a.getMonth()];
		var date = a.getDate();
		var hour = a.getHours();
		var min = a.getMinutes();
		var sec = a.getSeconds();
		var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
		return time;
	},
};