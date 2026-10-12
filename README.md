# NIRANTAR — Offline-First Emergency Preparedness

> **When connectivity fails, preparedness shouldn't.**

NIRANTAR is an offline-first emergency preparedness web application designed to help people access essential safety information and organize their emergency plans, even when internet connectivity is unavailable.

From emergency checklists and personal emergency contacts to built-in safety guides, NIRANTAR helps individuals and households prepare for unexpected situations before they happen.

## 🚨 Problem Statement

During emergencies such as fires, floods, severe weather, and power outages, internet connectivity may become unreliable precisely when people need important information. Emergency contacts, safety instructions, and preparedness plans may be scattered across different sources, making them difficult to access quickly during stressful situations.

NIRANTAR addresses these challenges by bringing essential preparedness tools together in one accessible, offline-first platform.

## 💡 Our Solution

NIRANTAR provides a simple, responsive web application where users can organize emergency information, track their preparedness tasks, and access built-in safety guides.

The application uses browser storage and service worker caching to keep saved information and essential app resources accessible without an active internet connection, once the app has been loaded and its resources cached.

## ✨ Key Features

### 1. Emergency Readiness Checklist
- Track emergency preparedness tasks.
- Mark completed items and review your progress.
- Save checklist progress in browser storage.

### 2. Personal Emergency Plan
- Save an emergency contact's name, relationship, and phone number.
- Record essential supplies and personal notes.
- Keep important information organized in one place.

### 3. Emergency Mode
- Quickly access saved emergency contact details, supplies, and personal notes.
- Reduce the need to search through multiple screens for important information.
- Access previously saved plan information offline when the application is available.

### 4. Offline Emergency Guides
Access searchable, built-in guides covering five important topics:

- **Fire Safety** — Basic fire preparedness and safety guidance.
- **Power Outages** — Preparedness for electricity disruptions.
- **Severe Weather & Flooding** — Basic preparation and safety guidance.
- **First-Aid Basics** — Introductory first-aid information.
- **Contacting Emergency Services** — Guidance on contacting emergency services.

The guides are built into the application, allowing them to remain accessible offline after the app resources have been cached.

### 5. Backup and Restore
- Export preparedness data as a JSON backup file.
- Restore data from a valid backup.
- Validate imported data before accepting it.
- Support versioned backup formats for the checklist and personal emergency plan.

### 6. Printable Emergency Plan
- Print your saved personal emergency plan.
- Keep a physical copy available as a backup when devices or connectivity are unavailable.

### 7. Offline-First Experience
- Cache essential application resources using a service worker and the Cache API.
- Load the cached application shell when offline.
- Store checklist and personal plan data in browser local storage.
- Support responsive layouts for different screen sizes.

### 8. Accessibility and Usability
- Keyboard-accessible interactions.
- Touch-friendly controls.
- Readable text and contrast.
- Responsive mobile layout.
- Simple navigation designed for quick access to essential information.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure and content |
| CSS3 | Styling, responsive layouts, and visual design |
| JavaScript | Interactive features and application logic |
| localStorage | Saving checklist progress and personal emergency plans |
| Service Workers | Supporting offline application access |
| Cache API | Caching essential application resources |
| JSON | Exporting and restoring preparedness data |

NIRANTAR is built with core web technologies and does not require a separate application backend for its current local preparedness features.

## ⚙️ Getting Started

### Prerequisites

- A modern web browser, such as Chrome, Edge, or Firefox.
- A code editor such as Visual Studio Code.
- A local development server for testing service worker functionality.

### Run Locally

**1. Clone the repository**

```bash
git clone https://github.com/YOUR-USERNAME/NIRANTAR.git
```

Replace `YOUR-USERNAME` with your GitHub username.

**2. Open the project**

```bash
cd NIRANTAR
```

Open the folder in Visual Studio Code.

**3. Start a local server**

In VS Code, install the **Live Server** extension if you do not already have it. Right-click `index.html` and select **Open with Live Server**.

Alternatively, serve the folder using another local development server.

**4. Test the application**

Open the local URL provided by your server in your browser. Use the application online at least once so its service worker can install and cache the required resources.

**5. Test offline functionality**

After the application has loaded and caching is complete, disconnect your internet connection and reload the page. Check the dashboard, saved information, and built-in emergency guides.

> **Note:** Service workers generally require HTTPS or a localhost development environment. Opening `index.html` directly as a `file://` URL is not sufficient for testing service worker functionality.

## 📱 How to Use NIRANTAR

1. Open the application and review the preparedness dashboard.
2. Complete checklist items as you prepare for emergencies.
3. Create your personal emergency plan with relevant contact and supply information.
4. Use Emergency Mode to access saved plan details quickly.
5. Search the built-in guides for relevant safety information.
6. Export a backup of your preparedness data and keep a printed emergency plan when appropriate.
7. Test the app offline after its resources have been cached.

## 🔐 Privacy and Data Storage

NIRANTAR currently stores checklist progress and personal emergency plan information in the browser's local storage.

- The current application is designed to keep these records on the user's device rather than automatically uploading them to a cloud account.
- Clearing browser data or using a different browser or device may make locally stored information unavailable.
- Exported backup files may contain personal contact information. Store them securely and share them only with trusted people.
- Users should maintain alternative access to critical emergency information.

## 🎯 Target Audience

NIRANTAR is designed for:

- Individuals and households preparing for emergencies.
- Students and young adults learning emergency preparedness.
- People in areas that may experience internet or power disruptions.
- Rural and semi-urban communities that benefit from readily accessible preparedness resources.
- Anyone who wants to organize important emergency information in advance.

## 🌍 Expected Impact

NIRANTAR aims to help people:

- Prepare for emergencies before they occur.
- Keep essential contacts and preparedness information organized.
- Access built-in safety guides without depending on a live internet connection.
- Maintain a personal emergency plan and a portable backup.
- Build awareness of preparedness and resilience at the household level.

The goal is to make emergency preparedness simpler, more accessible, and more practical.

## 🚀 Future Scope

Potential future improvements include:

- Multilingual emergency guides.
- Additional safety-reviewed emergency preparedness resources.
- Optional encrypted backup features.
- Improved installability and testing across a wider range of mobile devices.
- Usability testing with different communities.
- Additional preparedness tools based on user feedback.

These are potential future enhancements and are not represented as currently implemented features.

## ⚠️ Important Safety Disclaimer

NIRANTAR is a preparedness and information tool. It does not replace trained emergency responders, professional medical advice, or official emergency instructions.

The application does not automatically call emergency services or send emergency alerts. In a life-threatening situation, contact the appropriate local emergency service and follow instructions from qualified authorities.

Users should verify emergency procedures against trusted, official guidance.

## 👩‍💻 Project Information

**Project Name:** NIRANTAR  
**Category:** Disaster Mitigation and Emergency Preparedness  
**Project Type:** Offline-first web application  
**Built With:** HTML, CSS, and JavaScript  
**Purpose:** Making essential emergency preparedness information accessible when connectivity is unavailable.

---

> **NIRANTAR — When connectivity fails, preparedness shouldn't.**
