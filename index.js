const Discord = require("discord.js");
const client = new Discord.Client();

client.once("ready", () => {
	console.log("Ready!");
  client.user.setActivity("/games");
});

client.login(process.env.BOT_TOKEN);

client.on("message", async message => {
	if (message.author.bot) {return};
	{
	var 	messageContent = message.content,
				args = messageContent.substr(prefix.length, messageContent.length).split(delimiter),
				messageChannel = message.channel.id,
				messageAuthor = message.author.id, authorId = messageAuthor, player = messageAuthor;

	// Anti-raid
	{
		// Get role
		let raidRole = message.guild.roles.find(role => role.name === antiRaidRole);

		if (raidRole != null) {
			if (message.mentions.users.size > maxMentions) {
				if (message.guild.me.hasPermission("MANAGE_ROLES")) {
					message.member.addRole(raidRole).catch(console.error);
					message.reply("You have tagged more than 3 users. To prevent raids, your chat permissions have been revoked. Contact an admin if you believe this is an error. Apologies to those pinged in the attempt.");	
				} else {
					message.channel.send("Error: Attempted to deal with raid attempt but I do not have role managing permissions.");
				};
			};
		};
	};
	

	// Responses
	if (!messageContent.startsWith(prefix)) {
		if (!isNaN(messageContent)) { // Number responses
			// NUMBER GUESS game
			if (games.numberguess.hasOwnProperty(messageChannel)) {
				var guess = messageContent;
				var number = games.numberguess[messageChannel];
				if (guess == number) {
					message.reply(`You got the number! The number was ${number}.`);
					delete games.numberguess[messageChannel];
				} else if (guess > number) {
					message.reply("Lower!");
				} else if (guess < number) {
					message.reply("Higher!");
				};
			};
		} else { // Word responses
			// UNSCRAMBLE game
			if (games.unscramble.servers.hasOwnProperty(messageChannel) && messageContent.toLowerCase().includes(games.unscramble.servers[messageChannel])) {
				message.reply(`You got the word! The word was **${games.unscramble.servers[messageChannel]}**.`);
				delete games.unscramble.servers[messageChannel];
			};
			if (games.unscramble.hosts.hasOwnProperty(player)) {
				var word = messageContent.toLowerCase();
				const server = games.unscramble.hosts[player], gameChannel = client.channels.get(server);
				if (games.unscramble.servers.hasOwnProperty[server]) {
					message.reply("A game of unscramble has already been started in that server!");
				} else {
					games.unscramble.servers[server] = word.toLowerCase();
					message.reply("The word you have chosen is " + word.emoticonvert());
					gameChannel.send(`Unscramble this: ${games.unscramble.servers[server].shuffle()}`);
				};
				delete games.unscramble.hosts[player];
			};
			// SCISSORS PAPER ROCK game
			if (games.scissorspaperrock.hasOwnProperty(player)) {
				var playerChoice = messageContent.toLowerCase();
				if (!rpsChoices.includes(playerChoice)) {message.reply("That's not one of the choices!"); return};

				const	opponent = games.scissorspaperrock[player]["opponent"],
							playerTag = games.scissorspaperrock[player]["tag"],
							opponentTag = games.scissorspaperrock[opponent]["tag"];

				games.scissorspaperrock[player]["choice"] = playerChoice;
				message.reply(`You have chosen **${playerChoice}**.`);
				opponentTag.send("Your opponent has made their choice.");

				if (!games.scissorspaperrock[opponent].hasOwnProperty("choice")) {message.reply("Awaiting your opponent's choice..."); return};

				const	opponentChoice = games.scissorspaperrock[opponent]["choice"],
							gameChannel = client.channels.get(games.scissorspaperrock[player]["channel"]);

				if (rpsBeats[playerChoice] === opponentChoice) { // Player wins
					gameChannel.send(`${playerTag}'s **${playerChoice}** beat ${opponentTag}'s **${opponentChoice}** in a game of scissors-paper-rock.`);
					delete games.scissorspaperrock[opponent];
					delete games.scissorspaperrock[player];
				} else if (rpsBeats[opponentChoice] === playerChoice) { // Opponent wins
					gameChannel.send(`${opponentTag}'s **${opponentChoice}** beat ${playerTag}'s **${playerChoice}** in a game of scissors-paper-rock.`);
					delete games.scissorspaperrock[opponent];
					delete games.scissorspaperrock[player];
				} else { // Tie
					gameChannel.send(`${opponentTag} and ${playerTag} both chose **${playerChoice}** in a game of scissors-paper-rock, resulting in a tie.`)
					delete games.scissorspaperrock[opponent];
					delete games.scissorspaperrock[player];
				};

				message.reply("Check the text-channel the game was started in.");
				opponentTag.send("Check the text-channel the game was started in.");
			};
		};
	};


	// Commands
	if (messageContent.startsWith(prefix) && args[0]) {
		messageContent = messageContent.substr(args[0].length + 2, messageContent.length);
		console.log(message.author.tag + ": " + args + " (" + messageContent + ")");

		switch (args[0].toLowerCase()) {
			case "unscramble": case "unscram": case "unscr":
				var gameRunning = games.unscramble.servers.hasOwnProperty(messageChannel);
				if (!gameRunning) {
					if (args[1] && args[1] != "dm") {message.reply(reusedMessages.notplaying); return};
					if (args[1] && args[1] === "dm") {
						if (message.channel.type === "dm") {message.reply(reusedMessages.cantDM); return};
						games.unscramble.hosts[authorId] = messageChannel;

						message.reply("DM me the word.");
						message.author.send(`You are preparing a game of unscramble in **${message.channel.name}**. What's the word?`);
					} else {
						games.unscramble.servers[messageChannel] = words[Math.round(Math.random() * words.length)];
						message.channel.send(`Unscramble this: ${games.unscramble.servers[messageChannel].shuffle()}`);
					};
				} else {
					if (args[1] && args[1].toLowerCase() === "hint") {
						message.channel.send(`Rescrambled: ${games.unscramble.servers[messageChannel].shuffle()}`);
					} else if (args[1]) {
						message.reply(reusedMessages.invalidcommand);
					} else {
						message.reply(reusedMessages.alreadyplaying);
					};
				};
				break;

			case "numberguess": case "numg": case "numguess": case "guess":
				var gameRunning = games.numberguess.hasOwnProperty(messageChannel);
				if (!gameRunning) {
					if (!isNaN(args[1])) {
						var number = args[1];
					} else if (args[1] && isNaN(args[1])) {
						message.reply(reusedMessages.invalidcommand);
						return;
					} else {
						var number = 10;
					};
					games.numberguess[messageChannel] = Math.floor((Math.random() * number) + 1);
					message.channel.send(`What number from 1-${number} am I thinking of?`);
				} else {
					if (args[1]) {
						message.reply(reusedMessages.invalidcommand);
					} else {
						message.reply(reusedMessages.alreadyplaying);
					};
				};
				break;

			case "8ball":
				if (!args[1]) {message.reply("Ask something!"); return};
				message.reply(responses[Math.floor(Math.random() * responses.length)]);
				break;

			case "illiterate": case "ilr":
				if (!args[1]) {message.reply("Say something!"); return;};
				var toFlip = 1;
				message.channel.send(messageContent.illiterate(toFlip));
				break;
			case "illiterateflip": case "ilrf":
				if (!args[1]) {message.reply("Say something!"); return;};
				var toFlip = 0;
				message.channel.send(messageContent.illiterate(toFlip));
				break;

			case "separate": case "friendzone": case "sep":
				if (!args[1]) {message.reply("Say something!"); return;};
				var repeater = 1;
				if (args[1].toLowerCase().startsWith("r") && !isNaN(args[1].substr(1, args[1].length))) {
					messageContent = messageContent.substr(args[1].length + 1, messageContent.length);
					repeater = args[1].substr(1, args[1].length);
				};
				// Taken from https://stackoverflow.com/a/7437419
				message.channel.send(messageContent.split("").join(" ".repeat(repeater)));
				break;

			case "lowercase": case "lc":
				if (!args[1]) {message.reply("Say something!"); return;};
				message.channel.send(messageContent.toLowerCase());
				break;
			case "uppercase": case "uc":
				if (!args[1]) {message.reply("Say something!"); return;};
				message.channel.send(messageContent.toUpperCase());
				break;

			case "reverse": case "rev":
				// Taken from https://stackoverflow.com/a/959004
				if (!args[1]) {message.reply("Say something!"); return;};
				message.channel.send(messageContent.split("").reverse().join(""));
				break;

			case "emoticonvert": case "emrt":
				if (!args[1]) {message.reply("Say something!"); return;};
				messageContent = messageContent.emoticonvert();
				if (messageContent.length > 2000) {
					message.reply(`The output message would be too long. Output message length: ${messageContent.length}`);
				} else {
					message.channel.send(messageContent);
					message.channel.send("```" + messageContent + "```");
				};
				break;

			case "random": case "dice": case "roll":
				if (args[1] && !isNaN(args[1])) {
					message.reply(Math.floor(Math.random() * Math.pow(10, args[1])));
				} else {
					message.reply(Math.floor(Math.random() * 6));
				};
				break;

			case "count":
				if (!args[1]) {message.reply("Say something!"); return};
				message.reply(`Your message contained **${messageContent.split(" ").length}** words and **${messageContent.length}** characters. (**${messageContent.split(" ").join("").length}** characters, excludine spaces.)`);
				break;

			case "log": case "gamelog": case "loggame":
				if (message.author.id != tempus) {return};
				console.log(games);
				break;

			case "setactivity": case "setact":
				if (message.author.id != tempus) {return};
				client.user.setActivity(messageContent);
				console.log(`Set activity to ${messageContent}`);
				break;

			case "rockpaperscissors": case "scissorspaperrock": case "rps": case "spr": case "handgame":
				if (games.scissorspaperrock.hasOwnProperty(messageAuthor)) {message.reply(`You're already in a game of scissors-paper-rock with ${games.scissorspaperrock[games.scissorspaperrock[player]["opponent"]]["tag"]}!`); return};
				if (!message.mentions.users.size) {message.reply("No one was mentioned."); return};
				var tagged = message.mentions.users.first(), taggedId = tagged.id;
				console.log(authorId + " " + taggedId)
				if (authorId === taggedId) {message.reply("You can't challenge yourself!"); return};
				if (tagged.bot) {message.reply("You can't challenge bots!"); return};
				if (games.scissorspaperrock.hasOwnProperty(taggedId)) {message.reply(`${message.mentions.users.first()} is already in a game of scissors-paper-rock!`); return};

				games.scissorspaperrock[authorId] = new Object();
				games.scissorspaperrock[taggedId] = new Object();
				games.scissorspaperrock[authorId].opponent = taggedId;
				games.scissorspaperrock[taggedId].opponent = authorId;
				games.scissorspaperrock[authorId].channel = message.channel.id;
				games.scissorspaperrock[taggedId].channel = message.channel.id;
				games.scissorspaperrock[authorId].tag = message.author;
				games.scissorspaperrock[taggedId].tag = tagged;

				message.channel.send(`A game of scissors-paper-rock with ${games.scissorspaperrock[authorId].tag} and ${games.scissorspaperrock[taggedId].tag} has been started. Direct message me **scissors**, **paper** or **rock**.`);
				message.author.send(`You have started a game of scissors-paper-rock with ${games.scissorspaperrock[taggedId].tag} (${games.scissorspaperrock[taggedId].tag.username}). What do you choose? You can choose from **scissors**, **paper** and **rock**.`);
				message.mentions.users.first().send(`${games.scissorspaperrock[authorId].tag} (${games.scissorspaperrock[authorId].tag.username}) has started a game of scissors-paper-rock with you. What do you choose? You can choose from **scissors**, **paper** and **rock**.`);
				break;

			case "endgame":
				if (!args[1]) {message.reply(reusedMessages.noarguments); return};

				switch (args[1].toLowerCase()) {
					case "numberguess": case "guess":
						if (games.numberguess.hasOwnProperty(messageChannel)) {
							message.channel.send(`**Number guessing** game ended. The answer was **${games.numberguess[messageChannel]}**.`);
							delete games.numberguess[messageChannel];
						} else {
							message.reply("There's no game of that type running in this server!");
						};
						break;
					case "unscramble":
						if (games.unscramble.servers.hasOwnProperty(messageChannel)) {
							message.channel.send(`**UNSCRAMBLE** game ended. The word was **${games.unscramble.servers[messageChannel]}**.`);
							delete games.unscramble.servers[messageChannel];
						} else if (games.unscramble.hosts.hasOwnProperty(messageAuthor)) {
							message.reply("Your game of unscramble was cancelled.");
							delete games.unscramble.hosts[messageAuthor];
						} else {
							message.reply("There's no game of that type running in this server!");
						};
						break;
					case "rps": case "spr": case "rockpaperscissors": case "scissorspaperrock":
						if (!games.scissorspaperrock.hasOwnProperty(message.author.id)) {message.reply(reusedMessages.notinagame); return};
						var opponent = games.scissorspaperrock[player]["opponent"];
						message.channel.send(`${message.author} and ${games.scissorspaperrock[opponent]["tag"]}'s game of scissors-paper-rock has been cancelled.`);
						games.scissorspaperrock[opponent]["tag"].send(`Your game of scissors-paper-rock with ${message.author} has been cancelled.`);
						message.author.send(`Your game of scissors-paper-rock with ${games.scissorspaperrock[opponent]["tag"]} has been cancelled.`);
						delete games.scissorspaperrock[opponent];
						delete games.scissorspaperrock[player];
						break;
					case "hangman":
						if (!games.hangman.servers.hasOwnProperty(messageChannel)) {message.reply(reusedMessages.notplaying); return};
						if (games.hangman.servers[messageChannel].hasOwnProperty("word")) {
							message.channel.send(`The game of hangman has been cancelled. The word was ${games.hangman.servers[messageChannel].word.emoticonvert()}`);
						} else {
							message.channel.send("The game of hangman has been cancelled. No word was given by the host.");
						};
						delete games.hangman.servers[messageChannel];
						break;
					case "maths": case "algebra":
						message.reply(`Games of ${args[1].toLowerCase()} will end automatically.`);
						break;
					default:
						message.reply("That's not a game I have.")
				};
				break;

			case "avatar":
				if (message.mentions.users.size) {
					var tagged = message.mentions.users.first();
					if (tagged.avatarURL) {
						var url = tagged.avatarURL;
						message.channel.send(message.author, {files: [url.substr(0, url.length - 9)]});
					} else {
						message.reply("That user doesn't have an avatar!");
					};
				} else {
					if (message.author.avatarURL) {
						var url = message.author.avatarURL;
						message.channel.send(message.author, {files: [url.substr(0, url.length - 9)]});
					} else {
						message.reply("You don't have an avatar!");
					};
				};
				break;

			default:
				//message.reply(reusedMessages.invalidcommand);
				break;
		};
	};
	}
	// Commands
	if (message.content.startsWith(prefix)) {
		var args = message.content.substr(prefix.length, message.content.length).split(delimiter);

		switch (args[0].toLowerCase()) {

			case "ping":
				message.reply("Pong! :ping_pong:")
				break;

			case "debug":
				if (message.author.id != tempus) {message.reply("You don't have permission to use this command."); return};
				console.log(games);
				console.log(servers);
				break;

			case "games": case "help":
				message.channel.send(tempbotEmbed)
				break;

			case "hangman":
				// Error handling: Currently running game
				if (gameRunning()) {return};

				// Error handling: Don't allow DM games
				if (message.channel.type === "dm") {message.reply("This game can't be played in a direct message."); return};

				// Initialise game data
				servers[message.channel.id] = "hangman";
				games.hangman.servers[message.channel.id] = new Object();
				games.hangman.hosts[message.author.id] = message.channel.id;

				// Use all-or-nothing gamemode
				if (args.length >= 2 && args[1] === "risk") {
					games.hangman.servers[message.channel.id].risk = true;
				} else {
					games.hangman.servers[message.channel.id].risk = false;
				};

				// Schedule cancellation
				setTimeout(() => cancelHangmanHost(message.channel.id, message.author.id), 1000 * gametime.hangmanHost);
				
				// Send messages
				message.reply("DM me the word.");
				message.author.send(`You have started a game of hangman in the **#${message.channel.name}** text-channel in **${message.guild.name}**.\nWhat's the word?`);
				break;

			case "maths":
				// Error handling: Currently running game
				if (gameRunning()) {return};

				// Get difficulty
				if (args.length >= 2) {
					// If the subcommand is a number, greater than or equal to 1 and less than or equal to 5
					if (!isNaN(args[1]) && args[1] >= 1 && args[1] <= 5) {
						var difficulty = Number(args[1]);
					}
					// Otherwise
					else {
						message.reply("That's not a valid difficulty level. Choose a level from 1-5.");
						return;
					};
				} else {
					var difficulty = 1;
				};

				// Generate variables
				switch (difficulty) {
					case 1:
						var numA = Math.round(Math.random() * 13);
						var numB = Math.round(Math.random() * 13);
						break;
					case 2:
						var numA = Math.round(Math.random() * 145);
						var numB = Math.round(Math.random() * 13);
						break;
					case 3:
						var numA = Math.round(Math.random() * 145);
						var numB = Math.round(Math.random() * 145);
						break;
					case 4:
						var numA = Math.round(Math.random() * 1729);
						var numB = Math.round(Math.random() * 145);
						break;
					case 5:
						var numA = Math.round(Math.random() * 1729);
						var numB = Math.round(Math.random() * 1729);
						break;
					default:
						break;
				};
				var answer;
				var compose = ``;
				var emoji;

				// Choose question type from random
				var type = mathsTypes[Math.round(Math.random() * 3)];

				// Set out question
				switch (type) {
					case "+":
						answer = numA + numB;
						break;

					case "-":
						answer = numA - numB;
						break;

					case "x":
						answer = numA * numB;
						break;

					case "/":
						answer = Math.round(numA / numB);
						break;
				
					default:
						break;
				};

				// Initialise game data
				servers[message.channel.id] = "maths";

				// Add to/Subtract from the answer to make a close but wrong number
				Number.prototype.vary = function () {
					let sign = Math.round(Math.random());
					let range = Math.floor(Math.random() * (answer / 2));
					let newNum = (sign == 1) ? this + range : this - range;
					return newNum;
				};

				compose += `What is **${numA} ${type} ${numB}**?`;

				// Add note about rounding if the question type is division
				if (type === "/") {
					compose += ` (Round to the nearest integer)`;
				};

				// Create wrong multiple-choice answers // Inspired by https://stackoverflow.com/a/41147010
				var choices = [];
				var index = Math.floor(Math.random() * 4);
				for (let i = 0; i < 4; i++) {
					if (i == index) {
						choices.push(answer);
					} else {
						let genNum = answer.vary();
						while (choices.includes(genNum) || genNum == answer) {
							genNum++
						};
						choices.push(genNum);
					};
				};
				compose += `\n1️⃣**) ${choices[0]}  |  2️⃣) ${choices[1]}  |  3️⃣) ${choices[2]}  |  4️⃣) ${choices[3]}**`;

				switch (index) {
					case 0:
						emoji = "1️⃣";
						break;
					case 1:
						emoji = "2️⃣";
						break;
					case 2:
						emoji = "3️⃣";
						break;
					case 3:
						emoji = "4️⃣";
						break;
					default:
						break;
				};

				// Send message and add reactions for multiple-choice
				message.channel.send(compose)
				.then(async function (message) {

					await message.react("1️⃣");
					await message.react("2️⃣");
					await message.react("3️⃣");
					await message.react("4️⃣");

					const filter = (reaction, user) => {
						return reaction.emoji.name === emoji && user.id != tempbot && user.id != testbot;
					};

					const collector = message.createReactionCollector(filter, {time: 1000 * gametime.maths});

					/*collector.on("collect", (reaction, reactionCollector) => {
					});*/

					collector.on("end", collected => {

						// If no one correctly answered
						if (collected.size == 0) {
							message.channel.send(`:timer: No one got the answer in time. The correct answer was ${emoji}**) ${answer}**`);
						}
						// If otherwise
						else {
							let winners = collected.get(emoji).users;

							// Delete TempBot/TestBot key
							if (winners.has(tempbot)) {winners.delete(tempbot)};
							if (winners.has(testbot)) {winners.delete(testbot)};

							// Send congratulations message
							let compose2 = `:trophy: Congratulations to `;
							winners.forEach(function (key) {
								compose2 += `${key} `;
							});
							compose2 += `for getting the correct answer: ${emoji}**) ${answer}**`;
							message.channel.send(compose2);
						};

						// Delete game data
						delete servers[message.channel.id];
						
					});
				});
				break;

			case "algebra":
				// Error handling: Currently running game
				if (gameRunning()) {return};

				// Generate variables
				do {
					var numA = Math.round(Math.random() * 13);
				} while (numA == 0); // Can't be 0
				var numB = Math.round(Math.random() * 13);
				var answer = Math.round(Math.random() * 13);
				var posOrNeg = Math.round(Math.random());
				var numC = (posOrNeg == 1) ? numA * answer + numB : numA * answer - numB;
				var strSign = (posOrNeg == 1) ? "+" : "-";
				var compose = ``;
				var emoji;

				// Initialise game data
				servers[message.channel.id] = "algebra";

				// Add to/Subtract from the answer to make a close but wrong number
				Number.prototype.vary = function () {
					let sign = Math.round(Math.random());
					let range = Math.floor(Math.random() * (answer / 2));
					let newNum = (sign == 1) ? this + range : this - range;
					return newNum;
				};

				compose += `Solve for x: **${numA}x ${strSign} ${numB} = ${numC}**`;

				// Create wrong multiple-choice answers // Inspired by https://stackoverflow.com/a/41147010
				var choices = [];
				var index = Math.floor(Math.random() * 4);
				for (let i = 0; i < 4; i++) {
					if (i == index) {
						choices.push(answer);
					} else {
						let genNum = answer.vary();
						while (choices.includes(genNum) || genNum == answer) {
							genNum++
						};
						choices.push(genNum);
					};
				};
				compose += `\n1️⃣**) ${choices[0]}  |  2️⃣) ${choices[1]}  |  3️⃣) ${choices[2]}  |  4️⃣) ${choices[3]}**`;

				switch (index) {
					case 0:
						emoji = "1️⃣";
						break;
					case 1:
						emoji = "2️⃣";
						break;
					case 2:
						emoji = "3️⃣";
						break;
					case 3:
						emoji = "4️⃣";
						break;
					default:
						break;
				};

				// Send message and add reactions for multiple-choice
				message.channel.send(compose)
				.then(async function (message) {

					await message.react("1️⃣");
					await message.react("2️⃣");
					await message.react("3️⃣");
					await message.react("4️⃣");

					const filter = (reaction, user) => {
						return reaction.emoji.name === emoji && user.id != tempbot && user.id != testbot;
					};

					const collector = message.createReactionCollector(filter, {time: 1000 * gametime.algebra});

					collector.on("end", collected => {

						// If no one correctly answered
						if (collected.size == 0) {
							message.channel.send(`:timer: No one got the answer in time. The correct answer was ${emoji}**) ${answer}**`);
						}
						// If otherwise
						else {
							let winners = collected.get(emoji).users;

							// Delete TempBot/TestBot key
							if (winners.has(tempbot)) {winners.delete(tempbot)};
							if (winners.has(testbot)) {winners.delete(testbot)};

							// Send congratulations message
							let compose2 = `:trophy: Congratulations to `;
							winners.forEach(function (key) {
								compose2 += `${key} `;
							});
							compose2 += `for getting the correct answer: ${emoji}**) ${answer}**`;
							message.channel.send(compose2);
						};

						// Delete game data
						delete servers[message.channel.id];
						
					});
				});
				break;

			case "mute": {
				// If member has permission
				if (!message.member.roles.some(role => role.name === modRole)) {
					message.reply("You don't have permission! To use this command, you require the role: '" + modRole + "'.");
					return;
				};

				if (!message.mentions.users.size) {
					message.reply("You didn't tag anyone to mute!"); 
					return;
				};

				// Get mute role
				let role = message.guild.roles.find(role => role.name === mutedRole);
		
				if (role != null) {
					let mutee = message.mentions.members.first();
					if (mutee.roles.some(role => role.name === mutedRole)) {
						message.reply("This user is already muted!");
						return;
					};
					if (message.guild.me.hasPermission("MANAGE_ROLES")) {
						mutee.addRole(role).catch(console.error);
						message.reply("Successfully muted " + mutee.displayName);	
					} else {
						message.channel.send("Error: Attempted to mute user but I do not have role managing permissions.");
					};
				};
			} break;

			case "unmute": {
				// If member has permission
				if (!message.member.roles.some(role => role.name === modRole)) {
					message.reply("You don't have permission! To use this command, you require the role: '" + modRole + "'.");
					return;
				};

				if (!message.mentions.users.size) {
					message.reply("You didn't tag anyone to unmute!"); 
					return;
				};

				// Get mute role
				let role = message.guild.roles.find(role => role.name === mutedRole);
		
				if (role != null) {
					let mutee = message.mentions.members.first();
					if (!mutee.roles.some(role => role.name === mutedRole)) {
						message.reply("This user isn't muted!");
						return;
					};
					if (message.guild.me.hasPermission("MANAGE_ROLES")) {
						mutee.removeRole(role).catch(console.error);
						message.reply("Successfully unmuted " + mutee.displayName);	
					} else {
						message.channel.send("Error: Attempted to unmute user but I do not have role managing permissions.");
					};
				};
			} break;
		
			default:
				//message.reply("That's not a valid command.");
				break;
		};

		function gameRunning() {
			if (servers.hasOwnProperty(message.channel.id)) {
				let game = servers[message.channel.id];
				message.reply("There's a game of **" + game + "** playing in this chat already. Use **/endgame " + game + "** to stop it.");
				return true;
			} else {
				return false;
			};
		};

		return;
	}
	// Responses
	else {
		// Hangman: Host direct messaging the chosen word
		if (games.hangman.hosts.hasOwnProperty(message.author.id) && (message.channel.type === "dm")) {
			let word = message.content.toLowerCase();
			
			// Accept if the word contains only letters
			if (!lettersAll.test(word)) {
				message.reply("Words/Phrases can only contain letters and spaces.");
				return;
			};

			let server = games.hangman.hosts[message.author.id];

			// Insert game data
			games.hangman.servers[server].word = word; // Original word
			games.hangman.servers[server].echo = word; // Editable copy
			games.hangman.servers[server].stage = 0;
			games.hangman.servers[server].guessed = "";

			message.reply("The word/phrase you have chosen is " + word.emoticonvert());

			client.channels.get(server).send(`A game of hangman has been started by ${message.author}. Guess the word/phrase!\n${word.hangmanconvert()}`, {files: [hangmanStages[0]]});

			delete games.hangman.hosts[message.author.id];

			// Schedule cancellation
			setTimeout(() => cancelHangman(server, word), 1000 * gametime.hangman);

			return;
		};
		
		// Player's responses to a game
		if (servers.hasOwnProperty(message.channel.id)) {
			switch (servers[message.channel.id]) {

				// Hangman: Guessing a letter
				case "hangman":
					// Get game data
					var game = games.hangman.servers[message.channel.id];
					let guess = message.content.toLowerCase();

					// Initialise response message
					let response = ``;
					let doPrint = false;
					let postStage = false;

					// Check if guess is a single character and a letter
					if (guess.length == 1 && letters.test(guess)) {

						// Check if word includes guessed letter
						if (game.echo.includes(guess)) {

							// Capitalise guessed letter in word (simulates a filled in letter)
							game.echo = game.echo.replace(new RegExp(guess, "g"), guess.toUpperCase());
							
							// Add 'letter add' message to response
							response += `The word has ${guess.emoticonvert()} as guessed by ${message.author}\n${game.echo.hangmanconvert()}`;

							// Check if word is completely filled out
							if (lettersHigh.test(game.echo)) {
								response += `\nThe entire word has been uncovered! :checkered_flag:`;
								delete servers[message.channel.id];
								delete games.hangman.servers[message.channel.id];
							}
							// If not, show the guessed letters
							else {
								response += `\n${game.guessed.emoticonvert()}`;
							};

						}
						// Check if guessed letter has already been guessed and is wrong
						else if (game.guessed.includes(guess)) {
							response += `That letter has already been guessed!\n${game.guessed.emoticonvert()}`;
						}
						// Check if guessed letter has already been guessed and is correct/filled
						else if (game.echo.includes(guess.toUpperCase())) {
							response += `That letter has already been added!\n${game.echo.hangmanconvert()}`;
						}
						// If the word does not have the guessed letter
						else {
							// Move up a stage
							game.stage++;

							// Add guessed letter to crossed out words
							game.guessed += guess;

							response += `The word does not have ${guess.emoticonvert()} as guessed by ${message.author}`;

							// Check if the game has not reached the final stage
							if (game.stage < 6) {
								response += `\n${game.echo.hangmanconvert()}\n${game.guessed.emoticonvert()}`;
							}
							// If the game has no more stages
							else {
								response += `\nThe word was ${game.word.emoticonvert()}\nGame over! :pirate_flag:`;
								delete servers[message.channel.id];
								delete games.hangman.servers[message.channel.id];
							};
							postStage = true;
						};
						doPrint = true;
					}
					// Check if all-or-nothing is enabled, if not: Move up a stage
					else if (game.risk && guess != game.word) {
						// Move up a stage
						game.stage++;

						response += `The word was NOT ${guess.emoticonvert()} as guessed by ${message.author}`;

						// Check if the game has not reached the final stage
						if (game.stage < 6) {
							response += `\n${game.guessed.emoticonvert()}`;
						}
						// If the game has no more stages
						else {
							response += `\nThe word was ${game.word.emoticonvert()}\nGame over! :pirate_flag:`;
							delete servers[message.channel.id];
							delete games.hangman.servers[message.channel.id];
						};
						doPrint = true;
						postStage = true;
					}
					// Check if the guessed word is correct
					else if (guess === game.word) {
						response += `The whole word has been guessed correctly by ${message.author} :checkered_flag:\nThe word was ${game.word.emoticonvert()}`;
						delete servers[message.channel.id];
						delete games.hangman.servers[message.channel.id];
						doPrint = true;
					};

					// Send complete response
					if (doPrint && postStage) {
						message.channel.send(response, {files: [hangmanStages[game.stage]]});
					} else if (doPrint) {
						message.channel.send(response);
					};
					break;
			
				default:
					break;
			};
			return;
		};
	};

});

