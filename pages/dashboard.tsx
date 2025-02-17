"use client"

import { useEffect, useState } from "react"
import Layout from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculatePsychologicalSafetyScore, assessRisk, predictImprovementLikelihood } from "@/lib/bayesianModel"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { withAuth } from "@/components/withAuth"
import { useAuth } from "@/hooks/useAuth"

function Dashboard() {
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchSurveys = async () => {
      if (!user) return

      try {
        const res = await fetch(`/api/get-survey-data?userId=${user.uid}`)
        if (!res.ok) throw new Error("Failed to fetch survey data")
        const data = await res.json()
        setSurveys(data)
      } catch (error) {
        console.error("Error fetching survey data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSurveys()
  }, [user])

  if (loading) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    )
  }

  const latestSurvey = surveys[surveys.length - 1]
  const psychSafetyScore = latestSurvey ? calculatePsychologicalSafetyScore(latestSurvey.responses) : 0
  const riskLevel = assessRisk(psychSafetyScore)
  const improvementLikelihood = predictImprovementLikelihood(
    psychSafetyScore,
    surveys.slice(0, -1).map((s) => calculatePsychologicalSafetyScore(s.responses)),
  )

  const chartData = surveys.map((survey, index) => ({
    name: `Survey ${index + 1}`,
    score: calculatePsychologicalSafetyScore(survey.responses),
  }))

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Team Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Psychological Safety Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{psychSafetyScore.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{riskLevel}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Improvement Likelihood</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{(improvementLikelihood * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Psychological Safety Score Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Layout>
  )
}

export default withAuth(Dashboard)

