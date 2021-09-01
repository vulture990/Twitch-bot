require('dotenv').config();
const tmi = require('tmi.js');
const { username } = require('tmi.js/lib/utils');

const client = new tmi.Client({
	options: { debug: true },
	connection: {
		reconnect: true,
	},
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	},
	channels: [ process.env.TWITCH_CHANNEL ]
});

const entires={};
client.connect();
client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;
	const isAdmin=tags.username ===process.env.TWITCH_BOT_USERNAME;

	if(message.toLowerCase() === '!entries') {
		// "@alca, heya!"
		client.say(channel, `@${tags.username}, You've Entred!`);
		entires[tags.username]=username;
		// store the users who enter the command for entries

	}else if(message==='!pickWinner' && isAdmin){
		const entriesArray=Object.keys(entires);
		const winner=entriesArray[Math.floor(Math.random()*entriesArray.length)];
		client.say(channel, `Yo Congrats , @${winner}, you are the winner!`);
		// and this is just picking a random user from the array of users who enter the command
	}
});