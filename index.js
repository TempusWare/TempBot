const Discord = require("discord.js");
const client = new Discord.Client();

client.once("ready", () => {
	console.log("Ready!");
  client.user.setActivity("Fortnite for the Nintendo 3DS");
});

client.login("NTYzODc1MTU4NzM4MjA2NzIw.XKgFRQ.RRb0WPyEIgLTZkEWhUSHEiAZPSw");

const helpEmbed = new Discord.RichEmbed()
	.addField("-unscramble", "Get a word to unscramble.\nSUBCOMMANDS:")
	.addField("-start", "Start the game.", true)
	.addField("-end", "End the game.", true)
	.addField("-numberguess", "Guess a random generated number.\nSUBCOMMANDS:")
	.addField("-start", "Start the game with a number from 1-10.", true)
	.addField("-start-(range)", "Start the game and choose the range.", true)
	.addField("-end", "End the game.", true)
	.addField("-8ball-(question)", "Ask the Magic 8-Ball a question and get a response.")
	.addField("-mathsquestion", "Get a maths question to answer.\nSUBCOMMANDS:")
	.addField("-addition", "Get an addition question.", true)
	.addField("-subtraction", "Get a subtraction question.", true)
	.addField("-multiplication", "Get a multiplication question.", true)
	.addField("-division", "Get a division question.", true)
	.addField("-(question type)-(range)", "Specify the range to generate a number from.", true)
	.addField("-end", "End the game.", true)
	.setTimestamp();

