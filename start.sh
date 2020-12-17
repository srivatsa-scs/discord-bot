if [ "${NODE_ENV}" = "production" ] 
then
   exec node ./dist/discord.bot.ts
elif [ "${NODE_ENV}" = "development" ] 
then
   exec ts-node ./src/discord.bot.ts
else
   echo "unsupported NODE_ENV value is set in .env file please only use 'development' or 'production'"
fi



