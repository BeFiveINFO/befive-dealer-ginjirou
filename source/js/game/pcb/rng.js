/*
	logic: rng, random number generator
	routines used for generating random numbers, and other helper tools for stats
*/
// Make Printed circuit board if it does not exist yet (to deal with load order issue here).
if(!PCB) var PCB = {};

// print PCB
PCB.rng = {
	/**
	 * Methods
	 */
	/**
	 * Generate pure random number ranging from 0 to the number specified with _max minus one.
	 *
	 * @param      {number}  _max  The range, max number
	 * @return     {number}  any number ranging from 0 to the _max value
	 */
	generate: function ( _max ) {
		return ~~(Math.random()*(_max + 1));
	},
	/**
	 * { function_description }
	 *
	 * @param      {<type>}  _min    The minimum
	 * @param      {number}  _max    The maximum
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	generate_range: function ( _min, _max ) {
		return Math.round(Math.random() * (_max - _min) + _min);
	},
	/**
	 * Generate random percentage according to 1/f fluctuation.
	 *
	 * @return     {number}  random percentage integer from 0 to 100
	 */
	generate_one_f_fluctuation: function () {
		/**
		 * 1/f yuragi
		 */
		var _rand = Math.random();
		var _percent;
		if(_rand < 0.5) {
			_percent =  _rand + 2*_rand*_rand;
		} else {
			_percent = _rand - 2*(1 - _rand)*(1 - _rand);
		}
		return _percent;
	},
	/*
		other stat tools for debugging
	*/
	findAverage: function (_data) {
		var sum = 0;
		for (var i=0; i<_data.length; i++) {
			sum = sum + _data[i];
		}
		return (sum / _data.length);
	},
	/*
		Find variance = sum of data - average ^ 2  / # of samples
	*/
	findVariance: function (_data) {
		// find average
		var ave = this.findAverage(_data);

		var varia = 0;
		for (var i=0; i<_data.length; i++) {
			varia = varia + Math.pow(_data[i] - ave, 2);
		}
		return (varia / _data.length);
	},
	/*
		find standard diviasion
	*/
	findStandardDeviation: function  (_data) {
		var varia = this.findVariance(_data);
	    return Math.sqrt(varia);
	},
	floatRound: function ( _number ) {
		return Math.ceil( _number * 10000 ) / 10000 ;
	},
	/**
	 * Test RNG
	 *
	 * @param      {(number)}  _range      The range
	 * @param      {(number)}  _iteration  The iteration
	 */
	testGenerate: function (_range,_iteration) {
		var _maxValueCount = 0;
		console.log('Testing RNG Generation. Range: '+ _range + ' Iteration: '+ _iteration);
		for(var _i = 0; _i <= _iteration; _i ++ ) {
			var _result = this.generate(_range);
			console.log('#'+_i,_result);
			if(_result == _range) {
				console.log('Max value '+_range);
				_maxValueCount ++;
			}
		}
		console.log('Max Value Count : ' + _maxValueCount);
	}
};