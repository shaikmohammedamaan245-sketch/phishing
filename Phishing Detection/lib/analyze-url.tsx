import { parse as parseUrl } from "url"

// List of known free hosting platforms (sample)
const FREE_HOSTING_PLATFORMS = [
  "freewebhostmost.com",
  "000webhost.com",
  "x10hosting.com",
  "weebly.com",
  "vercel.app",
  "netlify.com",
  ".monster",
  ".top",
  ".pro",
  "-com",
  "com.",
  ".solutions",
  ".playtest",
  "communmutty",
  "comunutty",
  ".vip",
  ".ww",
  "fsthosting",
  ".tw",
  ".de",
  ".legal",
  ".kg",
  ".n1",
  ".store",
  "firebaseapp",
  ".bond",
  ".br",
  "bj",
  "hstn",
  ".asp",
  ".gd",
  ".r2",
  ".top",
  ".mx",
  ".fr",
  "gcbt",
  "comcom",
  "-sale",
  ".vip",
  ".leia",
  ".beta",
  ".cn",
  ".ca",
  "=phi",
  ".web",
  ".center",
  ".centre",
  ".shop",
  "m.s",
  "com-info",
  "-lg",
  "cp.",
  "hn.pn",
  ".run",
  ".es",
  ".click",
  "-binance",
  ".webflow",
  ".jp",
  "-cdn",
  ".cdn",
  ".sso",
  "-sso",
  ".msde",
  "-fi",
  ".p7ah",
  "net-",
  "-net",
  ".ubpages",
  "i.m",
  ".pagemaker",
  ".ubpages",
  "_uc",
  ".gy",
  "/d/e/",
  "/gmx",
  ".p",
  "aspmx.",
  ".aspmx",
  "m.",
  ".m",
  ".vpn",
  "vpn.",
  ".cfd",
  "-cse.",
  "/accueil",
  ".de",
  ".intttc",
  ".p250w",
  ".work",
  ".im",
  ".community",
  "-bless.",
  ".ys7z",
  ".doom",
  "-lala.",
  "-bless.",
  ".bless",
  "-steam.",
  ".concord",
  "-bonus",
  ".wall",
  "0steam.",
  "-steam.",
  ".com.co",
  "ycc.com",
  ",wp",
  "/przyciski",
  "/fr/",
  ".fr",
  ".top",
  ".devr",
  "-iossa.",
  "-luigi-",
  "-luigi",
  ".luigi",
  ".lma",
  ".nz",
  "device.",
  "/for",
  "yee.",
  "-usa.",
  ".mx",
  "/ncp/",
  ".dk",
  ".md",
  ".pp-al",
  ".my",
  ".ro",
  ".it",
  ".firebaseapp",
  "-io",
  "app.",
  "-nft",
  "-gpt-",
  ".log",
  ".dog",
  ".shop",
  "swhm.",
  ".swhm",
  ".ac1360",
  "com-info",
  "token.",
  "sea.",
  ".gbjslyhr",
  ".help",
  "-be.",
  "-seguro.",
  "-suspenso.",
  ".3ds-",
  ".portal",
  ".account",
  ".admin",
  ".de",
  ".ru",
  "ftp.",
]

// Define invalid or unsafe characters for a URL
const INVALID_URL_CHARS = new Set('<>"{}|\\^[]` ')

