# Stage 1: Build React application
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source code
COPY . .

# Create production build
RUN npm run build


# Stage 2: Serve React using Nginx
FROM nginx:alpine

# Remove default Nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy React production build
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx listens on port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]