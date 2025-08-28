import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Server,
  Shield,
  Globe,
  Lock,
  Database,
  FileText,
  Cpu,
  Wifi,
  ArrowRight,
  Leaf,
  Activity,
  Layers,
} from "lucide-react"
import { ServerLocationMap } from "./server-location-map"

interface TechnicalDetailsProps {
  results: any
}

export function TechnicalDetails({ results }: TechnicalDetailsProps) {
  if (!results) return null

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Server className="h-6 w-6" />
          Technical Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="server" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 bg-slate-900 mb-6">
            <TabsTrigger value="server">Server</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="dns">DNS</TabsTrigger>
            <TabsTrigger value="tls">TLS/SSL</TabsTrigger>
            <TabsTrigger value="misc">Misc</TabsTrigger>
          </TabsList>

          <TabsContent value="server" className="space-y-4">
            <SectionCard title="Server Information" icon={<Cpu className="h-5 w-5" />}>
              <DetailRow label="Web Server" value={results.serverInfo?.webServer || "Unknown"} />
              <DetailRow label="Powered By" value={results.serverInfo?.poweredBy || "Unknown"} />
              <DetailRow label="Server Location" value={results.serverLocation || "Unknown"} />
              <DetailRow label="IP Address" value={results.ipAddress || "Unknown"} />
            </SectionCard>

            <SectionCard title="Server Status" icon={<Activity className="h-5 w-5" />}>
              <DetailRow
                label="Status"
                value={
                  <Badge className={`${results.serverStatus?.status === "Online" ? "bg-green-600" : "bg-red-600"}`}>
                    {results.serverStatus?.status || "Unknown"}
                  </Badge>
                }
              />
              <DetailRow label="Uptime" value={results.serverStatus?.uptime || "Unknown"} />
              <DetailRow label="Response Time" value={results.serverStatus?.responseTime || "Unknown"} />
            </SectionCard>

            <SectionCard title="Open Ports" icon={<Wifi className="h-5 w-5" />}>
              <div className="flex flex-wrap gap-2 mt-2">
                {results.openPorts?.map((port: number) => (
                  <Badge key={port} className="bg-slate-700">
                    {port}
                  </Badge>
                ))}
              </div>
            </SectionCard>

            {/* Add the server location map component */}
            {results.serverStatus?.status === "Online" && (
              <ServerLocationMap serverLocation={results.serverLocation} serverStatus={results.serverStatus.status} />
            )}
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <SectionCard title="HTTP Security" icon={<Shield className="h-5 w-5" />}>
              <DetailRow
                label="HSTS"
                value={
                  <Badge className={`${results.httpSecurity?.hsts ? "bg-green-600" : "bg-red-600"}`}>
                    {results.httpSecurity?.hsts ? "Enabled" : "Disabled"}
                  </Badge>
                }
              />
              <DetailRow
                label="Content Security Policy"
                value={
                  <Badge className={`${results.httpSecurity?.contentSecurityPolicy ? "bg-green-600" : "bg-red-600"}`}>
                    {results.httpSecurity?.contentSecurityPolicy ? "Enabled" : "Disabled"}
                  </Badge>
                }
              />
              <DetailRow
                label="X-Frame-Options"
                value={
                  <Badge className={`${results.httpSecurity?.xFrameOptions ? "bg-green-600" : "bg-red-600"}`}>
                    {results.httpSecurity?.xFrameOptions ? "Enabled" : "Disabled"}
                  </Badge>
                }
              />
              <DetailRow
                label="X-XSS-Protection"
                value={
                  <Badge className={`${results.httpSecurity?.xXssProtection ? "bg-green-600" : "bg-red-600"}`}>
                    {results.httpSecurity?.xXssProtection ? "Enabled" : "Disabled"}
                  </Badge>
                }
              />
              <DetailRow
                label="Referrer Policy"
                value={
                  <Badge className={`${results.httpSecurity?.referrerPolicy ? "bg-green-600" : "bg-red-600"}`}>
                    {results.httpSecurity?.referrerPolicy ? "Enabled" : "Disabled"}
                  </Badge>
                }
              />
            </SectionCard>

            <SectionCard title="Firewall" icon={<Shield className="h-5 w-5" />}>
              <DetailRow
                label="Firewall Detected"
                value={
                  <Badge className={`${results.firewall?.detected ? "bg-green-600" : "bg-yellow-600"}`}>
                    {results.firewall?.detected ? "Yes" : "No"}
                  </Badge>
                }
              />
              <DetailRow label="Firewall Name" value={results.firewall?.name || "N/A"} />
            </SectionCard>
          </TabsContent>

          <TabsContent value="dns" className="space-y-4">
            <SectionCard title="Domain WHOIS" icon={<Database className="h-5 w-5" />}>
              <DetailRow label="Registrar" value={results.whoisInfo?.registrar || "Unknown"} />
              <DetailRow label="Registrant" value={results.whoisInfo?.registrantName || "Unknown"} />
              <DetailRow label="Organization" value={results.whoisInfo?.registrantOrganization || "Unknown"} />
              <DetailRow label="Creation Date" value={results.whoisInfo?.creationDate || "Unknown"} />
              <DetailRow label="Expiry Date" value={results.whoisInfo?.expiryDate || "Unknown"} />
              <DetailRow label="Domain Age" value={results.whoisInfo?.domainAge || "Unknown"} />
            </SectionCard>

            <SectionCard title="DNS Information" icon={<Globe className="h-5 w-5" />}>
              <DetailRow
                label="DNSSEC"
                value={
                  <Badge className={`${results.dnssec === "Enabled" ? "bg-green-600" : "bg-yellow-600"}`}>
                    {results.dnssec || "Unknown"}
                  </Badge>
                }
              />
              <DetailRow
                label="DNS Servers"
                value={
                  <div className="flex flex-col gap-1">
                    {results.dnsServers?.map((server: string, index: number) => (
                      <span key={index}>{server}</span>
                    ))}
                  </div>
                }
              />
            </SectionCard>
          </TabsContent>

          <TabsContent value="tls" className="space-y-4">
            <SectionCard title="SSL Certificate" icon={<Lock className="h-5 w-5" />}>
              <DetailRow
                label="Valid"
                value={
                  <Badge className={`${results.sslCertificateDetails?.valid ? "bg-green-600" : "bg-red-600"}`}>
                    {results.sslCertificateDetails?.valid ? "Yes" : "No"}
                  </Badge>
                }
              />
              <DetailRow label="Issuer" value={results.sslCertificateDetails?.issuer || "N/A"} />
              <DetailRow label="Valid From" value={results.sslCertificateDetails?.validFrom || "N/A"} />
              <DetailRow label="Valid To" value={results.sslCertificateDetails?.validTo || "N/A"} />
              <DetailRow
                label="Days Remaining"
                value={
                  <Badge
                    className={`
                    ${
                      results.sslCertificateDetails?.daysRemaining > 30
                        ? "bg-green-600"
                        : results.sslCertificateDetails?.daysRemaining > 7
                          ? "bg-yellow-600"
                          : "bg-red-600"
                    }
                  `}
                  >
                    {results.sslCertificateDetails?.daysRemaining || "0"}
                  </Badge>
                }
              />
            </SectionCard>

            <SectionCard title="TLS Handshake" icon={<Lock className="h-5 w-5" />}>
              <DetailRow label="Protocol" value={results.tlsHandshake?.protocol || "Unknown"} />
              <DetailRow
                label="Status"
                value={
                  <Badge className={`${results.tlsHandshake?.status === "Successful" ? "bg-green-600" : "bg-red-600"}`}>
                    {results.tlsHandshake?.status || "Unknown"}
                  </Badge>
                }
              />
              <DetailRow label="Time" value={results.tlsHandshake?.time || "Unknown"} />
            </SectionCard>

            <SectionCard title="TLS Cipher Suites" icon={<Layers className="h-5 w-5" />}>
              <div className="flex flex-col gap-1 mt-2">
                {results.tlsCipherSuites?.map((cipher: string, index: number) => (
                  <Badge key={index} className="bg-slate-700 mb-1 inline-block">
                    {cipher}
                  </Badge>
                ))}
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="misc" className="space-y-4">
            <SectionCard title="HTTP Headers" icon={<FileText className="h-5 w-5" />}>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {results.httpHeaders &&
                  Object.entries(results.httpHeaders).map(([key, value]: [string, any]) => (
                    <div key={key} className="bg-slate-900 p-2 rounded-md">
                      <span className="font-semibold">{key}:</span> {value}
                    </div>
                  ))}
              </div>
            </SectionCard>

            <SectionCard title="Redirects" icon={<ArrowRight className="h-5 w-5" />}>
              {results.redirectDetails && results.redirectDetails.length > 0 ? (
                <div className="flex flex-col gap-3 mt-2">
                  {results.redirectDetails.map((redirect: any, index: number) => (
                    <div key={index} className="bg-slate-900 p-2 rounded-md">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{redirect.from}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>{redirect.to}</span>
                      </div>
                      <Badge className="mt-1 bg-slate-700">Status: {redirect.statusCode}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 mt-2">No redirects detected</p>
              )}
            </SectionCard>

            <SectionCard title="Carbon Footprint" icon={<Leaf className="h-5 w-5" />}>
              <DetailRow label="CO2 Per Visit" value={results.carbonFootprint?.co2PerVisit || "Unknown"} />
              <DetailRow label="Cleaner Than" value={results.carbonFootprint?.cleanerThan || "Unknown"} />
              <DetailRow
                label="Rating"
                value={
                  <Badge
                    className={`
                    ${
                      results.carbonFootprint?.rating === "A"
                        ? "bg-green-600"
                        : results.carbonFootprint?.rating === "B"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                    }
                  `}
                  >
                    {results.carbonFootprint?.rating || "Unknown"}
                  </Badge>
                }
              />
            </SectionCard>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function SectionCard({ title, children, icon }: { title: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div className="bg-slate-900 rounded-lg p-4">
      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-slate-700 last:border-0">
      <span className="text-slate-300">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
