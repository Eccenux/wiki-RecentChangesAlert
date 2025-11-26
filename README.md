RCA: RecentChangesAlert
==========================

RC stands for the RecentChanges special page (Polish: OZ, *Ostatnie Zmiany*). The script starts when you enable live updates on RC. A sound will play when new changes appear.

**Disabling sound:** In Firefox, just press CTRL+M (mute tab). This will temporarily disable sounds.

## Installation

```js
// RCA: [[meta:User:Nux/RecentChangesAlert.js]]
mw.loader.load("https://meta.wikipedia.org/w/index.php?title=User:Nux/RecentChangesAlert.js&action=raw&ctype=text/javascript");
```
## Sounds of RC

A small warning — there are two sounds: one short and one long. Usually, you'll hear the short sound, but after a longer period, you'll hear a longer sound designed to draw your attention... and it works pretty well in my tests. Remember you can always mute the tab.

### Default sounds of RC

- Short sound: https://upload.wikimedia.org/wikipedia/commons/6/61/Beep_400ms.ogg
- Long sound: https://upload.wikimedia.org/wikipedia/commons/1/14/Same.ogg

### Custom sounds of RC

To have custom sounds you do this (instead of standard installation):
```js
// RCA: [[meta:User:Nux/RecentChangesAlert.js]]
mw.loader.load("https://meta.wikipedia.org/w/index.php?title=User:Nux/RecentChangesAlert.js&action=raw&ctype=text/javascript");
mw.hook('userjs.RecentChangesAlert.loaded').add(function (rcAlert) {
	// Note! You must use `upload.wikimedia.org`, so a raw sound link
	rcAlert.setSounds({
		shortSoundUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/NEC_PC-9801VX_ITF_beep_sound.ogg',
		longSoundUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/75/En-uk-yo-ho-ho.oga',
	});
});
```

Some other sounds You might want to use:
- https://commons.wikimedia.org/wiki/File:Brush_Cuckoo_song_Nov2007.ogg
- https://commons.wikimedia.org/wiki/File:Didric_Cuckoo_(Chrysococcyx_caprius)_(022A-WA03044X0011-0003M0).ogg

Or search for something else:
- https://commons.wikimedia.org/w/index.php?search=cuckoo+-insource%3A%2Fpronunciation%2F&title=Special%3AMediaSearch&type=audio
- https://commons.wikimedia.org/w/index.php?search=beep+-insource%3A%2Fpronunciation%2F&title=Special%3AMediaSearch&type=audio


## DEV

Init:
```bash
npm i
```

Deploy:
```bash
npm run deploy
```

## External links
* [Wikiploy on npm](https://www.npmjs.com/package/wikiploy) – Wikiploy can be used to deploy from Git back to Wikipedia.
