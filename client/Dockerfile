# Use the official Nginx image as base
FROM nginx:alpine

WORKDIR /app

# Copy the built files from your local dist folder to the Nginx html directory
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]