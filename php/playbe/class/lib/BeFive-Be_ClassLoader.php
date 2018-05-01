<?php
namespace BeFive {
	/**
	 * Class Loader Modified by BeFive
	 *
	 * Notes: For classes in a namespace, names of php files need to use hyphen ( - ) where it uses back slash (\)
	 *
	 * @author BeFive
	 * @author noto
	 */
	class Be_ClassLoader {
		/**
		 * variable for storing directories in array
		 */

		/**
		 * Stores directory names to search.
		 *
		 * @var        array
		 */
		private static $dirs = array();

		/**
		 * Stores path to the parent (root) directory
		 *
		 * @var        string
		 */
		private static $parentDir = '';


		/**
		 * Constructor
		 */
		public function __construct($classDir) {
			if(!isset($classDir)) {
				trigger_error(__('Be_ClassLoader requires $classDir to be passed upon instantiation.', 'befive'), E_USER_ERROR);
			}
			self::$parentDir = dirname(dirname(dirname(__FILE__))).'/';
			spl_autoload_register('BeFive\Be_ClassLoader::loader');
			self::registerDir($classDir);
		}

		/**
		 * Register directories
		 * @param string $dir
		 */
		public function registerDir($dir){
			if( is_array($dir) ) {
				array_splice( self::$dirs, count(self::$dirs), 0, $dir );
			} else {
				self::$dirs[] = $dir;
			}
		}

		/**
		 * Callback
		 * @param string $classname
		 */
		public function loader($classname){
			if(strpos($classname , "\\") !== FALSE  ) {
				$classname = str_replace("\\","-",$classname);
			}
			foreach (self::$dirs as $dir) {
				$file = $dir . '/' . $classname;
				if(file_exists(self::$parentDir .$file.'.php') !== FALSE){
					require (self::$parentDir .$file.'.php');
					return;
				}
			}
		}
	}
}