const tmi = require('tmi.js');
require('dotenv').config();
const vars = require("./variables");
const requests = require("./requests");
const client = new tmi.client(vars.tmi);
const mongo = require("./db/database");
mongo.connect(err => {
	if (err) {
	  throw err;
	} else {
	  console.log("Successfully connected to Database");
	}
  });
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

// const client = new tmi.Client({
// 	options: { debug: true },
// 	connection: {
// 		reconnect: true,
// 	},
// 	identity: {
// 		username: process.env.TWITCH_BOT_USERNAME,
// 		password: process.env.TWITCH_OAUTH_TOKEN
// 	},
// 	channels: [ process.env.TWITCH_CHANNEL ]
// });
const reputation ={};
const reputationRegex = /(\+\+|--)/g;
const entires={};
const winningUsers={};
client.connect();
client.on("message", onMessage);
client.on("connected", onConnect);


function onConnect(add, port) {
	console.log(`connected to ${add}:${port}`);
  }
  

const COMMAND_INTERVAL = 900000; // -interval of 15 minute 
setInterval(twitchPrimeReminder, COMMAND_INTERVAL);
setInterval(stretchReminder, COMMAND_INTERVAL * 4);
setInterval(waterReminder, COMMAND_INTERVAL * 2);
function onMessage(chan, userstate, message, self) {
	const channel = chan.substring(1);
	if (self) {
	  return;
	}
	const msg = message.trim();
	if(reputationRegex.test('!'+ message)) {
		reputationPoints(message,userstate,chan);
	}
	if (msg === "!title") {
	  titleHandler(channel, userstate);
	} else if (msg === "!followage") {
	  followageHandler(channel, userstate);
	} else if (msg === "!uptime") {
	  uptimeHandler(channel, userstate);
	} else if (msg === "!clear") {
	  clearChatHandler(channel);
	} else if (msg === "!help") {
	  helpHandler(channel, userstate);
	} else if (msg === "!prime") {
	  twitchPrimeReminder(channel);
	} else if (msg === "!clip") {
	  twitchClipHandler(channel, userstate);
	} else if (msg === "!addchannel") {
	  addChannelHandler(channel, userstate);
	} else if (msg === "!removechannel") {
	  removeChannelHandler(channel, userstate);
	} else if (msg === "!listall") {
	  listAllCommandsHandler(channel, userstate);
	} else if (msg.startsWith("!adduser")) {
	  addUserHandler(channel, userstate, msg);
	} else if (msg.startsWith("!removeuser")) {
	  removeUserHandler(channel, userstate, msg);
	} 
	 else if (msg.startsWith("!cmd")) {
	  commandHandler(channel, userstate, msg);
	}else if(msg=='!spits' || '!entries' || '!pickWinner' ){
		spitRandom(message,userstate,chan);
	}
	  else if (msg.startsWith("!")) {
	  customCommandHandler(channel, msg);
	}
  }

  
