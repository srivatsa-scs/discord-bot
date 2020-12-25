#!/bin/sh

NODE_ENV=$(echo "${NODE_ENV}" | tr '[:upper:]' '[:lower:]')

ls -la
pwd

if [ "${NODE_ENV}" = "production" ] ; then 
    npm install --production=false \
    && npm run build \
    && rm -r ${BOT_HOME}/src \
    && mv ./dist/src ./src \
    && rm -r ./dist \
    && npm prune --production ;
elif [ "${NODE_ENV}" = "development" ] ; then
    npm install -D
else
    echo "ERROR build failed probably because i dont have access to env variables"
    exit 1
fi