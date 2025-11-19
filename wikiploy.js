/**
 * Dev/staging deploy.
 */
import {DeployConfig, Wikiploy, setupSummary } from 'wikiploy';

import * as botpass from './bot.config.mjs';
const ployBot = new Wikiploy(botpass);

// default site
ployBot.site = "meta.wikimedia.org"; 

(async () => {
	// custom summary from a prompt
	await setupSummary(ployBot);

	// deploy
	const configs = [];
	configs.push(new DeployConfig({
		src: 'RecentChangesAlert.js',
		dst: '~/RecentChangesAlert.js',
	}));
	await ployBot.deploy(configs);
})().catch(err => {
	console.error(err);
	process.exit(1);
});