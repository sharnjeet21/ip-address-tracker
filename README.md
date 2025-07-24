# Frontend Mentor - IP Address Tracker Solution

This is a solution to the **[IP Address Tracker challenge](https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0)** on Frontend Mentor. It helps improve JavaScript skills, API integration, and responsive design by building a real-time IP geolocation tracker with interactive maps and dynamic content rendering.

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
- **API Integration**: Geoapify API for accurate geolocation data
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Loading States**: Visual feedback during API requests

---

## 📸 Screenshot

![IP Address Tracker - Desktop View](./design/desktop-design.jpg)
*Desktop view showing IP information cards and interactive map*

![IP Address Tracker - Mobile View](./design/mobile-design.jpg)
*Mobile view with responsive layout and touch-friendly interface*

---

## 🔗 Links

- **Live Demo**: [IP Address Tracker](https://ip-address-tracker-initial.vercel.app/)
- **Solution URL**: [Frontend Mentor Solution](https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0?tab=solutions)
- **Challenge URL**: [Frontend Mentor Challenge](https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0)

---

## 🔨 My Process

I started by analyzing the design requirements and building a semantic HTML foundation. I implemented the API integration using vanilla JavaScript with proper error handling, created a responsive CSS layout that adapts from mobile to desktop, and integrated Leaflet.js for interactive maps. The project uses modern JavaScript patterns with classes and async/await for clean, maintainable code.

---

## 🛠️ Built With

- Semantic **HTML5** markup
- **CSS Custom Properties** and **Flexbox/Grid**
- **JavaScript ES6+** with classes and async/await
- **Leaflet.js** - Interactive maps library
- **Geoapify API** - IP geolocation service
- **Mobile-first workflow**
- **Responsive design** principles
- No frameworks — Pure **Vanilla JavaScript**!

---

## 💡 What I Learned

- **API integration with error handling**:
```javascript
async getIPInfo(ipOrDomain) {
  try {
    const apiUrl = `${API_CONFIG.GEOAPIFY.BASE_URL}?ip=${ipOrDomain}&apiKey=${API_CONFIG.GEOAPIFY.API_KEY}`
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`)
    }
    
    const data = await response.json()
    return this.formatApiResponse(data)
  } catch (error) {
    // Graceful fallback to mock data
    return this.getMockData(ipOrDomain)
  }
}
```

- **Custom Leaflet markers with SVG icons**:
```javascript
createMarker(lat, lng) {
  const customIcon = L.divIcon({
    className: 'custom-marker',
    iconSize: [46, 56],
    iconAnchor: [23, 56],
    popupAnchor: [0, -56]
  })
  
  this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map)
  this.map.setView([lat, lng], 13, { animate: true, duration: 1 })
}
```

- **Responsive CSS with mobile-first approach**:
```css
.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .info-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

- **Class-based JavaScript architecture**:
```javascript
class IPTracker {
  constructor() {
    this.map = null
    this.marker = null
    this.init()
  }
  
  init() {
    this.initMap()
    this.bindEvents()
    this.getUserIP()
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

## 👤 Author

- Website: [Sharnjeet Singh](https://sharn-portfolio.vercel.app/)
- Frontend Mentor: [@sharnjeet21](https://www.frontendmentor.io/profile/sharnjeet21)
- GitHub: [@sharnjeet21](https://github.com/sharnjeet21)

---

## 🙏 Acknowledgments

Special thanks to **Frontend Mentor** for providing such a comprehensive challenge that perfectly demonstrates real-world API integration, vanilla JavaScript development patterns, and responsive design principles. Also grateful to the **Geoapify** team for their reliable geolocation API and **Leaflet.js** community for the excellent mapping library.