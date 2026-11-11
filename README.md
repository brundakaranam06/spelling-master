# Spelling Master

A small React + Vite spelling practice app based on the supplied JavaScript. It includes six levels, speech playback, an 80% pass threshold, and progress saved in the current browser using localStorage.

## Run locally

1. Install Node.js (current LTS).
2. In this folder run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.
4. Run `npm run build` to verify a production build.

## Deploy to Vercel

1. Push this folder to a private GitHub repository.
2. In Vercel, choose **Add New → Project**, import that repository, and deploy. Vercel should detect Vite automatically. Build command: `npm run build`; output directory: `dist`.
3. After deployment, open the Vercel project **Settings → Deployment Protection** and select **All Deployments** with **Vercel Authentication**. Give family members access to the Vercel project/team so they can sign in. Confirm the production URL is protected in a private/incognito browser before sharing it.

Important: a private GitHub repository does not make the deployed website private. Do not use a client-side password prompt for real privacy. Vercel's built-in Vercel Authentication is the recommended protection and is available on all plans; visitors need a Vercel account with access. Vercel Password Protection is a paid feature (Pro add-on / Enterprise), so it is not the free default.

## Notes

- Progress is stored separately in each browser/device. There is no cross-device sync or parent dashboard yet.
- Audio uses the browser's Speech Synthesis API. Voice availability depends on the device/browser.
- Word lists are the six lists in the original supplied code; Level 6 remains a 20-word list.
