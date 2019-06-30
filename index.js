const Discord = require("discord.js");
const client = new Discord.Client();
const Canvas = require("canvas");
//const fetch = require('node-fetch');
const fetch = require("node-superfetch");

client.once("ready", () => {
	console.log("Ready!");
  client.user.setActivity("Fortnite for the Nintendo 3DS");
});

//client.login(process.env.BOT_TOKEN);
client.login("NTk0NDczOTM2OTQzNTc5MTY2.XRc9CQ.ve6bqf5jZxgi2uJTSckgGKIFPNk");
console.log("Remember to remove the bot token when commiting to GitHub!");

const helpEmbed = new Discord.RichEmbed()
	.setColor("#78f7fe")
	.setTitle("List of Commands")
	.setDescription("Commands in UPPERCASE are main commands. Subcommands are in lowercase and are optional unless written in italics. \nExamples: -maths-multiplication-12 | -caption-My name is-JEFF-#-https://website.com/image.png")

	.addField("-UNSCRAMBLE", "Get a word to unscramble.")

	.addField("-NUMBERGUESS", "Guess a random generated number.")
	.addField("-range", "Choose the range for the random number to generate up to. Default range is 10.", true)

	.addField("-8BALL-*question*", "Ask the Magic 8-Ball a question and get a response.")

	.addField("-MATHS / -MATHSQUESTION", "Get a maths question to answer.")
	.addField("-add / -addition", "Get an addition question.", true)
	.addField("-sub / -subtraction", "Get a subtraction question.", true)
	.addField("-mul / -multiplication", "Get a multiplication question.", true)
	.addField("-div / -division", "Get a division question.", true)
	.addField("-range", "Specify the range to generate a number from.", true)

	.addField("-ILLITERATE / -ILR", "Turn a message into an iLlItErAtE MeSsAgE with the second letter capitalised.", true)
	.addField("-ILLITERATEFLIP / -ILRF", "Turn a message into an IlLiTeRaTe mEsSaGe with the first letter capitalised.", true)
	.addField("-SEPARATE / -FRIENDZONE", "Insert spaces between the characters of a message.", true)
	.addField("-LOWERCASE", "Convert a message to all lower case.", true)
	.addField("-UPPERCASE", "Convert a message to all upper case.", true)

	.addField("-CAPTION-*toptext*-*bottomtext*-*smalltext*-image.png", "Add a caption to an image. Use # if you don't want to use a text. If an image is attached to the message, image.png isn't necessary. Use \\n to insert line breaks. Use \\aL at the start of an input to align text to the left or \\aR for the right. Browser version: https://tempusware.github.io/caption-adder/")

	.setTimestamp();

