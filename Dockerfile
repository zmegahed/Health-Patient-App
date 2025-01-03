# Frontend build
FROM node:18 as frontend
WORKDIR /app
COPY package*.json ./
COPY . .
RUN cd frontend && npm install --legacy-peer-deps
RUN cd frontend && npm run build

# Backend build and run
FROM node:18
WORKDIR /app
COPY package*.json ./
COPY --from=frontend /app/frontend/build ./frontend/build
COPY . .
RUN cd backend && npm install --legacy-peer-deps
RUN cd backend && npm run build
CMD ["npm", "start", "--prefix", "backend"]