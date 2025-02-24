# Use an official Node runtime as a parent image
FROM node:18.17.0

# Set the working directory in the container
WORKDIR /mnt/HydroShark/hydroshark-admin

# Copy package.json and package-lock.json to the working directory
COPY ./package*.json ./

# Install dependencies
RUN npm install
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

#run build
RUN npm run build

#port
EXPOSE 3000

# Run React App
CMD ["npm","start"]