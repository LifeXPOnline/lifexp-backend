# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node package*.json ./

# Install app dependencies
RUN npm ci

# Creates a "dist" folder with the production build
RUN npm run build

# Bundle app source and dependencies
COPY --chown=node:node dist ./dist
COPY --chown=node:node node_modules ./node_modules

# Set Node.js to run in production mode
ENV NODE_ENV production

# Avoid running as root
USER node

# Start the server using the production build
CMD [ "node", "main.js" ]

