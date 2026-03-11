# Deployment Guide

## Production Deployment Checklist

### 1. Environment Variables

#### Backend Production .env
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_very_long_and_random_secret_key
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_production_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=Campus Dekho <noreply@campusdekho.ai>

# Frontend URL (Update with production domain)
FRONTEND_URL=https://campusdekho.ai
```

#### Frontend Production .env
```env
VITE_API_URL=https://api.campusdekho.ai/api
```

### 2. Security Hardening

#### Update server.js CORS Configuration
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### Add Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

#### Add Helmet for Security Headers
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 3. Database Optimization

#### Create Indexes
```javascript
// In MongoDB shell or using Mongoose
db.students.createIndex({ email: 1 }, { unique: true })
db.students.createIndex({ paymentStatus: 1 })
db.students.createIndex({ createdAt: -1 })
db.otps.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### 4. Build Frontend
```bash
cd frontend
npm run build
```

This creates optimized production build in `dist/` folder.

### 5. Deployment Options

## Option A: Deploy to Heroku

### Backend Deployment

1. **Install Heroku CLI**
```bash
npm install -g heroku
heroku login
```

2. **Create Heroku App**
```bash
cd backend
heroku create campusdekho-api
```

3. **Set Environment Variables**
```bash
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set JWT_SECRET="your_secret"
heroku config:set EMAIL_USER="your_email"
heroku config:set EMAIL_PASSWORD="your_password"
heroku config:set FRONTEND_URL="https://campusdekho.netlify.app"
```

4. **Create Procfile**
```
web: node server.js
```

5. **Deploy**
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

### Frontend Deployment (Netlify)

1. **Build Project**
```bash
cd frontend
npm run build
```

2. **Deploy to Netlify**
- Go to netlify.com
- Drag & drop `dist` folder
- Or use Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

3. **Configure Environment Variables**
- Go to Site Settings → Environment Variables
- Add `VITE_API_URL=https://campusdekho-api.herokuapp.com/api`

## Option B: Deploy to VPS (DigitalOcean, AWS, etc.)

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### 2. Deploy Backend

```bash
# Copy project to server
scp -r backend user@your-server-ip:/var/www/

# SSH to server
ssh user@your-server-ip

# Navigate to project
cd /var/www/backend

# Install dependencies
npm install --production

# Create .env file
nano .env
# (paste your production environment variables)

# Start with PM2
pm2 start server.js --name "campusdekho-api"
pm2 save
pm2 startup
```

### 3. Configure Nginx for Backend

```nginx
# /etc/nginx/sites-available/campusdekho-api

server {
    listen 80;
    server_name api.campusdekho.ai;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /var/www/backend/uploads;
        autoindex off;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/campusdekho-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Deploy Frontend

```bash
# Build frontend locally
cd frontend
npm run build

# Copy to server
scp -r dist user@your-server-ip:/var/www/campusdekho-frontend
```

### 5. Configure Nginx for Frontend

```nginx
# /etc/nginx/sites-available/campusdekho

server {
    listen 80;
    server_name campusdekho.ai www.campusdekho.ai;

    root /var/www/campusdekho-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/campusdekho /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificates
sudo certbot --nginx -d campusdekho.ai -d www.campusdekho.ai
sudo certbot --nginx -d api.campusdekho.ai

# Auto-renewal
sudo certbot renew --dry-run
```

## Option C: Deploy with Docker

### 1. Create Dockerfile for Backend

```dockerfile
# backend/Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

### 2. Create Dockerfile for Frontend

```dockerfile
# frontend/Dockerfile

FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 3. Create docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - EMAIL_USER=${EMAIL_USER}
      - EMAIL_PASSWORD=${EMAIL_PASSWORD}
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

### 4. Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Post-Deployment Tasks

### 1. Create Production Admin
```bash
# SSH to server or use Heroku CLI
node scripts/createAdmin.js
```

### 2. Test All Features
- Registration flow
- Email OTP
- File uploads
- Admin login
- Payment approval

### 3. Setup Monitoring

#### Install PM2 Web Dashboard
```bash
pm2 install pm2-server-monit
```

#### Setup Error Logging
```javascript
// Add to server.js
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Send to error tracking service (Sentry, etc.)
});
```

### 4. Backup Strategy

#### MongoDB Backup
```bash
# Create backup script
mongodump --uri="your_mongodb_uri" --out=/backups/$(date +%Y%m%d)

# Setup cron job
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

#### File Uploads Backup
```bash
# Backup uploads folder
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/

# Upload to cloud storage (AWS S3, etc.)
aws s3 cp uploads-backup-$(date +%Y%m%d).tar.gz s3://your-bucket/backups/
```

## Performance Optimization

### 1. Enable Gzip Compression
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Optimize Images
- Resize uploaded images
- Convert to WebP format
- Use image CDN

### 3. Caching Strategy
- Cache static assets (1 year)
- Cache API responses (Redis)
- Use CDN for frontend

### 4. Database Optimization
- Create proper indexes
- Use pagination for large datasets
- Implement connection pooling

## Monitoring & Maintenance

### 1. Setup Health Check Endpoint
```javascript
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    uptime: process.uptime()
  });
});
```

### 2. Setup Alerts
- Server downtime alerts
- Error rate monitoring
- Database connection issues
- Disk space monitoring

### 3. Regular Maintenance
- [ ] Update dependencies monthly
- [ ] Review error logs weekly
- [ ] Database backup daily
- [ ] Security patches immediately
- [ ] Performance monitoring daily

## Rollback Plan

### Quick Rollback Steps
1. Keep previous version tagged
2. Switch PM2 to previous version
3. Restore database backup if needed
4. Verify functionality

```bash
# Rollback with PM2
pm2 stop campusdekho-api
cd /var/www/backend-previous
pm2 start server.js --name "campusdekho-api"
```

---

**Deployment Checklist Complete! 🚀**

Remember to:
- Test thoroughly before production
- Keep backups updated
- Monitor server health
- Update dependencies regularly
- Keep documentation current
