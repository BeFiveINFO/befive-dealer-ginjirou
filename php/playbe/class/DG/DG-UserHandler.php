<?php
namespace DG {
	/**
	 * Handles ajax request communication from game clients for Bonus Jackpot Competition Cup.
	 *
	 * @package    BeFive\PlayBe
	 * @subpackage Competition Cup
	 * @since      1.0
	 */
	class UserHandler {
		/**
		 * Properties
		 */
		private static $time_updated;

		/**
		 * Constructor
		 *
		 * Opens mySQL connection automatically if it is not yet initiated.
		 */
		public function __construct() {
		}

		/**
		 * Public Methods
		 */

		/**
		 * Let a user join to the leaders board
		 *
		 * @param      array  $user_data      The user data
		 *
		 * @return     array   ID of affected row.
		 */
		public static function join_to_the_game ($user_data) {
			/* init a variable */
			$_enrolment_data = array();

			/* mySQL query to register the user (UPDATE) */
			$_result = \BeFive\MySQLi::mysql_query("INSERT INTO `players` (user_id, user_avatar_id, bet_parity, bet_amount, time_joined) VALUES ({$user_data['user_id']}, \"{$user_data['user_avatar_id']}\", \"{$user_data['bet_parity']}\", {$user_data['bet_amount']}, UTC_TIMESTAMP()) ON DUPLICATE KEY UPDATE user_avatar_id = \"{$user_data['user_avatar_id']}\", bet_parity = \"{$user_data['bet_parity']}\", bet_amount = {$user_data['bet_amount']};");

			/* if the user is not existent, generate a user id and add a new user record */
			if (!isset($_result['insert_id'])) {
				return NULL;
			}

			/* returning an affected row ID */
			return $_result['insert_id'];
		}

		/**
		 * Find player's current ranking
		 *
		 * @access     public
		 * @since      1.0
		 *
		 * @param      integer $user_id The user id of requestee
		 *
		 * @return     array|NULL 	Ranking data or NULL in case of system error.
		 */
		public static function get_participants ( $user_id , $bet_parity ){
			/** Gets the number of eligible participating users. */
			if(!empty($bet_parity)) {
				$_rivals = self::get_recent_rivals($user_id);
			} else {
				$_rivals = self::get_last_ten_rivals($user_id);
			}
			return array('rivals' => $_rivals, 'user_id' => $user_id);
		}

		/**
		 * Private method
		 */

		/**
		 * Gets the number of recent rivals.
		 *
		 * @return     <type> ( description_of_the_return_value )
		 */
		private static function get_recent_rivals ( $user_id ) {
			$_result = \BeFive\MySQLi::mysql_query("SELECT * FROM `players` WHERE `user_id` != $user_id AND `bet_parity` != '' AND `time_updated` >= DATE_SUB(NOW(),INTERVAL 2 MINUTE) ORDER BY `time_updated` DESC LIMIT 100;");
			// $_result = \BeFive\MySQLi::mysql_query("SELECT * FROM `players` WHERE `user_id` != $user_id AND `bet_parity` != '' ORDER BY `time_updated` DESC LIMIT 100;");
			if(isset($_result)) {
				return $_result['result'];
			} else {
				return FALSE;
			}
		}

		/**
		 * Gets the number of last 10 rivals.
		 *
		 * @return     <type> ( description_of_the_return_value )
		 */
		private static function get_last_ten_rivals ( $user_id ) {
			$_result = \BeFive\MySQLi::mysql_query("SELECT * FROM `players` WHERE `user_id` != $user_id AND `bet_parity` != '' ORDER BY `time_updated` DESC LIMIT 10;");
			if(isset($_result)) {
				return $_result['result'];
			} else {
				return FALSE;
			}
		}
	}
}