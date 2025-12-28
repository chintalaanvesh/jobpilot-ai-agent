# Deployment Guide for JobPilot

## Prerequisites

Before deploying, ensure:
- ✅ All local tests pass (see TESTING_GUIDE.md)
- ✅ Supabase project is set up
- ✅ n8n workflow is working locally
- ✅ GitHub repository is ready (or create one)

---

## Part 1: Prepare for Deployment

### Step 1: Create GitHub Repository

1. **Go to GitHub:** https://github.com/new
2. **Repository name:** `jobpilot` (or your preferred name)
3. **Visibility:** Private (recommended) or Public
4. **Click:** "Create repository"

### Step 2: Push Code to GitHub

Open terminal in your project folder:

```bash
cd /c/Users/anves/Documents/FindJob-Website/jobpilot

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - JobPilot SaaS"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/jobpilot.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Verify:** Check GitHub - all your files should be there.

---

## Part 2: Deploy to Vercel

### Step 1: Sign Up / Log In to Vercel

1. **Go to:** https://vercel.com
2. **Sign up** with GitHub account (recommended)
3. **Grant access** to your repositories

### Step 2: Import Project

1. **Click:** "Add New..." → "Project"
2. **Select:** Your GitHub repository (`jobpilot`)
3. **Click:** "Import"

### Step 3: Configure Build Settings

Vercel will auto-detect Next.js. Verify:

- **Framework Preset:** Next.js
- **Root Directory:** `./` (leave as default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

**Click:** "Deploy" (but wait! We need to add environment variables first)

### Step 4: Add Environment Variables

Before deploying, click **"Environment Variables"** and add:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://cjtfgfjfuszinsfnhmrf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqdGZnZmpmdXN6aW5zZm5obXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MjA1MjcsImV4cCI6MjA4MTk5NjUyN30.M7ZiB6UB7jPiCn-Elme-DaWg1HcFKiHgdkwhJFcrylg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqdGZnZmpmdXN6aW5zZm5obXJmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQyMDUyNywiZXhwIjoyMDgxOTk2NTI3fQ.Ay0LuIX7L5H44aniJqr_gvKOik5GbRURPVWZFO19yJM

# n8n
N8N_WEBHOOK_URL=https://m08.app.n8n.cloud/webhook/af3b6e70-33da-447a-b11c-416ec2c96de3
N8N_WEBHOOK_SECRET=jobpilot_webhook_secret_2025_secure_key_change_in_production

# App URL - UPDATE THIS AFTER DEPLOYMENT
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

**Important:**
- For each variable, select **"All Environments"** (Production, Preview, Development)
- We'll update `NEXT_PUBLIC_APP_URL` after deployment

### Step 5: Deploy

1. **Click:** "Deploy"
2. **Wait:** 2-5 minutes for build to complete
3. **Expected:** "Congratulations! Your project has been deployed."

### Step 6: Get Your Production URL

After deployment:
1. **Copy your URL:** `https://jobpilot-abc123.vercel.app` (yours will be different)
2. **Go back to Settings** → Environment Variables
3. **Edit** `NEXT_PUBLIC_APP_URL`:
   - Value: `https://jobpilot-abc123.vercel.app` (your actual URL)
   - Click "Save"

### Step 7: Redeploy with Updated URL

1. **Go to:** Deployments tab
2. **Click:** "..." menu on latest deployment → "Redeploy"
3. **Click:** "Redeploy" to confirm
4. **Wait:** for redeployment to complete

---

## Part 3: Configure Supabase for Production

### Step 1: Update Auth Redirect URLs

1. **Go to:** Supabase Dashboard → Authentication → URL Configuration
2. **Site URL:** `https://jobpilot-abc123.vercel.app` (your Vercel URL)
3. **Redirect URLs:** Add these URLs:
   ```
   https://jobpilot-abc123.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```
4. **Click:** "Save"

### Step 2: Verify Email Templates

1. **Go to:** Supabase Dashboard → Authentication → Email Templates
2. **Confirm Email Template:**
   - Verify the confirmation link uses: `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup`
3. **If needed, update to:**
   ```html
   <h2>Confirm your signup</h2>
   <p>Follow this link to confirm your email:</p>
   <p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup">Confirm your email</a></p>
   ```

---

## Part 4: Configure n8n for Production

### Update n8n Workflow

**Final HTTP Request Node (Send Results):**

Change the URL from:
```
http://localhost:3000/api/webhooks/n8n
```

To:
```
https://jobpilot-abc123.vercel.app/api/webhooks/n8n
```

**Steps:**
1. Open n8n workflow
2. Find "Send Results to JobPilot" HTTP Request node
3. Update URL to production URL
4. Keep header `x-webhook-secret` the same
5. **Save** workflow
6. **Activate** workflow (toggle switch)

---

## Part 5: Test Production Deployment

### Step 1: Test Signup Flow

1. **Open:** `https://jobpilot-abc123.vercel.app` (your URL)
2. **Click:** "Sign Up"
3. **Create account** with a new email (use real email to test verification)
4. **Upload resume**
5. **Submit**
6. **Expected:**
   - Redirected to "Check Your Email" page
   - Email received with verification link
   - Click link → Success page
   - Log in → Dashboard

