# 🌍 Frontend Mentor - IP Address Tracker Solution

This is a solution to the **[IP Address Tracker challenge](https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0)** on Frontend Mentor. It helps improve React development skills, API integration, and responsive design by building a real-time IP geolocation tracker with interactive maps.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Screenshot](#screenshot)
- [Links](#links)
- [My Process](#my-process)
- [Built With](#built-with)
- [What I Learned](#what-i-learned)
- [Continued Development](#continued-development)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

---

## 🧐 Overview

### The Challenge

Users should be able to:

- View the optimal layout for each page depending on their device's screen size
- See hover states for all interactive elements on the page
- See their own IP address on the map on the initial page load
- Search for any IP addresses or domains and see the key information and location
- View accurate geolocation data including timezone and ISP information
- Experience smooth loading states and error handling

### Key Features

- **Real-time IP Detection**: Automatically detects user's IP on page load
- **Domain & IP Search**: Search functionality for both IP addresses and domains
- **Interactive Maps**: Leaflet.js integration with custom location markers
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **API Integration**: IPify API for accurate geolocation data
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Loading States**: Visual feedback during API requests

---

## 📸 Screenshot

![IP Address Tracker - Desktop View](./public/design/desktop-design.jpg)
*Desktop view showing IP information cards and interactive map*

![IP Address Tracker - Mobile View](./public/design/mobile-design.jpg)
*Mobile view with responsive layout and touch-friendly interface*

---

## 🔗 Links

- **Live Demo**: [IP Address Tracker](https://ip-tracker-react-app.vercel.app/)
- **Solution URL**: [Frontend Mentor Solution](https://www.frontendmentor.io/solutions/ip-address-tracker-react-leaflet)
- **Challenge URL**: [Frontend Mentor Challenge](https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0)

---

## 🔨 My Process

I started by analyzing the design requirements and setting up a React project with Vite for fast development. I implemented the component architecture with proper state management, integrated the IPify API for real geolocation data, and used React Leaflet for interactive maps. The project follows modern React patterns with hooks and includes comprehensive error handling and fallback systems.

---

## 🛠️ Built With

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Leaflet** - React components for Leaflet maps
- **Leaflet.js** - Interactive maps library
- **IPify API** - IP geolocation service
- **CSS3** - Custom properties and responsive design
- **JavaScript ES6+** - Modern JavaScript features
- **Mobile-first workflow** - Responsive design approach

---

## 💡 What I Learned

- **React Leaflet integration with custom markers**:
```jsx
const customIcon = L.divIcon({
  className: 'custom-marker-icon',
  html: `<img src="/images/icon-location.svg" style="width: 46px; height: 56px;" />`,
  iconSize: [46, 56],
  iconAnchor: [23, 56]
})

<Marker position={[lat, lng]} icon={customIcon} />
```

- **API service layer with error handling**:
```javascript
export const getIPInfo = async (ipOrDomain) => {
  try {
    const validation = validateInput(ipOrDomain)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    })
    
    return formatApiResponse(await response.json())
  } catch (error) {
    // Graceful fallback to mock data
    return getMockData(ipOrDomain)
  }
}
```

- **React state management for API data**:
```jsx
const [ipData, setIpData] = useState({
  ip: '192.212.174.101',
  location: { city: 'Brooklyn', region: 'NY', lat: 40.6782, lng: -73.9442 },
  isp: 'SpaceX Starlink'
})

const handleSearch = async (query) => {
  try {
    setLoading(true)
    const data = await getIPInfo(query)
    setIpData(data)
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
```

- **Environment variable configuration for API keys**:
```javascript
const API_CONFIG = {
  IPIFY: {
    API_KEY: import.meta.env.VITE_IPIFY_API_KEY || 'fallback_key',
    BASE_URL: 'https://geo.ipify.org/api/v2/country,city'
  }
}
```

---

## 🔁 Continued Development

In future versions, I plan to:

- Add geolocation history and bookmarking
- Implement IP range analysis and subnet information
- Add more detailed network information (ASN, organization)
- Include VPN/proxy detection capabilities
- Add export functionality for IP data
- Implement offline mode with cached results
- Add dark mode theme support
- Include more map providers and satellite view

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sharnjeet21/ip-address-tracker.git
cd ip-address-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Add your IPify API key to .env file
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### API Setup

1. Sign up for a free account at [IPify](https://geo.ipify.org/)
2. Get your API key from the dashboard
3. Add it to your `.env` file:
```
VITE_IPIFY_API_KEY=your_api_key_here
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Search form and title
│   ├── InfoContainer.jsx   # IP information display
│   ├── MapSection.jsx      # Interactive map component
│   ├── LoadingSpinner.jsx  # Loading state component
│   ├── ErrorMessage.jsx    # Error handling component
│   └── Attribution.jsx     # Footer attribution
├── services/
│   └── ipService.js        # API service layer
├── config/
│   └── api.js             # API configuration
├── App.jsx                # Main application component
├── main.jsx              # React entry point
└── index.css             # Global styles
```

---

## 👤 Author

- Website: [Sharnjeet Singh](https://sharn-portfolio.vercel.app/)
- Frontend Mentor: [@sharnjeet21](https://www.frontendmentor.io/profile/sharnjeet21)
- GitHub: [@sharnjeet21](https://github.com/sharnjeet21)

---

## 🙏 Acknowledgments

Special thanks to **Frontend Mentor** for providing such a comprehensive challenge that perfectly demonstrates real-world API integration, React development patterns, and responsive design principles. Also grateful to the **IPify** team for their reliable geolocation API and **Leaflet.js** community for the excellent mapping library.