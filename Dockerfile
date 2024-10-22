# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set the environment to build
ENV NODE_ENV=build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock for installing dependencies using Yarn
COPY package.json yarn.lock ./

# Install dependencies with Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY ./ ./

# Install Prisma globally and generate the client
RUN yarn global add prisma
RUN npx prisma generate
RUN yarn prisma:m:d

# Build the NestJS application
RUN yarn build

# Stage 2: Run the application
FROM node:20-alpine

# Set the environment to production
ENV NODE_ENV=production

# Set the working directory in the container
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/package.json ./ 
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/dist/ ./dist/

# Set the command to run migrations and start the application
CMD [yarn start:prod]
