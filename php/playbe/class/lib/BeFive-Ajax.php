<?php
namespace BeFive {
	/**
	 * Ajax request communications manager
	 *
	 * @package    BeFive\PlayBe
	 * @subpackage lib\Ajax
	 * @since      1.0
	 */
	class Ajax {
		/* Properties */

		/* runtime cache */
		public static $current_request;

		/**
		 * Constructor
		 */
		public function __construct( $received_request = array() ) {
			if(array_key_exists('CONTENT_TYPE',$_SERVER) && strpos($_SERVER["CONTENT_TYPE"],'application/json') === 0) {
				/** application/json */
				$_json = file_get_contents('php://input');
				self::$current_request = json_decode($_json, TRUE);
			} else {
				/** assume POST */
				self::$current_request = $_POST;
			}

			/** execute command */
			self::handle_ajax_command();
		}

		/**
		 * Public methods
		 */

		/**
		 * Handle ajax command. Requires 'ajax_command' set in the POST variable.
		 *
		 * @access     public
		 * @since      1.0
		 *
		 * @uses       self::$current_request
		 *
		 * @return     Boolean|string True is success. Returns error message if error.
		 */
		public static function handle_ajax_command () {
			/**
			 * Does he ajax_command key exist?
			 */
			if(!isset(self::$current_request['ajax_command'])){
				self::return_results_in_json_and_exit(
					self::construct_ajax_response_array(FALSE,'COMMAND_NOT_SET')
					);
			}

			/**
			 * Set ajax command.
			 * Command names are in alphabets only. command length limited to 63 chars. No special characters except for underscore. Camel Case preferred.
			 */
			$_ajax_command = preg_replace('/[^a-zA-Z_]/', '', mb_substr(self::$current_request['ajax_command'],0,63));

			// is the ajax command set?
			if($_ajax_command === '') {
				self::return_results_in_json_and_exit(
					self::construct_ajax_response_array(FALSE,'NO_COMMAND_SPECIFIED')
					);
			}

			/**
			 * Print ajax response
			 */
			$_target_command_path = dirname(dirname(dirname(__FILE__)))."/ajax_commands/{$_ajax_command}.php";

			/**
			 * Check up if the command exists
			 */
			if(!file_exists( $_target_command_path )) {
				/**
				 * Command not found error
				 */
				self::return_results_in_json_and_exit(
					self::construct_ajax_response_array(
						FALSE,
						'COMMAND_DOES_NOT_EXIST',
						array('command'=> $_ajax_command)
						)
					);
			} else {
				/**
				 * execute the command
				 */
				$ajaxResponseArray = array();
				include_once( $_target_command_path );
				self::return_results_in_json_and_exit($ajaxResponseArray);
			}
		}

		/**
		 * construct ajax response array
		 * Input: Result (bool), Message (optional), Data to be sent back in array
		 *
		 * @access     public
		 * @since      1.0
		 *
		 * @param      string  $response  The response
		 * @param      string  $message   The message
		 * @param      string  $json      The json
		 *
		 * @return     string   json array = ('response': boolean, 'message': string, 'json': misc data in json array)
		 */
		public static function construct_ajax_response_array ($response, $message = '', $json = null) {
			$_responseArray = array();
			$response = ( $response === TRUE ) ? TRUE : FALSE;
			$_responseArray['response'] = $response;
			if(isset($message)) $_responseArray['message'] = $message;
			if(isset($json)) $_responseArray['json'] = $json;

			return json_encode($_responseArray,JSON_FORCE_OBJECT);
		}

		/**
		 * Public utility tools methods
		 */

		/**
		 * Sets the received data to variable.
		 *
		 * @param      array  $data_array  The data array, a key array template with value wokring as a default as well as type indication.
		 *
		 * @return     array  boolean|array 	FALSE if error. Returns Array if there is not any problem.
		 */
		public static function set_received_data_to_variable ( $data_array = array() ) {
			foreach ($data_array as $_key => $_value) {
				$_validated_data = self::validate_and_sanitize_received_data($_key, gettype($_value));
				if(is_null($_validated_data)) {
					return NULL;
				}
				$data_array[$_key] = $_validated_data;
			}
			return $data_array;
		}

		/**
		 * Sanitization and check up tool
		 *
		 * @access     public
		 * @since      1.0
		 *
		 * @param      string  $data		The data
		 * @param      string  $type		The type to cast
		 * @param      int     $char_limit	The number of character to be limited. Anything more than the number will be invalidated
		 *
		 * @param      boolean|null|mixed Sanitized and validated data. Returns NULL if invalid.
		 */
		public static function validate_and_sanitize_received_data ($data_key, $type = 'string', $char_limit = 255 ) {
			/** data */
			if(!array_key_exists($data_key, self::$current_request)) {
				return NULL;
			} else {
				$_data = self::$current_request[$data_key];
			}

			/** check up the char number */
			if (strlen($_data) > $char_limit ){
				return NULL;
			}

			/* sanitize and cast according to type */
			switch($type){
				case 'integer':
					return (int) $_data;
					break;
				case 'boolean':
					if($_data === 'true' || $_data === 'TRUE' || $_data == 1 ) {
						return TRUE;
					} else {
						return FALSE;
					}
					break;
				case 'string':
					return htmlspecialchars($_data);
					break;
			}
		}


		/**
		 * Private method
		 */

		/**
		 * Returns a results in json and conclude the script.
		 *
		 * @access     private
		 * @since      1.0
		 *
		 * @see        Be_RequestHandler::construct_ajax_response_array() ajax response needs this method for data formatting.
		 *
		 * @param      string  $ajax_response  The ajax response in string.
		 */
		private static function return_results_in_json_and_exit ( $ajax_response ) {
			if(is_string($ajax_response) !== TRUE ) return FALSE;
			header('Content-Type: text/html; charset=utf-8');
			echo ($ajax_response);
			die;
		}

	}
}