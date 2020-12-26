if [ "$(echo "${NODE_ENV}" | tr '[:upper:]' '[:lower:]')" = "production" ] 
then
   exec node --experimental-specifier-resolution=node --no-warnings ./dist/discord.bot.js
elif [ "$(echo "${NODE_ENV}" | tr '[:upper:]' '[:lower:]')" = "development" ] 
then
  exec node --loader ts-node/esm --experimental-specifier-resolution=node --no-warnings ./src/discord.bot.ts
else
   echo "unsupported NODE_ENV value is set in .env file please only use 'development' or 'production'"
fi