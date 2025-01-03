# Build stage for React frontend
FROM node:18 as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build stage for backend
FROM node:18 as backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Production stage
FROM node:18
WORKDIR /app

# Copy built frontend
COPY --from=frontend-build /app/frontend/build /app/frontend/build

# Copy backend
COPY --from=backend-build /app/backend /app/backend

# Set the working directory to backend for running the server
WORKDIR /app/backend

# Start the server
CMD ["npm", "start"]