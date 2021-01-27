const Discord = require('discord.io');
const request = require('request');
const fs = require('fs');
const auth = require('./auth.json');
let prefix = "?";
/**
 * 
 * @param {Array} arr 
 * @param {any} item
 * @return {Number} res
 */
function findIndex(arr, item) {
	let res = 0;
	for(let i; i<arr.length; i++) {
		if(typeof arr[i][item] !== "undefined") {
			res = i;
		}
	}
	return res;
}
/**
 * 
 * @param {Array} arr 
 * @param {any} item
 * @return {Number} res
 */
function findBool(arr, item) {
	let res = false;
	for(let i; i<arr.length; i++) {
		if(typeof arr[i][item] !== "undefined") {
			res = true;
		}
		console.log(arr[i][item]);
	}
	return res;
}
// Initialize Discord Bot
var bot = new Discord.Client({
	token: auth.token,
	autorun: true
});
bot.on('ready', function(event) {
	console.log('Logged in as %s - %s\n', bot.username, bot.id);
});
bot.on('message', (user, userID, channelID, message, event) => {
	if(message.startsWith(prefix)) {
		let cmd = message.slice(prefix.length).split(" ");
		if(cmd[0] == "prefix" && cmd[1] == "set") {
			prefix = cmd[2];
			bot.sendMessage({
				to:channelID,
				message:`prefix changed to \`${prefix}\``
			})
		}
		else if(cmd[0] == "vote" && cmd[1] == "for") {
			// console.log(event.d.mentions[0].username);
			let vote = JSON.parse(fs.readFileSync('./votes/vote.json'));
			if(findBool(vote.votes, event.d.mentions[0].id)) {
				let index = findIndex(vote.votes, event.d.mentions[0].id);
				vote.votes[index][event.d.mentions[0].id].vote += 1;
			}
			else {
			let data = {}
			data[event.d.mentions[0].id] = {};
			data[event.d.mentions[0].id].name = event.d.mentions[0].username;
			if(typeof data[event.d.mentions[0].id].votes == "null") data[event.d.mentions[0].id].votes = data[event.d.mentions[0].id].votes=1
			else data[event.d.mentions[0].id].votes=+1
			vote.votes.push(data);
			}
			fs.writeFileSync('./votes/vote.json', JSON.stringify(vote, null, 2))
		}
		else if(cmd[0] == "see" && cmd[1] == "votes") {
			let vote = JSON.parse(fs.readFileSync('./votes/vote.json'));
			bot.sendMessage({
				to:channelID,
				message:JSON.stringify(vote, null, 2)
			});
		}
		else if(cmd[0] == "everyone") {
			bot.sendMessage({
				to:channelID,
				message: "@everyone"
			})
		}
	}
});

bot.on('disconnect', function(errMsg, code) {
	if(errMsg) {
			console.log(errMsg);
	}
	console.log(code);
	bot.disconnect();
});