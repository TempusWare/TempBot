const Discord = require("discord.js");
const client = new Discord.Client();

client.once("ready", () => {
	console.log("Ready!");
  client.user.setActivity("Scissors Paper Rock");
});

client.login(process.env.BOT_TOKEN);



client.on("message", async message => {
  if (message.author.bot) {return};
	var 	messageContent 	= message.content,
				args 						= messageContent.substr(prefix.length, messageContent.length).split(delimiter),
				messageChannel 	= message.channel.id,
				messageAuthor		= message.author.id;

	// Responses
	if (games.unscramble.hasOwnProperty(messageChannel) && message.content.toLowerCase().includes(games.unscramble[messageChannel])) {
		message.reply(reusedMessages.correctanswer("word", games.unscramble[messageChannel]));
		delete games.unscramble[messageChannel];
	};

	if (games.numberguess.hasOwnProperty(messageChannel)) {
		var guess = message.content;
		if (isNaN(guess)) {return;}
		var number = games.numberguess[messageChannel];
		if (guess == number) {
			message.reply(reusedMessages.correctanswer("number", number));
			delete games.numberguess[messageChannel];
		} else if (guess > number) {
			message.reply("Lower!");
		} else if (guess < number) {
			message.reply("Higher!");
		};
	};

	if (games.mathsquestion.hasOwnProperty(messageChannel) && message.content == games.mathsquestion[messageChannel]) {
		message.reply(reusedMessages.correctanswer("answer", games.mathsquestion[messageChannel]));
		delete games.mathsquestion[messageChannel];
	};

	if (games.scissorspaperrock.hasOwnProperty(messageAuthor)) {
		messageContent = messageContent.toLowerCase();
		if (rpsChoices.includes(messageContent)) {
			games.scissorspaperrock[messageAuthor]["choice"] = messageContent;
			playerChoice = messageContent;
			message.reply("You have chosen **" + messageContent + "**.");
			games.scissorspaperrock[games.scissorspaperrock[messageAuthor]["opponent"]]["tag"].send("Your opponent has made their choice.");
			if (games.scissorspaperrock[games.scissorspaperrock[messageAuthor]["opponent"]].hasOwnProperty("choice")) {
				opponentChoice = games.scissorspaperrock[games.scissorspaperrock[messageAuthor]["opponent"]]["choice"];
				message.reply("Check the text-channel the game was started in.");
				games.scissorspaperrock[games.scissorspaperrock[messageAuthor]["opponent"]]["tag"].send("Check the text-channel the game was started in.");
				if (rpsBeats[playerChoice] === opponentChoice) {
					// Player wins
					client.channels.get(games.scissorspaperrock[messageAuthor]["channel"])
					.send(games.scissorspaperrock[messageAuthor]["tag"] + "\'s **" + playerChoice + "** beat " + games.scissorspaperrock[games.scissorspaperrock[messageAuthor]["opponent"]]["tag"] + "\'s **" + opponentChoice + "** in a game of scissors-paper-rock.");
					delete games.scissorspaperrock[games.scissorspaperrock[messageAuthor]["opponent"]];
					delete games.scissorspaperrock[messageAuthor];
				} else if (rpsBeats[opponentChoice] === playerChoice) {
					// Opponent wins
					client.channels.get(games.scissorspaperrock[messageAuthor]["channel"])
					.send(games.scissorspaperrock[games.scissorspaperrock[messageAuthor]["opponent"]]["tag"] + "\'s **" + opponentChoice + "** beat " + games.scissorspaperrock[messageAuthor]["tag"] + "\'s **" + playerChoice + "** in a game of scissors-paper-rock.");
					delete games.scissorspaperrock[games.scissorspaperrock[messageAuthor]["opponent"]];
					delete games.scissorspaperrock[messageAuthor];
				} else {
					// Tie
					client.channels.get(games.scissorspaperrock[messageAuthor]["channel"])
					.send(games.scissorspaperrock[games.scissorspaperrock[messageAuthor]["opponent"]]["tag"] + " and " + games.scissorspaperrock[messageAuthor]["tag"] + " both chose **" + playerChoice + "** in a game of scissors-paper-rock, resulting in a tie.");
					delete games.scissorspaperrock[games.scissorspaperrock[messageAuthor]["opponent"]];
					delete games.scissorspaperrock[messageAuthor];
				};
			} else {
				message.reply("Awaiting your opponent's choice...");
			}
		} else {
			message.reply("That's not one of the choices!");
			console.log(message.author.tag + ": " + messageContent);
		};
	};

	// Commands
	if (messageContent.startsWith(prefix) && args[0]) {
		messageContent = messageContent.substr(args[0].length + 2, messageContent.length);
		console.log(message.author.tag + ": " + args + " (" + messageContent + ")");

		switch (args[0].toLowerCase()) {
			case "ping":
				message.reply("Ping!");
				break;

			case "help":
				message.channel.send(helpEmbed);
				break;

			case "unscramble": case "unscram": case "unscr":
				var gameRunning = games.unscramble.hasOwnProperty(messageChannel);
				if (gameRunning) {
					if (!args[1]) {
						message.reply(reusedMessages.alreadyplaying);
						return;
					} else {
						switch (args[1]) {
							case "end":
								message.channel.send(reusedMessages.endgame("Unscramble", "word", games.unscramble[messageChannel]));
								delete games.unscramble[messageChannel];
								break;
							case "hint":
								message.channel.send("Rescrambled: " + games.unscramble[messageChannel].shuffle());
								break;
							default:
								message.reply(reusedMessages.invalidcommand);
						};
					};
				} else {
					if (args[1]) {message.reply(reusedMessages.notplaying); return};
					games.unscramble[messageChannel] = words[Math.round(Math.random() * words.length)];
					message.channel.send("Unscramble this: " + games.unscramble[messageChannel].shuffle());
				};
				break;

			case "numberguess": case "numg": case "numguess":
				var gameRunning = games.numberguess.hasOwnProperty(messageChannel);
				if (gameRunning) {
					if (args[1] && args[1] === "end") {
						message.channel.send(reusedMessages.endgame("Number guessing", "number", games.numberguess[messageChannel]));
						delete games.numberguess[messageChannel];
					} else {
						message.reply(reusedMessages.alreadyplaying + " | " + reusedMessages.invalidcommand);
					};
				} else {
					if (args[1]) {
						if (!isNaN(args[1])) {
							var number = args[1];
						} else {
							message.reply(reusedMessages.invalidcommand);
							return;
						};
					} else {
						var number = 10;
					};
					games.numberguess[messageChannel] = Math.floor((Math.random() * number) + 1);
					message.channel.send("What number from 1-" + number + " am I thinking of?");
				};
				return;
				break;

			case "8ball":
				message.reply(responses[Math.floor(Math.random() * responses.length)]);
				break;

			case "mathsquestion": case "maths":
				var gameRunning = games.mathsquestion.hasOwnProperty(messageChannel);
				if (gameRunning) {
					if (args[1] && args[1] === "end") {
						message.channel.send(reusedMessages.endgame("Maths question", "number", games.mathsquestion[messageChannel]));
						delete games.mathsquestion[messageChannel];
					} else {
						message.reply(reusedMessages.alreadyplaying + " | " + reusedMessages.invalidcommand);
					};
				} else {
					var range = 64, questionType = mathsTypes[Math.round(Math.random() * mathsTypes.length)];
					if (args[1]) {
						if (isNaN(args[1])) {
							questionType = args[1].toLowerCase();
						} else {
							range = args[1];
						};
					};
					if (args[2]) {
						if (isNaN(args[2])) {
							questionType = args[2].toLowerCase();
						} else {
							range = args[2];
						};
					};
					var numberA = Math.round(Math.random() * range), numberB = Math.round(Math.random() * range);
					console.log(numberA + " " + numberB + " " + range)
					switch (questionType) {
						case "addition": case "add":
							games.mathsquestion[messageChannel] = numberA + numberB;
							message.channel.send("What is **" + numberA + "** + **" + numberB + "** = ?");
							break;
						case "subtraction": case "sub":
							games.mathsquestion[messageChannel] = numberA - numberB;
							message.channel.send("What is **" + numberA + "** - **" + numberB + "** = ?");
							break;
						case "multiplication": case "mul":
							games.mathsquestion[messageChannel] = numberA * numberB;
							message.channel.send("What is **" + numberA + "** x **" + numberB + "** = ?");
							break;
						case "division": case "div":
							while (numberA % numberB != 0 || numberB == 1) {
								numberA = Math.floor((Math.random() * range) + 1);
								numberB = Math.floor((Math.random() * range) + 1);
							};
							games.mathsquestion[messageChannel] = numberA / numberB;
							message.channel.send("What is **" + numberA + "** / **" + numberB + "** = ?");
							break;
						default:
							message.reply(reusedMessages.invalidcommand);
					};
				};
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
				var delmsg = false;
				if (messageContent.includes("DELMSG")) {
					messageContent = messageContent.split("DELMSG").join("");
					delmsg = true;
				};
				messageContent = messageContent.emoticonvert();
				if (messageContent.length > 2000) {
					message.reply("The output message would be too long. Output message length: " + messageContent.length);
				} else {
					if (delmsg) {message.delete()};
					message.channel.send(messageContent);
					if (!delmsg) {message.channel.send("```" + messageContent + "```");}
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
				message.reply("Your message contained **" + messageContent.split(" ").length + "** words and **" + messageContent.length + "** characters. (**" + messageContent.split(" ").join("").length + "** characters, excluding spaces.)");
				break;

			case "log": case "gamelog": case "loggame":
				if (message.author.id != tempus) {return};
				console.log(games);
				break;

			case "setactivity": case "setact":
				if (message.author.id != tempus) {return};
				client.user.setActivity(messageContent);
				console.log("Set activity to " + messageContent);
				break;

			case "rockpaperscissors": case "scissorspaperrock": case "rps": case "spr": case "handgame":
				if (args[1] && args[1].toLowerCase() === "end") {
					message.channel.send(message.author + " and " + games.scissorspaperrock[games.scissorspaperrock[messageAuthor]["opponent"]]["tag"] + "\'s game of scissors-paper-rock has been cancelled.");
					delete games.scissorspaperrock[games.scissorspaperrock[messageAuthor]["opponent"]];
					delete games.scissorspaperrock[messageAuthor];
					games.scissorspaperrock[games.scissorspaperrock[messageAuthor]["opponent"]]["tag"].send("Your game of scissors-paper-rock with " + message.author + " has been cancelled.");
					message.author.send("Your game of scissors-paper-rock with " + games.scissorspaperrock[games.scissorspaperrock[messageAuthor]["opponent"]]["tag"] + " has been cancelled.");
					return;
				} else if (games.scissorspaperrock.hasOwnProperty(messageAuthor)) {
					message.reply("You're already in a game of scissors-paper-rock with " + games.scissorspaperrock[games.scissorspaperrock[messageAuthor]["opponent"]]["tag"] + "!");
					return;
				};
				if (!message.mentions.users.size) {
					message.reply("No one was mentioned.");
					return;
				};
				const authorId = message.author.id;
				const taggedId = message.mentions.users.first().id;
				console.log(authorId + " " + taggedId)
				if (authorId === taggedId) {
					message.reply("You can't challenge yourself!");
					return;
				};
				if (taggedId === testbot || taggedId === tempbot) {
					message.reply("You can't challenge me!");
					return;
				};
				if (games.scissorspaperrock.hasOwnProperty(taggedId)) {
					message.reply(message.mentions.users.first() + " is already in a game of scissors-paper-rock!");
					return;
				};

				games.scissorspaperrock[authorId] = new Object();
				games.scissorspaperrock[taggedId] = new Object();
				games.scissorspaperrock[authorId].opponent = taggedId;
				games.scissorspaperrock[taggedId].opponent = authorId;
				games.scissorspaperrock[authorId].channel = message.channel.id;
				games.scissorspaperrock[taggedId].channel = message.channel.id;
				games.scissorspaperrock[authorId].tag = message.author;
				games.scissorspaperrock[taggedId].tag = message.mentions.users.first();

				message.channel.send("A game of scissors-paper-rock with " + message.author + " and " + message.mentions.users.first() + " has been started. Direct message me **scissors**, **paper** or **rock**.");
				message.author.send("You have started a game of scissors-paper-rock with " + message.mentions.users.first() + ". What do you choose? You can choose from **scissors**, **paper** and **rock**.");
				message.mentions.users.first().send(message.author + " has started a game of scissors-paper-rock with you. What do you choose? You can choose from **scissors**, **paper** and **rock**.");
				break;

			default:
				message.reply(reusedMessages.invalidcommand);
				break;
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
		} else if (!isNaN(emotext)) {
			for (var j = 0; j < 20; j = j + 2) {
				if (emotext === numbersintext[j]) {
					emotext = numbersintext[j + 1];
					break;
				};
			};
		} else if (letters.test(emotext)) {
			emotext = "regional_indicator_" + emotext;
		} else {
			emotext = "white_small_square";
		};
		og[i] = ":" + emotext + ":";
	};
	return og.join(" ");
};

const 	prefix = "/", delimiter = " ", tempus = "494030294723067904", testbot = "594473936943579166", tempbot = "563875158738206720",
				reusedMessages = {
					invalidcommand: "That's not a valid command/subcommand!",
					alreadyplaying: "There's already a game of this type running in this server!",
					notplaying: "There's no game of this type running in this server!",
					correctanswer: function (keyword, answer) {return "You got the " + keyword + "! The " + keyword + " was **" + answer + "**.";},
					endgame: function (game, keyword, answer) {return game + " game ended. The " + keyword + " was **" + answer + "**.";},
					},
				helpEmbed = new Discord.RichEmbed().setColor("#78f7fe").setTitle("List of Commands").setURL("https://github.com/TempusWare").setDescription("/unscramble\n/numberguess\n/8ball\n/maths\n/illiterate\n/separate\n/emoticonvert\n/random\n/count\n/rps").setFooter("Online since:").setTimestamp(),
				words = ["marvel","stark","groot","inevitable","infinity","endgame","ragnarok","homecoming","iron man","captain america","hulk","thor","black widow","hawkeye","nick fury","spider-man","guardians","galaxy","thanos","gauntlet"],
				responses = ["Definitely not. (Captain Marvel 77:18)","Definitely not. (Doctor Strange 11:22)","No. Definitely not. (III Captain America 58:37)","Probably. Yeah. (II Iron Man 52:12)","Probably not, to be honest. (III Thor 123:05)","Absolutely. (I Ant-Man 44:24)","Absolutely not! (I Ant-Man 47:08)","No. No, absolutely not. (I Iron Man 59:10)","Absolutely, we're... I'm going to have to call you back. (I Iron Man 95:04)","Absolutely. (II Iron Man 11:30)","Absolutely. (II Iron Man 80:08)","Absolutely. (III Avengers 72:08)","Yes, my son. (Black Panther 0:07)","Yes, General. (Black Panther 14:10)","For now, yes. (Doctor Strange 52:24)","The answer is yes. (Doctor Strange 76:22)","Oh, yes. Promptly. (Doctor Strange 107:24)","Yes, ma'am. (II Avengers 40:35)","That is not possible. (Black Panther 64:32)","Experimental and expensive, but possible. (Doctor Strange 14:30)","It's impossible. (I Guardians of the Galaxy 78:11)","Oh, I don't doubt it. (III Iron Man 51:49)","We have no idea (Captain Marvel 111:44)","I've got no idea. (I Iron Man 81:19)","I'm not sure. (I Spider-Man 54:57)","I'm not sure. (II Ant-Man 14:08)","Not sure. I'm working on it. (III Avengers 17:53)","With all due respect, I'm not sure the science really supports that. (IV Avengers 83:46)","I'm not sure. (III Thor 120:11)","I'm not sure. (IV Avengers 161:15)","I don't know. (Captain Marvel 60:58)","I don't know. I hadn't gotten to that part yet. (Doctor Strange 51:38)","I don't know. (Doctor Strange 67:59)"],
				mathsTypes = ["addition", "subtraction", "multiplication", "division"],
				letters = /^[a-zA-Z]/,
				numbersintext = ["0", "zero", "1", "one", "2", "two", "3", "three", "4", "four", "5", "five", "6", "six", "7", "seven", "8", "eight", "9", "nine"],
				rpsChoices = ["rock", "paper", "scissors"],
				rpsBeats = {scissors: "paper", paper: "rock", rock: "scissors"};
var games = {
	unscramble: {},
	numberguess: {},
	mathsquestion: {},
	scissorspaperrock: {},
};
