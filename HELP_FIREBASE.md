# How to Enable Phone Authentication

Your application requires **Phone Number (OTP) Login**, but this feature is currently disabled in your Firebase project. To fix the `auth/operation-not-allowed` error, follow these steps:

## 1. Open the Firebase Console
Visit this direct link:
[Enable Phone Auth for Gen-Lang-Client-0317114435](https://console.firebase.google.com/project/gen-lang-client-0317114435/authentication/providers)

## 2. Enable the Provider
1.  On the **Sign-in method** tab, click **Add new provider**.
2.  Choose **Phone** from the list.
3.  Click the **Enable** switch (it should turn blue).
4.  **Important**: Click **Save**.

## 3. (Optional) Add Authorized Domain
Your app is running on a custom URL. If you still see errors after enabling Phone Auth, you may also need to add your app's domain to the "Authorized domains" list at the bottom of the same page:
-   Domain: `ais-dev-g3ltsojis2dl22qqk72bv3-727882412182.asia-east1.run.app`

---

Once you have done this, your login screen will start working immediately!