// Update the analyzeUrl function to include all these new simulations
export async function analyzeUrl(url: string) {
  const results: Record<string, any> = {}
  let phishingIndicators = 0 // Counter for suspicious features

  try {
    // Parse the URL
    const parsedUrl = parseUrl(url)
    const domain = parsedUrl.hostname || ""

    // 1. Validate URL for prohibited characters
    const hasInvalidChars =
      Array.from(INVALID_URL_CHARS).some((char) => url.includes(char)) ||
      FREE_HOSTING_PLATFORMS.some((platform) => url.includes(platform))
    results.hasInvalidCharacters = hasInvalidChars
    if (hasInvalidChars) phishingIndicators++

    // 2. Check for suspicious characters
    const suspiciousChars = [" ", "<", ">", "_", "$", "^", "*", "{", "}", "[", "]", "|", '"', "`"]
    const hasSuspiciousChars = suspiciousChars.some((c) => url.includes(c))
    results.hasSuspiciousCharacters = hasSuspiciousChars
    if (hasSuspiciousChars) phishingIndicators++

    // 3. Check for too many subdomains
    const subdomains = domain.split(".")
    results.numberOfSubdomains = Math.max(0, subdomains.length - 2)
    results.hasTooManySubdomains = subdomains.length > 3
    if (subdomains.length > 3) phishingIndicators++

    // 4. Check for IP address instead of domain
    const isIpAddress = /^\d{1,3}(\.\d{1,3}){3}$/.test(domain)
    results.hasIpAddressInUrl = isIpAddress
    if (isIpAddress) phishingIndicators++

    // 5. Check for HTTPS
    results.usesHttps = url.startsWith("https")
    if (!results.usesHttps) phishingIndicators++

    // 6. Domain age - simulated since we can't do a real WHOIS lookup in the browser
    // In a real implementation, this would be a server-side API call
    const domainAge = simulateDomainAge(domain)
    results.domainAgeDays = domainAge
    results.isNewlyCreatedDomain = domainAge < 180
    if (domainAge < 180) phishingIndicators++

    // 7. IP Address - simulated
    results.ipAddress = simulateIpAddress()

    // 8. Check if domain is hosted on known free hosting platform
    const isFreeHosting = FREE_HOSTING_PLATFORMS.some((platform) => domain.includes(platform))
    results.isFreeHostingPlatform = isFreeHosting
    if (isFreeHosting) phishingIndicators++

    // 9. SSL certificate - simulated
    results.sslCertificate = results.usesHttps ? "Valid" : "Invalid"
    if (results.sslCertificate !== "Valid") phishingIndicators++

    // 10. Server location - simulated
    results.serverLocation = simulateServerLocation()

    // 11. HTTP Headers - simulated
    results.serverHeader = "Apache/2.4.41"
    results.xPoweredByHeader = "PHP/7.4.3"

    // 12. Redirects - simulated
    results.numberOfRedirects = Math.floor(Math.random() * 3)
    if (results.numberOfRedirects > 2) phishingIndicators++

    // Add all the new technical details
    results.whoisInfo = simulateWhoisInfo(domain)
    results.dnssec = simulateDNSSEC()
    results.dnsServers = simulateDNSServers()
    results.serverInfo = simulateServerInfo()
    results.firewall = simulateFirewall()
    results.tlsHandshake = simulateTLSHandshake()
    results.tlsCipherSuites = simulateTLSCipherSuites()
    results.httpHeaders = simulateHTTPHeaders()
    results.redirectDetails = simulateRedirects()
    results.carbonFootprint = simulateCarbonFootprint()
    results.serverStatus = simulateServerStatus()
    results.openPorts = simulateOpenPorts()
    results.httpSecurity = simulateHTTPSecurity()
    results.sslCertificateDetails = simulateSSLCertificate(results.usesHttps)

    // Final Verdict
    if (
      phishingIndicators >= 3 ||
      results.domainAgeDays === "Unknown" ||
      FREE_HOSTING_PLATFORMS.some((platform) => url.includes(platform))
    ) {
      results.phishingVerdict = "Phishing attack detected"
    } else {
      results.phishingVerdict = "No phishing attack detected"
    }

    return results
  } catch (error) {
    console.error("Error analyzing URL:", error)
    return {
      error: "Failed to analyze URL",
      phishingVerdict: "Analysis failed",
    }
  }
}

// Simulation functions (in a real app, these would be API calls)
function simulateDomainAge(domain: string): number {
  // For demonstration purposes, generate a random domain age
  // Domains with certain TLDs or keywords are more likely to be new
  if (
    domain.includes("free") ||
    domain.includes("login") ||
    domain.includes("secure") ||
    domain.endsWith(".xyz") ||
    domain.endsWith(".info")
  ) {
    return Math.floor(Math.random() * 180) // 0-180 days
  }

  // Established domains
  if (domain.endsWith(".com") || domain.endsWith(".org") || domain.endsWith(".net") || domain.endsWith(".gov")) {
    return 180 + Math.floor(Math.random() * 1000) // 180-1180 days
  }

  return Math.floor(Math.random() * 500) // 0-500 days
}

function simulateIpAddress(): string {
  // Generate a random IP address
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
}