client.on("message", message => {
  if (message.author.bot) {return};
	var messageContent = message.content;
	var args = message.content.split("-");
	args.shift();

	// Commands
	if (args[0]) {
		console.log(message.author.tag + ": " + args);
		switch (args[0].toLowerCase()) {
			case "ping":
				message.reply("Ping!");
				break;
			case "help":
				message.channel.send(helpEmbed);
				break;
			case "unscramble":
				if (!args[1]) {
					message.reply("Not enough arguments.");
					return;
				};
				switch (args[1].toLowerCase()) {
					case "start":
						unscrambledWord = words[Math.round(Math.random() * words.length)];
						message.channel.send("Unscramble this: " + unscrambledWord.shuffle());
						break;
					case "end":
						message.channel.send("Unscramble game ended. The word was **'" + unscrambledWord + "'**.");
						unscrambledWord = "";
						break;
					};
				break;
			case "numberguess":
				if (!args[1]) {
					message.reply("Not enough arguments.");
					return;
				};
				if (args[2] && !isNaN(args[2])) {
					var number = args[2]
				} else {
					var number = 10
				};
				switch (args[1].toLowerCase()) {
					case "start":
						thoughtNumber = Math.floor((Math.random() * number) + 1);
						message.channel.send("What number from 1-" + number + " am I thinking of?");
						break;
					case "end":
						message.channel.send("Number guessing game ended. The number was **'" + thoughtNumber + "'**.");
						thoughtNumber = false;
				}
				break;
			case "8ball":
				if (!args[1]) {
					message.reply("Not enough arguments.");
					return;
				};
				var messageContent = message.content.toLowerCase();
				if (messageContent.includes("can") || messageContent.includes("does") || messageContent.includes("will") || messageContent.includes("should") || messageContent.includes("could")) {
					message.reply(responsesBoolean[Math.round(Math.random() * responsesBoolean.length - 1)]);
				} else {
					message.reply(responsesUnknown[Math.round(Math.random() * responsesUnknown.length - 1)])
				}
				break;
			case "mathsquestion":
				if (args[1]) {
					var questionType = args[1].toLowerCase()
				} else {
					var questionType = mathsTypes[Math.round(Math.random() * mathsTypes.length)]
				};
				if (args[2] && !isNaN(args[2])) {
					var number = args[2]
				} else {
					var number = 64
				};
				switch (questionType) {
					case "addition":
						firstNumber = Math.round(Math.random() * number);
						secondNumber = Math.round(Math.random() * number);
						mathsAnswer = firstNumber + secondNumber;
						message.channel.send("What is **" + firstNumber + "** + **" + secondNumber + "** = ?");
						break;
					case "subtraction":
						firstNumber = Math.round(Math.random() * number);
						secondNumber = Math.round(Math.random() * number);
						mathsAnswer = firstNumber - secondNumber;
						message.channel.send("What is **" + firstNumber + "** - **" + secondNumber + "** = ?");
						break;
					case "multiplication":
						firstNumber = Math.round(Math.random() * number);
						secondNumber = Math.round(Math.random() * number);
						mathsAnswer = firstNumber * secondNumber;
						message.channel.send("What is **" + firstNumber + "** x **" + secondNumber + "** = ?");
						break;
					case "division":
						firstNumber = Math.floor((Math.random() * number) + 1);
						secondNumber = Math.floor((Math.random() * number) + 1);
						while (firstNumber % secondNumber != 0 || secondNumber == 1) {
							firstNumber = Math.floor((Math.random() * number) + 1);
							secondNumber = Math.floor((Math.random() * number) + 1);
						};
						mathsAnswer = firstNumber / secondNumber;
						message.channel.send("What is **" + firstNumber + "** / **" + secondNumber + "** = ?");
						break;
					case "end":
						message.reply("Maths question game ended. The answer was **'" + mathsAnswer + "'**.");
						firstNumber = false;
						secondNumber = false;
						mathsAnswer = "nogame";
						break;
				};
				break;
			default:

		};
	};

	// Responses
	if (unscrambledWord && messageContent.toLowerCase().includes(unscrambledWord)) {
		message.reply("You got the word! The word was **'" + unscrambledWord + "'**.");
		unscrambledWord = "";
	};
	if (thoughtNumber && !isNaN(messageContent)) {
		if (messageContent == thoughtNumber) {
			message.reply("You got the number! The number was **'" + thoughtNumber + "'**.");
			thoughtNumber = false;
		} else if (messageContent > thoughtNumber) {
			message.reply("Lower!")
		} else if (messageContent < thoughtNumber) {
			message.reply("Higher!")
		}
	};
	if (mathsAnswer != "nogame" && messageContent == mathsAnswer) {
		message.reply("You got the answer! The answer was **'" + mathsAnswer + "'**.");
		firstNumber = false;
		secondNumber = false;
		mathsAnswer = "nogame";
	}
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
}
var words = [
	"marvel",
	"stark",
	"groot",
	"inevitable",
	"infinity",
	"endgame",
	"ragnarok",
	"homecoming",
	"iron man",
	"captain america",
	"hulk",
	"thor",
	"black widow",
	"hawkeye",
	"nick fury",
	"spider-man",
	"guardians",
	"galaxy",
	"thanos",
	"gauntlet",
];
var unscrambledWord;
var thoughtNumber;
var responsesBoolean = [
	"Definitely not. (Captain Marvel 77:18)",
	"Definitely not. (Doctor Strange 11:22)",
	"No. Definitely not. (III Captain America 58:37)",
	"Probably. Yeah. (II Iron Man 52:12)",
	"Probably not, to be honest. (III Thor 123:05)",
	"Absolutely. (I Ant-Man 44:24)",
	"Absolutely not! (I Ant-Man 47:08)",
	"No. No, absolutely not. (I Iron Man 59:10)",
	"Absolutely, we're... I'm going to have to call you back. (I Iron Man 95:04)",
	"Absolutely. (II Iron Man 11:30)",
	"Absolutely. (II Iron Man 80:08)",
	"Absolutely. (III Avengers 72:08)",
	"Yes, my son. (Black Panther 0:07)",
	"Yes, General. (Black Panther 14:10)",
	"For now, yes. (Doctor Strange 52:24)",
	"The answer is yes. (Doctor Strange 76:22)",
	"Oh, yes. Promptly. (Doctor Strange 107:24)",
	"Yes, ma'am. (II Avengers 40:35)",
	"That is not possible. (Black Panther 64:32)",
	"Experimental and expensive, but possible. (Doctor Strange 14:30)",
	"It's impossible. (I Guardians of the Galaxy 78:11)",
	"Oh, I don't doubt it. (III Iron Man 51:49)",
];
var responsesUnknown = [
	"We have no idea (Captain Marvel 111:44)",
	"I've got no idea. (I Iron Man 81:19)",
	"I'm not sure. (I Spider-Man 54:57)",
	"I'm not sure. (II Ant-Man 14:08)",
	"Not sure. I'm working on it. (III Avengers 17:53)",
	"With all due respect, I'm not sure the science really supports that. (IV Avengers 83:46)",
	"I'm not sure. (III Thor 120:11)",
	"I'm not sure. (IV Avengers 161:15)",
	"I don't know. (Captain Marvel 60:58)",
	"I don't know. I hadn't gotten to that part yet. (Doctor Strange 51:38)",
	"I don't know. (Doctor Strange 67:59)",
]
var firstNumber;
var secondNumber;
var mathsAnswer = "nogame";
var mathsTypes = ["addition", "subtraction", "multiplication", "division"];