### Step 2: Test Job Search

1. **Create a new job search** with filters
2. **Expected:**
   - Run created
   - n8n workflow triggered
   - Status shows "processing"

3. **Wait for n8n to complete** (or test with simulated callback)

4. **Verify results** appear in dashboard

### Step 3: Test Simulated n8n Callback (Production)

If you want to test without waiting for full n8n workflow:

```bash
# Use the production URL
curl -X POST https://jobpilot-abc123.vercel.app/api/webhooks/n8n \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: jobpilot_webhook_secret_2025_secure_key_change_in_production" \
  -d '{
    "runId": "YOUR_PRODUCTION_RUN_ID",
    "secret": "jobpilot_webhook_secret_2025_secure_key_change_in_production",
    "jobs": [
      {
        "title": "Test Job",
        "company": "Test Company",
        "location": "Test Location",
        "score": 80,
        "description": "Test description",
        "applyLink": "https://linkedin.com/jobs/test",
        "coverLetter": "Test cover letter",
        "mailDraft": "Test email"
      }
    ]
  }'
```

---

## Part 6: Optional - Custom Domain

### Step 1: Add Custom Domain in Vercel

1. **Go to:** Vercel Dashboard → Your Project → Settings → Domains
2. **Add Domain:** `jobpilot.com` (your domain)
3. **Follow instructions** to configure DNS

### Step 2: Update Environment Variables

After domain is configured:

1. **Update** `NEXT_PUBLIC_APP_URL` to `https://jobpilot.com`
2. **Redeploy** the app
3. **Update Supabase** redirect URLs to use new domain
4. **Update n8n** webhook URL to use new domain

---

## Part 7: Monitoring & Maintenance

### Monitor Logs

**Vercel Logs:**
1. **Go to:** Vercel Dashboard → Your Project → Logs
2. **View:** Real-time logs, function logs, build logs

**Supabase Logs:**
1. **Go to:** Supabase Dashboard → Logs
2. **View:** Database logs, API logs

**n8n Logs:**
1. **Go to:** n8n → Workflow → Executions
2. **View:** Execution history, errors

### Common Production Issues

**Issue: 500 Error on deployment**
- Check Vercel logs for errors
- Verify all environment variables are set
- Check database connection

**Issue: Email verification not working**
- Verify Supabase redirect URLs include production domain
- Check email template has correct callback URL
- Check spam folder

**Issue: n8n not receiving webhooks**
- Verify n8n workflow is activated
- Check n8n webhook URL in environment variables
- Test with curl to verify connectivity

---

## Part 8: Continuous Deployment

### Automatic Deployments

Every time you push to GitHub, Vercel will automatically:
1. Build your app
2. Run tests (if configured)
3. Deploy to production
4. Keep previous deployments for rollback

### Deploy Updates

```bash
# Make your changes
git add .
git commit -m "Add new feature"
git push origin main

# Vercel automatically deploys!
```

### Rollback

If something goes wrong:
1. **Go to:** Vercel → Deployments
2. **Find:** Previous working deployment
3. **Click:** "..." → "Promote to Production"

---

## Security Checklist

Before going live:

- [ ] Change `N8N_WEBHOOK_SECRET` to a strong, unique value
- [ ] Verify Supabase RLS policies are enabled
- [ ] Check that `SUPABASE_SERVICE_ROLE_KEY` is only used server-side
- [ ] Enable HTTPS only (Vercel does this by default)
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Configure rate limiting (future enhancement)
- [ ] Review Supabase authentication settings
- [ ] Test all API endpoints with invalid data

---

## Performance Optimization

### Future Enhancements

1. **Add caching** for API responses
2. **Optimize images** (use Next.js Image component)
3. **Add database indexes** for frequently queried fields
4. **Implement pagination** for large job lists
5. **Add loading skeletons** for better UX
6. **Set up CDN** (Vercel Edge Network)

---

## Support & Troubleshooting

### Getting Help

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs

### Backup Strategy

1. **Database:** Supabase automatically backs up daily
2. **Code:** GitHub repository is your backup
3. **Environment Variables:** Keep a secure copy in password manager

---

## Cost Estimates

### Free Tier (Good for testing)

- **Vercel:** Free tier includes unlimited deployments
- **Supabase:** Free tier includes 500MB database, 1GB storage
- **n8n:** Cloud starter (check current pricing)

### Paid Tier (For production)

- **Vercel Pro:** ~$20/month (custom domains, analytics)
- **Supabase Pro:** ~$25/month (more storage, better performance)
- **n8n Cloud:** Variable based on executions

---

## Next Steps After Deployment

1. ✅ Share with beta users
2. ✅ Collect feedback
3. ✅ Monitor usage and errors
4. ✅ Iterate on features
5. ✅ Plan marketing and launch

---

## Congratulations! 🎉

Your JobPilot app is now live and ready to help users automate their job search!

**Production URL:** https://jobpilot-abc123.vercel.app

Start sharing and getting feedback! 🚀
