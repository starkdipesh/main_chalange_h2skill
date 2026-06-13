# Deployment & Production Guide

## Pre-Deployment Checklist

### Backend
- [ ] All dependencies in package.json
- [ ] .env.example has all required variables
- [ ] Error handling in all endpoints
- [ ] Gemini API key tested and working
- [ ] CORS configuration reviewed
- [ ] Health check endpoint working
- [ ] No console.logs in production code (optional)
- [ ] Rate limiting considered (optional)

### Frontend
- [ ] No hardcoded API URLs (use proxy or env vars)
- [ ] All components tested locally
- [ ] Build completes without errors (`npm run build`)
- [ ] dist/ folder generated
- [ ] No console errors in browser
- [ ] Responsive design verified on mobile
- [ ] Accessibility features checked

---

## Backend Deployment Options

### Option 1: Render (Recommended for Beginners)

1. **Prepare Repository**
   - Initialize git: `git init`
   - Add files: `git add .`
   - Commit: `git commit -m "Initial commit"`

2. **Create Render Account**
   - Visit [render.com](https://render.com)
   - Sign up with GitHub

3. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect GitHub repo
   - Configuration:
     ```
     Build Command: npm install
     Start Command: npm start
     Environment: Node
     ```
   - Add Environment Variable:
     - Key: `GEMINI_API_KEY`
     - Value: Your actual API key

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete
   - Your URL: `https://your-app.onrender.com`

### Option 2: Railway

1. Visit [railway.app](https://railway.app)
2. Create project, select Node.js
3. Connect GitHub repo
4. Add environment variables
5. Deploy automatically on push

### Option 3: Heroku (No Longer Free - Alternative)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set GEMINI_API_KEY=your_key

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Option 4: Self-Hosted (VPS like DigitalOcean, AWS)

1. **SSH into Server**
   ```bash
   ssh root@your_server_ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

3. **Clone Repository**
   ```bash
   git clone your_repo_url
   cd your_repo/backend
   npm install
   ```

4. **Setup Environment**
   ```bash
   nano .env
   # Add GEMINI_API_KEY and PORT
   ```

5. **Use Process Manager (PM2)**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "wellness-tracker"
   pm2 startup
   pm2 save
   ```

6. **Setup Reverse Proxy (Nginx)**
   ```bash
   sudo apt install nginx
   
   # Create config
   sudo nano /etc/nginx/sites-available/default
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo systemctl restart nginx
   ```

7. **Enable HTTPS (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Frontend Deployment Options

### Option 1: Vercel (Recommended - Zero Config)

1. **Build Locally First**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   # Follow prompts, select dist/ as build output
   ```

3. **Configure API URL**
   - In Vercel Dashboard: Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend.com`
   - Update `frontend/vite.config.js`:
     ```javascript
     server: {
       proxy: {
         '/api': {
           target: process.env.VITE_API_URL || 'http://localhost:5000'
         }
       }
     }
     ```

### Option 2: Netlify

1. **Connect GitHub**
   - Visit [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your repo

2. **Configure Build**
   ```
   Build command: cd frontend && npm run build
   Publish directory: frontend/dist
   ```

3. **Add Environment Variables**
   - Settings → Build & Deploy → Environment
   - Add any env vars needed

4. **Deploy**
   - Automatic on push to main branch

### Option 3: GitHub Pages (Static Only)

```bash
cd frontend

# Install gh-pages
npm install --save-dev gh-pages

# Update package.json
# Add: "homepage": "https://yourusername.github.io/repo-name"
# Add scripts: "predeploy": "npm run build", "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

### Option 4: Self-Hosted (Same as Backend VPS)

```bash
# Copy dist folder to server
scp -r frontend/dist/* root@your_server:/var/www/html/

# Or with nginx config
sudo nano /etc/nginx/sites-available/default
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://your-backend-domain.com;
    }
}
```

---

## Database Migration (From Session Store)

### Option 1: MongoDB

```javascript
// backend/models/User.js
import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  text: String,
  mood: Number,
  analysis: {
    hiddenTriggers: [String],
    emotionalPatterns: String,
    burnoutRisk: String
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('Journal', journalSchema);
export default User;
```

```javascript
// Update server.js
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI);

app.post('/api/journal', async (req, res) => {
  const { text, mood } = req.body;
  // ... analysis ...
  const journal = new Journal({ text, mood, analysis });
  await journal.save();
  res.json({ success: true, analysis });
});
```

### Option 2: PostgreSQL

```bash
npm install pg
```

```javascript
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

await client.connect();

app.post('/api/journal', async (req, res) => {
  const { text, mood } = req.body;
  // ... analysis ...
  await client.query(
    'INSERT INTO journals (text, mood, analysis) VALUES ($1, $2, $3)',
    [text, mood, JSON.stringify(analysis)]
  );
  res.json({ success: true, analysis });
});
```

### Option 3: Firebase/Firestore

```bash
npm install firebase-admin
```

```javascript
import admin from 'firebase-admin';

const db = admin.firestore();

app.post('/api/journal', async (req, res) => {
  const { text, mood } = req.body;
  // ... analysis ...
  await db.collection('journals').add({
    text,
    mood,
    analysis,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });
  res.json({ success: true, analysis });
});
```

---

## Environment Variables (Production)

### Backend (.env)
```
# API Keys
GEMINI_API_KEY=your_production_key_here

# Server
PORT=5000
NODE_ENV=production

# Database (if using)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
DATABASE_URL=postgresql://user:password@host:5432/dbname

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Security
JWT_SECRET=your_secret_key (if using auth)
```

### Frontend (.env or vite.config.js)
```
VITE_API_URL=https://api.yourdomain.com
VITE_ENVIRONMENT=production
```

---

## Monitoring & Logging

### Backend Error Tracking (Sentry)

```bash
npm install @sentry/node
```

```javascript
import * as Sentry from "@sentry/node";

Sentry.init({ dsn: process.env.SENTRY_DSN });

app.use(Sentry.Handlers.requestHandler());

// ... routes ...

app.use(Sentry.Handlers.errorHandler());
```

### Server Monitoring

- **Uptime Monitoring:** UptimeRobot (free)
- **Error Alerts:** SendGrid, Slack webhooks
- **Performance:** New Relic, Datadog (paid)
- **Logs:** Loggly, LogRocket

### Health Check Script

```bash
#!/bin/bash
# health-check.sh

BACKEND_URL="https://your-backend.com/api/health"
RESPONSE=$(curl -s $BACKEND_URL)

if [[ $RESPONSE == *"ok"* ]]; then
  echo "✅ Backend is healthy"
else
  echo "❌ Backend is down"
  # Send alert
fi
```

---

## Performance Optimization

### Backend

1. **Enable Compression**
   ```javascript
   import compression from 'compression';
   app.use(compression());
   ```

2. **Caching Headers**
   ```javascript
   app.use((req, res, next) => {
     res.setHeader('Cache-Control', 'public, max-age=3600');
     next();
   });
   ```

3. **Rate Limiting**
   ```javascript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   });
   
   app.use('/api/', limiter);
   ```

### Frontend

1. **Build Optimization**
   ```bash
   npm run build
   # Check bundle size: npm install -g vite-bundle-visualizer
   ```

2. **Image Optimization**
   - Use WebP format
   - Lazy load images
   - Responsive images with srcset

3. **Code Splitting** (Vite auto-handles)

---

## Security Hardening

### Backend Security

```javascript
// Add helmet for security headers
import helmet from 'helmet';
app.use(helmet());

// Rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 // requests per windowMs
});
app.use(limiter);

// Input validation
import validator from 'validator';
if (!validator.isLength(text, { min: 1, max: 5000 })) {
  return res.status(400).json({ error: 'Invalid input' });
}

// HTTPS enforcement
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### Frontend Security

```javascript
// Content Security Policy
// Set in nginx/server config
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'";

// Secure cookies (if using)
document.cookie = "auth=token; Secure; HttpOnly; SameSite=Strict";
```

---

## Troubleshooting Deployment

### Issue: Backend endpoint returns 500
- Check server logs: `heroku logs --tail` or `pm2 logs`
- Verify API key in production environment
- Test with `curl https://your-backend.com/api/health`

### Issue: Frontend can't reach backend
- Check CORS configuration
- Verify API URL in frontend config
- Check network tab in browser DevTools
- Ensure backend is running and accessible

### Issue: Gemini API rate limited
- Upgrade API quota in Google Cloud Console
- Implement caching for repeated queries
- Add exponential backoff retry logic

### Issue: Database connection timeout
- Check connection string
- Verify firewall rules allow connection
- Ensure database is running
- Check network connectivity from server

---

## Rollback Procedure

### Render/Railway
- Dashboard → Deployments → Select previous version → Redeploy

### Vercel
- Dashboard → Deployments → Right-click previous → Promote to Production

### Manual Server
```bash
# Check running version
pm2 logs wellness-tracker

# Rollback to previous code
git revert HEAD
git push origin main

# Or manually
pm2 restart wellness-tracker
```

---

## Backup Strategy

```bash
# Backup database daily
0 2 * * * mysqldump -u user -p password dbname > /backup/backup-$(date +\%Y\%m\%d).sql

# Backup uploads
0 3 * * * tar -czf /backup/uploads-$(date +\%Y\%m\%d).tar.gz /app/uploads/

# Verify backups
ls -lh /backup/ | tail -10
```

---

## Cost Estimation (Monthly)

| Service | Free Tier | Paid |
|---------|-----------|------|
| Backend Hosting (Render) | 0.5 GB RAM free | $7/mo per instance |
| Frontend Hosting (Vercel) | Unlimited | N/A |
| Database (MongoDB Atlas) | 512 MB | $9+/mo |
| Gemini API | 60 requests/min | $0.075/1000 requests |
| Domain | N/A | $12/year |
| SSL Certificate | Free (Let's Encrypt) | N/A |
| **Total** | **Free** | **~$30+/month** |

---

## Production Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and built
- [ ] API URL correctly configured
- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Error monitoring setup (Sentry)
- [ ] Database backup scheduled
- [ ] Health check monitoring active
- [ ] API key rotation scheduled
- [ ] Performance metrics baseline established
- [ ] Security headers configured
- [ ] Logs centralized
- [ ] Incident response plan documented

Happy deploying! 🚀
