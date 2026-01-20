# Maasli Dashboard

A sleek and futuristic manufacturing intelligence dashboard for tracking product counts and employee statistics in real-time.

## Features

### 🔐 Secure Login
- Simple authentication system
- Demo credentials: `admin` / `admin`

### 📊 Product Counts by Machine
- Track production counts for each machine
- **Customizable product names** per machine (user-editable)
- **Product counts are READ-ONLY** (automatically updated from AI model)
- Support for multiple product types
- Automatic totals calculation separated by product type
- Real-time count updates from AI model
- Add, edit, and delete machines

### 👥 Employee Statistics by Station
- Manage multiple stations
- Assign 1-2 employees per station
- **Customizable employee names** (user-editable)
- **Box counts are READ-ONLY** (automatically updated from AI model)
- Track boxes completed per employee
- Real-time statistics updates from AI model
- Full CRUD operations for stations

## Getting Started

1. **Open the Dashboard**
   - Simply open `index.html` in a modern web browser
   - No backend or server required!

2. **Login**
   - Use credentials: `admin` / `admin`

3. **Manage Machines**
   - Click "Add Machine" to add a new machine
   - Edit machine names and product names (counts are read-only from AI)
   - Product totals are automatically separated by product type
   - Example: If you have "Milk" and "Cookie" products, their totals are tracked separately
   - **Note:** Product counts are automatically updated by the AI model and cannot be manually changed

4. **Manage Stations**
   - Click "Add Station" to create a new station
   - Choose 1 or 2 employees per station
   - Customize employee names (e.g., "Michael Chen" instead of "Employee A")
   - Track boxes completed per employee (counts are read-only from AI)
   - Update employee assignments anytime
   - **Note:** Box completion counts are automatically updated by the AI model and cannot be manually changed

## Technology Stack

- **HTML5** - Structure
- **CSS3** - Modern styling with gradients, glassmorphism, and animations
- **JavaScript (Vanilla)** - All functionality
- **LocalStorage** - Data persistence (no backend needed)

## Data Persistence

All data is stored in your browser's LocalStorage, which means:
- ✅ Data persists between sessions
- ✅ No internet connection required
- ✅ Fast and responsive
- ⚠️ Data is browser-specific (clearing browser data will reset the dashboard)

## Real-time Updates

The dashboard simulates real-time data updates every 5 seconds, mimicking the AI model sending data:
- Machine product counts increment automatically
- Employee box counts update automatically
- All changes are reflected immediately in the UI

## Customization

### For Production Use - Connecting to AI Model

To connect to a real AI model backend:

1. **Replace LocalStorage with API calls** in `script.js`:
   - Replace `getMachines()` and `getStations()` with API GET requests
   - Replace `saveMachines()` and `saveStations()` with API POST/PUT requests
   - Keep only name updates user-editable; counts should come from API

2. **Update authentication logic**:
   - Replace simple login with your actual auth system
   - Implement JWT tokens or session management

3. **Implement real-time updates**:
   - Replace the simulation interval with WebSocket connections
   - Or use Server-Sent Events (SSE) for real-time count updates from AI model
   - Update only the `count` field for machines and `boxes` field for employees

4. **Example API Structure**:
   ```javascript
   // Fetch machine data from AI model
   async function getMachines() {
       const response = await fetch('/api/machines');
       return await response.json();
   }
   
   // Update only names (counts come from AI)
   async function updateMachineName(id, name, product) {
       await fetch(`/api/machines/${id}`, {
           method: 'PUT',
           body: JSON.stringify({ name, product })
       });
   }
   ```

### Styling

- All styles are in `styles.css`
- CSS variables at the top make it easy to customize colors
- Fully responsive design for mobile, tablet, and desktop

## Browser Compatibility

Works best on modern browsers:
- ✅ Chrome/Edge (Chromium) 90+
- ✅ Firefox 88+
- ✅ Safari 14+

## Demo Features

- Automatic data simulation for demonstration purposes
- Sample machines and stations pre-loaded
- Smooth animations and transitions
- Glassmorphism design elements
- Gradient accents and hover effects

## Company

**Maasli** - Smart Manufacturing Intelligence

---

Built with ❤️ for intelligent manufacturing solutions
