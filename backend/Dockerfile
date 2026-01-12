FROM node:20-alpine

WORKDIR /app

# Install dependencies for SQLite
RUN apk add --no-cache python3 make g++ curl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create data directory
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Default command (overridden by docker-compose)
CMD ["npm", "run", "dev"]
