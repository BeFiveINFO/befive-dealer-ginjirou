/*
	logic: sprite
	routines used for managing sprites
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

/**
 * Sprite Manager
 *
 * @param      object   context  	id				id of the sprite
 * 									arguments		arguments to pass to sprite
 * 									destroy			destroy the sprite specified with id
 * 									destroy_all		destroy all registered sprite instances.
 */
PCB.sprite = function ( context ) {
	var _sprite_id = context.id;
	var _arguments = context.arguments;
	var _destroy = context.destroy;
	var _destroy_all = context.destroy_all;

	if(_destroy_all === true) {
		Register.spriteInstances = {};
		Register.groupInstances = {};
		return true;
	}
	if(!_sprite_id) return false;
	var _spriteInstance = Register.spriteInstances[_sprite_id];
	if(typeof _spriteInstance === 'undefined') {
		// make a dummy onject once
		Register.spriteInstances[_sprite_id] = {};
		// execute new method
		Rom.sprite[_sprite_id].new(_arguments);
	} else if (_destroy === true ) {
		Register.spriteInstances[_sprite_id].destroy();
		if(Register.groupInstances[_sprite_id]) Register.groupInstances[_sprite_id].destroy();
	} else {
		Rom.sprite[_sprite_id].update(_arguments);
	}
};

/**
 * Draws a rectangle.
 * To eliminate padding, do spriteObject.boundsPadding = 0; (padding set to 10 by default).
 *
 * @param      object	context  	width		width of rect
 * 									height		height of rect
 * 									x			x coord.
 * 									y			y coord.
 * 									color		color in hex
 * @return     object	A bitmap instance of rectangle.
 */
PCB.sprite.getRectBitmap = function ( context ) {
	// parameters init
	var _width = (context.width) ? context.width : 100;
	var _height = (context.height) ? context.height : 100;
	var _color = (context.color) ? context.color : '#ffffff';
	var _x = (context.x) ? context.x : 0;
	var _y = (context.y) ? context.y : 0;

	var _bmd = Game.add.bitmapData(_width, _height);

	_bmd.ctx.beginPath();
	_bmd.ctx.rect(0, 0, _width, _height);
	_bmd.ctx.fillStyle = _color;
	_bmd.ctx.fill();

	return _bmd;
}