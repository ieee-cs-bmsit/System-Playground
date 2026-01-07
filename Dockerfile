# Stage 1: Build WASM and Frontend
FROM rust:1.75 as wasm-builder

# Install wasm-pack
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Set working directory
WORKDIR /app

# Copy simulation engine
COPY simulation-engine simulation-engine

# Build WASM
WORKDIR /app/simulation-engine
RUN wasm-pack build --target web --release

# Stage 2: Build Frontend
FROM node:20-alpine as frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source and WASM
COPY . .
COPY --from=wasm-builder /app/simulation-engine/pkg ./simulation-engine/pkg

# Build frontend
RUN npm run build

# Stage 3: Production
FROM nginx:alpine

# Copy built frontend
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|wasm)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
