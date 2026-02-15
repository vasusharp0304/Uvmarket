# 🚀 Deploying to Railway (Updated)

I have updated your code to be **Railway-Ready**! 
Here is exactly what you need to do on the web.

## 1. Push Code
(I have already done this. Your GitHub repo is up to date).

## 2. Create Project on Railway
1.  Go to [Railway Dashboard](https://railway.app/dashboard).
2.  Click **"New Project"** -> **"Deploy from GitHub repo"**.
3.  Select your repo `uv-market-school`.
4.  Click **"Deploy Now"**.

## 3. Add Database (PostgreSQL)
1.  In your project view, click **"New"** -> **"Database"** -> **"PostgreSQL"**.
2.  Wait a moment for it to initialize.

## 4. Connect App to Database
1.  Click on your **App Service** (uv-market-school).
2.  Go to **"Variables"** tab.
3.  Click **"Reference a Variable"**.
4.  Select `DATABASE_URL` from the drop-down (it comes from the Postgres service you just created).

## 5. Add Other Variables
In the same **Variables** tab, add these:

| Variable | Value |
| :--- | :--- |
| `NEXTAUTH_SECRET` | (Random string, e.g. `fj39f32f90j23f90j`) |
| `NEXTAUTH_URL` | `https://<your-project-url>.up.railway.app` (You get this URL in "Settings" -> "Generic Domains" if not already there, generate one). |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary Name |
| `CLOUDINARY_API_KEY` | Your Cloudinary Key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary Secret |

## 6. Finish
Railway will redeploy automatically when you add variables.
*   **Database Schema**: The app will automatically set up the database (tables) when it starts (`prisma db push`).
*   **Images**: Will stay safe in Cloudinary.

---

### ⚠️ Local Development Note
Since we switched to PostgreSQL, your local `npm run dev` will create errors unless you connect it to a Postgres database.
**Easy Fix**: Copy the `DATABASE_URL` from Railway and paste it into your local `.env` file.
