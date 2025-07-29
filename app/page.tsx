"use client"

import { useState } from "react"
import { Search, MapPin, Calendar, Trash2, Download, Map, List, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock geofence data for councils
const councilData = [
  {
    name: "Manningham City Council",
    bounds: {
      // Rough bounds for Doncaster/Donvale area
      north: -37.75,
      south: -37.8,
      east: 145.15,
      west: 145.1,
    },
    color: "#22c55e",
    binSchedule: {
      general: { day: "Tuesday", week: "Weekly" },
      recycling: { day: "Tuesday", week: "Fortnightly (Week A)" },
      green: { day: "Friday", week: "Fortnightly (Week B)" },
    },
  },
  {
    name: "Whitehorse City Council",
    bounds: {
      north: -37.8,
      south: -37.85,
      east: 145.15,
      west: 145.1,
    },
    color: "#3b82f6",
    binSchedule: {
      general: { day: "Wednesday", week: "Weekly" },
      recycling: { day: "Wednesday", week: "Fortnightly (Week A)" },
      green: { day: "Monday", week: "Fortnightly (Week B)" },
    },
  },
]

// Mock address data
const mockAddresses = [
  {
    address: "123 Main Street, Doncaster VIC 3108",
    coordinates: { lat: -37.77, lng: 145.13 },
    council: "Manningham City Council",
  },
  {
    address: "456 High Street, Donvale VIC 3111",
    coordinates: { lat: -37.78, lng: 145.14 },
    council: "Manningham City Council",
  },
]

const binTypes = [
  { type: "general", name: "General Waste", color: "bg-red-500", icon: "🗑️" },
  { type: "recycling", name: "Recycling", color: "bg-yellow-500", icon: "♻️" },
  { type: "green", name: "Green Waste", color: "bg-green-500", icon: "🌿" },
]

export default function BinsOutPortal() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find matching address
    const foundAddress = mockAddresses.find(
      (addr) =>
        addr.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        searchQuery.toLowerCase().includes("doncaster") ||
        searchQuery.toLowerCase().includes("donvale"),
    )

    if (foundAddress) {
      // Find council based on coordinates
      const council = councilData.find(
        (c) =>
          foundAddress.coordinates.lat >= c.bounds.south &&
          foundAddress.coordinates.lat <= c.bounds.north &&
          foundAddress.coordinates.lng >= c.bounds.west &&
          foundAddress.coordinates.lng <= c.bounds.east,
      )

      setSelectedAddress({
        ...foundAddress,
        councilData: council,
      })
    } else {
      setSelectedAddress(null)
    }

    setIsSearching(false)
  }

  const MapView = () => (
    <Card className="w-full h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="w-5 h-5" />
          Council Areas Map
        </CardTitle>
        <CardDescription>Colored areas represent different council boundaries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-64 bg-slate-100 rounded-lg overflow-hidden">
          {/* Mock map with colored council areas */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 opacity-60" style={{ backgroundColor: councilData[0].color }}>
              <div className="p-4 text-white font-semibold text-sm">Manningham City Council</div>
            </div>
            <div className="flex-1 opacity-60" style={{ backgroundColor: councilData[1].color }}>
              <div className="p-4 text-white font-semibold text-sm">Whitehorse City Council</div>
            </div>
          </div>

          {selectedAddress && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-red-500 w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-4">
          {councilData.map((council, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: council.color }}></div>
              <span className="text-sm">{council.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">binsout.com.au</h1>
                <p className="text-sm text-gray-600">Your local bin collection guide</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Australia-wide coverage
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Never miss bin day again! 🗑️</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Enter your address to find your local council's bin collection schedule. Get reminders for general waste,
            recycling, and green waste collection days.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Find Your Bin Collection Schedule
            </CardTitle>
            <CardDescription>Enter your street address to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. 123 Main Street, Doncaster VIC 3108"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching} className="bg-green-600 hover:bg-green-700">
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Quick examples */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setSearchQuery("Doncaster")}>
                  Doncaster
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSearchQuery("Donvale")}>
                  Donvale
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {selectedAddress && (
          <div className="space-y-6">
            {/* Address Info */}
            <Alert>
              <MapPin className="h-4 w-4" />
              <AlertDescription>
                <strong>Found:</strong> {selectedAddress.address} - {selectedAddress.councilData?.name}
              </AlertDescription>
            </Alert>

            {/* View Toggle */}
            <div className="flex justify-center">
              <div className="bg-white rounded-lg p-1 shadow-sm border">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="gap-2"
                >
                  <List className="w-4 h-4" />
                  Schedule
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className="gap-2"
                >
                  <Map className="w-4 h-4" />
                  Map View
                </Button>
              </div>
            </div>

            {viewMode === "list" ? (
              /* Bin Schedule */
              <div className="grid md:grid-cols-3 gap-4">
                {binTypes.map((bin) => {
                  const schedule = selectedAddress.councilData?.binSchedule[bin.type]
                  return (
                    <Card key={bin.type} className="relative overflow-hidden">
                      <div className={`absolute top-0 left-0 right-0 h-1 ${bin.color}`}></div>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <span className="text-2xl">{bin.icon}</span>
                          {bin.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold">{schedule?.day}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {schedule?.week}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <MapView />
            )}

            {/* Council Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Council Information</CardTitle>
                <CardDescription>Contact {selectedAddress.councilData?.name} for more information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>(03) 9840 9333</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>info@manningham.vic.gov.au</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {searchQuery && !selectedAddress && !isSearching && (
          <Alert>
            <AlertDescription>
              No results found for "{searchQuery}". Try searching for "Doncaster" or "Donvale" to see example data.
            </AlertDescription>
          </Alert>
        )}

        <Separator className="my-12" />

        {/* Download App Section */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Download className="w-16 h-16 mx-auto mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-2">Get the BinsOut App</h3>
              <p className="text-green-100 max-w-2xl mx-auto">
                Never forget bin day again! Get push notifications, set custom reminders, and access your schedule
                offline with our mobile app.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 gap-2 min-w-48">
                <Download className="w-5 h-5" />
                Download for iOS
              </Button>
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 gap-2 min-w-48">
                <Download className="w-5 h-5" />
                Download for Android
              </Button>
            </div>

            <p className="text-sm text-green-100 mt-4">Free download • Available Australia-wide • Offline access</p>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-green-600 p-1 rounded">
                  <Trash2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">binsout.com.au</span>
              </div>
              <p className="text-gray-400 text-sm">Making waste management easier for all Australians.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Coverage Areas</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Melbourne Metro</li>
                <li>Sydney Metro</li>
                <li>Brisbane Metro</li>
                <li>Perth Metro</li>
              </ul>
            </div>
          </div>

          <Separator className="my-6 bg-gray-700" />

          <div className="text-center text-sm text-gray-400">
            <p>&copy; 2024 BinsOut. All rights reserved. Made with ❤️ in Australia.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
