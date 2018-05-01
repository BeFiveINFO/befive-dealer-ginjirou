/*
	logic: audio
	routines used for audio
*/
// Make Printed circuit board if it does not exist yet (to deal with load order issue here).
if(!PCB) var PCB = {};

// print PCB

PCB.audio = {
	/**
	 * uses Register.audioInstances for holding each instance. You need to play once to register in there.
	 * also handles audio sprites (requires _marker to be set)
	 */
	play: function ( _sound_id, _marker, _volume, _loop, _allowMultiple ) {
		// see if _sound_id is valid
		if(_sound_id  === undefined) return false;
		if( Register.audioInstances.hasOwnProperty(_sound_id) === false ) {
			// must be a new sound... here it needs a check up if the sound id is valid... in the future
			return false;
		}
		if(_loop  === undefined) _loop = false; // loop set to none by default

		/** volume */
		if(_volume  === undefined) {
			_volume = Register.audioInstances[_sound_id].volume; // volume is full by default
		}
		Register.audioInstances[_sound_id].volume = _volume;

		if (_marker === undefined) {
			Register.audioInstances[_sound_id].allowMultiple = true;
			Register.audioInstances[_sound_id].play('',0, _volume,_loop,false);
		} else if(Register.audioInstances[_sound_id].sounds.hasOwnProperty(_marker)) {
			if(_allowMultiple){
				Register.audioInstances[_sound_id].sounds[_marker].allowMultiple = true;
			}
			// audiosprite
			Register.audioInstances[_sound_id].play(_marker, undefined,_volume,_loop,false);
		} else {
			console.log(_marker + ' of ' +_sound_id + ' does not exist.');
			return false;
		}
	},
	stop: function ( _sound_id ) {
		if(!_sound_id ) {
			// sound_id is not specified. stop all at once
			Game.sound.stopAll();
		} else {
			Register.audioInstances[_sound_id].stop();
		}
	},
	/*
	 * fades out works for just one sound instance. global fade out if sound id is not valid
	 * duration in millisecond, set _volume value between 0 and 1.
	 * fades out in 1 second if _duration, _volume are omitted.
	 */
	fadeTo: function ( _sound_id , _duration, _volume) {
		if(!_duration) _duration = 1000;
		if(!_volume) _volume = 0;
		// see if _sound_id is valid
		if(!_sound_id || Register.audioInstances.hasOwnProperty(_sound_id) === false ) {
			// fade all
			for(var _key in Register.audioInstances ) {
				// let me think if it is necessary to fade audio sprite too
				if(!Register.audioInstances[_key].hasOwnProperty('sounds')){
					Register.audioInstances[_key].fadeTo(_duration, _volume);
				}
			}
		} else {
			Register.audioInstances[_sound_id].fadeTo(_duration, _volume);
		}
	},
	/*
	 * Pause / resume. Played when it is not either paused or played. loop mode by default
	 * Note: Phase does not really seem to support audio sprite (looped) well.
	 */
	pause: function ( _sound_id , _marker, _isLooped , _volume ) {
		// _sound_id is required
		if(_sound_id === undefined) return false;
		if(_marker === undefined) _marker = '';

		// see if _sound_id is valid
		if(Register.audioInstances.hasOwnProperty(_sound_id) === false) {
			return false;
		}
		var _audioInstance;
		var _currentPosition;
		/** set volue */
		if(_volume  === undefined) {
			_volume = Register.audioInstances[_sound_id].volume; // volume is full by default
		}
		Register.audioInstances[_sound_id].volume = _volume;

		// find audio instance. if this is an audio sprite, it requires marker
		if(
			Register.audioInstances[_sound_id].hasOwnProperty('sounds') &&
			Register.audioInstances[_sound_id].sounds.hasOwnProperty(_marker)
		) {
			// this is an audio sprite
			_audioInstance = Register.audioInstances[_sound_id].sounds[_marker];
		} else {
			// this is a regular audio
			_audioInstance = Register.audioInstances[_sound_id];
		}
		// exception handling
		if(_audioInstance.pausedPosition < 0) {
			_audioInstance.pausedPosition = 0;
		}
		// play if the audio is not being played now
		if(_audioInstance.isPlaying === undefined) {
			return false;
		} else if(_audioInstance.isPlaying === false ) {
			if(_audioInstance.paused === true) {
				_audioInstance.resume();
			} else {
				// if the audio is not paused, just play
				_audioInstance.play(_marker, 0, _volume , _isLooped);
			}
		} else if(_audioInstance.isPlaying === true ) {
			// remember the last played position. there can be a bug here, the sound will not be played at all then the value of position should exceed that of duration.
			// _audioInstance.currentPosition = _audioInstance.position;
			_audioInstance.pause();
		}
		return true;
	},
	/**
	 * mute globally
	 *
	 * @params boolean _mute_sound. Toggle the current state if omitted.
	 */
	mute: function ( _mute_sound ) {
		// Set explicitly
		if(typeof _mute_sound !== 'undefined') {
			Game.sound.mute = Boolean(_mute_sound);
		// Toggle if _mute_sound is not set
		} else if (Game.sound.mute == false) {
			Game.sound.mute = true;
		} else {
			Game.sound.mute = false;
		}
	}
};