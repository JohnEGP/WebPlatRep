# Netlify Deployment Instructions

This CRM application is configured for deployment on Netlify with serverless functions.

## Automatic Deployment

1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Connect to Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Netlify will automatically detect the configuration from `netlify.toml`

## Manual Deployment

If you prefer to deploy manually:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy the site
netlify deploy --prod --dir=dist/spa
```

## Configuration

The project is pre-configured with:

- ✅ **Build Command**: `npm run build:client`
- ✅ **Publish Directory**: `dist/spa`
- ✅ **Functions Directory**: `netlify/functions`
- ✅ **API Redirects**: `/api/*` → `/.netlify/functions/api/:splat`
- ✅ **SPA Fallback**: All routes redirect to `index.html`

## Environment Variables

If you need to add environment variables for production:

1. Go to your Netlify site dashboard
2. Navigate to Site settings → Environment variables
3. Add any required variables

## Features Available After Deployment

- ✅ **Full CRM Dashboard**
- ✅ **Project Management System**
- ✅ **Calendar & Timeline View**
- ✅ **Stock Management with Multiple Units**
- ✅ **API Endpoints** (via Netlify Functions)
- ✅ **Responsive Design**
- ✅ **Fast Loading** (Static Generation)

## API Endpoints

After deployment, your API will be available at:

- `https://your-site.netlify.app/api/ping`
- `https://your-site.netlify.app/api/demo`

## Troubleshooting

If you encounter issues:

1. Check the Netlify build logs
2. Ensure all dependencies are in the correct sections of `package.json`
3. Verify the function is deploying correctly
4. Check the function logs in Netlify dashboard

## Performance

The deployed site will have:

- ⚡ **Fast loading** via Netlify CDN
- 🌍 **Global distribution**
- 🔧 **Automatic HTTPS**
- 📱 **Mobile optimized**
