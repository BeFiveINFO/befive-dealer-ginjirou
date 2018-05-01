<?php
namespace BeFive;

ini_set('html_errors', 0);

date_default_timezone_set("UTC");

/**
 * Auto Classloader is required.
 */
if (!file_exists('class/lib/BeFive-Be_ClassLoader.php')) {
	trigger_error(__('Be_ClassLoader is required.', 'befive'), E_USER_ERROR);
} else {
	require('class/lib/BeFive-Be_ClassLoader.php');
	new Be_ClassLoader(array('class/DG','class/BJ','class/lib'));
}

/**
 * Execute ajax request
 */
new Ajax();

/**
 * Command List:
 *
 * Bonus Jackpot
 *   - BJ_joinToLeadersBoard
 */