// Shuffle method taken from https://stackoverflow.com/a/3943985
String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
};

// Illiterate method (Lowercase followed by UPPERCASE for every other letter)
String.prototype.illiterate = function (toFlip) {
	var og = this.toLowerCase().split("");
	for (var i = toFlip; i < og.length;) {
		og[i] = og[i].toUpperCase();
		i += 2;
	};
	return og.join("");
};

// Convert to emoticons/emojis
String.prototype.emoticonvert = function () {
	var og = this.toLowerCase().split("");
	for (var i = 0; i < og.length; i++) {
		var emotext = og[i];
		if (emotext === " ") {
			emotext = "white_small_square";
		} else if (emoticonvertSpecials.hasOwnProperty(emotext)) {
			emotext = emoticonvertSpecials[emotext];
		} else if (letters.test(emotext)) {
			emotext = "regional_indicator_" + emotext;
		} else {
			emotext = "white_small_square";
		};
		og[i] = ":" + emotext + ":";
	};
	return og.join(" ");
};

// Convert to HANGMAN emoji text
String.prototype.hangmanconvert = function () {
	var og = this.split("");
	for (var i = 0; i < og.length; i++) {
		var emotext = og[i];
		if (lettersLow.test(emotext)) {
			emotext = "black_large_square";
		} else if (emotext === " ") {
			emotext = "white_small_square";
		} else {
			emotext = "regional_indicator_" + emotext.toLowerCase();
		};
		og[i] = ":" + emotext + ":";
	};
	return og.join(" ");
};

