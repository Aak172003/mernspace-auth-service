
# Note : 
#  We are using Multi stage build system
#  First stage is builder stage
#  Second stage is production stage

# ---------------------------------------------------------------------------------------------------

# First stage is builder stage
FROM node-18-alpine as builder

WORKDIR /app

# (app = ./ )-> current Directory
# Copy package.json and packag-lock.json (acces both file via using package*.json  ) file and copy to (app or ./ (current Directory)  both are same in docker file system) directory 

COPY package*.json ./

# 🔍 npm ci - What It Does
# npm ci is used to install dependencies in a clean, consistent way:

# 1. It uses the package-lock.json file to install exact versions.
# 2. It removes the node_modules folder if it exists before installation.
# 3. It is faster and more reliable for CI/CD and Docker because it doesn't do any package resolution — just installs exactly what is specified in package-lock.json.
RUN npm ci

# Copy the rest of our app's source code into the container
# first . represent my whole code copy into second . means docker file directory # (app = ./ )-> current Directory
COPY . .

# Execute docker build command
RUN npm run build

# Till now we perform build , so this will create dist folder inside /app directory 
# And we can access this dist folder from /app/dist directory


# ---------------------------------------------------------------------------------------------------

# Second stage is production stage
FROM node:18-alpine AS production

# This is how we set environment variable in docker file
# ENV is used to set environment variable in docker file
ENV NODE_ENV=production


WORKDIR /app

# (app = ./ )-> current Directory
# Copy package.json and packag-lock.json (acces both file via using package*.json  ) file and copy to (app or ./ (current Directory)  both are same in docker file system) directory 

COPY package*.json ./

# 🔍 npm ci --ignore-scripts - What It Does
# Basically when we have any 3rd parties script inside package.json file
# So this will automatically run when we execute npm i  or in container npm ci
# So we need to ignore this script
# So we are using --ignore-scripts flag to ignore this script
# Also it will install only dependencies not dev-dependencies
# due to this our image size will automatically reduce



# If we don't pass NODE_ENV = production so we can also ignore dev-dependencies to install using below command
# RUN npm ci --ignore-scripts --omit=dev
# --omit=dev -> this will ignore dev-dependencies

RUN npm ci --ignore-scripts 

# if step one execute , so this will create dist folder we are copy only dist folder form app

# /app/dist -> this is the dist folder that we created in builder stage
# ./ -> this is the current directory of production image
COPY --from=builder /app/dist ./

# Expose the port the app will run on
EXPOSE 5500

# this run only when we start container 
CMD [ "node" , "src/server.js" ]

