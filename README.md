# 🎒 Student Hub – MVP

A customizable student dashboard you can host on **GitHub Pages**. Features:

- Google Sign-in (Firebase Auth)
- Your own widgets: Notes, Links, Embed, Calendar
- Drag, resize, and arrange with **react-grid-layout**
- Multiple pages/tabs (e.g., Home, Math, Clubs)
- Data saved per-user in **Firestore**

## 1) Set up Firebase
1. Go to https://console.firebase.google.com → **Add project**.
2. In **Build → Authentication → Sign-in method**, enable **Google**.
3. In **Project settings → Your apps**, add a **Web app** and copy the config.
4. In **Build → Firestore Database**, create a database in production mode.

**Security rules (simple):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      match /pages/{pageId} {
        allow read, write: if request.auth.uid == uid;
      }
    }
  }
}
```

## 2) Local dev
```bash
npm install
cp .env.example .env   # fill with your Firebase config
npm run dev
```

## 3) Deploy to GitHub Pages
1. Create a new GitHub repo (e.g., `student-dashboard`), push this project.
2. Edit `vite.config.ts` and set:
```ts
export default defineConfig({
  // if your repo name is "student-dashboard", set:
  base: "/student-dashboard/"
})
```
3. Install deps and deploy:
```bash
npm install
npm run deploy
```
4. In GitHub → Settings → Pages, ensure the source is set to **Deploy from a branch** and the folder is **gh-pages** (GitHub does this automatically for `gh-pages` deploys).

Open: `https://<your-username>.github.io/<your-repo-name>/`

## 4) Tips
- **Calendar:** In Google Calendar → Settings → *Your calendar* → *Integrate calendar*, copy the **Public URL** or **Embed code** (make the calendar public if you want it visible).
- **Embed widget:** Some sites block embedding with X-Frame-Options; use services that allow it (Docs, YouTube, etc.).
- **Styling:** All styles live in `src/index.css`. Tweak freely.

Have fun! 🚀
