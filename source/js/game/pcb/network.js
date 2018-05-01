/**
 * Logic: Network. Handles ajax requests.
 *
 * @see 	http://youmightnotneedjquery.com/
 */

// Make Printed circuit board if it does not exist yet (to deal with load order issue here).
if(!PCB) var PCB = {};

/**
 * Define network PCB part
 * @require string Register.play_be_net_url URL string where the network sever is.
 */
PCB.network = {
	/**
	 * Send POST requset for ajax
	 *
	 * @param      {Object} data {Data to be sent}
	 * @param      {String} postFix Postfix for the trigger name.
	 * @return     {N/A} Only events are triggerred upon exit.
	 *
	 * Events triggered:
	 *   - onNetworkSuccess (returns result in object decoded from original JSON response text)
	 *   - onNetworkError (such as lack of internet connection)
	 *   - onNetworkServerError (returns results in text)
	 */
	sendRequest: function ( data , postFix ) {
		/** params init */
		var _postFix = postFix || '';

		/** Return if play be net URL is not set in the config */
		var _play_be_net_url = Register.play_be_net_url;
		if(_play_be_net_url === '') return false;

		/** Instantiate XMLHttpRequest */
		var _request = new XMLHttpRequest();

		/** Open a request */
		_request.open('POST', _play_be_net_url, true);
		_request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

		/** onload event */
		_request.onload = function() {
			var _resp = _request.responseText;
			if (_request.status >= 200 && _request.status < 400) {
				/** success */
				PCB.event.trigger('onNetworkSuccess'+_postFix,JSON.parse(_resp));
			} else {
				// We reached our target server, but it returned an error
				PCB.event.trigger('onNetworkServerError'+_postFix,_resp);
			}
		};

		/** onerror event */
		_request.onerror = function() {
			// There was a connection error of some sort
			PCB.event.trigger('onNetworkError'+_postFix);
		};

		/** send request */
		_request.send(JSON.stringify(data));
	},
	parseResponse: function ( response_object ) {
		if(response_object.response && response_object.response == true) {
			return response_object.json;
		} else {
			return false;
		}
	},
};