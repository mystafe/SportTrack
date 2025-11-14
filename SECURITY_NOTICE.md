# Security Notice

## Firebase API Key Exposure

**IMPORTANT:** Firebase API keys were accidentally committed to the repository in commit `bbeadde`.

### Action Required

1. **Revoke the exposed API key in Firebase Console:**
   - Go to Firebase Console → Project Settings → General
   - Under "Your apps", find your web app
   - Regenerate the API key or restrict it using Firebase App Check

2. **Update your local `.env.local` file:**
   - After revoking/regenerating the key, update your `.env.local` with the new credentials

3. **Enable Firebase App Check (Recommended):**
   - Go to Firebase Console → App Check
   - Enable App Check for your web app
   - This adds an additional layer of security

### What Was Exposed

The following Firebase credentials were visible in the repository:

- API Key
- Project ID
- Auth Domain
- Storage Bucket
- App ID
- Measurement ID

### Security Measures Taken

- ✅ `.env.local` has been removed from git history
- ✅ `.env.local` is now in `.gitignore`
- ✅ README has been updated to use placeholders
- ✅ Future commits will not include sensitive data

### Best Practices Going Forward

- Never commit `.env.local` or any file containing credentials
- Use environment variables for all sensitive configuration
- Regularly rotate API keys
- Enable Firebase App Check for production apps
- Use Firebase Security Rules to restrict access
