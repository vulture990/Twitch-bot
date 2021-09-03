# Twitch-bot
## Intro:

This custom bot was a deep dive into creating Twitch chatbot, and is not intended for any serious  use as a livestreaming tool. The Big players in Twitch chatbots are [Nightbot](https://beta.nightbot.tv/) and [StreamElements](https://streamelements.com/) that are intended for a serious use.


## Commands

Command              | Description
---------------------|------------
`!spits`+ lenght     | It's spits out some random Strings depending on the lenght that you wanted .
`!entries`           | Once you Copy pasted the random String you'll be entred for a giveaway!
`!pickWinner`        | This Command is for the streamer to pick a random winner from the viewers in Twitch Chat That Will win  
`!followage`         | Retrieve how long the user has been following the channel.
`!uptime`            | Displays how long the stream has been live for, or an offline messageif the stream is offline.
`!title`             | Retrieve the current stream title.
`!clear`             | Clears all the messages in the chat.
`!prime`             | Displays a Twitch Prime advertisement message.
`!listall`           | Returns a space-separated string of all of the custom commands that have been created. eg. `!command1 !command2 !command3`
 `help`              | Sends you the Link to the documentation.



## Messages On A Scheduled Interval

Some messages will be repeatedly sent to chat in a scheduled manner, with the user able to customize the interval time between each message.

Currently, the only messages that will loop repeatedly are:

`prime` - Sends a Twitch Prime advertisement message

`water` - Sends a reminder to the streamer to drink water, calculating how much water they should drink to maintain optimal hydration by using stream uptime data.

`stretch`-Sends a reminder for the streamer to Stretch every 20 minutes or 40 minutes. 



## Custom Commands

Custom commands can be set by using the following schema:

`!cmd OPERATION ARGS`
still they are not finished

also working on Music Integration with Spotify API

