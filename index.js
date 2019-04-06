const Discord = require("discord.js");
const client = new Discord.Client();

const prefix = "-";

client.once("ready", () => {
	console.log("Ready!");
  client.user.setActivity("Beepity Boop I have no friends")
});

client.login("NTYzODc1MTU4NzM4MjA2NzIw.XKgFRQ.RRb0WPyEIgLTZkEWhUSHEiAZPSw");

// Card-Jitsu Game
var cardElements = [":fire:", ":droplet:", ":snowflake:"];
var cardColours = [":yellow_heart:", ":large_orange_diamond:", ":red_circle:", ":purple_heart:", ":green_heart:", ":large_blue_circle:"]
function createCard(type) {
  return type[Math.floor(Math.random() * type.length)];
};
function cardPower() {
  return ":clock" + Math.floor((Math.random() * 12) + 1) + ":"
}
function playerCards() {
	return new Discord.RichEmbed()
		.setTitle("Card-Jitsu Cards")
		.addField("1: " + playerCard01.element + playerCard01.colour + playerCard01.power)
		.addField("2: " + playerCard02.element + playerCard02.colour + playerCard02.power)
		.addField("3: " + playerCard03.element + playerCard03.colour + playerCard03.power)
		.addField("4: " + playerCard04.element + playerCard04.colour + playerCard04.power)
		.addField("5: " + playerCard05.element + playerCard05.colour + playerCard05.power)
}

client.on("message", message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split("-");

  switch (args.shift().toLowerCase()) {
    case "ping":
      message.reply("Pong! :ping_pong:")
      break;
    case "cardjitsu":
      if (!message.mentions.users.size) {
				var botCards = [
					createCard(cardElements), createCard(cardColours), cardPower(),
					createCard(cardElements), createCard(cardColours), cardPower(),
					createCard(cardElements), createCard(cardColours), cardPower(),
					createCard(cardElements), createCard(cardColours), cardPower(),
					createCard(cardElements), createCard(cardColours), cardPower(),
					createCard(cardElements), createCard(cardColours), cardPower()
				];
				var playerCards = [
					createCard(cardElements), createCard(cardColours), cardPower(),
					createCard(cardElements), createCard(cardColours), cardPower(),
					createCard(cardElements), createCard(cardColours), cardPower(),
					createCard(cardElements), createCard(cardColours), cardPower(),
					createCard(cardElements), createCard(cardColours), cardPower(),
					createCard(cardElements), createCard(cardColours), cardPower()
				];
				message.channel.send("Bot Cards:\n" + ":one: " + botCards[0] + botCards[1] + botCards[2] + "\n" + ":two: " + botCards[3] + botCards[4] + botCards[5] + "\n" + ":three: " + botCards[6] + botCards[7] + botCards[8] + "\n" + ":four: " + botCards[9] + botCards[10] + botCards[11] + "\n" + ":five: " + botCards[12] + botCards[13] + botCards[14] + "\n" + ":six: " + botCards[15] + botCards[16] + botCards[17]);
				message.channel.send("Player Cards:\n" + ":one: " + playerCards[0] + playerCards[1] + playerCards[2] + "\n" + ":two: " + playerCards[3] + playerCards[4] + playerCards[5] + "\n" + ":three: " + playerCards[6] + playerCards[7] + playerCards[8] + "\n" + ":four: " + playerCards[9] + playerCards[10] + playerCards[11] + "\n" + ":five: " + playerCards[12] + playerCards[13] + playerCards[14] + "\n" + ":six: " + playerCards[15] + playerCards[16] + playerCards[17]);
				message.reply("Choose a card.");
				if (args[1] === "1") {
					message.reply("You chose card 1")
				}
      } else if (message.mentions.users.size == 1) {
        message.reply("TWO PLAYER MODE");
      } else {
        message.reply("Can't have more than 2 players.");
      }
      break;
    default:
      message.reply("Not a command, mate.")
  }
});