function cancelHangmanHost(server, host) {
	
	// Check if the server is still running hangman and it doesn't have a word selected
	if (servers.hasOwnProperty(server) && servers[server] === "hangman" && !games.hangman.servers[server].hasOwnProperty("word")) {

		// Select text-channel
		client.channels.get(server).send(`The host has not chosen a word within ${gametime.hangmanHost} seconds. The game of hangman has been cancelled.`);
		
		// Delete game data
		delete servers[server];
		delete games.hangman.servers[server];
		delete games.hangman.hosts[host];
	};
};

function cancelHangman(server, word) {
	
	// Check if the server is still running hangman and it's the same game (checked using the word)
	if (servers.hasOwnProperty(server) && servers[server] === "hangman" && games.hangman.servers[server].word === word) {

		// Select text-channel
		client.channels.get(server).send(`No one got the word in time! The word was ${word.emoticonvert()}`);
		
		// Delete game data
		delete servers[server];
		delete games.hangman.servers[server];
	};
};

const 	prefix = "/", delimiter = " ", tempus = "494030294723067904", testbot = "594473936943579166", tempbot = "563875158738206720",
				reusedMessages = {
					invalidcommand: "That's not a valid command/subcommand!",
					alreadyplaying: "There's already a game of this type running in this server!",
					notplaying: "There's no game of this type running in this server!",
					notinagame: "You're not in a game!",
					noarguments: "You didn't add a subcommand / Not enough arguments!",
					cantDM: "This game can't be played in a DM.",
					},
				gametime = {
					hangman: 60 * 5,
					hangmanHost: 30,
					maths: 5,
					algebra: 10,
				},
				antiRaidRole = "Anti-Raid", maxMentions = 3,
				mutedRole = "Muted", modRole = "Moderators",
				//words = ["marvel","stark","groot","inevitable","infinity","endgame","ragnarok","homecoming","iron man","captain america","hulk","thor","black widow","hawkeye","nick fury","spider-man","guardians","galaxy","thanos","gauntlet"],
				words = ["everything","basketball","characters","literature","perfection","volleyball","depression","homecoming","technology","maleficent","watermelon","appreciate","relaxation","convection","government","abominable","strawberry","retirement"],
				//responses = ["Definitely not. (Captain Marvel 77:18)","Definitely not. (Doctor Strange 11:22)","No. Definitely not. (III Captain America 58:37)","Probably. Yeah. (II Iron Man 52:12)","Probably not, to be honest. (III Thor 123:05)","Absolutely. (I Ant-Man 44:24)","Absolutely not! (I Ant-Man 47:08)","No. No, absolutely not. (I Iron Man 59:10)","Absolutely, we're... I'm going to have to call you back. (I Iron Man 95:04)","Absolutely. (II Iron Man 11:30)","Absolutely. (II Iron Man 80:08)","Absolutely. (III Avengers 72:08)","Yes, my son. (Black Panther 0:07)","Yes, General. (Black Panther 14:10)","For now, yes. (Doctor Strange 52:24)","The answer is yes. (Doctor Strange 76:22)","Oh, yes. Promptly. (Doctor Strange 107:24)","Yes, ma'am. (II Avengers 40:35)","That is not possible. (Black Panther 64:32)","Experimental and expensive, but possible. (Doctor Strange 14:30)","It's impossible. (I Guardians of the Galaxy 78:11)","Oh, I don't doubt it. (III Iron Man 51:49)","We have no idea (Captain Marvel 111:44)","I've got no idea. (I Iron Man 81:19)","I'm not sure. (I Spider-Man 54:57)","I'm not sure. (II Ant-Man 14:08)","Not sure. I'm working on it. (III Avengers 17:53)","With all due respect, I'm not sure the science really supports that. (IV Avengers 83:46)","I'm not sure. (III Thor 120:11)","I'm not sure. (IV Avengers 161:15)","I don't know. (Captain Marvel 60:58)","I don't know. I hadn't gotten to that part yet. (Doctor Strange 51:38)","I don't know. (Doctor Strange 67:59)"],
				responses = ["Yeah sure why not?","No doubt about it.","I mean it's possible.","Yeah nah I don't think so.","Ehhh, I'm not sure about that."],
				mathsTypes = ["+", "-", "x", "/"],
				letters = /^[a-zA-Z]/, lettersAll = /^[a-z]|\s/, lettersLow = /^[a-z]/, lettersHigh = /^[A-Z]+$/,
				emoticonvertSpecials = {0: "zero", 1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "keycap_ten"},
				rpsChoices = ["rock", "paper", "scissors"],
				rpsBeats = {scissors: "paper", paper: "rock", rock: "scissors"},
				hangmanStages = [
					"https://media.discordapp.net/attachments/563884324039163914/681659654287523872/tempbot-hangman-0.jpg",
					"https://media.discordapp.net/attachments/563884324039163914/681659656086749225/tempbot-hangman-1.jpg",
					"https://media.discordapp.net/attachments/563884324039163914/681659657663938640/tempbot-hangman-2.jpg",
					"https://media.discordapp.net/attachments/563884324039163914/681659659870142464/tempbot-hangman-3.jpg",
					"https://media.discordapp.net/attachments/563884324039163914/681659662021558278/tempbot-hangman-4.jpg",
					"https://media.discordapp.net/attachments/563884324039163914/681659663363735561/tempbot-hangman-5.jpg",
					"https://media.discordapp.net/attachments/563884324039163914/681659665033068591/tempbot-hangman-6.jpg",
				];

