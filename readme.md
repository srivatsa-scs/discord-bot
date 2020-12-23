#xAtri's Discord Bot

Hey! This is a Discord Bot written in Typescript, which can be compiled to JS or run directly via ts-node.
This project uses MongoDB to store API keys in the cloud, log4Js to do it's logging.

If you wish to run this yourself on your machine

#Pre-requisites

1. Git
2. Node / npm
3. Guild Wars 2 Account | Your api key can be created here https://account.arena.net/applications
4. Discord Account | The necessary tokens etc for your bot can be found using this guide https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot
5. A MongoDB Account & their free 500 MB server DB | https://cloud.mongodb.com/

#Running the bot

1. git clone <link to the repo>
2. Run npm install
3. Set up the config.json file (additional information in the config.sample.json). The bot will not work if this is left empty.
4. npm run start

---

This bot has watches your arcdps.cbtlogs folder on your windows system (or network share) and looks for .zevtc files for ARC DPS and automatically uploads them to your channel of your choosing.
