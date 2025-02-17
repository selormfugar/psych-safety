type SurveyResponses = Record<string, number>

export function calculatePsychologicalSafetyScore(responses: SurveyResponses): number {
  const weights = {
    risk: 0.25,
    discussion: 0.25,
    value: 0.2,
    safety: 0.2,
    support: 0.1,
  }

  let weightedSum = 0
  let totalWeight = 0

  for (const [question, response] of Object.entries(responses)) {
    const weight = weights[question]
    weightedSum += response * weight
    totalWeight += weight
  }

  return (weightedSum / totalWeight) * 20 // Scale to 0-100
}

export function assessRisk(score: number): string {
  if (score >= 80) return "Low"
  if (score >= 60) return "Moderate"
  return "High"
}

export function predictImprovementLikelihood(score: number, previousScores: number[]): number {
  const averagePreviousScore = previousScores.reduce((a, b) => a + b, 0) / previousScores.length
  const trend = score - averagePreviousScore

  let likelihood = 0.5 // Base likelihood

  if (trend > 5) likelihood += 0.2
  else if (trend < -5) likelihood -= 0.2

  if (score < 50)
    likelihood += 0.1 // More room for improvement
  else if (score > 80) likelihood -= 0.1 // Less room for improvement

  return Math.max(0, Math.min(1, likelihood)) // Ensure likelihood is between 0 and 1
}

