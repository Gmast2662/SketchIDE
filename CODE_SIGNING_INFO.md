# Code Signing Information

## About "Windows protected your PC" Warning

When users download and run the SketchIDE installer, they may see a warning:
> "Windows protected your PC - Microsoft Defender SmartScreen prevented an unrecognized app from starting. An unrecognized app could put your PC at risk."

### Why This Happens

This warning appears because:
1. The app is **not code-signed** with a digital certificate
2. Windows SmartScreen doesn't recognize the publisher (because it's unsigned)
3. This is a security feature to protect users from potentially malicious software

### Is It Safe?

✅ **Yes, the app is safe.** This warning appears for **all unsigned applications**, not just yours. It's a normal part of Windows security.

### Solutions

#### Option 1: Code Signing (Recommended for Public Release)

To remove the warning completely, you need a **code signing certificate**:

**Cost:** $100 - $500+ per year

**Where to get one:**
- **DigiCert** - https://www.digicert.com/code-signing/ (most trusted)
- **Sectigo** - https://sectigo.com/ssl-certificates-tls/code-signing
- **GlobalSign** - https://www.globalsign.com/en/code-signing-certificate
- **Certificate Authority (CA)** - Various resellers

**Process:**
1. Purchase a code signing certificate
2. Complete identity verification (can take days/weeks)
3. Configure `electron-builder.yml`:
   ```yaml
   win:
     sign: true
     certificateFile: path/to/certificate.pfx
     certificatePassword: your-password
   ```
4. Rebuild the installer - it will be automatically signed

**Note:** For free/open-source software, the cost may not be worth it unless you're distributing widely.

#### Option 2: Wait for SmartScreen Reputation

If enough users download and run your app (and it's safe), Windows SmartScreen will eventually build a reputation for it, and the warning will appear less often or disappear. This can take **months** and requires many downloads.

#### Option 3: Distribute via Windows Store

If you publish through the Microsoft Store, the app is automatically signed and doesn't show the warning. However, this requires:
- Windows Store developer account ($19 one-time fee)
- Meeting Microsoft's app requirements
- Store review process

#### Option 4: Inform Users (Current Approach)

**What users need to do:**
1. Click "More info" on the warning
2. Click "Run anyway"
3. The installer will proceed normally

This is acceptable for:
- Personal projects
- Small distributions
- Free/open-source software
- Internal company tools

### Current Status

✅ **The app works perfectly** - the warning is just a security prompt
✅ **Users can proceed** by clicking "More info" → "Run anyway"
✅ **No functionality is affected** - this is purely a Windows security UI

### Best Practices for Users

Include in your README/website:
- Explain that the warning is normal for unsigned apps
- Provide clear instructions to click "More info" → "Run anyway"
- Reassure users that the app is safe
- Mention that code signing is expensive and not always necessary for free software

### Example Message for Users

> **"Windows SmartScreen Warning"**
> 
> When you download SketchIDE, Windows may show a security warning saying "Windows protected your PC". This is normal for unsigned applications and is a Windows security feature.
> 
> **To proceed:**
> 1. Click **"More info"**
> 2. Click **"Run anyway"**
> 
> The app is safe - this warning appears for all unsigned free software. Code signing certificates cost $100-500/year, which is why many free applications are unsigned.

---

**Bottom line:** The warning is cosmetic and doesn't affect functionality. For free software, it's often acceptable to leave it unsigned and inform users how to proceed.
