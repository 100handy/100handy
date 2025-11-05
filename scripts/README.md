# Admin Setup Scripts

This folder contains SQL scripts to help you set up and manage admin accounts for the 100handy Admin Web application.

---

## 📁 Files in This Folder

### `create-admin.sql`
**Purpose:** Create or update a user profile to have admin role

**When to use:**
- Setting up your first admin account
- Converting an existing user to admin
- Fixing a profile that wasn't created by the trigger

**How to use:**
1. Create user via Supabase Dashboard → Authentication → Users → Add User
2. Copy the User ID from the dashboard
3. Open `create-admin.sql` in Supabase SQL Editor
4. Replace `'YOUR_USER_ID_HERE'` with actual User ID
5. Replace email and name if needed
6. Click Run

**What it does:**
- Checks if user exists in auth.users
- Creates or updates profile with admin role
- Shows confirmation message with user details
- Displays verification query results

---

### `verify-admin.sql`
**Purpose:** Verify admin setup and troubleshoot issues

**When to use:**
- After creating your first admin
- Troubleshooting login issues
- Checking RLS policies are working
- Verifying database state

**How to use:**
1. Open `verify-admin.sql` in Supabase SQL Editor
2. Run the entire script (or run queries individually)
3. Review the results to check for issues

**What it checks:**
- ✅ List all admin users
- ✅ Test is_admin() function
- ✅ List all users with roles
- ✅ Count users by role
- ✅ Find orphaned auth users (without profiles)
- ✅ Check RLS policies
- ✅ Test admin permissions
- ✅ Check for authentication issues

---

## 🎯 Common Scenarios

### Scenario 1: First Time Setup
1. Follow `docs/QUICK_START.md` guide
2. Run `create-admin.sql` to set admin role
3. Run `verify-admin.sql` to confirm setup

### Scenario 2: Can't Login
1. Run `verify-admin.sql` query #8 to check auth issues
2. Check if user is confirmed (confirmed_at should not be null)
3. Verify role is 'admin' in profiles table

### Scenario 3: "Access Denied" Error
1. Run `verify-admin.sql` query #1 to list all admins
2. Check if your user has role = 'admin'
3. Run `verify-admin.sql` query #2 to test is_admin() function
4. If function returns false, re-run `create-admin.sql`

### Scenario 4: Profile Not Created
1. Run `verify-admin.sql` query #5 to find orphaned users
2. If your user appears, run `create-admin.sql` to create profile
3. Check database trigger is working:
   ```sql
   SELECT * FROM information_schema.triggers
   WHERE event_object_table = 'users';
   ```

---

## 🔒 Security Notes

- ⚠️ Never commit these files with real User IDs
- ⚠️ Don't share SQL scripts with User IDs filled in
- ⚠️ Use strong passwords for all admin accounts
- ⚠️ Limit number of admin accounts (only create what you need)
- ⚠️ Regularly audit admin accounts using `verify-admin.sql`

---

## 📚 Additional Resources

- **Quick Start Guide**: `../docs/QUICK_START.md`
- **Detailed Setup Guide**: `../docs/ADMIN_SETUP_GUIDE.md`
- **RLS Policies Migration**: `../supabase/migrations/20251027000001_add_admin_policies.sql`

---

## 🆘 Need Help?

If you encounter issues:

1. **Check the verification script**: Run `verify-admin.sql` to diagnose
2. **Review browser console**: Open DevTools (F12) → Console tab
3. **Check Supabase logs**: Dashboard → Logs → Look for errors
4. **Verify environment**: Ensure `.env` file has correct Supabase credentials
5. **Test RLS policies**: Use `verify-admin.sql` query #6

Common issues and solutions:
- **"User not found"** → User ID is incorrect, check Authentication → Users
- **"Profile not found"** → Run `create-admin.sql` again
- **"Access denied"** → Role is not 'admin', run `verify-admin.sql` query #1
- **Can't run SQL** → Check you have admin/owner permissions on Supabase project

---

## 🔄 Workflow Summary

```
┌──────────────────────────────┐
│  1. Create Auth User         │
│  (Supabase Dashboard)        │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  2. Run create-admin.sql     │
│  (Set role to admin)         │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  3. Run verify-admin.sql     │
│  (Confirm setup)             │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  4. Login to Admin Web       │
│  (Test access)               │
└──────────────────────────────┘
```

---

Happy administrating! 🎉
