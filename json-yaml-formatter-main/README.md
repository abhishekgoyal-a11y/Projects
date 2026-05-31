# 🚀 JSON YAML Formatter & Developer Toolkit

A powerful developer utility built with **React + Tailwind CSS + Monaco Editor** that supports:

- JSON Formatting
- YAML Formatting
- JSON ↔ YAML Conversion
- Validation & Error Highlighting
- Diff Viewer
- JSON Tree Viewer
- API Testing
- JSON Schema Validation
- Dark/Light Mode
- File Upload & Download
- Auto Save
- Responsive IDE Layout

---

# ✨ Features

## ✅ JSON & YAML Formatter
Format messy JSON/YAML into clean readable structures.

## ✅ JSON/YAML Minifier
Compress formatted data into compact single-line output.

## ✅ JSON ↔ YAML Converter
Convert:
- JSON → YAML
- YAML → JSON

## ✅ Real-Time Validation
Live syntax validation with:
- Error messages
- Line highlighting
- Monaco editor markers

## ✅ Monaco Code Editor
VS Code-like editor experience:
- Syntax highlighting
- Smooth scrolling
- Auto layout
- Line markers

## ✅ Diff Viewer
Compare previous and latest formatted outputs visually.

## ✅ JSON Tree Viewer
View JSON in expandable tree structure format.

## ✅ API Tester
Mini Postman inside the app:
- GET requests
- POST requests
- API response viewer

## ✅ JSON Schema Validation
Validate JSON against custom schemas using AJV.

## ✅ Drag Resizable Panels
Resizable IDE-style editor layout.

## ✅ Dark / Light Mode
Modern theme switching support.

## ✅ File Upload & Download
- Upload JSON/YAML files
- Download formatted outputs

## ✅ Local Storage Auto Save
Automatically restores:
- Editor content
- Theme preference
- Format selection

## ✅ Toast Notifications
Beautiful success/error notifications using React Hot Toast.

---

# 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| React | Frontend Framework |
| Tailwind CSS | Styling |
| Monaco Editor | Code Editor |
| React Hot Toast | Notifications |
| AJV | JSON Schema Validation |
| React Diff Viewer | Diff Comparison |
| React Icons | Icons |
| Vite | Build Tool |

---

# 📂 Project Structure

```bash
src/
│
├── components/
│   ├── Navbar.jsx
│   ├── Toolbar.jsx
│   ├── Editor.jsx
│   ├── OutputPanel.jsx
│   ├── ErrorPanel.jsx
│   ├── Footer.jsx
│   ├── JsonTreeView.jsx
│   ├── DiffViewer.jsx
│   ├── ApiTester.jsx
│   └── SchemaValidator.jsx
│
├── hooks/
│   └── useDebounce.js
│
├── utils/
│   ├── formatter.js
│   ├── converter.js
│   ├── validator.js
│   ├── helpers.js
│   └── errorHandler.js
│
├── App.jsx
└── main.jsx
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/json-yaml-formatter.git
```

---

## 2️⃣ Move Into Project

```bash
cd json-yaml-formatter
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Start Development Server

```bash
npm run dev
```

---

# 📦 Required Packages

```bash
npm install \
@monaco-editor/react \
react-hot-toast \
react-icons \
ajv \
react-diff-viewer
```

---

# 🧪 API Testing Example

## GET Request

```txt
https://jsonplaceholder.typicode.com/users
```

## POST Request

```txt
https://jsonplaceholder.typicode.com/posts
```

Body:

```json
{
  "title": "Hello",
  "body": "Testing API",
  "userId": 1
}
```

---

# 🧠 Schema Validation Example

## Schema

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "age": {
      "type": "number"
    }
  },
  "required": [
    "name",
    "age"
  ]
}
```

## JSON Data

```json
{
  "name": "Harshi",
  "age": 22
}
```

---

# 📸 Screenshots

<img width="1920" height="1080" alt="Screenshot (51)" src="https://github.com/user-attachments/assets/285118d7-c1dc-4dbc-9b1e-491706c0c587" />


https://github.com/user-attachments/assets/5c505ca3-9f39-4d6b-9b7a-1200fbc3930a








---

# 🚀 Future Improvements

- Multi-language formatting
- GraphQL API testing
- Authentication headers
- Environment variables
- Export as PDF
- Shareable links
- Cloud save
- Collaboration mode

---

# 👨‍💻 Author

**Harshitha Suru**

Built using React & Tailwind CSS.

---

