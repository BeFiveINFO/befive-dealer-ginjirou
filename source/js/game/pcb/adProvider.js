/*
	logic: adProvider
	see : https://github.com/orange-games/phaser-ads
	see : http://www.emanueleferonato.com/2016/05/25/easily-add-googles-doubleclick-ads-in-your-html5-games-with-a-little-phaser-plugin/
*/
// Make Printed circuit board if it does not exist yet (to deal with load order issue here).
if(!PCB) var PCB = {};

// print PCB
PCB.adProvider = {
	init: function() {
		/**
		 * Return if ad provider url is not set.
		 */
		if(Register.adProvider_url === '') {
			return false;
		}

		// add AdManager plugin
		// Game.add.plugin(PhaserAds.AdManager);

		Game.plugins.add(PhaserAds.AdManager);

		//Content paused event is fired when the content (game) should be paused, and the ad will be played
		Game.ads.onContentPaused.add(function () {
			// console.log('Started playing ad');
		});

		// event listener. Triggers adFinished event when ad is completed/skipped/finished/done playing.
		Game.ads.onContentResumed.add(function(_status) {
			if(_status) console.log(_status);
			// unpause game
			Game.paused = false;
			// trigger event
			PCB.event.trigger('adFinished');
		});
	},
	requestAd: function () {
		Game.paused = true;
		PCB.adProvider.setAd();
		Game.ads.showAd();
	},
	setAd: function () {
		// add provider URL
		Register.adProvider = Game.ads.setAdProvider(new PhaserAds.AdProvider.Ima3(
			Game,
			Register.adProvider_url
			));
	},
};