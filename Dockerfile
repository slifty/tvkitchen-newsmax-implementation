FROM node:18-buster

RUN apt-get update && apt-get -y install \
	ffmpeg

# Create a directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY src ./src
RUN yarn build

ENTRYPOINT [ "yarn", "start" ]