function simulateServerLocation(): string {
  // Return a random country
  const countries = ["United States", "Russia", "China", "Netherlands", "Germany", "France", "United Kingdom", "Canada"]
  return countries[Math.floor(Math.random() * countries.length)]
}

// Simulate DNS Security Extensions status
function simulateDNSSEC(): string {
  const statuses = ["Enabled", "Disabled", "Not Configured"]
  return statuses[Math.floor(Math.random() * statuses.length)]
}

// Simulate DNS Server information
function simulateDNSServers(): string[] {
  const dnsProviders = [
    "ns1.cloudflare.com",
    "ns2.cloudflare.com",
    "ns1.google.com",
    "ns2.google.com",
    "ns1.amazon.com",
    "ns2.amazon.com",
    "ns1.godaddy.com",
    "ns2.godaddy.com",
  ]

  // Return 2-3 random DNS servers
  const count = 2 + Math.floor(Math.random() * 2)
  const servers = []
  for (let i = 0; i < count; i++) {
    servers.push(dnsProviders[Math.floor(Math.random() * dnsProviders.length)])
  }
  return servers
}

// Simulate server information
function simulateServerInfo(): Record<string, string> {
  const webServers = ["Apache/2.4.41", "nginx/1.18.0", "Microsoft-IIS/10.0", "LiteSpeed/5.4.1"]
  const phpVersions = ["PHP/7.4.3", "PHP/8.0.13", "PHP/8.1.2", "Not Detected"]

  return {
    webServer: webServers[Math.floor(Math.random() * webServers.length)],
    poweredBy: phpVersions[Math.floor(Math.random() * phpVersions.length)],
  }
}

// Simulate firewall information
function simulateFirewall(): Record<string, any> {
  const firewalls = ["Cloudflare", "AWS WAF", "Sucuri", "Imperva", "None Detected"]
  const detected = Math.random() > 0.3

  return {
    detected,
    name: detected ? firewalls[Math.floor(Math.random() * (firewalls.length - 1))] : firewalls[firewalls.length - 1],
  }
}

// Simulate TLS handshake
function simulateTLSHandshake(): Record<string, any> {
  const protocols = ["TLSv1.2", "TLSv1.3"]
  const statuses = ["Successful", "Failed", "Timeout"]
  const times = [100, 150, 200, 250, 300, 350]

  return {
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    time: times[Math.floor(Math.random() * times.length)] + "ms",
  }
}

// Simulate TLS cipher suites
function simulateTLSCipherSuites(): string[] {
  const ciphers = [
    "TLS_AES_128_GCM_SHA256",
    "TLS_AES_256_GCM_SHA384",
    "TLS_CHACHA20_POLY1305_SHA256",
    "ECDHE-ECDSA-AES128-GCM-SHA256",
    "ECDHE-RSA-AES128-GCM-SHA256",
    "ECDHE-ECDSA-AES256-GCM-SHA384",
    "ECDHE-RSA-AES256-GCM-SHA384",
  ]

  // Return 2-4 random cipher suites
  const count = 2 + Math.floor(Math.random() * 3)
  const selectedCiphers = []
  for (let i = 0; i < count; i++) {
    selectedCiphers.push(ciphers[Math.floor(Math.random() * ciphers.length)])
  }
  return selectedCiphers
}

// Simulate HTTP headers
function simulateHTTPHeaders(): Record<string, string> {
  return {
    Server: simulateServerInfo().webServer,
    "X-Powered-By": simulateServerInfo().poweredBy,
    "Content-Type": "text/html; charset=UTF-8",
    "Content-Encoding": Math.random() > 0.5 ? "gzip" : "none",
    "Cache-Control": "max-age=3600, public",
    "X-Frame-Options": Math.random() > 0.5 ? "SAMEORIGIN" : "DENY",
    "X-XSS-Protection": "1; mode=block",
    "X-Content-Type-Options": "nosniff",
    "Strict-Transport-Security": Math.random() > 0.7 ? "max-age=31536000; includeSubDomains" : "not set",
  }
}