var games = {
	unscramble: {servers: {}, hosts: {}},
	numberguess: {servers: {}},
	mathsquestion: {servers: {}},
	maths: {servers: {}},
	scissorspaperrock: {},
	cardjitsu: {},
	hangman: {servers: {}, hosts: {}},
};

var servers = {};

const tempbotEmbed = new Discord.RichEmbed()
tempbotEmbed.setAuthor("TempBot", "https://cdn.discordapp.com/attachments/563884324039163914/681447191633461273/tempbot-avatar-transparent.png", "https://www.078596.xyz")
	.setColor("0x78F7FE")
	.addField("/hangman", "Start a game of hangman with any word you choose. Use /hangman risk to penalise wrong word guesses.")
	.addField("/maths", "Get a simple multiple-choice maths question to solve. Use /maths [difficulty (e.g. 2)] to increase the difficulty.")
	.addField("/algebra", "Get a simple multiple-choice 'solve for x' algebra question to solve.")
	.addField("/unscramble", "Get a word to unscramble. Use /unscramble dm to set a custom word. Use /unscramble hint to rescramble the word.")
	.addField("/guess", "Guess a number from 1-10. Use /guess [range (e.g. 100)] to increase the range.")
	.setFooter("Check out my website by clicking on 'TempBot'!", "https://cdn.discordapp.com/attachments/563884324039163914/681446253988675614/logo-clean-sd.png");
	