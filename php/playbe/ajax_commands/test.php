<?php
namespace BeFive;
/**
 * Test Command
 */
	$test_data = array(
		/**
		 * Serial number of game rom
		 * @var        integer
		 */
		'serial_number' => '',
	);

/**
 * set_received_data_to_variable
 */
	if ( is_null($test_data = Ajax::set_received_data_to_variable( $test_data )) ) {
		/** Return if invalid */
		$ajaxResponseArray = Ajax::construct_ajax_response_array(FALSE,'INVALID_DATA_RECEIVED');
		return;
	}

/**
 * Prepare data to be returned
 */
	$server_load = sys_getloadavg();
/* Calculate Request Frequency. base_time +- 20 ~ 150 seconds */
	$_server_load_five_min = $server_load[1];
	$_base_wait_time  = $_server_load_five_min * 70;
	$_base_wait_time += rand(0,$_server_load_five_min * 60);
	$data_to_return = array(
		'serial_number' => $test_data['serial_number'],
		'server_load' => $server_load,
		'request_frequency' => round($_base_wait_time)
		);



/**
 * Construct ajax response in array
 */
	$ajaxResponseArray = Ajax::construct_ajax_response_array(TRUE,'OK',$data_to_return);

/**
 * END
 */