require('dotenv').config();

const tmi = require('tmi.js');
const { username } = require('tmi.js/lib/utils');
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


var latestRandomString ;
function botSpitsOutRandomString(channel,len) {
	latestRandomString=makeRandomString(len);
	client.say(channel,latestRandomString);
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
const reputation ={};
const reputationRegex = /(\+\+|--)/g;

const entires={};
const winningUsers={};
client.connect();
client.on('message', (channel, tags, message, self) => {
	if(reputationRegex.test('!'+ message)) {
		const [user, operator] = message.split(reputationRegex);
	
		if(!(user in reputation)) {
		  reputation[user] = 0;
		}
	
		if(operator === '++') {
		  reputation[user]++;
		} else {
		  reputation[user]--;
		}
	
		client.say(channel, `@${tags.username}, ${user} now has a reputation of ${reputation[user]}`);
		return;
	  }
	// Ignore echoed messages.
	if(self || !message.startsWith('!') ) return;
	if(message.toLowerCase().includes('!spits ')){
		var retrievedLength=message.toLowerCase().replace('!spits ','');
		botSpitsOutRandomString(channel,Number(retrievedLength));
	}
	// setInterval(function botSpitsOutRandomString(length) {
	// 	latestRandomeString = makeRandomString(length);
	// 	client.say(channel,latestRandomString);
	// },timer);
	const isAdmin=tags.username ===process.env.TWITCH_BOT_USERNAME;
	if(message ===latestRandomString ){
		winningUsers[tags.username]=username;
		client.say(channel, `Yo Congrats , @${tags.username}, you Got it,you type !entries to be Entred !`);
		
	}
	const winnersArray=Object.keys(winningUsers);
	console.log('winner:',winnersArray);
	//only those who got it will be able to !entries
	if(message.toLowerCase() === '!entries' && winnersArray.includes(tags.username)) {
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

