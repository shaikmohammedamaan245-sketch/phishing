"use client"

import { useState, useEffect } from "react"

interface ServerLocationMapProps {
  serverLocation: string
  serverStatus: string
}

export function ServerLocationMap({ serverLocation, serverStatus }: ServerLocationMapProps) {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [locationDetails, setLocationDetails] = useState<{
    city: string
    country: string
    timezone: string
    languages: string
    currency: string
    countryCode: string
  } | null>(null)

  useEffect(() => {
    if (serverStatus !== "Online" || !serverLocation) return

    // In a real app, we would use a geocoding API to get the actual coordinates
    // For this demo, we'll simulate coordinates based on the server location
    const simulatedCoordinates = getSimulatedCoordinates(serverLocation)
    setCoordinates(simulatedCoordinates)

    // Simulate location details
    setLocationDetails(getLocationDetails(serverLocation))
  }, [serverLocation, serverStatus])

  if (serverStatus !== "Online" || !coordinates || !locationDetails) {
    return null
  }

  // Calculate position on the map (simple mapping from lat/lng to x/y)
  // Map is 360x180 degrees, our SVG is 800x400 pixels
  const x = ((coordinates.lng + 180) / 360) * 800
  const y = ((90 - coordinates.lat) / 180) * 400

  return (
    <div className="bg-slate-900 rounded-lg p-4 mt-4">
      <h3 className="text-lg font-medium mb-3">Server Location</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-slate-400">City</div>
            <div>{locationDetails.city}</div>

            <div className="text-slate-400">Country</div>
            <div className="flex items-center gap-2">
              {locationDetails.country}
              <span className="text-lg">{getFlagEmoji(locationDetails.countryCode)}</span>
            </div>

            <div className="text-slate-400">Timezone</div>
            <div>{locationDetails.timezone}</div>

            <div className="text-slate-400">Languages</div>
            <div>{locationDetails.languages}</div>

            <div className="text-slate-400">Currency</div>
            <div>{locationDetails.currency}</div>
          </div>
        </div>

        <div className="relative">
          <div className="bg-slate-950 rounded-md overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
              {/* World map paths - simplified for demo */}
              <g fill="none" stroke="#333" strokeWidth="1">
                <path d="M 100,100 L 700,100 L 700,300 L 100,300 Z" />
                {/* North America */}
                <path
                  d="M 170,120 L 220,120 L 250,150 L 270,180 L 250,200 L 200,210 L 180,190 L 160,150 Z"
                  stroke="#444"
                />
                {/* South America */}
                <path d="M 220,220 L 250,220 L 270,260 L 250,290 L 220,280 L 210,250 Z" stroke="#444" />
                {/* Europe */}
                <path d="M 400,120 L 450,120 L 470,150 L 450,170 L 420,170 L 400,150 Z" stroke="#444" />
                {/* Africa */}
                <path d="M 400,180 L 450,180 L 470,220 L 450,260 L 420,260 L 400,220 Z" stroke="#444" />
                {/* Asia */}
                <path d="M 500,120 L 600,120 L 620,180 L 600,220 L 550,220 L 520,180 Z" stroke="#444" />
                {/* Australia */}
                <path d="M 650,250 L 680,250 L 690,270 L 680,290 L 650,290 L 640,270 Z" stroke="#444" />
              </g>

              {/* Server location marker */}
              <g transform={`translate(${x}, ${y})`}>
                <circle r="5" fill="#00aaff" />
                <circle r="10" fill="#00aaff" fillOpacity="0.3" />
                <line x1="15" y1="-15" x2="100" y2="-40" stroke="#00aaff" strokeWidth="1" />
                <text x="105" y="-35" fill="#00aaff" fontSize="12" textAnchor="start">
                  Server ({serverLocation.split(",")[0]})
                </text>
              </g>

              {/* Coordinates display */}
              <text x="10" y="390" fill="#666" fontSize="10">
                Latitude: {coordinates.lat.toFixed(4)}, Longitude: {coordinates.lng.toFixed(4)}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions to simulate data
function getSimulatedCoordinates(location: string): { lat: number; lng: number } {
  // Map common locations to coordinates
  const locationMap: Record<string, { lat: number; lng: number }> = {
    "United States": { lat: 37.0902, lng: -95.7129 },
    Canada: { lat: 56.1304, lng: -106.3468 },
    "United Kingdom": { lat: 55.3781, lng: -3.436 },
    Germany: { lat: 51.1657, lng: 10.4515 },
    France: { lat: 46.2276, lng: 2.2137 },
    Russia: { lat: 61.524, lng: 105.3188 },
    China: { lat: 35.8617, lng: 104.1954 },
    Netherlands: { lat: 52.1326, lng: 5.2913 },
  }

  // Check if the location is in our map
  for (const [key, coords] of Object.entries(locationMap)) {
    if (location.includes(key)) {
      // Add a small random offset to make it look more realistic
      return {
        lat: coords.lat + (Math.random() * 2 - 1),
        lng: coords.lng + (Math.random() * 2 - 1),
      }
    }
  }

  // Default to a random location if not found
  return {
    lat: Math.random() * 180 - 90,
    lng: Math.random() * 360 - 180,
  }
}

function getLocationDetails(location: string) {
  // Map locations to details
  const detailsMap: Record<string, any> = {
    "United States": {
      city: "Ashburn, Virginia",
      country: "United States",
      timezone: "America/New_York",
      languages: "en-US",
      currency: "Dollar (USD)",
      countryCode: "US",
    },
    Canada: {
      city: "MDM, Toronto, Ontario",
      country: "Canada",
      timezone: "America/Toronto",
      languages: "en-CA,fr-CA,iu",
      currency: "Dollar (CAD)",
      countryCode: "CA",
    },
    "United Kingdom": {
      city: "London",
      country: "United Kingdom",
      timezone: "Europe/London",
      languages: "en-GB",
      currency: "Pound (GBP)",
      countryCode: "GB",
    },
    Germany: {
      city: "Frankfurt",
      country: "Germany",
      timezone: "Europe/Berlin",
      languages: "de-DE",
      currency: "Euro (EUR)",
      countryCode: "DE",
    },
    France: {
      city: "Paris",
      country: "France",
      timezone: "Europe/Paris",
      languages: "fr-FR",
      currency: "Euro (EUR)",
      countryCode: "FR",
    },
    Russia: {
      city: "Moscow",
      country: "Russia",
      timezone: "Europe/Moscow",
      languages: "ru-RU",
      currency: "Ruble (RUB)",
      countryCode: "RU",
    },
    China: {
      city: "Beijing",
      country: "China",
      timezone: "Asia/Shanghai",
      languages: "zh-CN",
      currency: "Yuan (CNY)",
      countryCode: "CN",
    },
    Netherlands: {
      city: "Amsterdam",
      country: "Netherlands",
      timezone: "Europe/Amsterdam",
      languages: "nl-NL",
      currency: "Euro (EUR)",
      countryCode: "NL",
    },
  }

  // Check if the location is in our map
  for (const [key, details] of Object.entries(detailsMap)) {
    if (location.includes(key)) {
      return details
    }
  }

  // Default details
  return {
    city: "Unknown City",
    country: "Unknown Country",
    timezone: "UTC",
    languages: "en",
    currency: "Unknown",
    countryCode: "XX",
  }
}

function getFlagEmoji(countryCode: string) {
  // Convert country code to flag emoji
  // Each country code character is converted to a regional indicator symbol letter
  // which when combined create flag emojis in supporting browsers
  if (countryCode === "XX") return "🌐"

  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0))

  return String.fromCodePoint(...codePoints)
}