client.on("message", async message => {
  if (message.author.bot) {return};
	var messageContent = message.content;
	var args = message.content.split("-");
	args.shift();

	// Commands
	if (args[0]) {
		messageContent = messageContent.substr(args[0].length + 2, messageContent.length);
		console.log(message.author.tag + ": " + args);
		switch (args[0].toLowerCase()) {
			case "ping":
				message.reply("Ping!");
				break;
			case "help":
				message.channel.send(helpEmbed);
				break;
			case "unscramble":
				// Subcommands
				if (args[1]) {
					switch (args[1]) {
						case "end":
							message.channel.send("Unscramble game ended. The word was **'" + unscrambledWord + "'**.");
							unscrambledWord = "";
							break;
						case "hint":
							message.channel.send("Rescrambled: " + unscrambledWord.shuffle());
							break;
						default:
							message.reply("That's not a valid subcommand!");
					};
					return;
				};
				// New game
				unscrambledWord = words[Math.round(Math.random() * words.length)];
				message.channel.send("Unscramble this: " + unscrambledWord.shuffle());
				break;
			case "numberguess":
				if (args[1]) {
					if (isNaN(args[1])) {
						switch (args[1].toLowerCase()) {
							case "end":
								message.channel.send("Number guessing game ended. The number was **'" + thoughtNumber + "'**.");
								thoughtNumber = false;
								return;
								break;
							default:
								message.reply("That's not a valid subcommand.");
								return;
						};
					} else {
						var number = args[1];
					};
				} else {
					var number = 10;
				};
				thoughtNumber = Math.floor((Math.random() * number) + 1);
				message.channel.send("What number from 1-" + number + " am I thinking of?");
				return;
				break;
			case "8ball":
				if (!args[1]) {
					message.reply("Ask a question!");
					return;
				};
				var messageContent = message.content.toLowerCase();
				if (messageContent.includes("can") || messageContent.includes("does") || messageContent.includes("will") || messageContent.includes("should") || messageContent.includes("could")) {
					message.reply(responsesBoolean[Math.round(Math.random() * responsesBoolean.length - 1)]);
				} else {
					message.reply(responsesUnknown[Math.round(Math.random() * responsesUnknown.length - 1)])
				}
				break;
			case "mathsquestion": case "maths":
				if (args[1] && isNaN(args[1])) {
					var questionType = args[1].toLowerCase();
				} else if (args[2] && isNaN(args[2])) {
					var questionType = args[2].toLowerCase();
				} else {
					var questionType = mathsTypes[Math.round(Math.random() * mathsTypes.length)];
				};
				if (args[1] && !isNaN(args[1])) {
					var number = args[1];
				} else if (args[2] && !isNaN(args[2])) {
					var number = args[2];
				} else {
					var number = 64;
				};
				switch (questionType) {
					case "addition": case "add":
						firstNumber = Math.round(Math.random() * number);
						secondNumber = Math.round(Math.random() * number);
						mathsAnswer = firstNumber + secondNumber;
						message.channel.send("What is **" + firstNumber + "** + **" + secondNumber + "** = ?");
						break;
					case "subtraction": case "sub":
						firstNumber = Math.round(Math.random() * number);
						secondNumber = Math.round(Math.random() * number);
						mathsAnswer = firstNumber - secondNumber;
						message.channel.send("What is **" + firstNumber + "** - **" + secondNumber + "** = ?");
						break;
					case "multiplication": case "mul":
						firstNumber = Math.round(Math.random() * number);
						secondNumber = Math.round(Math.random() * number);
						mathsAnswer = firstNumber * secondNumber;
						message.channel.send("What is **" + firstNumber + "** x **" + secondNumber + "** = ?");
						break;
					case "division": case "div":
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
					default:
						message.reply("That's not a valid subcommand!");
				};
				break;
			case "illiterate": case "ilr":
				var toFlip = 1;
				message.channel.send(messageContent.illiterate(toFlip));
				break;
			case "illiterateflip": case "ilrf":
				var toFlip = 0;
				message.channel.send(messageContent.illiterate(toFlip));
				break;
			case "separate": case "friendzone":
				// Taken from https://stackoverflow.com/a/7437419
				message.channel.send(messageContent.split("").join(" "));
				break;
			case "lowercase":
				message.channel.send(messageContent.toLowerCase());
				break;
			case "uppercase":
				message.channel.send(messageContent.toUpperCase());
				break;
			case "caption":
				if (!args[3]) {
					message.reply("Not enough arguments. Command usage is as follows: -caption-Top text-Bottom text-Small text-https://website.com/image.png. To leave a text blank, use # in its place. An image url must be provided if an image isn't attached. PNGs only.");
					return;
				};

				// Get the image
				var imgSrc;
				if (message.attachments.array()[0]) {
					imgSrc = message.attachments.array()[0].url;
					console.log("IMAGE ATTACHED.")
				};
				if (args[4] && args[4].endsWith(".png")) {
					imgSrc = args[4];
					console.log("IMAGE LINKED.")
				};
				if (!imgSrc) {
					console.log("NO IMAGE LOADED.");
					message.reply("No image was attached or linked. Only PNGs are accepted. If you're linking an image (using a url), this command can't accept filenames with a hyphen (-).");
					return;
				};

				// Get the text
				var toptext = args[1];
				if (toptext != "#") {
					toptext = toptext.split("\\n");
				} else {
					toptext = [];
				};
				var bottomtext = args[2];
				if (bottomtext != "#") {
					bottomtext = bottomtext.split("\\n").reverse();
				} else {
					bottomtext = [];
				};
				var smalltext = args[3];

				// Image loader taken from https://www.youtube.com/watch?v=A1dSjB8z0JI
				const { body: imgFetch } = await fetch.get(imgSrc);
				const img = await Canvas.loadImage(imgFetch);

				console.log(toptext + bottomtext + smalltext + imgSrc);
				console.log("Loading image: " + imgSrc);
				message.reply("Loading image...");

				// Create the canvas
				var captionHeight = 90;
				var outputWidth = 1280;
				var resizedHeight = outputWidth / img.width * img.height;
				var canvas = Canvas.createCanvas(outputWidth, resizedHeight + captionHeight * toptext.length);
				var context = canvas.getContext("2d");
				context.lineWidth = 2;
				context.font = "50px arial";
				context.textAlign = "center";
				var textstart = outputWidth / 2;

				// Add top text
				if (toptext.length != 0) {
					context.fillStyle = "white";
					context.fillRect(0, 0, outputWidth, captionHeight * toptext.length);
					context.fillStyle = "black";
					if (toptext[0].startsWith("\\aL")) {
						toptext[0] = toptext[0].substr(3);
						context.textAlign = "left";
						textstart = 25
					} else if (toptext[0].startsWith("\\aR")) {
						toptext[0] = toptext[0].substr(3);
						context.textAlign = "right";
						textstart = outputWidth - 25
					}
					for (var i = 0; i < toptext.length; i++) {
						context.fillText(toptext[i], textstart, captionHeight / 3 * 2 + captionHeight * i);
					};
					context.textAlign = "center";
					textstart = outputWidth / 2;
				}

				context.drawImage(img, 0, 0, img.width, img.height, 0, captionHeight * toptext.length, outputWidth, resizedHeight);

				if (bottomtext.length != 0) {
					context.fillStyle = "rgba(0, 0, 0, 0.7)";
					context.fillRect(0, canvas.height - captionHeight * bottomtext.length, outputWidth, canvas.height);
					context.fillStyle = "white";
					if (bottomtext[0].startsWith("\\aL")) {
						bottomtext[0] = bottomtext[0].substr(3);
						context.textAlign = "left";
						textstart = 25
					} else if (bottomtext[0].startsWith("\\aR")) {
						bottomtext[0] = bottomtext[0].substr(3);
						context.textAlign = "right";
						textstart = outputWidth - 25
					};
					for (var i = 0; i < bottomtext.length; i++) {
						context.fillText(bottomtext[i], textstart, canvas.height - captionHeight / 3 - captionHeight * i)
					}
					context.textAlign = "center";
					textstart = outputWidth / 2;
				};

				if (smalltext != "#") {
					context.fillStyle = "white";
					context.font = "30px arial";
					context.textAlign = "right";
					if (smalltext.startsWith("\\aL")) {
						smalltext = smalltext.substr(3);
						context.textAlign = "left";
						textstart = 10
					} else if (smalltext.startsWith("\\aR")) {
						smalltext = smalltext.substr(3);
						context.textAlign = "right";
						textstart = canvas.width - 10
					} else if (smalltext.startsWith("\\aC")) {
						smalltext = smalltext.substr(3)
					} else {
						context.textAlign = "right";
						textstart = canvas.width - 10
					}
					context.fillText(smalltext, textstart, canvas.height - 10 - captionHeight * bottomtext.length)
				};

				const attachment = new Discord.Attachment(canvas.toBuffer(), "image.png");
				message.reply("Here is your image:", attachment);

				break;
			default:
				break;
		};
	};

	// Responses
	if (unscrambledWord) {
		if (messageContent.toLowerCase().includes(unscrambledWord) || message.content.toLowerCase().includes(unscrambledWord)) {
			message.reply("You got the word! The word was **'" + unscrambledWord + "'**.");
			unscrambledWord = "";
		};
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
	if (mathsAnswer != "nogame" && message.content == mathsAnswer) {
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
var thoughtNumber = false;
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
