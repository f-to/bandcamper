
const STATUS_PLAYING = 1;
const STATUS_STOPED = 0;
const STATUS_PAUSED = -1;

const MODE_NONE = 0;

const MODE_RANDOM = 1;
const MODE_ORDERED = 2;
const MODE_REPEAT_NONE = 4;
const MODE_REPEAT_ONE = 8;
const MODE_REPEAT_ALL = 16;

BcJs = {

	timers : {},
	readyToPlay : false,
	currentId : 0,
	playingStatut : STATUS_STOPED,
	currentPlaylist : [],
	currentPlayingMode : '',

	StartIntervalTimer : function(fct, delay) {
		if(BcJs.timers[fct.name]) {
			clearInterval(BcJs.timers[fct.name]);
		}
		BcJs.timers[fct.name] = setTimeout(fct, delay);
	},

	ClearIntervalTimer : function(fct) {
		if(BcJs.timers[fct.name]) {
			clearInterval(BcJs.timers[fct.name]);
			delete BcJs.timers[fct.name];
		}
	},

	PreloadPage : function() {
		BcJs.ClearIntervalTimer(BcJs.ScrollAndWait);
		BcJs.StartIntervalTimer(BcJs.ScrollAndWait, 2000);
	},

	PlayPause : function(){
		var oldStatus = BcJs.playingStatut;
		BcJs.PlayIt(BcJs.currentId);
		BcJs.playingStatut = -oldStatus ;
	},

	Stop : function() {
		BcJs.PlayIt(BcJs.currentId);
		BcJs.playingStatut = STATUS_STOPED;
		for(var idx=0; idx < BcJs.timers.length; idx++) {
			//BcJs.ClearIntervalTimer(BcJs.timers[idx]);
			console.log(BcJs.timers[idx]);
		}

		$('li.collection-item-container[data-itemid='+BcJs.currentId+'] span.item_link_play_bkgd').click();
	},

	PlayNext : function() {
		$('li.collection-item-container.playing').removeClass('playing');
	},

	FocusOnItem : function(itemId) {
		var elemRect = $('li.collection-item-container[data-itemid='+itemId+'] a').get(0).getBoundingClientRect(),
		bodyRect = document.body.getBoundingClientRect(),
		offsetX   = elemRect.left - bodyRect.left;
		offsetY   = elemRect.top - bodyRect.top;
		window.scrollTo(offsetX-10,offsetY-120)
	},
	PlayIt : function(itemId) {
		console.log('BcJs.PlayIt('+itemId+')');$('li.collection-item-container[data-itemid='+itemId+'] span.item_link_play_bkgd').click();
		BcJs.FocusOnItem(itemId);
		BcJs.currentId = itemId;
		BcJs.playingStatut = STATUS_PLAYING;
		console.log(BcJs.currentPlaylist.length + ' items in Playlist...');
	},

	PlayNextRandomAndWait : function() {
		BcJs.ClearIntervalTimer(BcJs.PlayNextRandomAndWait);
		if(BcJs.currentPlaylist.length > 0) {
			BcJs.currentPlayingMode = MODE_RANDOM;
			if($('li.collection-item-container.playing').length == 0 && BcJs.playingStatut > 0) {
				var nextId = BcJs.currentPlaylist.splice(Math.floor((Math.random() * BcJs.currentPlaylist.length)), 1).shift();
				nextId = nextId.substr(1, nextId.length -1);
				BcJs.PlayIt(nextId);
			}
			if(BcJs.playingStatut != STATUS_STOPED) {
				BcJs.StartIntervalTimer(BcJs.PlayNextRandomAndWait, 2000);
			}
		}
		else {
			BcJs.currentPlayingMode = '';
			console.log('Nothing left to play ! :(');
		}
	},

	PlayNextAndWait : function() {
		BcJs.ClearIntervalTimer(BcJs.PlayNextAndWait);
		if(BcJs.currentPlaylist.length > 0) {
			BcJs.currentPlayingMode = MODE_ORDERED;
			if($('li.collection-item-container.playing').length == 0 && BcJs.playingStatut > 0) {
				var nextId = BcJs.currentPlaylist.shift();
				nextId = nextId.substr(1, nextId.length -1);
				BcJs.PlayIt(nextId);
			}
			if(BcJs.playingStatut != STATUS_STOPED) {
				BcJs.StartIntervalTimer(BcJs.PlayNextAndWait, 2000);
			}
		}
		else {
			BcJs.currentPlayingMode = '';
			console.log('Nothing left to play ! :(');
		}
	},

	ScrollAndWait : function() {
		BcJs.ClearIntervalTimer(BcJs.ScrollAndWait);
		$('button.show-more').click();
		if(window.collectionTabs.currentTab.grids[0].sequence.length < window.collectionTabs.currentTab.grids[0].itemCount) {
			window.scrollTo(10e8,10e8);
			BcJs.StartIntervalTimer(BcJs.ScrollAndWait, 2000);
		} else {
			console.log('Ready to play !!!');
			BcJs.ClearIntervalTimer(BcJs.ScrollAndWait);
			BcJs.currentPlaylist = collectionTabs.currentTab.grids[0].sequence;
			BcJs.readyToPlay = true;
		}
	},
};
console.log('Extention loaded !!');

/***************
***************/

BcJs.PreloadPage();

var _startTimer = setInterval(function() {
	if(BcJs.readyToPlay == true) {
		BcJs.playingStatut = STATUS_PLAYING;
		BcJs.PlayNextRandomAndWait();
		clearInterval(_startTimer);
		_startTimer = null;
		console.log('....Hell Yeah !');
	} else {
		console.log('Still waitin....');
	}
}, 1000);
