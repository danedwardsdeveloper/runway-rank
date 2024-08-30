# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.2.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install pnpm
ARG PNPM_VERSION=9.5.0
RUN npm install -g pnpm@$PNPM_VERSION

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Copy only the files needed for installation
COPY --link package.json ./

# Install node modules
# CHANGE: Install only production dependencies
RUN pnpm install

# Copy only the necessary files
COPY . . 

# Remove development dependencies
RUN pnpm prune --prod

# Final stage for app image
FROM base

# Copy built application from the 'build' stage
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json

# Set the working directory
WORKDIR /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
# CHANGE: Kept original start command
CMD [ "node", "dist/proxy.js" ]