# Step 1: Use an official Node.js image as the base image
FROM node:18-alpine AS build

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json files to the working directory
COPY package.json ./
COPY package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the entire project to the working directory
COPY . .

# Step 6: Build the React app for production
RUN npm run build

# Step 7: Use a smaller, lightweight image for serving the app
FROM nginx:alpine

# Step 8: Copy the build output from the previous stage to the Nginx container's default directory
COPY --from=build /app/build /usr/share/nginx/html


# Step 9: Expose port 80 to the outside world
EXPOSE 80

# Step 10: Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
