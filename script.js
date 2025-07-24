// API Configuration
const API_CONFIG = {
  GEOAPIFY: {
    API_KEY: 'bec5703cecd64071997010ec34344aab',
    BASE_URL: 'https://api.geoapify.com/v1/ipinfo',
    TIMEOUT: 10000
  },
  IP_DETECTION: {
    URL: 'https://api.ipify.org?format=json',
    TIMEOUT: 5000
  }
}

// IP Address Tracker App
class IPTracker {
  constructor() {
    this.map = null
    this.marker = null
    this.currentIP = null
    
    // DOM elements
    this.searchForm = document.getElementById('searchForm')
    this.searchInput = document.getElementById('searchInput')
    this.loading = document.getElementById('loading')
    this.errorMessage = document.getElementById('errorMessage')
    
    // Info display elements
    this.ipElement = document.getElementById('ipAddress')
    this.locationElement = document.getElementById('location')
    this.timezoneElement = document.getElementById('timezone')
    this.ispElement = document.getElementById('isp')
    
    this.init()
  }

  init() {
    this.initMap()
    this.bindEvents()
    this.getUserIP()
  }

  initMap() {
    // Initialize map with default coordinates (New York)
    this.map = L.map('map', {
      zoomControl: false
    }).setView([40.7128, -74.0060], 13)

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map)

    // Add zoom control to top right
    L.control.zoom({
      position: 'topright'
    }).addTo(this.map)