// Simulate redirects
function simulateRedirects(): Record<string, any>[] {
  const count = Math.floor(Math.random() * 3)
  const redirects = []

  for (let i = 0; i < count; i++) {
    redirects.push({
      from: `http${Math.random() > 0.5 ? "s" : ""}://example${i}.com`,
      to: `http${Math.random() > 0.7 ? "s" : ""}://example${i + 1}.com`,
      statusCode: [301, 302, 307][Math.floor(Math.random() * 3)],
    })
  }

  return redirects
}

// Simulate carbon footprint
function simulateCarbonFootprint(): Record<string, any> {
  const co2Range = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
  const co2 = co2Range[Math.floor(Math.random() * co2Range.length)]

  return {
    co2PerVisit: co2.toFixed(2) + "g",
    cleanerThan: Math.floor(Math.random() * 100) + "%",
    rating: co2 < 0.5 ? "A" : co2 < 0.8 ? "B" : "C",
  }
}

// Simulate server status
function simulateServerStatus(): Record<string, any> {
  const uptimes = [99.9, 99.99, 99.999, 100]
  const responseTime = 100 + Math.floor(Math.random() * 900)

  return {
    status: Math.random() > 0.1 ? "Online" : "Offline",
    uptime: uptimes[Math.floor(Math.random() * uptimes.length)] + "%",
    responseTime: responseTime + "ms",
  }
}

// Simulate open ports
function simulateOpenPorts(): number[] {
  const commonPorts = [21, 22, 25, 53, 80, 443, 3306, 8080, 8443]
  const count = Math.floor(Math.random() * 4) + 1 // 1-4 open ports
  const openPorts = []

  // Always include port 80 or 443
  openPorts.push(Math.random() > 0.5 ? 80 : 443)

  // Add some random ports
  while (openPorts.length < count) {
    const port = commonPorts[Math.floor(Math.random() * commonPorts.length)]
    if (!openPorts.includes(port)) {
      openPorts.push(port)
    }
  }

  return openPorts.sort((a, b) => a - b)
}

// Simulate WHOIS information
function simulateWhoisInfo(domain: string): Record<string, any> {
  const registrars = ["GoDaddy.com, LLC", "Namecheap, Inc.", "Amazon Registrar, Inc.", "Google LLC", "Cloudflare, Inc."]
  const domainAge = simulateDomainAge(domain)

  const creationDate = new Date()
  creationDate.setDate(creationDate.getDate() - domainAge)

  const expiryDate = new Date(creationDate)
  expiryDate.setFullYear(expiryDate.getFullYear() + Math.floor(Math.random() * 5) + 1)

  return {
    registrar: registrars[Math.floor(Math.random() * registrars.length)],
    registrantName: Math.random() > 0.5 ? "Privacy Protected" : "John Doe",
    registrantOrganization: Math.random() > 0.5 ? "Privacy Protected" : "Example Organization",
    creationDate: creationDate.toISOString().split("T")[0],
    expiryDate: expiryDate.toISOString().split("T")[0],
    domainAge: domainAge + " days",
  }
}

// Simulate HTTP security information
function simulateHTTPSecurity(): Record<string, any> {
  return {
    hsts: Math.random() > 0.6,
    contentSecurityPolicy: Math.random() > 0.7,
    xFrameOptions: Math.random() > 0.5,
    xXssProtection: Math.random() > 0.5,
    referrerPolicy: Math.random() > 0.6,
  }
}

// Simulate SSL certificate information
function simulateSSLCertificate(usesHttps: boolean): Record<string, any> {
  if (!usesHttps) {
    return {
      valid: false,
      issuer: "N/A",
      validFrom: "N/A",
      validTo: "N/A",
      daysRemaining: 0,
    }
  }

  const issuers = ["Let's Encrypt Authority X3", "DigiCert SHA2 Secure Server CA", "Cloudflare Inc ECC CA-3", "Amazon"]
  const validFrom = new Date()
  validFrom.setDate(validFrom.getDate() - Math.floor(Math.random() * 90))

  const validTo = new Date(validFrom)
  validTo.setDate(validTo.getDate() + 90 + Math.floor(Math.random() * 275)) // 90-365 days validity

  const now = new Date()
  const daysRemaining = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return {
    valid: true,
    issuer: issuers[Math.floor(Math.random() * issuers.length)],
    validFrom: validFrom.toISOString().split("T")[0],
    validTo: validTo.toISOString().split("T")[0],
    daysRemaining,
  }
}
