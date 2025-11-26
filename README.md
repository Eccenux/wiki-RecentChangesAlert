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

A small warning — there are two sounds: one short and one long. Usually, you'll hear the short sound, but after a longer period, you'll hear a longer sound designed to draw your attention... and it works pretty well in my tests. Remeber you can always mute the tab.

- Short sound: https://upload.wikimedia.org/wikipedia/commons/6/61/Beep_400ms.ogg
- Long sound: https://upload.wikimedia.org/wikipedia/commons/1/14/Same.ogg

The sounds config in code:
https://github.com/Eccenux/wiki-RecentChangesAlert/blob/34e9ad5d5428ad1c037a2c28dead82f796ab1389/RecentChangesAlert.js#L36

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
