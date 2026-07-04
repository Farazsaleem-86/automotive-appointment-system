# Deployment Guide

This guide covers deploying the Automotive Appointment System to production.

## Prerequisites

- Domain name
- Server (VPS, cloud hosting, or PaaS)
- SSL certificate
- Email service account (Gmail, SendGrid, etc.)

## Deployment Options

### Option 0: GitHub Pages Frontend Deployment

The frontend is configured to build and deploy on GitHub using GitHub Actions. You do not need to build it locally.

1. Push this project to:
```bash
https://github.com/Farazsaleem-86/automotive-appointment-system
```

2. In GitHub, open the repository settings:
   - Go to **Settings**
   - Go to **Pages**
   - Set **Source** to **GitHub Actions**

3. Push to the `main` branch. The workflow at `.github/workflows/deploy-frontend.yml` will:
   - Install frontend dependencies
   - Build the Vite React app
   - Deploy `frontend/dist` to GitHub Pages

4. After the workflow succeeds, the website will be available at:
```text
https://farazsaleem-86.github.io/automotive-appointment-system/
```

To connect the deployed frontend to a deployed backend, add this GitHub Actions environment variable or repository variable before building:
```text
VITE_API_URL=https://your-backend-url
```

### Option 1: VPS/Cloud Server (Recommended)

#### Backend Deployment

1. **Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3 python3-pip python3-venv nginx -y

# Clone repository
git clone <your-repo-url>
cd appointment-system
```

2. **Environment Configuration**
```bash
cp .env.example .env
nano .env
```

Update with production values:
```env
DATABASE_URL=postgresql://user:password@localhost/appointment_system
BUSINESS_NAME=Your Business Name
BUSINESS_ADDRESS=Your Address
BUSINESS_PHONE=Your Phone
BUSINESS_EMAIL=your-email@domain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@domain.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@domain.com
SECRET_KEY=<generate-strong-secret-key>
FRONTEND_URL=https://your-domain.com
```

3. **Setup PostgreSQL** (recommended for production)
```bash
sudo apt install postgresql postgresql-contrib -y
sudo -u postgres psql
```

```sql
CREATE DATABASE appointment_system;
CREATE USER appointment_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE appointment_system TO appointment_user;
\q
```

4. **Install Dependencies**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

5. **Setup Systemd Service**
```bash
sudo nano /etc/systemd/system/appointment-api.service
```

```ini
[Unit]
Description=Appointment API Service
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/appointment-system
Environment="PATH=/path/to/appointment-system/venv/bin"
ExecStart=/path/to/appointment-system/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable appointment-api
sudo systemctl start appointment-api
```

6. **Setup Nginx Reverse Proxy**
```bash
sudo nano /etc/nginx/sites-available/appointment-system
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        root /path/to/appointment-system/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/appointment-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

#### Frontend Deployment

1. **Build Frontend**
```bash
cd frontend
npm install
npm run build
```

2. **Configure for Production**
Update `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
})
```

### Option 2: Platform as a Service (PaaS)

#### Render / Railway / Heroku

1. **Backend Deployment**
- Create a new web service
- Connect your GitHub repository
- Set environment variables
- Deploy

2. **Frontend Deployment**
- Create a new static site service
- Connect your GitHub repository
- Set build command: `cd frontend && npm install && npm run build`
- Set publish directory: `frontend/dist`
- Deploy

#### Environment Variables for PaaS
```
DATABASE_URL=postgresql://...
BUSINESS_NAME=Your Business
BUSINESS_ADDRESS=Your Address
BUSINESS_PHONE=Your Phone
BUSINESS_EMAIL=your-email@domain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@domain.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@domain.com
SECRET_KEY=your-secret-key
FRONTEND_URL=https://your-frontend-url.com
```

### Option 3: Docker Deployment

1. **Create Dockerfile**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. **Create docker-compose.yml**
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/appointment_system
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=appointment_system
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

3. **Deploy**
```bash
docker-compose up -d
```

## Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Email service is configured and tested
- [ ] SSL certificate is installed
- [ ] Automated processes (scheduler) are running
- [ ] Backups are configured
- [ ] Monitoring is set up
- [ ] Error logging is configured
- [ ] Domain DNS is configured
- [ ] Firewall rules are set up
- [ ] API endpoints are accessible
- [ ] Frontend loads correctly

## Monitoring and Maintenance

### Log Monitoring
```bash
# Check API logs
sudo journalctl -u appointment-api -f

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Backups
```bash
# Backup
pg_dump appointment_system > backup.sql

# Restore
psql appointment_system < backup.sql
```

### Updates
```bash
# Pull latest changes
git pull

# Update dependencies
source venv/bin/activate
pip install -r requirements.txt --upgrade

# Restart service
sudo systemctl restart appointment-api
```

## Troubleshooting

### Common Issues

1. **Email not sending**
   - Check email credentials
   - Verify SMTP settings
   - Check firewall rules

2. **Scheduler not working**
   - Check system service status
   - Review logs for errors
   - Verify database connection

3. **Frontend not loading**
   - Check Nginx configuration
   - Verify build output
   - Check file permissions

4. **Database connection errors**
   - Verify database is running
   - Check connection string
   - Review database logs
