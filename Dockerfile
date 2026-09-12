FROM node:20

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install -g @angular/cli && npm install

# Copy rest of the app
COPY . .

# Expose Angular dev server port
EXPOSE 4500

# Run Angular in development mode
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4500"]
