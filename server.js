require('dotenv').config();

const commands = {
	website: {
	  response: 'https://salbi.me'
	},
	upvote: {
	  response: (argument) => `Successfully upvoted ${argument}`
	}
  }
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const tmi = require('tmi.js');
const client = new tmi.Client({
	connection: { reconnect: true },
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	},
	channels: [ process.env.TWITCH_CHANNEL ]
});

client.connect();

client.on('message',async (channel, context, message) => {
	const notBot = context.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME.toLowerCase();
	if(!notBot) return;
	const [raw, command, argument] = message.match(regexpCommand);

	const { response } = commands[command] || {};
  
	const responseMessage = response;
  
	if ( typeof responseMessage === 'function' ) {
	  responseMessage = response(argument);
	}
  
	if ( responseMessage ) {
		// the only thing left is a string so we should be fine
	  console.log(`Responding to command !${command}`);
	  client.say(channel, responseMessage);
	}

	
});
			