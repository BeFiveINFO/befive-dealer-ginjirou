<?php
namespace BeFive {
	/**
	 * Handles ajax request communication from game clients for Bonus Jackpot Competition Cup.
	 *
	 * @package    BeFive\PlayBe
	 * @subpackage lib\MySQLi
	 * @since      1.0
	 */
	class MySQLi {
		/* Properties */

		/**
		 * Database instance
		 */
		private static $mysqli;

		private static $result_counter = 0;

		/**
		 * Database Config
		 *
		 * @var        array
		 */
		private static $database_config = array(
			'host' => '',
			'username' => '',
			'password' => '',
			'dbname' => '',
			);

		/**
		 * Constructor
		 */
		public function __construct($host, $username, $password, $dbname ) {
			self::$database_config['host'] = $host;
			self::$database_config['username'] = $username;
			self::$database_config['password'] = $password;
			self::$database_config['dbname'] = $dbname;
		}

		/**
		 * Destructor
		 */
		function __destruct() {
		    self::close_mysql_connection();
		}

		/**
		 * Public methods
		 */

		/**
		 * Open database connection
		 *
		 * @access     public
		 * @since      1.0
		 *
		 * @uses       self::$database_config
		 *
		 * @return     Boolean|string True is success. Returns error message if error.
		 */
		public static function open_mysql_connection () {
			/** check up if there is already a connection. return true if it does */
			if(!is_null(self::$mysqli)) return TRUE;

			/** open the mysql connection */
			self::$mysqli = new \mysqli(self::$database_config['host'], self::$database_config['username'], self::$database_config['password'], self::$database_config['dbname']);

			/* error */
			if (self::$mysqli->connect_error) {
				return self::$mysqli->connect_error;
			/* return result */
			} else {
				self::$mysqli->set_charset("utf8");
				return TRUE;
			}
		}

		/**
		 * Execute SELECT/INSERT/UPDATE/DELETE queries
		 *
		 * @param      string  $sql    The sql query
		 * @param      boolean	$returnJson  Set FALSE to return by json
		 *
		 * @return     array   ( description_of_the_return_value )
		 */
		public static function mysql_query($sql, $returnJson = FALSE) {
			$result = self::$mysqli->query($sql);
			if ($result === FALSE) {
				$error = self::$mysqli->errno.": ".self::$mysqli->error;
				$rtn = array(
					'status' => FALSE,
					'count'  => 0,
					'result' => "",
					'error'  => $error
					);
				if( $returnJson === FALSE )
					return $rtn;
				else
					return json_encode($rtn);
			}

			if($result === TRUE) {
				self::$result_counter = self::$mysqli->affected_rows;
				$rtn = array(
					'status' => TRUE,
					'count'  => self::$result_counter,
					'result' => "",
					'error'  => ""
					);
				if(isset(self::$mysqli->insert_id)) {
					$rtn['insert_id'] = self::$mysqli->insert_id;
				}
				if( $returnJson === FALSE )
					return $rtn;
				else
					return json_encode($rtn);
			} else {
				self::$result_counter = $result->num_rows;
				$data = array();
				while ($row = $result->fetch_assoc()) {
					$data[] = $row;
				}
				// close result
				$result->close();
				$rtn = array(
					'status' => TRUE,
					'count'  => self::$result_counter,
					'result' => $data,
					'error'  => ""
					);
				if( $returnJson === FALSE )
					return $rtn;
				else
					return json_encode($rtn);
			}
		}

		/**
		 * Close database connection only if mysql is left open.
		 *
		 * @access     public
		 * @since      1.0
		 *
		 * @uses       self::$mysqli
		 */
		public static function close_mysql_connection () {
			if(!is_null(self::$mysqli)) self::$mysqli->close();
		}

		/**
		 * Public tools
		 */

		/**
		 * Sanitize and cast type data.
		 *
		 * @access     public
		 * @since      1.0
		 *
		 * @param      string|integer  $original_data  The original data
		 * @param      string  $type           The type
		 * @param      boolean $sql_escape     The sql escape
		 *
		 * @return     mixed Sanitized data
		 */
		public static function sanitize_data ($original_data, $type = 'string', $sql_escape = TRUE) {
			if($sql_escape === TRUE) {
				$original_data = mysqli_real_escape_string(self::$mysqli,$original_data);
			}
			switch($type) {
				case 'int':
					$original_data = (int) $original_data;
					break;
				case 'boolean':
					$original_data = (boolean) $original_data;
					break;
				default: // string
					$original_data = stripslashes($original_data);
					$original_data = (filter_var($original_data, FILTER_SANITIZE_STRING));
					break;
			}
			return $original_data;
		}

		/**
		 * Converts mysql to unixtimestamp
		 *
		 * @param      string  $mySQLDateTime  My sql date time
		 *
		 * @return     string  UNIX timestamp
		 */
		public static function convert_mysql_to_unixtimestamp ( $mySQLDateTime ) {
			if(!is_string($mySQLDateTime)) {
				return NULL;
			}
			list($date, $time) = explode(' ', $mySQLDateTime);
			list($year, $month, $day) = explode('-', $date);
			list($hour, $minute, $second) = explode(':', $time);
			return mktime($hour, $minute, $second, $month, $day, $year);
		}

		/**
		 * Converts unixtimestamp to mysql datetime
		 *
		 * @param      string  $unixTime  UNIX timestamp
		 *
		 * @return     string  My sql date time
		 */
		public static function convert_unixtimestamp_to_mysql ( $unixTime ) {
			if(is_null($unixTime)) {
				return '';
			}
			return date ('D, d M Y H:i:s T',$unixTime);
		}


	}
}