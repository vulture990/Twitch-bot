// try {

// } catch (err) {
//   console.log(err);
// }
module.exports = {
    tmi: {
        options: {
            debug: true
        },
        connection: {
            reconnect: true
        },
        identity: {
            username: 'vulturebot1', //BOT USERNAME
            password: "iolyck7x2n4x9ni7bbgf1svjs8858e" //OATH TOKEN RETRIEVED FROM https://twitchapps.com/tmi/ 
        },
        channels: ['vulturebot1'], // LIST OF CHANNELS TO JOIN ON BOT START ["#channel1", "#channel2", etc]
    },
    clientID: "gp762nuuoqcoxypju8c569th9wz7q5", // CLIENT ID FOR API CALLS FROM https://dev.twitch.tv/
    oauthToken: "iolyck7x2n4x9ni7bbgf1svjs8858e", //OAUTH TOKEN FOR API CALLS FROM https://dev.twitch.tv/ from OAuth 2.0 Authorization Code Flow
    dbLink: "mongodb+srv://vulture:vulture-066842@cluster0.jwl1i.mongodb.net/Project 0?retryWrites=true&w=majority"
};
