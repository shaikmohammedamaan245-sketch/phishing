"use client"

import { useState } from "react"
import { analyzeUrl } from "@/lib/analyze-url"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Shield, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TechnicalDetails } from "@/components/technical-details"

export function UrlAnalyzer() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    if (!url) {
      setError("Please enter a URL to analyze")
      return
    }

    try {
      setIsAnalyzing(true)
      setError("")

      // Add http:// if no protocol is specified
      let urlToAnalyze = url
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        urlToAnalyze = "https://" + url
      }

      const analysisResults = await analyzeUrl(urlToAnalyze)
      setResults(analysisResults)
    } catch (err) {
      setError("Failed to analyze URL. Please try again.")
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Calculate risk percentage based on phishing indicators
  const calculateRiskPercentage = () => {
    if (!results) return 0

    let riskScore = 0
    let totalFactors = 0

    // Add weight to each risk factor
    if (results.hasInvalidCharacters) {
      riskScore += 15
      totalFactors += 15
    }
    if (results.hasSuspiciousCharacters) {
      riskScore += 15
      totalFactors += 15
    }
    if (results.hasTooManySubdomains) {
      riskScore += 10
      totalFactors += 10
    }
    if (results.hasIpAddressInUrl) {
      riskScore += 20
      totalFactors += 20
    }
    if (!results.usesHttps) {
      riskScore += 15
      totalFactors += 15
    }
    if (results.isNewlyCreatedDomain) {
      riskScore += 15
      totalFactors += 15
    }
    if (results.isFreeHostingPlatform) {
      riskScore += 10
      totalFactors += 10
    }

    // Calculate percentage
    return totalFactors > 0 ? Math.min(100, Math.round((riskScore / totalFactors) * 100)) : 0
  }

  const riskPercentage = results ? calculateRiskPercentage() : 0

  const getRiskLevel = () => {
    if (riskPercentage >= 70) return { level: "High", color: "text-red-500", bg: "bg-red-500" }
    if (riskPercentage >= 40) return { level: "Medium", color: "text-yellow-500", bg: "bg-yellow-500" }
    return { level: "Low", color: "text-green-500", bg: "bg-green-500" }
  }

  const riskLevel = getRiskLevel()

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="bg-slate-800 border-slate-700 shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">URL Analyzer</CardTitle>
          <CardDescription className="text-slate-400">
            Enter a website URL to check if it's a potential phishing attempt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              type="text"
              placeholder="Enter URL (e.g., example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-slate-900 border-slate-700 text-white"
            />
            <Button onClick={handleAnalyze} disabled={isAnalyzing} className="bg-teal-600 hover:bg-teal-700">
              {isAnalyzing ? "Analyzing..." : "Analyze URL"}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4 bg-red-900/50 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">
                    Risk Level: <span className={riskLevel.color}>{riskLevel.level}</span>
                  </h3>
                  <span className="text-lg font-bold">{riskPercentage}%</span>
                </div>
                <Progress value={riskPercentage} className="h-3" indicatorClassName={riskLevel.bg} />
              </div>

              <div className="mb-6">
                <Alert
                  className={`${results.phishingVerdict.includes("No phishing") ? "bg-green-900/30 border-green-800" : "bg-red-900/30 border-red-800"}`}
                >
                  {results.phishingVerdict.includes("No phishing") ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <AlertTitle>Verdict</AlertTitle>
                  <AlertDescription>{results.phishingVerdict}</AlertDescription>
                </Alert>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem
                  title="Invalid Characters"
                  value={results.hasInvalidCharacters ? "Detected" : "None"}
                  status={!results.hasInvalidCharacters}
                />
                <DetailItem
                  title="Suspicious Characters"
                  value={results.hasSuspiciousCharacters ? "Detected" : "None"}
                  status={!results.hasSuspiciousCharacters}
                />
                <DetailItem
                  title="Subdomains"
                  value={`${results.numberOfSubdomains} (${results.hasTooManySubdomains ? "Too many" : "Normal"})`}
                  status={!results.hasTooManySubdomains}
                />
                <DetailItem
                  title="IP Address in URL"
                  value={results.hasIpAddressInUrl ? "Yes" : "No"}
                  status={!results.hasIpAddressInUrl}
                />
                <DetailItem title="HTTPS" value={results.usesHttps ? "Yes" : "No"} status={results.usesHttps} />
                <DetailItem
                  title="Domain Age"
                  value={`${results.domainAgeDays} days`}
                  status={!results.isNewlyCreatedDomain}
                />
                <DetailItem
                  title="Free Hosting"
                  value={results.isFreeHostingPlatform ? "Yes" : "No"}
                  status={!results.isFreeHostingPlatform}
                />
                <DetailItem title="Server Location" value={results.serverLocation} status={true} />
              </div>
            </CardContent>
          </Card>

          <TechnicalDetails results={results} />
        </div>
      )}
    </div>
  )
}

function DetailItem({ title, value, status }: { title: string; value: string; status: boolean }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-md bg-slate-900">
      <span className="font-medium">{title}</span>
      <span className="flex items-center gap-2">
        {value}
        {status ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
      </span>
    </div>
  )
}
