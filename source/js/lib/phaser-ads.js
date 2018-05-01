/*!
 * phaser-ads - version 2.0.3
 * A Phaser plugin for providing nice ads integration in your phaser.io game
 *
 * OrangeGames
 * Build at 27-01-2017
 * Released under MIT License
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PhaserAds;
(function (PhaserAds) {
    var AdEvent;
    (function (AdEvent) {
        AdEvent[AdEvent["start"] = 0] = "start";
        AdEvent[AdEvent["firstQuartile"] = 1] = "firstQuartile";
        AdEvent[AdEvent["midPoint"] = 2] = "midPoint";
        AdEvent[AdEvent["thirdQuartile"] = 3] = "thirdQuartile";
        AdEvent[AdEvent["complete"] = 4] = "complete";
    })(AdEvent = PhaserAds.AdEvent || (PhaserAds.AdEvent = {}));
    var AdManager = (function (_super) {
        __extends(AdManager, _super);
        function AdManager(game, pluginManager) {
            var _this = _super.call(this, game, pluginManager) || this;
            _this.onContentPaused = new Phaser.Signal();
            _this.onContentResumed = new Phaser.Signal();
            _this.onAdProgression = new Phaser.Signal();
            _this.onAdsDisabled = new Phaser.Signal();
            _this.onAdClicked = new Phaser.Signal();
            _this.onAdRewardGranted = new Phaser.Signal();
            _this.provider = null;
            _this.wasMuted = false;
            Object.defineProperty(game, 'ads', {
                value: _this
            });
            return _this;
        }
        /**
         * Here we set an adprovider, any can be given as long as it implements the IProvider interface
         *
         * @param provider
         */
        AdManager.prototype.setAdProvider = function (provider) {
            this.provider = provider;
            this.provider.setManager(this);
        };
        /**
         * Here we request an ad, the arguments passed depend on the provider used!
         * @param args
         */
        AdManager.prototype.showAd = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (null === this.provider) {
                throw new Error('Can not request an ad without an provider, please attach an ad provider!');
            }
            //Let's not do this for banner's
            if (args[0] && args[0] !== PhaserAds.AdProvider.CocoonAdType.banner) {
                //first we check if the sound was already muted before we requested an add
                this.wasMuted = this.game.sound.mute;
                //Let's mute audio for the game, we can resume the audi playback once the add has played
                this.game.sound.mute = true;
            }
            this.provider.showAd.apply(this.provider, args);
        };
        /**
         * Some providers might require you to preload an ad before showing it, that can be done here
         *
         * @param args
         */
        AdManager.prototype.preloadAd = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (null === this.provider) {
                throw new Error('Can not preload an ad without an provider, please attach an ad provider!');
            }
            this.provider.preloadAd.apply(this.provider, args);
        };
        /**
         * Some providers require you to destroy an add after it was shown, that can be done here.
         *
         * @param args
         */
        AdManager.prototype.destroyAd = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (null === this.provider) {
                throw new Error('Can not destroy an ad without an provider, please attach an ad provider!');
            }
            this.provider.destroyAd.apply(this.provider, args);
        };
        /**
         * Some providers allow you to hide an ad, you might think of an banner ad that is shown in show cases
         *
         * @param args
         */
        AdManager.prototype.hideAd = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (null === this.provider) {
                throw new Error('Can not hide an ad without an provider, please attach an ad provider!');
            }
            this.unMuteAfterAd();
            this.provider.hideAd.apply(this.provider, args);
        };
        /**
         * Checks if ads are enabled or blocked
         *
         * @param args
         */
        AdManager.prototype.adsEnabled = function () {
            return this.provider.adsEnabled;
        };
        /**
         * Should be called after ad was(n't) shown, demutes the game so we can peacefully continue
         */
        AdManager.prototype.unMuteAfterAd = function () {
            if (!this.wasMuted) {
                //Here we unmute audio, but only if it wasn't muted before requesting an add
                this.game.sound.mute = false;
            }
        };
        return AdManager;
    }(Phaser.Plugin));
    PhaserAds.AdManager = AdManager;
})(PhaserAds || (PhaserAds = {}));
var PhaserAds;
(function (PhaserAds) {
    var AdProvider;
    (function (AdProvider) {
        var CocoonProvider;
        (function (CocoonProvider) {
            CocoonProvider[CocoonProvider["AdMob"] = 0] = "AdMob";
            CocoonProvider[CocoonProvider["MoPub"] = 1] = "MoPub";
            CocoonProvider[CocoonProvider["Chartboost"] = 2] = "Chartboost";
            CocoonProvider[CocoonProvider["Heyzap"] = 3] = "Heyzap";
        })(CocoonProvider = AdProvider.CocoonProvider || (AdProvider.CocoonProvider = {}));
        var CocoonAdType;
        (function (CocoonAdType) {
            CocoonAdType[CocoonAdType["banner"] = 0] = "banner";
            CocoonAdType[CocoonAdType["interstitial"] = 1] = "interstitial";
            CocoonAdType[CocoonAdType["insentive"] = 2] = "insentive";
        })(CocoonAdType = AdProvider.CocoonAdType || (AdProvider.CocoonAdType = {}));
        var CocoonAds = (function () {
            function CocoonAds(game, provider, config) {
                this.adsEnabled = false;
                this.banner = null;
                this.bannerShowable = false;
                this.interstitial = null;
                this.interstitialShowable = false;
                this.insentive = null;
                this.insentiveShowable = false;
                if ((game.device.cordova || game.device.crosswalk) && (Cocoon && Cocoon.Ad)) {
                    this.adsEnabled = true;
                }
                else {
                    return;
                }
                switch (provider) {
                    default:
                    case CocoonProvider.AdMob:
                        this.cocoonProvider = Cocoon.Ad.AdMob;
                        break;
                    case CocoonProvider.Chartboost:
                        this.cocoonProvider = Cocoon.Ad.Chartboost;
                        break;
                    case CocoonProvider.Heyzap:
                        this.cocoonProvider = Cocoon.Ad.Heyzap;
                        break;
                    case CocoonProvider.MoPub:
                        this.cocoonProvider = Cocoon.Ad.MoPub;
                        break;
                }
                this.cocoonProvider.configure(config);
            }
            CocoonAds.prototype.setManager = function (manager) {
                this.adManager = manager;
            };
            CocoonAds.prototype.showAd = function (adType) {
                if (!this.adsEnabled) {
                    this.adManager.unMuteAfterAd();
                    if (!(adType === CocoonAdType.banner)) {
                        this.adManager.onContentResumed.dispatch();
                    }
                    return;
                }
                if (adType === CocoonAdType.banner) {
                    if (!this.bannerShowable || null === this.banner) {
                        this.adManager.unMuteAfterAd();
                        //No banner ad available, skipping
                        //this.adManager.onContentResumed.dispatch(CocoonAdType.banner);
                        return;
                    }
                    this.banner.show();
                }
                if (adType === CocoonAdType.interstitial) {
                    if (!this.interstitialShowable || null === this.interstitial) {
                        this.adManager.unMuteAfterAd();
                        //No banner ad available, skipping
                        this.adManager.onContentResumed.dispatch(CocoonAdType.interstitial);
                        return;
                    }
                    this.interstitial.show();
                }
                if (adType === CocoonAdType.insentive) {
                    if (!this.insentiveShowable || null === this.insentive) {
                        this.adManager.unMuteAfterAd();
                        //No banner ad available, skipping
                        this.adManager.onContentResumed.dispatch(CocoonAdType.insentive);
                        return;
                    }
                    this.insentive.show();
                }
            };
            CocoonAds.prototype.preloadAd = function (adType, adId, bannerPosition) {
                var _this = this;
                if (!this.adsEnabled) {
                    return;
                }
                //Some cleanup before preloading a new ad
                this.destroyAd(adType);
                if (adType === CocoonAdType.banner) {
                    this.banner = this.cocoonProvider.createBanner(adId);
                    if (bannerPosition) {
                        this.banner.setLayout(bannerPosition);
                    }
                    this.banner.on('load', function () {
                        _this.bannerShowable = true;
                    });
                    this.banner.on('fail', function () {
                        _this.bannerShowable = false;
                        _this.banner = null;
                    });
                    this.banner.on('click', function () {
                        _this.adManager.onAdClicked.dispatch(CocoonAdType.banner);
                    });
                    //Banner don't pause or resume content
                    this.banner.on('show', function () {
                        // this.adManager.onContentPaused.dispatch(CocoonAdType.banner);
                    });
                    this.banner.on('dismiss', function () {
                        // this.adManager.onContentResumed.dispatch(CocoonAdType.banner);
                        // this.bannerShowable = false;
                        // this.banner = null;
                    });
                    this.banner.load();
                }
                if (adType === CocoonAdType.interstitial) {
                    this.interstitial = this.cocoonProvider.createInterstitial(adId);
                    this.interstitial.on('load', function () {
                        _this.interstitialShowable = true;
                    });
                    this.interstitial.on('fail', function () {
                        _this.interstitialShowable = false;
                        _this.interstitial = null;
                    });
                    this.interstitial.on('click', function () {
                        _this.adManager.onAdClicked.dispatch(CocoonAdType.interstitial);
                    });
                    this.interstitial.on('show', function () {
                        _this.adManager.onContentPaused.dispatch(CocoonAdType.interstitial);
                    });
                    this.interstitial.on('dismiss', function () {
                        _this.adManager.unMuteAfterAd();
                        _this.adManager.onContentResumed.dispatch(CocoonAdType.interstitial);
                        _this.interstitialShowable = false;
                        _this.interstitial = null;
                    });
                    this.interstitial.load();
                }
                if (adType === CocoonAdType.insentive) {
                    this.insentive = this.cocoonProvider.createRewardedVideo(adId);
                    this.insentive.on('load', function () {
                        _this.insentiveShowable = true;
                    });
                    this.insentive.on('fail', function () {
                        _this.insentiveShowable = false;
                        _this.insentive = null;
                    });
                    this.insentive.on('click', function () {
                        _this.adManager.onAdClicked.dispatch(CocoonAdType.insentive);
                    });
                    this.insentive.on('show', function () {
                        _this.adManager.onContentPaused.dispatch(CocoonAdType.insentive);
                    });
                    this.insentive.on('dismiss', function () {
                        _this.adManager.unMuteAfterAd();
                        _this.adManager.onContentResumed.dispatch(CocoonAdType.insentive);
                        _this.insentiveShowable = false;
                        _this.insentive = null;
                    });
                    this.insentive.on('reward', function () {
                        _this.adManager.unMuteAfterAd();
                        _this.adManager.onAdRewardGranted.dispatch(CocoonAdType.insentive);
                        _this.insentiveShowable = false;
                        _this.insentive = null;
                    });
                    this.insentive.load();
                }
            };
            CocoonAds.prototype.destroyAd = function (adType) {
                if (!this.adsEnabled) {
                    return;
                }
                if (adType === CocoonAdType.banner && null !== this.banner) {
                    this.cocoonProvider.releaseBanner(this.banner);
                    this.banner = null;
                    this.bannerShowable = false;
                }
                if (adType === CocoonAdType.interstitial && null !== this.interstitial) {
                    this.cocoonProvider.releaseInterstitial(this.interstitial);
                    this.interstitial = null;
                    this.interstitialShowable = false;
                }
            };
            CocoonAds.prototype.hideAd = function (adType) {
                if (!this.adsEnabled) {
                    return;
                }
                if (adType === CocoonAdType.interstitial && null !== this.interstitial) {
                    this.interstitial.hide();
                }
                if (adType === CocoonAdType.banner && null !== this.banner) {
                    this.banner.hide();
                }
                if (adType === CocoonAdType.insentive && null !== this.insentive) {
                    this.insentive.hide();
                }
            };
            return CocoonAds;
        }());
        AdProvider.CocoonAds = CocoonAds;
    })(AdProvider = PhaserAds.AdProvider || (PhaserAds.AdProvider = {}));
})(PhaserAds || (PhaserAds = {}));
var PhaserAds;
(function (PhaserAds) {
    var AdProvider;
    (function (AdProvider) {
        var HeyzapAdTypes;
        (function (HeyzapAdTypes) {
            HeyzapAdTypes[HeyzapAdTypes["Interstitial"] = 0] = "Interstitial";
            HeyzapAdTypes[HeyzapAdTypes["Video"] = 1] = "Video";
            HeyzapAdTypes[HeyzapAdTypes["Rewarded"] = 2] = "Rewarded";
            HeyzapAdTypes[HeyzapAdTypes["Banner"] = 3] = "Banner";
        })(HeyzapAdTypes = AdProvider.HeyzapAdTypes || (AdProvider.HeyzapAdTypes = {}));
        var CordovaHeyzap = (function () {
            function CordovaHeyzap(game, publisherId) {
                var _this = this;
                this.adsEnabled = false;
                if (game.device.cordova || game.device.crosswalk) {
                    this.adsEnabled = true;
                }
                else {
                    return;
                }
                HeyzapAds.start(publisherId).then(function () {
                    // Native call successful.
                }, function (error) {
                    //Failed to start heyzap, disabling ads
                    _this.adsEnabled = false;
                });
            }
            CordovaHeyzap.prototype.setManager = function (manager) {
                this.adManager = manager;
            };
            CordovaHeyzap.prototype.showAd = function (adType, bannerAdPositions) {
                var _this = this;
                if (!this.adsEnabled) {
                    this.adManager.unMuteAfterAd();
                    this.adManager.onContentResumed.dispatch();
                }
                switch (adType) {
                    case HeyzapAdTypes.Interstitial:
                        //Register event listeners
                        HeyzapAds.InterstitialAd.addEventListener(HeyzapAds.InterstitialAd.Events.HIDE, function () {
                            _this.adManager.unMuteAfterAd();
                            _this.adManager.onContentResumed.dispatch(HeyzapAds.InterstitialAd.Events.HIDE);
                        });
                        HeyzapAds.InterstitialAd.addEventListener(HeyzapAds.InterstitialAd.Events.SHOW_FAILED, function () {
                            _this.adManager.unMuteAfterAd();
                            _this.adManager.onContentResumed.dispatch(HeyzapAds.InterstitialAd.Events.SHOW_FAILED);
                        });
                        HeyzapAds.InterstitialAd.addEventListener(HeyzapAds.InterstitialAd.Events.CLICKED, function () {
                            _this.adManager.onAdClicked.dispatch(HeyzapAds.InterstitialAd.Events.CLICKED);
                        });
                        HeyzapAds.InterstitialAd.show().then(function () {
                            // Native call successful.
                            _this.adManager.onContentPaused.dispatch();
                        }, function (error) {
                            _this.adManager.unMuteAfterAd();
                            //Failed to show insentive ad, continue operations
                            _this.adManager.onContentResumed.dispatch();
                        });
                        break;
                    case HeyzapAdTypes.Video:
                        HeyzapAds.VideoAd.addEventListener(HeyzapAds.VideoAd.Events.HIDE, function () {
                            _this.adManager.unMuteAfterAd();
                            _this.adManager.onContentResumed.dispatch(HeyzapAds.VideoAd.Events.HIDE);
                        });
                        HeyzapAds.VideoAd.addEventListener(HeyzapAds.VideoAd.Events.SHOW_FAILED, function () {
                            _this.adManager.unMuteAfterAd();
                            _this.adManager.onContentResumed.dispatch(HeyzapAds.VideoAd.Events.SHOW_FAILED);
                        });
                        HeyzapAds.VideoAd.addEventListener(HeyzapAds.VideoAd.Events.CLICKED, function () {
                            _this.adManager.onAdClicked.dispatch(HeyzapAds.VideoAd.Events.CLICKED);
                        });
                        HeyzapAds.VideoAd.show().then(function () {
                            // Native call successful.
                            _this.adManager.onContentPaused.dispatch();
                        }, function (error) {
                            _this.adManager.unMuteAfterAd();
                            //Failed to show insentive ad, continue operations
                            _this.adManager.onContentResumed.dispatch();
                        });
                        break;
                    case HeyzapAdTypes.Rewarded:
                        HeyzapAds.IncentivizedAd.addEventListener(HeyzapAds.IncentivizedAd.Events.HIDE, function () {
                            _this.adManager.unMuteAfterAd();
                            _this.adManager.onContentResumed.dispatch(HeyzapAds.IncentivizedAd.Events.HIDE);
                        });
                        HeyzapAds.IncentivizedAd.addEventListener(HeyzapAds.IncentivizedAd.Events.SHOW_FAILED, function () {
                            _this.adManager.unMuteAfterAd();
                            _this.adManager.onContentResumed.dispatch(HeyzapAds.IncentivizedAd.Events.SHOW_FAILED);
                        });
                        HeyzapAds.IncentivizedAd.addEventListener(HeyzapAds.IncentivizedAd.Events.CLICKED, function () {
                            _this.adManager.onAdClicked.dispatch(HeyzapAds.IncentivizedAd.Events.CLICKED);
                        });
                        HeyzapAds.IncentivizedAd.show().then(function () {
                            // Native call successful.
                            _this.adManager.onContentPaused.dispatch();
                        }, function (error) {
                            _this.adManager.unMuteAfterAd();
                            //Failed to show insentive ad, continue operations
                            _this.adManager.onContentResumed.dispatch();
                        });
                        break;
                    case HeyzapAdTypes.Banner:
                        HeyzapAds.BannerAd.show(bannerAdPositions).then(function () {
                            // Native call successful.
                        }, function (error) {
                            // Handle Error
                        });
                        break;
                }
            };
            CordovaHeyzap.prototype.preloadAd = function (adType) {
                if (!this.adsEnabled) {
                    return;
                }
                if (adType === HeyzapAdTypes.Rewarded) {
                    HeyzapAds.IncentivizedAd.fetch().then(function () {
                        // Native call successful.
                    }, function (error) {
                        // Handle Error
                    });
                }
                return;
            };
            CordovaHeyzap.prototype.destroyAd = function (adType) {
                if (!this.adsEnabled) {
                    return;
                }
                if (adType === HeyzapAdTypes.Banner) {
                    HeyzapAds.BannerAd.destroy().then(function () {
                        // Native call successful.
                    }, function (error) {
                        // Handle Error
                    });
                }
                return;
            };
            CordovaHeyzap.prototype.hideAd = function (adType) {
                if (!this.adsEnabled) {
                    return;
                }
                if (adType === HeyzapAdTypes.Banner) {
                    HeyzapAds.BannerAd.hide().then(function () {
                        // Native call successful.
                    }, function (error) {
                        // Handle Error
                    });
                }
                return;
            };
            return CordovaHeyzap;
        }());
        AdProvider.CordovaHeyzap = CordovaHeyzap;
    })(AdProvider = PhaserAds.AdProvider || (PhaserAds.AdProvider = {}));
})(PhaserAds || (PhaserAds = {}));
var PhaserAds;
(function (PhaserAds) {
    var AdProvider;
    (function (AdProvider) {
        var Ima3 = (function () {
            function Ima3(game, adTagUrl) {
                this.adsManager = null;
                this.googleEnabled = false;
                this.adsEnabled = true;
                this.adTagUrl = '';
                this.adRequested = false;
                this.adManager = null;
                this.resizeListener = null;
                this.adsEnabled = this.areAdsEnabled();
                if (typeof google === 'undefined') {
                    return;
                }
                this.googleEnabled = true;
                this.gameContent = (typeof game.parent === 'string') ? document.getElementById(game.parent) : game.parent;
                // this.gameContent.currentTime = 100;
                this.gameContent.style.position = 'absolute';
                this.gameContent.style.width = '100%';
                this.adContent = this.gameContent.parentNode.appendChild(document.createElement('div'));
                this.adContent.id = 'phaser-ad-container';
                this.adContent.style.position = 'absolute';
                this.adContent.style.zIndex = '9999';
                this.adContent.style.display = 'none';
                this.adContent.style.top = '0';
                this.adContent.style.left = '0';
                this.adContent.style.width = '100%';
                this.adContent.style.height = '100%';
                this.adContent.style.overflow = 'hidden';
                this.adTagUrl = adTagUrl;
                this.game = game;
                // Create the ad display container.
                this.adDisplay = new google.ima.AdDisplayContainer(this.adContent);
                //Set vpaid enabled, and update locale
                google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED);
                google.ima.settings.setLocale('nl');
                // Create ads loader, and register events
                this.adLoader = new google.ima.AdsLoader(this.adDisplay);
                this.adLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.onAdManagerLoader, false, this);
                this.adLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError, false, this);
            }
            Ima3.prototype.setManager = function (manager) {
                this.adManager = manager;
            };
            /**
             * Doing an ad request, if anything is wrong with the lib (missing ima3, failed request) we just dispatch the contentResumed event
             * Otherwise we display an ad
             */
            Ima3.prototype.showAd = function (customParams) {
                // console.log('Ad Requested');
                if (this.adRequested) {
                    return;
                }
                if (!this.adsEnabled) {
                    this.adManager.onAdsDisabled.dispatch(true);
                }
                if (!this.googleEnabled) {
                    this.onContentResumeRequested();
                    return;
                }
                //For mobile this ad request needs to be handled post user click
                this.adDisplay.initialize();
                // Request video ads.
                var adsRequest = new google.ima.AdsRequest();
                adsRequest.adTagUrl = this.adTagUrl + this.parseCustomParams(customParams);
                var width = window.innerWidth; //parseInt(<string>(!this.game.canvas.style.width ? this.game.canvas.width : this.game.canvas.style.width), 10);
                var height = window.innerHeight; //parseInt(<string>(!this.game.canvas.style.height ? this.game.canvas.height : this.game.canvas.style.height), 10);
                //Here we check if phaser is fullscreen or not, if we are fullscreen, we subtract some of the width and height, to counter for the resize (
                //Fullscreen should be disabled for the ad, (onContentPaused) and requested for again when the game resumes
                if (this.game.scale.isFullScreen && document.body.clientHeight < window.innerHeight) {
                    height = document.body.clientHeight;
                    width = document.body.clientWidth;
                }
                // Specify the linear and nonlinear slot sizes. This helps the SDK to
                // select the correct creative if multiple are returned.
                adsRequest.linearAdSlotWidth = width;
                adsRequest.linearAdSlotHeight = height;
                adsRequest.nonLinearAdSlotWidth = width;
                adsRequest.nonLinearAdSlotHeight = height;
                //Required for games, see:
                //http://googleadsdeveloper.blogspot.nl/2015/10/important-changes-for-gaming-publishers.html
                adsRequest.forceNonLinearFullSlot = true;
                try {
                    this.adRequested = true;
                    this.adLoader.requestAds(adsRequest);
                }
                catch (e) {
                    // console.log(e);
                    this.onContentResumeRequested();
                }
            };
            //Does nothing, but needed for Provider interface
            Ima3.prototype.preloadAd = function () {
                return;
            };
            //Does nothing, but needed for Provider interface
            Ima3.prototype.destroyAd = function () {
                return;
            };
            //Does nothing, but needed for Provider interface
            Ima3.prototype.hideAd = function () {
                return;
            };
            /**
             * Called when the ads manager was loaded.
             * We register all ad related events here, and initialize the manager with the game width/height
             *
             * @param adsManagerLoadedEvent
             */
            Ima3.prototype.onAdManagerLoader = function (adsManagerLoadedEvent) {
                var _this = this;
                // console.log('AdsManager loaded');
                // Get the ads manager.
                var adsRenderingSettings = new google.ima.AdsRenderingSettings();
                adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
                // videoContent should be set to the content video element.
                var adsManager = adsManagerLoadedEvent.getAdsManager(this.gameContent, adsRenderingSettings);
                this.adsManager = adsManager;
                // console.log(adsManager.isCustomClickTrackingUsed());
                // Add listeners to the required events.
                adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this.onContentPauseRequested, false, this);
                adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, this.onContentResumeRequested, false, this);
                adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError, false, this);
                [
                    google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
                    google.ima.AdEvent.Type.CLICK,
                    google.ima.AdEvent.Type.COMPLETE,
                    google.ima.AdEvent.Type.FIRST_QUARTILE,
                    google.ima.AdEvent.Type.LOADED,
                    google.ima.AdEvent.Type.MIDPOINT,
                    google.ima.AdEvent.Type.PAUSED,
                    google.ima.AdEvent.Type.STARTED,
                    google.ima.AdEvent.Type.THIRD_QUARTILE
                ].forEach(function (event) {
                    adsManager.addEventListener(event, _this.onAdEvent, false, _this);
                });
                try {
                    //Show the ad elements, we only need to show the faux videoelement on iOS, because the ad is displayed in there.
                    this.adContent.style.display = 'block';
                    // Initialize the ads manager. Ad rules playlist will start at this time.
                    var width = window.innerWidth; //parseInt(<string>(!this.game.canvas.style.width ? this.game.canvas.width : this.game.canvas.style.width), 10);
                    var height = window.innerHeight; //parseInt(<string>(!this.game.canvas.style.height ? this.game.canvas.height : this.game.canvas.style.height), 10);
                    this.adsManager.init(width, height, google.ima.ViewMode.NORMAL);
                    // Call play to start showing the ad. Single video and overlay ads will
                    // start at this time; the call will be ignored for ad rules.
                    this.adsManager.start();
                    this.resizeListener = function () {
                        //Window was resized, so expect something similar
                        // console.log('Resizing ad size');
                        _this.adsManager.resize(window.innerWidth, window.innerHeight, google.ima.ViewMode.NORMAL);
                    };
                    window.addEventListener('resize', this.resizeListener);
                }
                catch (adError) {
                    console.log('Adsmanager error:', adError);
                    this.onAdError(adError);
                }
            };
            /**
             * Generic ad events are handled here
             * @param adEvent
             */
            Ima3.prototype.onAdEvent = function (adEvent) {
                // console.log('onAdEvent', adEvent);
                switch (adEvent.type) {
                    case google.ima.AdEvent.Type.CLICK:
                        this.adManager.onAdClicked.dispatch();
                        break;
                    case google.ima.AdEvent.Type.LOADED:
                        this.adRequested = false;
                        var ad = adEvent.getAd();
                        // console.log('is ad linear?', ad.isLinear());
                        if (!ad.isLinear()) {
                            this.onContentResumeRequested();
                        }
                        break;
                    case google.ima.AdEvent.Type.STARTED:
                        this.adManager.onAdProgression.dispatch(PhaserAds.AdEvent.start);
                        break;
                    case google.ima.AdEvent.Type.FIRST_QUARTILE:
                        this.adManager.onAdProgression.dispatch(PhaserAds.AdEvent.firstQuartile);
                        break;
                    case google.ima.AdEvent.Type.MIDPOINT:
                        this.adManager.onAdProgression.dispatch(PhaserAds.AdEvent.midPoint);
                        break;
                    case google.ima.AdEvent.Type.THIRD_QUARTILE:
                        this.adManager.onAdProgression.dispatch(PhaserAds.AdEvent.thirdQuartile);
                        break;
                    case google.ima.AdEvent.Type.COMPLETE:
                        this.adManager.onAdProgression.dispatch(PhaserAds.AdEvent.complete);
                        break;
                    case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                        this.onContentResumeRequested();
                        break;
                }
            };
            Ima3.prototype.onAdError = function (error) {
                // console.log('gneric ad error', error);
                if (null !== this.adsManager) {
                    this.adsManager.destroy();
                    this.adsManager = null;
                    if (null !== this.resizeListener) {
                        window.removeEventListener('resize', this.resizeListener);
                        this.resizeListener = null;
                    }
                }
                if (this.adRequested) {
                    this.adRequested = false;
                }
                //We silently ignore adLoader errors, it just means there is no ad available
                this.onContentResumeRequested(error);
            };
            /**
             * When the ad starts playing, and the game should be paused
             */
            Ima3.prototype.onContentPauseRequested = function () {
                // console.log('onContentPauseRequested', arguments);
                this.adManager.onContentPaused.dispatch();
            };
            /**
             * When the ad is finished and the game should be resumed
             */
            Ima3.prototype.onContentResumeRequested = function (arguments) {
                var _returnValue = true;
                if(arguments.type) _returnValue = arguments.type;
                // console.log('onContentResumeRequested', arguments);
                if (typeof google === 'undefined') {
                    this.adManager.unMuteAfterAd();
                    this.adManager.onContentResumed.dispatch(_returnValue);
                    return;
                }
                this.adContent.style.display = 'none';
                this.adManager.unMuteAfterAd();
                this.adManager.onContentResumed.dispatch(_returnValue);
            };
            Ima3.prototype.parseCustomParams = function (customParams) {
                if (undefined !== customParams) {
                    var customDataString = '';
                    for (var key in customParams) {
                        if (customParams.hasOwnProperty(key)) {
                            if (customDataString.length > 0) {
                                customDataString += '' +
                                    '&';
                            }
                            var param = (Array.isArray(customParams[key])) ? customParams[key].join(',') : customParams[key];
                            customDataString += key + '=' + param;
                        }
                    }
                    return '&cust_params=' + encodeURIComponent(customDataString);
                }
                return '';
            };
            /**
             * Checks id the ads are enabled
             * @returns {boolean}
             */
            Ima3.prototype.areAdsEnabled = function () {
                var test = document.createElement('div');
                test.innerHTML = '&nbsp;';
                test.className = 'adsbox';
                document.body.appendChild(test);
                var adsEnabled;
                var isEnabled = function () {
                    var enabled = true;
                    if (test.offsetHeight === 0) {
                        enabled = false;
                    }
                    test.parentNode.removeChild(test);
                    return enabled;
                };
                window.setTimeout(adsEnabled = isEnabled(), 100);
                return adsEnabled;
            };
            return Ima3;
        }());
        AdProvider.Ima3 = Ima3;
    })(AdProvider = PhaserAds.AdProvider || (PhaserAds.AdProvider = {}));
})(PhaserAds || (PhaserAds = {}));
