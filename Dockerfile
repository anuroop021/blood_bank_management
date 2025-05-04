# Use Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json for frontend and install dependencies
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the frontend files into the container (assuming they are in the 'src' folder)
COPY src ./src

# Copy everything from the parent directory except backend
COPY . . 

# Expose the ports for frontend
EXPOSE 3000

# Set environment for frontend
CMD ["npm", "start"]
