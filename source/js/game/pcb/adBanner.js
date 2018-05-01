/*
	logic: adBanner
	see : https://github.com/orange-games/phaser-ads
	see : http://www.emanueleferonato.com/2016/05/25/easily-add-googles-doubleclick-ads-in-your-html5-games-with-a-little-phaser-plugin/
*/
// Make Printed circuit board if it does not exist yet (to deal with load order issue here).
if(!PCB) var PCB = {};

// print PCB
PCB.adBanner = {
	init: function() {
		if(Register.use_adBanner !== true) return;
		var button = document.getElementById("close-adbanner");
		button.addEventListener("click",function(e){
			PCB.adBanner.onContentResumed();
		},false);
	},
	showAd: function () {
		PCB.event.trigger('adBannerShow');
		Game.paused = true;
		var $_adContainer = document.getElementById("ad-container");
		$_adContainer.classList.remove("hide");
	},
	onContentResumed: function () {
		var $_adContainer = document.getElementById("ad-container");
		$_adContainer.classList.add("hide");
		// unpause game
		Game.paused = false;
		// trigger event
		PCB.event.trigger('adBannerFinished');
	},
};