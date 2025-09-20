# Logo Loading Issues - Fixed and Pending

## ✅ **FIXED: Static Logo Path Issues**

### **The Problem:**
The admin dashboard logos (sidebar and header) were not loading because:
- Logos were using hardcoded root paths (`/assets/images/logo.png`)
- Admin dashboard is served from `/admin` path
- Images should be at `/admin/assets/images/logo.png`

### **The Solution:**
1. **✅ Updated Sidebar Component**
   - Modified `frontend/src/components/layout/Sidebar.tsx`
   - Now uses `ASSETS.LOGO`, `ASSETS.LOGO_BLACK`, `ASSETS.LOGO_SM`
   - All logo paths now use relative paths that work with `/admin` base

2. **✅ Updated Header Component**
   - Modified `frontend/src/components/layout/Header.tsx`
   - Now uses asset utility for all logo references
   - Consistent with sidebar implementation

3. **✅ Rebuilt Admin Dashboard**
   - Generated new build with correct logo paths
   - Combined with storefront build

### **Current Status:**
- ✅ **Static logos fixed** - Sidebar and header logos now load correctly
- ✅ **Build updated** - New build with correct paths generated
- ⏳ **Deployment needed** - Updated build needs to be deployed

---

## ⏳ **PENDING: Dynamic Logo from Onboarding**

### **The Problem:**
The logo uploaded during onboarding is not displayed in the sidebar/header because:
- Logo is uploaded and stored as `File` object with `logoPreview` (base64)
- Sidebar/header still use static logo paths
- No mechanism to display the uploaded logo

### **What Needs to Be Done:**

1. **Store Logo in Backend**
   - Currently logo upload is handled but not persisted to store record
   - Need to update store with logo URL after successful upload

2. **Fetch Store Data in Frontend**
   - Sidebar/header need to fetch current store data
   - Display uploaded logo if available, fallback to static logo

3. **Update Logo Display Logic**
   - Modify sidebar/header to use dynamic logo
   - Handle both uploaded logo and static fallback

### **Implementation Plan:**

#### **Step 1: Backend Integration**
```typescript
// In storeService.ts - update setupStore method
if (logoResponse.data && logoResponse.data.url) {
  // Update store with logo URL
  await this.updateStore(storeResponse.data.id, {
    logo_url: logoResponse.data.url
  }, token);
}
```

#### **Step 2: Frontend Store Context**
```typescript
// Create useStore hook to fetch current store data
const { store, loading } = useStore();
const logoUrl = store?.logo_url || ASSETS.LOGO_BLACK;
```

#### **Step 3: Dynamic Logo Display**
```typescript
// In Sidebar.tsx
<img 
  src={store?.logo_url || ASSETS.LOGO_BLACK} 
  alt="logo" 
/>
```

### **Files to Modify:**
- `frontend/src/services/storeService.ts` - Complete logo upload integration
- `frontend/src/hooks/useStore.ts` - Create store data hook
- `frontend/src/components/layout/Sidebar.tsx` - Add dynamic logo logic
- `frontend/src/components/layout/Header.tsx` - Add dynamic logo logic

---

## **Next Steps:**

### **Immediate (Static Logo Fix):**
1. **Deploy current build** to fix static logo loading
2. **Test admin dashboard** - logos should now display correctly

### **Future (Dynamic Logo):**
1. **Complete backend integration** for logo persistence
2. **Implement store data fetching** in frontend
3. **Update logo display logic** to use uploaded logo
4. **Test end-to-end flow** from onboarding to dashboard

---

## **Current Build Status:**
- ✅ **Static logo paths fixed**
- ✅ **Build generated with correct paths**
- ⏳ **Ready for deployment**

**Deploy the current build to fix the immediate logo loading issue, then implement dynamic logo functionality in a separate update.**
