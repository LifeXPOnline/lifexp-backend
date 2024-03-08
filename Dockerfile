# Build stage
FROM node:18-alpine as builder

# Create app directory
WORKDIR /home/node

# Copy package.json, package-lock.json, tsconfig.json, etc...
COPY --chown=node:node . .

# Install app dependencies
RUN npm ci

# Creates a "dist" folder with the production build
RUN npm run build

# Production stage
FROM node:18-alpine

# Set Node.js to run in production mode
ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
