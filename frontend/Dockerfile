FROM node:22-alpine

WORKDIR /app

# Accept frontend API base at build time (Vite inlines VITE_ vars during build)
ARG VITE_API_BASE=""
ENV VITE_API_BASE=${VITE_API_BASE}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application (VITE_API_BASE is consumed at build time)
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
