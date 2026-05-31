# Cryptographic Password Generator

A modern and responsive Secure Password Generator built using React and Vite.

This application allows users to generate highly secure random passwords and memorable passphrases with customizable options, realtime strength analysis, dark mode support, copy-to-clipboard functionality, and a clean modern UI.


# Live Demo

Try it here - https://cryptographic-free-password-generator.vercel.app/

# Video Demo 
https://github.com/user-attachments/assets/a04dd613-9dc1-4e70-836f-43162bc7f95f

# Features

## Random Password Generator

Generate highly secure passwords with:

- Uppercase letters
- Lowercase letters
- Numbers
- Symbols
- Adjustable password length
- Avoid ambiguous characters option


## Passphrase Generator

Generate secure and memorable passphrases with:

- Adjustable word count
- Custom separators
- Capitalize words option
- Include number option


## Password Strength Meter

Realtime password analysis with:

- Weak
- Medium
- Strong
- Very Strong

Includes entropy calculation and visual strength indicators.


## Dark / Light Mode

Modern theme switching with smooth transitions and optimized readability.


## Copy to Clipboard

One-click copy support for:

- Generated passwords
- Passphrases
- Password history entries

Includes animated copy feedback.


## Password History

Stores recently generated passwords during the current session for quick reuse.

# Tech Stack

- React
- Vite
- JavaScript
- CSS3



# Folder Structure

```bash
PASSWORD-GENERATOR/
│
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── ModeSwitch/
│   │   ├── OptionsPanel/
│   │   ├── PassphraseOptions/
│   │   ├── PasswordBox/
│   │   ├── PasswordHistory/
│   │   ├── StrengthMeter/
│   │   └── ThemeToggle/
│   │
│   ├── data/
│   │   └── wordlist.js
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── index.css
│   │   ├── reset.css
│   │   ├── responsive.css
│   │   └── variables.css
│   │
│   ├── utils/
│   │   ├── charset.js
│   │   ├── crackTime.js
│   │   ├── entropy.js
│   │   ├── generator.js
│   │   ├── passphraseGenerator.js
│   │   ├── random.js
│   │   ├── strengthChecker.js
│   │   └── validations.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```


# Installation

Clone the repository:

```bash
git clone https://github.com/Vaidehee-Bindal/Password_Generator.git
```

Move into the project directory:

```bash
cd Password_Generator
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```


# UI Highlights

- Modern glassmorphism-inspired UI
- Responsive design
- Animated toggle switches
- Gradient buttons
- Smooth hover animations
- Dark mode optimized interface
- Consistent typography and spacing


# Responsive Design

Fully optimized for:

- Desktop
- Tablet
- Mobile devices


# Security Notes

This application uses:

- High entropy password generation
- Secure random generation
- Local browser-side generation

No passwords are stored or sent to any server.


