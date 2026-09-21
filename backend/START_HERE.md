# 🚀 Deploy Your Church Census Backend to Render.com

## Welcome! 👋

This folder contains everything you need to deploy your backend to Render.com for **FREE**.

## 📍 START HERE

### Step 1: Choose Your Guide

Pick the guide that matches your style:

| Guide | Best For | Time | Link |
|-------|----------|------|------|
| **Quick Deploy** | Experienced developers | 5 min | [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) |
| **Visual Guide** | First-time deployers | 10 min | [DEPLOYMENT_VISUAL_GUIDE.md](./DEPLOYMENT_VISUAL_GUIDE.md) |
| **Complete Guide** | Want all details | 15 min | [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) |
| **Checklist** | Systematic approach | 10 min | [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) |

**Not sure?** → Start with [DEPLOYMENT_VISUAL_GUIDE.md](./DEPLOYMENT_VISUAL_GUIDE.md)

### Step 2: Follow the Guide

All guides cover the same process:
1. Push code to GitHub
2. Create PostgreSQL database on Render
3. Deploy backend web service
4. Configure environment variables
5. Test your deployment
6. Set up keep-alive cron job

### Step 3: Test Your Deployment

After deployment, test your API:
```bash
node test-deployed-api.js https://your-app-name.onrender.com
```

## 📚 All Available Resources

### Deployment Guides
- 🚀 [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Fast 5-minute deployment
- 👁️ [DEPLOYMENT_VISUAL_GUIDE.md](./DEPLOYMENT_VISUAL_GUIDE.md) - Step-by-step with explanations
- 📖 [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) - Comprehensive reference
- ☑️ [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Checkbox format
- 📊 [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) - Overview of all resources

### Configuration Files
- ⚙️ `render.yaml` - Render platform blueprint
- 📄 `.env.example` - Environment variables template
- 🚫 `.gitignore` - Git exclusions

### Testing Tools
- 🧪 `test-deployed-api.js` - Test deployed API
- 🔌 `test-connection.js` - Test database connection

### Documentation
- 📚 [README.md](./README.md) - Project overview
- 💾 [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Database setup guide

## ⚡ Super Quick Start

If you're in a hurry:

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Ready to deploy"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main

# 2. Go to render.com
# 3. Create PostgreSQL database (free tier)
# 4. Create Web Service (connect GitHub repo)
# 5. Add environment variables:
#    - NODE_ENV = production
#    - DATABASE_URL = [from database dashboard]
# 6. Deploy!

# 7. Test
node test-deployed-api.js https://your-app.onrender.com
```

## ❓ Common Questions

**Q: Is it really free?**  
A: Yes! Render.com free tier includes PostgreSQL (1GB) and web service (750 hours/month).

**Q: Will it stay online 24/7?**  
A: Free tier sleeps after 15 minutes of inactivity. Set up a free cron job to keep it awake (covered in all guides).

**Q: Do I need a credit card?**  
A: No! Render.com free tier doesn't require a credit card.

**Q: How long does deployment take?**  
A: First deployment: 5-10 minutes. Future deploys: 1-2 minutes (automatic).

**Q: What if something goes wrong?**  
A: Each guide has a troubleshooting section. Check Render logs first.

**Q: Can I deploy from Windows?**  
A: Yes! All guides work on Windows, Mac, and Linux.

## 🎯 After Deployment

Once deployed, you'll have:

✅ Backend API running at: `https://your-app-name.onrender.com`  
✅ PostgreSQL database with 1GB storage  
✅ Automatic HTTPS/SSL  
✅ Auto-deploy on every Git push  
✅ Free monitoring and logs  

## 📱 Next Steps

After backend is deployed:

1. Copy your API URL
2. Update mobile app configuration with this URL
3. Test mobile app with production API
4. You're done! 🎉

## 💡 Pro Tips

- **Use same region** for database and web service (faster)
- **Set up cron job** immediately to prevent sleeping
- **Check logs regularly** in Render dashboard
- **Use test script** before updating mobile app
- **Keep DATABASE_URL secret** - never commit to Git

## 🆘 Need Help?

1. Check the **Troubleshooting** section in your chosen guide
2. Review **Render logs** in dashboard
3. Visit [Render Community](https://community.render.com)
4. Check [Render Docs](https://render.com/docs)

## 🎉 Ready?

**Pick your guide above and start deploying!**

Your Church Census Backend will be online in less than 10 minutes.

---

**Questions before starting?** Read the [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) for an overview.

**Good luck!** 🚀
