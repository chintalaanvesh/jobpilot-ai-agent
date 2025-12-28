# n8n Configuration Quick Reference

## HTTP Request Node - Final Callback Configuration

**Node Name:** Send Results to JobPilot
**Node Type:** HTTP Request
**Purpose:** Send processed jobs back to Next.js app

---

## 🔧 Configuration

### Basic Settings

| Setting | Value |
|---------|-------|
| **Method** | POST |
| **URL** | See below for environment |
| **Authentication** | None (using custom header) |
| **Response Format** | JSON |

### URLs by Environment

| Environment | URL |
|-------------|-----|
| **Local Development** | `http://localhost:3000/api/webhooks/n8n` |
| **Production (Vercel)** | `https://your-app.vercel.app/api/webhooks/n8n` |
| **Production (Custom Domain)** | `https://jobpilot.com/api/webhooks/n8n` |

---

## 📋 Headers

Add these headers to your HTTP Request node:

```
Content-Type: application/json
x-webhook-secret: jobpilot_webhook_secret_2025_secure_key_change_in_production
```

**In n8n UI:**

| Name | Value |
|------|-------|
| `Content-Type` | `application/json` |
| `x-webhook-secret` | `jobpilot_webhook_secret_2025_secure_key_change_in_production` |

---

## 📦 Request Body (JSON)

**Structure:**

```json
{
  "runId": "{{ $('Webhook Trigger').first().json.runId }}",
  "secret": "jobpilot_webhook_secret_2025_secure_key_change_in_production",
  "jobs": {{ $json.jobs }}
}
```

**Field Explanations:**

- `runId` - UUID from the webhook trigger (identifies which search run this belongs to)
- `secret` - Webhook secret for validation (must match Next.js environment variable)
- `jobs` - Array of processed jobs (must be aggregated before this node)

---

## 🔄 Jobs Array Structure

Each job in the array must have:

```json
{
  "title": "Senior Product Manager",
  "company": "Tech Corp",
  "location": "Bangalore, Karnataka, India (Remote)",
  "score": 85,
  "description": "Full job description...",
  "applyLink": "https://www.linkedin.com/jobs/view/1234567890",
  "coverLetter": "Dear Hiring Manager...",
  "mailDraft": "I know you are super busy..."
}
```

**Required Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Job title |
| `company` | string | Company name |
| `location` | string | Job location (can include "Remote") |
| `score` | number | AI match score (0-100) |
| `description` | string | Full job description |
| `applyLink` | string | LinkedIn job URL |
| `coverLetter` | string | AI-generated cover letter |
| `mailDraft` | string | AI-generated email to hiring manager |

---

## 🔗 Complete Workflow Flow

```
1. Webhook Trigger (Receives from Next.js)
   ↓
2. Download Resume (HTTP Request to Supabase)
   ↓
3. Extract PDF Text
   ↓
4. Build LinkedIn Search URL
   ↓
5. Scrape LinkedIn Jobs
   ↓
6. Loop Over Jobs
   ↓
7. AI Scoring & Generation
   ↓
8. Filter by Score (>= minScore)
   ↓
9. Aggregate Jobs (Function Node)
   ↓
10. Send Results to JobPilot (THIS HTTP REQUEST NODE)
```

---

## 📝 Example Aggregation Node

Before the HTTP Request node, you need to aggregate all jobs into an array.

**Function Node - "Aggregate Jobs"**

```javascript
// Collect all jobs from previous iterations
const jobs = [];

for (const item of $input.all()) {
  jobs.push({
    title: item.json.title,
    company: item.json.company,
    location: item.json.location,
    score: item.json.score,
    description: item.json.description,
    applyLink: item.json.applyLink,
    coverLetter: item.json.coverLetter,
    mailDraft: item.json.maildraft  // Note: lowercase 'd' from your current workflow
  });
}

return [{
  json: {
    runId: $('Webhook Trigger').first().json.runId,
    jobs: jobs
  }
}];
```

---

## ✅ Testing the HTTP Request Node

### Test with Manual Execution

1. **Prepare test data:**
   - Right-click HTTP Request node
   - Click "Execute node"
   - Provide test JSON input

2. **Check response:**
   - Should return: `{ "success": true, "jobsInserted": N }`
   - If error, check logs

### Test with Full Workflow

1. **Trigger webhook manually** from Next.js app
2. **Watch executions** in n8n
3. **Verify** each node processes correctly
4. **Check** final HTTP request succeeds

---

## 🐛 Troubleshooting

### Error: "Invalid webhook secret"

**Cause:** Secret mismatch
**Fix:**
- Verify `x-webhook-secret` header matches Next.js `.env` variable
- Verify `secret` in body matches Next.js `.env` variable

### Error: "Run not found"

**Cause:** Invalid `runId`
**Fix:**
- Check `runId` is being passed from Webhook Trigger correctly
- Verify run exists in database (check Supabase)

### Error: "Failed to save job results"

**Cause:** Database error (invalid job data)
**Fix:**
- Check all required fields are present in jobs array
- Verify score is a number (not string)
- Check description doesn't have invalid characters

### No response / Timeout

**Cause:** Network issue or Next.js server down
**Fix:**
- Verify Next.js URL is correct and accessible
- Check Next.js server is running
- Test URL with curl from n8n server

---

## 🔒 Security Best Practices

1. **Never commit secrets** to git
2. **Use environment variables** for webhook secret
3. **Rotate secrets regularly** (update in both n8n and Next.js)
4. **Use HTTPS** in production (Vercel provides this)
5. **Monitor failed requests** in logs

---

## 📊 Expected Response

**Success Response:**

```json
{
  "success": true,
  "jobsInserted": 12
}
```

**Error Responses:**

```json
// Invalid secret
{
  "error": "Invalid webhook secret"
}

// Invalid payload
{
  "error": "Invalid payload structure"
}

// Run not found
{
  "error": "Run not found"
}

// Database error
{
  "error": "Failed to save job results"
}
```

---

## 🎯 Quick Setup Checklist

Before going live:

- [ ] Webhook Trigger configured with correct path
- [ ] Resume download uses signed URL from payload
- [ ] Jobs are aggregated into array before final node
- [ ] HTTP Request URL points to correct environment
- [ ] Headers include `Content-Type` and `x-webhook-secret`
- [ ] Body includes `runId`, `secret`, and `jobs` array
- [ ] All job objects have required fields
- [ ] Workflow is activated (toggle on)
- [ ] Test execution completes successfully

---

## 📞 Need Help?

Check these resources:

- **n8n Docs:** https://docs.n8n.io/
- **HTTP Request Node Docs:** https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/
- **Testing Guide:** See `TESTING_GUIDE.md` in project
- **Deployment Guide:** See `DEPLOYMENT_GUIDE.md` in project

---

## 💡 Tips

1. **Use meaningful node names** - easier to debug
2. **Test each node individually** - isolate issues
3. **Keep executions** for debugging - n8n stores execution history
4. **Monitor execution time** - optimize slow nodes
5. **Handle errors gracefully** - add error workflows if needed

---

**Last Updated:** 2025-01-15
**Version:** 1.0
