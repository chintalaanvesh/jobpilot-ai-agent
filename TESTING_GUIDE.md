# Testing Guide for JobPilot

## Part 1: Local Testing (localhost:3000)

### Step 1: Test User Signup & Resume Upload

1. Open browser: `http://localhost:3000`
2. Click "Sign Up"
3. Fill form:
   - Email: `test@example.com`
   - Password: `password123`
   - Upload a PDF resume
4. Click "Create Account"
5. Check email and verify
6. Log in with credentials
7. Verify you reach the dashboard

**Expected:** Dashboard shows "No job searches yet"

---

### Step 2: Verify Supabase Data

Go to Supabase Dashboard → Table Editor:

1. **Check `auth.users` table:**
   - Should have your user record
   - Email confirmed: ✅

2. **Check `profiles` table:**
   - Should have matching user ID and email

3. **Check Storage → `resumes` bucket:**
   - Should have file: `{user_id}/resume.pdf`

---

### Step 3: Create Test Job Search Run

**Option A: Via UI (Recommended)**

1. In dashboard, click "New Job Search" or "Run Job Search"
2. Fill out the search form:
   - Keywords: `Product Manager`
   - Location: `Bangalore`
   - Experience: Select "Entry level" and "Mid-Senior level"
   - Remote: Select "Remote" and "Hybrid"
   - Job Type: Select "Full-time"
   - Easy Apply: ✅ Checked
   - Min Score: `50`
3. Click "Start Search"
4. **Expected:** Redirected to `/dashboard/{runId}` with loading state

**Option B: Via API (For Testing)**

Use this curl command to create a run:

```bash
# First, get your auth token from browser DevTools → Application → Cookies → sb-access-token
# Then run:

curl -X POST http://localhost:3000/api/runs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "filters": {
      "keywords": "Product Manager",
      "location": "Bangalore",
      "experienceLevel": ["Entry level", "Mid-Senior level"],
      "remote": ["Remote", "Hybrid"],
      "jobType": ["Full-time"],
      "easyApply": true,
      "minScore": 50
    }
  }'
```

**Expected Response:**
```json
{
  "runId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### Step 4: Verify n8n Was Triggered

**Check Next.js Console:**

You should see logs indicating the n8n webhook was called.

**Check n8n Workflow:**

1. Go to your n8n instance
2. Click on your workflow
3. Check "Executions" tab
4. You should see a new execution started

**If n8n didn't trigger:**
- Check `N8N_WEBHOOK_URL` in `.env.local`
- Check n8n workflow is activated
- Check n8n webhook URL is correct

---

### Step 5: Test n8n Callback (Simulate Results)

Since the full n8n workflow takes time, let's simulate it sending results back:

**Create test file:** `test-n8n-callback.json`

```json
{
  "runId": "YOUR_RUN_ID_HERE",
  "secret": "jobpilot_webhook_secret_2025_secure_key_change_in_production",
  "jobs": [
    {
      "title": "Senior Product Manager",
      "company": "Tech Innovations Inc",
      "location": "Bangalore, Karnataka, India (Remote)",
      "score": 85,
      "description": "We are seeking an experienced Product Manager to lead our platform team. You will work closely with engineering, design, and business stakeholders to define product roadmap and deliver impactful features.",
      "applyLink": "https://www.linkedin.com/jobs/view/1234567890",
      "coverLetter": "Dear Hiring Manager,\n\nI am writing to express my strong interest in the Senior Product Manager position at Tech Innovations Inc. With over 5 years of product management experience in B2B SaaS, I have successfully led cross-functional teams to deliver customer-centric solutions.\n\nI am excited about the opportunity to bring my expertise to your team.",
      "mailDraft": "I know you are super busy so I will keep this short.\n\nI noticed your posting for Senior Product Manager and believe my 5 years of product experience aligns perfectly with what you're looking for.\n\nPlease find my resume attached."
    },
    {
      "title": "Product Manager",
      "company": "Startup XYZ",
      "location": "Bangalore, Karnataka, India (Hybrid)",
      "score": 72,
      "description": "Join our fast-growing startup as a Product Manager. You'll own the product roadmap and work with a talented team to build innovative solutions.",
      "applyLink": "https://www.linkedin.com/jobs/view/9876543210",
      "coverLetter": "Dear Hiring Manager,\n\nI am excited to apply for the Product Manager role at Startup XYZ. Your mission to transform the industry resonates with my passion for building impactful products.\n\nI would love to discuss how I can contribute to your growth.",
      "mailDraft": "I know you are super busy so I will keep this short.\n\nYour Startup XYZ posting caught my attention. I've been following your growth and would love to contribute.\n\nPlease find my resume attached."
    }
  ]
}
```

**Replace `YOUR_RUN_ID_HERE` with the actual run ID from Step 3.**

**Send the callback:**

```bash
curl -X POST http://localhost:3000/api/webhooks/n8n \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: jobpilot_webhook_secret_2025_secure_key_change_in_production" \
  -d @test-n8n-callback.json
