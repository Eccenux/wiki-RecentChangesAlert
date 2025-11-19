RCA: RecentChangesAlert
==========================

RC stands for the RecentChanges special page (Polish: OZ, *Ostatnie Zmiany*). The script starts when you enable live updates on RC. A sound will play when new changes appear.

**Disabling sound:** In Firefox, just press CTRL+M (mute tab). This will temporarily disable sounds.

## Installation

```js
// RCA: [[meta:User:Nux/RecentChangesAlert.js]]
mw.loader.load("https://meta.wikipedia.org/w/index.php?title=User:Nux/RecentChangesAlert.js&action=raw&ctype=text/javascript");
```

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