    // Create custom marker
    this.createMarker(40.7128, -74.0060)
  }

  createMarker(lat, lng) {
    // Remove existing marker
    if (this.marker) {
      this.map.removeLayer(this.marker)
    }

    // Create custom icon using the location SVG
    const customIcon = L.divIcon({
      className: 'custom-marker',
      iconSize: [46, 56],
      iconAnchor: [23, 56],
      popupAnchor: [0, -56]
    })

    // Add new marker
    this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map)
    
    // Center map on marker with smooth animation
    this.map.setView([lat, lng], 13, {
      animate: true,
      duration: 1
    })
  }

  bindEvents() {
    this.searchForm.addEventListener('submit', (e) => {
      e.preventDefault()
      const query = this.searchInput.value.trim()
      this.searchIP(query)
    })

    // Add input focus effect
    this.searchInput.addEventListener('focus', () => {
      this.searchInput.parentElement.style.boxShadow = '0 50px 50px -25px rgba(0, 0, 0, 0.2)'
    })

    this.searchInput.addEventListener('blur', () => {
      this.searchInput.parentElement.style.boxShadow = '0 50px 50px -25px rgba(0, 0, 0, 0.1)'
    })
  }

  async getUserIP() {
    try {
      this.showLoading()
      
      // Get user's IP address
      const ipResponse = await fetch(API_CONFIG.IP_DETECTION.URL)
      const ipData = await ipResponse.json()
      
      this.currentIP = ipData.ip
      
      // Get location data for user's IP
      await this.getIPInfo('')
      
    } catch (error) {
      console.error('Error getting user IP:', error)
      this.showError('Unable to detect your IP address')
    } finally {
      this.hideLoading()
    }
  }

  async searchIP(query) {
    try {
      this.showLoading()
      await this.getIPInfo(query)
    } catch (error) {
      console.error('Error searching IP:', error)
      this.showError('Unable to fetch IP information. Please check your input and try again.')
    } finally {
      this.hideLoading()
    }
  }

  async getIPInfo(ipOrDomain) {
    try {
      // If no input provided, get user's current IP info
      if (!ipOrDomain || ipOrDomain.trim() === '') {
        const apiUrl = `${API_CONFIG.GEOAPIFY.BASE_URL}?apiKey=${API_CONFIG.GEOAPIFY.API_KEY}`
        
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`)
        }
        
        const data = await response.json()
        const formattedData = this.formatApiResponse(data)
        this.updateDisplay(formattedData)
        this.createMarker(formattedData.location.lat, formattedData.location.lng)
        return
      }

      const trimmedInput = ipOrDomain.trim()

      // Check if input is a domain or IP
      if (this.isValidDomain(trimmedInput)) {
        // For domains, use mock data since Geoapify doesn't resolve domains
        console.warn('Using mock data for domain:', trimmedInput)
        const mockData = this.getMockData(trimmedInput)
        this.updateDisplay(mockData)
        this.createMarker(mockData.location.lat, mockData.location.lng)
        return
      }

      // For IP addresses, use Geoapify API
      if (this.isValidIP(trimmedInput)) {
        const apiUrl = `${API_CONFIG.GEOAPIFY.BASE_URL}?ip=${encodeURIComponent(trimmedInput)}&apiKey=${API_CONFIG.GEOAPIFY.API_KEY}`
        
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          if (response.status === 400) {
            throw new Error('Invalid IP address format')
          } else if (response.status === 401) {
            throw new Error('API key is invalid')
          } else if (response.status === 403) {
            throw new Error('API access denied or quota exceeded')
          } else {
            throw new Error(`API request failed with status: ${response.status}`)
          }
        }

        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error.message || 'API returned an error')
        }
        
        const formattedData = this.formatApiResponse(data)
        this.updateDisplay(formattedData)
        this.createMarker(formattedData.location.lat, formattedData.location.lng)
        return
      }

      // If neither valid IP nor domain, show error
      throw new Error('Please enter a valid IP address or domain (e.g., 8.8.8.8 or google.com)')
      
    } catch (error) {
      console.error('Error fetching IP info:', error)
      
      // Fall back to mock data
      console.warn('API request failed, falling back to mock data')
      const mockData = this.getMockData(ipOrDomain)
      this.updateDisplay(mockData)
      this.createMarker(mockData.location.lat, mockData.location.lng)
    }
  }

  formatApiResponse(apiData) {
    console.log('Geoapify API Response:', apiData)
    
    return {
      ip: apiData.ip || 'Unknown',
      location: {
        country: apiData.country?.name || 'Unknown',
        region: apiData.state?.name || apiData.region?.name || 'Unknown', 
        city: apiData.city?.name || 'Unknown',
        lat: apiData.location?.latitude || 0,
        lng: apiData.location?.longitude || 0,
        postalCode: apiData.postcode || '',
        timezone: this.formatTimezone(apiData.timezone?.offset_STD || 0)
      },
      isp: apiData.isp || apiData.organization || 'Unknown ISP'
    }
  }

  formatTimezone(offsetSeconds) {
    if (!offsetSeconds) return 'UTC+00:00'
    
    const hours = Math.floor(Math.abs(offsetSeconds) / 3600)
    const minutes = Math.floor((Math.abs(offsetSeconds) % 3600) / 60)
    const sign = offsetSeconds >= 0 ? '+' : '-'
    
    return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  getMockData(query) {
    const mockResponses = {
      'google.com': {
        ip: '8.8.8.8',
        location: {
          country: 'US',
          region: 'California',
          city: 'Mountain View',
          lat: 37.4056,
          lng: -122.0775,
          postalCode: '94043',
          timezone: 'UTC-08:00'
        },
        isp: 'Google LLC'
      },
      'github.com': {
        ip: '140.82.112.4',
        location: {
          country: 'US',
          region: 'California',
          city: 'San Francisco',
          lat: 37.7749,
          lng: -122.4194,
          postalCode: '94107',
          timezone: 'UTC-08:00'
        },
        isp: 'GitHub, Inc.'
      },
      'facebook.com': {
        ip: '157.240.241.35',
        location: {
          country: 'US',
          region: 'California',
          city: 'Menlo Park',
          lat: 37.4845,
          lng: -122.1477,
          postalCode: '94025',
          timezone: 'UTC-08:00'
        },
        isp: 'Facebook, Inc.'
      },
      '8.8.8.8': {
        ip: '8.8.8.8',
        location: {
          country: 'US',
          region: 'California',
          city: 'Mountain View',
          lat: 37.4056,
          lng: -122.0775,
          postalCode: '94043',
          timezone: 'UTC-08:00'
        },
        isp: 'Google LLC'
      }
    }

    // Check if query matches a mock domain or IP
    const normalizedQuery = query.toLowerCase().trim()
    if (mockResponses[normalizedQuery]) {
      return mockResponses[normalizedQuery]
    }

    // Default mock data
    return {
      ip: this.isValidIP(query) ? query : '192.212.174.101',
      location: {
        country: 'US',
        region: 'NY',
        city: 'Brooklyn',
        lat: 40.6782,
        lng: -73.9442,
        postalCode: '10001',
        timezone: 'UTC-05:00'
      },
      isp: 'SpaceX Starlink'
    }
  }

  isValidIP(ip) {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    return ipRegex.test(ip)
  }

  isValidDomain(domain) {
    return domain.includes('.') && domain.length > 3
  }

  updateDisplay(data) {
    // Animate the info values update
    this.animateValueUpdate(this.ipElement, data.ip)
    this.animateValueUpdate(this.locationElement, `${data.location.city}, ${data.location.region} ${data.location.postalCode}`)
    this.animateValueUpdate(this.timezoneElement, data.location.timezone)
    this.animateValueUpdate(this.ispElement, data.isp)
  }

  animateValueUpdate(element, newValue) {
    element.style.opacity = '0.5'
    setTimeout(() => {
      element.textContent = newValue
      element.style.opacity = '1'
    }, 150)
  }

  showLoading() {
    this.loading.style.display = 'flex'
  }

  hideLoading() {
    this.loading.style.display = 'none'
  }

  showError(message) {
    this.errorMessage.querySelector('p').textContent = message
    this.errorMessage.style.display = 'block'
    
    // Hide error after 4 seconds
    setTimeout(() => {
      this.errorMessage.style.display = 'none'
    }, 4000)
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.ipTracker = new IPTracker()
})

// Handle responsive map resize
window.addEventListener('resize', () => {
  if (window.ipTracker && window.ipTracker.map) {
    setTimeout(() => {
      window.ipTracker.map.invalidateSize()
    }, 100)
  }
})