```

**Expected Response:**
```json
{
  "success": true,
  "jobsInserted": 2
}
```

---

### Step 6: View Results in Dashboard

1. Go back to your browser: `http://localhost:3000/dashboard/{runId}`
2. The page should auto-refresh and show the jobs
3. You should see:
   - Run status: "completed"
   - 2 jobs listed
   - Each job with score badge, title, company, location
4. Click on a job to expand and see:
   - Full description
   - Cover letter with "Copy" button
   - Email draft with "Copy" button
   - "Apply on LinkedIn" button

**Test the filters:**
- Move "Min Score" slider to 80
- Should only show the first job (score 85)
- Move back to 50, both jobs show

---

### Step 7: Test Copy Functionality

1. Expand a job card
2. Click "Copy" button on cover letter
3. **Expected:** "Copied!" message appears
4. Paste somewhere to verify it copied the text
5. Repeat for email draft

---

## Part 2: n8n Workflow Setup

### Configure n8n Nodes

**1. Webhook Trigger Node**

```
Node Type: Webhook
Path: /webhook/job-search
HTTP Method: POST
Authentication: None (we use custom header validation)
Response: Immediately
```

**Test Input:**
```json
{
  "runId": "test-123",
  "userId": "user-456",
  "resumeUrl": "https://example.com/resume.pdf",
  "filters": {
    "keywords": "Product Manager",
    "location": "Bangalore",
    "experienceLevel": "Entry level,Mid-Senior level",
    "remote": "Remote,Hybrid",
    "jobType": "Full-time",
    "easyApply": true,
    "minScore": 50
  }
}
```

**2. Final HTTP Request Node (Send Results Back)**

```
Node Type: HTTP Request
Method: POST
URL: http://localhost:3000/api/webhooks/n8n

Headers:
  Content-Type: application/json
  x-webhook-secret: jobpilot_webhook_secret_2025_secure_key_change_in_production

Body (JSON):
{
  "runId": "{{ $('Webhook Trigger').first().json.runId }}",
  "secret": "jobpilot_webhook_secret_2025_secure_key_change_in_production",
  "jobs": {{ $json.jobs }}
}
```

**Note:** You'll need to aggregate your jobs array before this node.

---

## Part 3: Troubleshooting

### Issue: Email not received

**Solution:**
1. Check Supabase Dashboard → Authentication → Email Templates
2. Verify email provider is configured
3. Check spam folder
4. For testing, disable email confirmation:
   - Supabase Dashboard → Authentication → Providers → Email
   - Uncheck "Confirm email"

### Issue: n8n not triggered

**Solution:**
1. Check `.env.local` has correct `N8N_WEBHOOK_URL`
2. Verify n8n workflow is activated
3. Check Next.js console for errors
4. Test n8n webhook URL with curl

### Issue: Jobs not appearing in dashboard

**Solution:**
1. Check browser console for errors
2. Verify run status is "completed" in Supabase
3. Check `jobs` table in Supabase has records
4. Refresh the page manually

### Issue: "Resume not uploaded" error

**Solution:**
1. Check Supabase Storage → `resumes` bucket
2. Verify file exists: `{user_id}/resume.pdf`
3. Check storage policies are set correctly
4. Try uploading resume again in settings (if you add that page)

---

## Next Steps

Once all tests pass:
1. ✅ Proceed to deployment (see DEPLOYMENT_GUIDE.md)
2. ✅ Update environment variables for production
3. ✅ Test the full flow in production
