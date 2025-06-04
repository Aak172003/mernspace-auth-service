# Use the official Node.js image as our base ( means to docker our docker image we are using other )
FROM node:18

# Set the working directory inside the container
# means our whole code present in this directory 
WORKDIR /usr/src/app

# (/usr/src/app = ./ )-> current Directory
# Copy package.json and packag-lock.json (acces both file via using package*.json  ) file and copy to (/usr/src/app or ./ (current Directory)  both are same in docker file system) directory 

COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of our app's source code into the container
# first . represent my whole code copy into second . means docker file directory # (/usr/src/app = ./ )-> current Directory
COPY . .

# Expose the port the app will run on
EXPOSE 5501

# The command to run our app
CMD ["npm", "run", "dev"]