function twitchPrimeReminder(channel) {
	const msg = `Did you know you get a free subscription to your favourite streamer every 30 days with your Amazon Prime membership? Learn more here https://twitch.tv/prime`;
	client
	  .say(channel, msg)
	  .then(channel => console.log(channel))
	  .catch(e => console.log(e));
  }
  
  async function waterReminder(channel) {
	const obj = await requests.waterHandler(channel);
	if (obj !== -1) {
	  const waterML = obj.hours * 250 + obj.minutes * 4; // water amount in mL
	  const waterOZ = (waterML / 29.574).toFixed(2);
	  const msg = `@${channel}, you have been streaming for ${obj.hours} hours and ${obj.minutes} minutes. By now you should have consumed ${waterML} mL / ${waterOZ} oz. of water to for optimal hydration.`;
	  client
		.say(channel, msg)
		.then(channel => console.log(channel))
		.catch(e => console.log(e));
	}
  }
  
  function stretchReminder(channel) {
	const msg = `A reminder to everyone to get up and stretch every once in a while! Take breaks to destress and untilt!`;
	client
	  .say(channel, msg)
	  .then(channel => console.log(channel))
	  .catch(e => console.log(e));
  }
  
  /* TWITCH API REQUESTS */
  
  //STREAM TITLE COMMAND !title
  
  async function titleHandler(channel, userstate) {
	const msg = await requests.getTitle(channel, userstate);
	client
	  .say(channel, msg)
	  .then(channel => console.log(channel))
	  .catch(e => console.log(e));
  }
  
  //FOLLOWAGE COMMAND !followage
  async function followageHandler(channel, userstate) {
	if (channel === userstate.username) {
	  const msg = "Can't check followage of yourself!";
	  client
		.say(channel, msg)
		.then(channel => console.log(channel))
		.catch(e => console.log(e));
	} else {
	  const msg = await requests.getFollowage(channel, userstate);
	  client
		.say(channel, msg)
		.then(channel => console.log(channel))
		.catch(e => console.log(e));
	}
  }
  
  //UPTIME COMMAND !uptime
  async function uptimeHandler(channel, userstate) {
	const msg = await requests.getUptime(channel, userstate);
	client
	  .say(channel, msg)
	  .then(channel => console.log(channel))
	  .catch(e => console.log(e));
  }
  
  //CLEAR CHAT COMMAND !clear
  
  function clearChatHandler(channel) {
	client
	  .clear(channel)
	  .then(() => {
		console.log("CHAT CLEARED");
	  })
	  .catch(err => {
		console.log(err);
	  });
  }
  
  async function twitchClipHandler(channel, userstate) {
	const url = await requests.twitchClipHandler(channel);
	if (url == -2) {
	  const msg = `@${userstate.username}, the clip failed to generate. (401)`;
	  client
		.say(channel, msg)
		.then(channel => console.log(channel))
		.catch(e => console.log(e));
	} else {
	  const msg = `@${userstate.username}, the clip was successfully generated: ${url}`;
	  client
		.say(channel, msg)
		.then(channel => console.log(channel))
		.catch(e => console.log(e));
	}
  }
  
  //CHAT HELP COMMAND !help
  
  function helpHandler(channel, userstate) {
	const msg = `@${userstate.username}, command documentation can be found here: https://github.com/vulture990`;
	client
	  .say(channel, msg)
	  .then(channel => console.log(channel))
	  .catch(e => console.log(e));
  }
  
  
  // commandHandler("asdf", "123", "!cmd add test this is a test message");
  
  async function commandHandler(channel, userstate, msg) {
	//CHECK IF CHANNEL EXISTS
	if (!mongo.getChannel(channel)) {
	  return;
	} else {
	  //allowed user
	  const user = userstate.username;
	  const chan = await mongo.getChannel(channel);
	  if (!chan.allowedUsers.includes(user)) {
		return;
	  } else {
		const msgSplit = msg.split(" ");
		const operation = msgSplit[1];
		if (operation === "add") {
		  const id = "!" + msgSplit[2];
		  var message = msgSplit.slice(3).join(" ");
		  const msg = await mongo.addCommand(channel, id, message);
		  client
			.say(channel, msg)
			.then(channel => console.log(channel))
			.catch(e => console.log(e));
		}
		//!cmd edit test this is the new message
		else if (operation === "edit") {
		  //edit the command
		  const id = "!" + msgSplit[2];
		  const message = msgSplit.slice(3).join(" ");
		  const msg = await mongo.editCommand(channel, id, message);
		  client
			.say(channel, msg)
			.then(channel => console.log(channel))
			.catch(e => console.log(e));
		}
		//!cmd remove test
		else if (operation === "remove") {
		  //remove the command
		  const id = "!" + msgSplit[2];
		  const msg = await mongo.removeCommand(channel, id);
		  client
			.say(channel, msg)
			.then(channel => console.log(channel))
			.catch(e => console.log(e));
		}
	  }
	}
  }
  
  async function customCommandHandler(channel, initmsg) {
	if (!mongo.getChannel(channel)) {
	  return;
	} else {
	  const chan = await mongo.getChannel(channel);
	  const commands = chan.commands;
	  if (initmsg in commands) {
		const msg = commands[initmsg];
		client
		  .say(channel, msg)
		  .then(channel => console.log(channel))
		  .catch(e => console.log(e));
	  }
	}
  }
  
  /* DATABSE FUNCTIONS */
  
  async function addChannelHandler(channel, userstate) {
	if (channel !== "vulturebot1") {
	  return;
	} else {
	  const msg = await mongo.addChannel(userstate.username);
	  client
		.say(channel, msg)
		.then(channel => console.log(channel))
		.catch(e => console.log(e));
	}
  }
  
  async function removeChannelHandler(channel, userstate) {
	if (channel !== "vulturebot1") {
	  return;
	} else {
	  const msg = await mongo.removeChannel(userstate.username);
	  client
		.say(channel, msg)
		.then(channel => console.log(channel))
		.catch(e => console.log(e));
	}
  }
  
  //TODO
  async function addUserHandler(channel, userstate, msg) {
	const user = msg.split(" ")[1];
	if (!mongo.getChannel(channel)) {
	  return;
	} else {
	  const chan = await mongo.getChannel(channel);
	  if (!chan.allowedUsers.includes(userstate.username)) {
		return;
	  }
	  const msg = await mongo.addAllowedUser(channel, user);
	  client
		.say(channel, msg)
		.then(channel => console.log(channel))
		.catch(e => console.log(e));
	}
  }
  
  async function removeUserHandler(channel, userstate, msg) {
	const user = msg.split(" ")[1];
	if (!mongo.getChannel(channel)) {
	  return;
	} else {
	  const chan = await mongo.getChannel(channel);
	  if (!chan.allowedUsers.includes(userstate.username)) {
		return;
	  }
	  const msg = await mongo.removeAllowedUser(channel, user);
	  client
		.say(channel, msg)
		.then(channel => console.log(channel))
		.catch(e => console.log(e));
	}
  }
  
  async function listAllCommandsHandler(channel, userstate) {
	const res = await mongo.getCommands(channel);
	const msg = `@${userstate.username}, commands: ${res}`;
  
	client
	  .say(channel, msg)
	  .then(channel => console.log(channel))
	  .catch(e => console.log(e));
  }

  function reputationPoints(message,tags,channel){
	
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
  function spitRandom(message,tags,channel){
	if(message.toLowerCase().includes('!spits ')){
		var retrievedLength=message.toLowerCase().replace('!spits ','');
		botSpitsOutRandomString(channel,Number(retrievedLength));
	}
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
  }
  
// client.on('message', (channel, tags, message, self) => {

	// Ignore echoed messages.
	// if(self || !message.startsWith('!') ) return;
	
	// setInterval(function botSpitsOutRandomString(length) {
	// 	latestRandomeString = makeRandomString(length);
	// 	client.say(channel,latestRandomString);
	// },timer);
	


//the bot has to write a random code to the channel every n-minutes
//the first viewer to type the random code wins the prize

