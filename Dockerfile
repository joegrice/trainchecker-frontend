# Stage 1: Build the React application
FROM node:20-alpine as builder

WORKDIR /app

# Declare build arguments
ARG NODE_ENV=production
ARG VITE_TRAIN_CHECKER_API_BASE_URL

# Set environment variables for Vite during build
ENV NODE_ENV=${NODE_ENV}
ENV VITE_TRAIN_CHECKER_API_BASE_URL=${VITE_TRAIN_CHECKER_API_BASE_URL}

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN NODE_ENV=${NODE_ENV} VITE_TRAIN_CHECKER_API_BASE_URL=${VITE_TRAIN_CHECKER_API_BASE_URL} npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]