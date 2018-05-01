/*
	logic: assets
	routines used for preload
*/
// Make Printed circuit board if it does not exist yet (to deal with load order issue here).
if(!PCB) var PCB = {};

// print PCB
/**
 * Registers preload. Manifest is required.
 * _manifest = {
 * 		images: {id: path ... },
 *		audioFiles: {id: path ... },
 * 		}
*/
PCB.assets = {
	/**
	 * Methods
	 */
	addPreloadListners: function ( _target ) {
		Game.load.onLoadStart.add(_target.loadStart, _target);
		Game.load.onFileComplete.add(_target.fileComplete, _target);
		// onFileError does not catch 404 for sound files.
		Game.load.onFileError.add(_target.onFileError, this);
		Game.load.onLoadComplete.add(_target.loadComplete, _target);
	},
	removePreloadListners: function () {
		Game.load.onLoadStart.removeAll();
		Game.load.onFileComplete.removeAll();
		Game.load.onFileError.removeAll();
		Game.load.onLoadComplete.removeAll();
	},
	enqueuePreloadAssets: function (_manifest) {
		var _audioType = Register.audioType; // m4a or ogg. registered at Rom.boot();
		// json file for configs
		if(_manifest.json) {
			for(var _key in _manifest.json) {
				var _randomTime = new Date().getTime();
				Game.load.json(_key, 'config/' + _manifest.json[_key] + '.json'+'?version='+Register.GAME_VRESION+'&'+_randomTime);
			};
		};
		// audio files. enqueue only if audio is supported.
		if (_manifest.audio && Register.audioType && Game.sound.noAudio === false) {
			for(var _key in _manifest.audio) {
				Game.load.audio(_key, 'sound/' + _manifest.audio[_key] + '.' + _audioType);
			};
			/**
			 * Sound Manager needs to be rebooted for Safari.
			 */
			Game.sound.boot();
		};
		/**
		 * audio sprite
		 * See source:  @method Phaser.Loader#audiosprite,
		 * audiosprite: function(key, urls, jsonURL, jsonData, autoDecode)
		 * Note: autoDecode is true by default.
		 * here theID: {url, jsonSpritelist}
		 */
		if (_manifest.audiosprite && Register.audioType && Game.sound.noAudio === false) {
			for(var _key in _manifest.audiosprite) {
				Game.load.audiosprite(_key, 'sound/' + _manifest.audiosprite[_key].path + '.' + _audioType, null, _manifest.audiosprite[_key].audioJSON);
			};
		};
		// image files
		if(_manifest.image) {
			for(var _key in _manifest.image) {
				Game.load.image(_key, 'images/' + _manifest.image[_key]);
			};
		};
		// spritesheet
		if(_manifest.spritesheet) {
			for(var _key in _manifest.spritesheet) {
				Game.load.spritesheet(_key, 'images/' + _manifest.spritesheet[_key][0],_manifest.spritesheet[_key][1],_manifest.spritesheet[_key][2]);
			};
		};
		// atlasHash
		if(_manifest.atlasHash) {
			for(var _key in _manifest.atlasHash) {
				var _atlasID = _manifest.atlasHash[_key];
				Game.load.atlasJSONArray(_atlasID, 'images/atlas/' +_atlasID+'.jpg', 'images/atlas/' +_atlasID+'.json');
			};
		};
	},
	postPreloadHandlings: function ( _reference ) {
		var _settings_data = Game.cache.getJSON('settings');
		var _manifest = _reference.manifest;
		for (var _key in _settings_data) {
			Register[_key] = _settings_data[_key];
		};
		// listners clean up
		PCB.assets.removePreloadListners();
		// reflect user settings
		if( Register.mute_sound === true ) PCB.audio.mute();
		// register audio at once
		if(Game.sound.noAudio === false) {
			if (_manifest.hasOwnProperty('audio')) {
				for(var _key in _manifest.audio) {
					Register.audioInstances[_key] = Game.add.audio(_key);
				};
			};
			// register audioSpriteInstances
			if (_manifest.hasOwnProperty('audiosprite')) {
				for(var _key in _manifest.audiosprite) {
					Register.audioInstances[_key] = Game.add.audioSprite(_key);
					// supposedly this is required for audio sprites
					Register.audioInstances[_key].allowMultiple = true;
				};
			};
		}
		return true;
	},
};

// _manifest