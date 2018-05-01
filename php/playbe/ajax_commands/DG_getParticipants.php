<?php
namespace DG;
/**
 * joinToLeadersBoard : Join to leaders board
 *
 * All the returning values are in string but they are implied here to indicate how they are expected to be treated on the client side.
 *
 * @return     array ranking				Ranking array containing user data. index is zero based ranking number with user_name and user_credits as values.
 * @return     integer current_user_ranking	user_id returned if the user is new or non existent. Blank if the user id exists.
 * @return     integer eligible_user_num	user_id returned if the user is new or non existent. Blank if the user id exists.
 * @return     integer user_id				user_id of the requestee
 */

/**
 * MySQL Create Syntax
 *
CREATE TABLE `players` (
  `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_avatar_id` tinytext NOT NULL,
  `bet_parity` tinytext NOT NULL,
  `bet_amount` int(11) NOT NULL,
  `time_joined` datetime DEFAULT NULL,
  `time_previous_update` datetime DEFAULT NULL,
  `time_updated` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8;
 */

/**
 * Init mySQL connection
 */
new \BeFive\MySQLi('127.0.0.1','playbe','playbe','ginjirou');
\BeFive\MySQLi::open_mysql_connection();

/**
 * Variables
 */
	$user_data = array(
		/**
		 * User id of requestee. 0 if new user. A unique id will be issued and returned,
		 * which the user will continue to use after the next request.
		 * @var        integer
		 */
		'user_id' => 0,
		/**
		 * User name as set by the user.
		 * @var        string
		 */
		'user_avatar_id' => '',
		/**
		 * User name as set by the user.
		 * @var        string
		 */
		'bet_parity' => '',
		/**
		 * Credits
		 * @var        Integer
		 */
		'bet_amount' => 0,
	);

/**
 * set_received_data_to_variable
 */
	if ( is_null($user_data = \BeFive\Ajax::set_received_data_to_variable( $user_data )) ) {
		/** Return if invalid */
		$ajaxResponseArray = \BeFive\Ajax::construct_ajax_response_array(FALSE,'INVALID_DATA_RECEIVED');
		return;
	}

/**
 * Join to the leaders board
 */
	$user_id = \DG\UserHandler::join_to_the_game( $user_data );
	/** just in case of system error */
	if( is_null( $user_id ) ) {
		/** Return if invalid */
		$ajaxResponseArray = \BeFive\Ajax::construct_ajax_response_array(FALSE,'SYSTEM_ERROR_AT_JOIN_BOARD');
	}

/**
 * Get the rival data
 */
	$rival_data_array = \DG\UserHandler::get_participants( $user_id , $user_data['bet_parity'] );

	/** just in case of system error */
	if( is_null( $rival_data_array ) ) {
		/** Return if invalid */
		$ajaxResponseArray = \BeFive\Ajax::construct_ajax_response_array(FALSE,'SYSTEM_ERROR_AT_GET_RANKING');
	}

/**
 * Find server load
 */
	// $server_load = sys_getloadavg();

	// /* Calculate Request Frequency. base_time +- 20 ~ 150 seconds */
	// $_server_load_five_min = $server_load[1];
	// $_base_wait_time  = $_server_load_five_min * 10;
	// $_base_wait_time += rand(0,$_server_load_five_min * 5);
	// $rival_data_array['request_frequency'] = round($_base_wait_time);

/**
 * Construct ajax response in array
 */
	$ajaxResponseArray = \BeFive\Ajax::construct_ajax_response_array(TRUE,'OK',$rival_data_array);

/**
 * END
 */
