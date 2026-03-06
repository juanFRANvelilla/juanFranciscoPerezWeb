FROM cgr.dev/chainguard/nginx:latest

# Copy your custom nginx.conf to the Nginx configuration directory
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy your HTML website files to the Nginx webroot directory
COPY ./ /usr/share/nginx/html

# Expose port 8080 for Nginx
EXPOSE 8080