require('dotenv').config();
const tmi = require('tmi.js');
const { username, toNumber } = require('tmi.js/lib/utils');
const latestRandomString='';
function makeRandomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
var timer=60*1000*5;//5 minutes


function botSpitsOutRandomString(length,channel) {
		latestRandomeString = makeRandomString(length);
		client.say(channel,latestRandomeString);
}

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
	
	if(message.toLowerCase() ==='!spits'){
		botSpitsOutRandomString(5,channel);
	}
	// setInterval(function botSpitsOutRandomString(length) {
	// 	latestRandomeString = makeRandomString(length);
	// 	client.say(channel,latestRandomString);
	// },timer);
	const isAdmin=tags.username ===process.env.TWITCH_BOT_USERNAME;
	if(message ==='!'+latestRandomString ){
		client.say(channel, `Yo Congrats , @${tags.username}, you Got it,you Won!`);
	}

	if(message.toLowerCase() === '!entries') {
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

//the bot has to write a random code to the channel every n-minutes
//the first viewer to type the random code wins the prize
