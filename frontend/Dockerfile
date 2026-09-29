# Frontend Dockerfile supporting development with hot-reload and production
FROM node:20-alpine

WORKDIR /app

# Install dependencies first for Docker caching
COPY package.json ./
RUN npm install

# Copy application code
COPY . .

# Expose Vite development server port
EXPOSE 5173

ENV HOST=0.0.0.0
ENV PORT=5173

# Start Vite dev server bound to all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
