# CMS — Vercel Deployment

## Project structure
```
cms-vercel/
├── api/
│   ├── _lib.js          # Shared DB + JWT helpers
│   ├── login.js         # POST /api/login
│   ├── pages.js         # GET/POST/PUT/DELETE /api/pages
│   ├── articles.js      # GET/POST/PUT/DELETE /api/articles
│   └── upload.js        # POST /api/upload (TinyMCE images)
├── public/
│   ├── index.html       # SPA entry point
│   ├── css/style.css
│   ├── js/app.js        # All frontend logic
│   └── data/pages.json  # Seed nav pages
├── vercel.json
├── package.json
└── .env.example
```

## Setup steps

### 1. PlanetScale database
1. Create a free database at https://planetscale.com
2. Run this SQL to create your tables:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user'
);

CREATE TABLE articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  page_slug VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT NOW()
);

-- Insert your admin user
INSERT INTO users (username, password, role) VALUES ('admin', 'yourpassword', 'admin');
```

3. Get your connection string from PlanetScale dashboard → Connect → Node.js

### 2. Add environment variables to Vercel
Go to Vercel → Your Project → Settings → Environment Variables and add:

| Key | Value |
|-----|-------|
| DB_HOST | (from PlanetScale) |
| DB_USER | (from PlanetScale) |
| DB_PASS | (from PlanetScale) |
| DB_NAME | cms |
| JWT_SECRET | any long random string |

### 3. Deploy
```bash
npm install
vercel --prod
```

## How auth works
- Login returns a JWT token stored in `localStorage`
- Every API request sends `Authorization: Bearer <token>`
- Admin-only routes verify the token server-side
