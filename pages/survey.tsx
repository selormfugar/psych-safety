import type React from "react"
import { useState } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Layout from "@/components/layout"
import { toast } from "@/components/ui/use-toast"
import { auth } from "@/lib/firebase"
import { withAuth } from "@/components/withAuth"

const questions = [
  { id: "risk", text: "I feel comfortable taking risks on this team." },
  { id: "discussion", text: "It's easy to discuss difficult issues and problems on this team." },
  { id: "value", text: "My unique skills and talents are valued and utilized on this team." },
  { id: "safety", text: "It's safe to take a risk on this team." },
  { id: "support", text: "No one on this team would deliberately act in a way that undermines my efforts." },
]

function Survey() {
  const [responses, setResponses] = useState<Record<string, number>>({})
  const router = useRouter()

  const handleResponse = (questionId: string, value: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const user = auth.currentUser
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit a survey.",
          variant: "destructive",
        })
        return
      }

      const res = await fetch("/api/submit-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, responses }),
      })

      if (!res.ok) throw new Error("Failed to submit survey")

      toast({
        title: "Survey submitted",
        description: "Thank you for your feedback!",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Psychological Safety Survey</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <Label>{question.text}</Label>
            <RadioGroup onValueChange={(value) => handleResponse(question.id, Number(value))}>
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value.toString()} id={`q${question.id}-${value}`} />
                  <Label htmlFor={`q${question.id}-${value}`}>{value}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
        <Button type="submit">Submit Survey</Button>
      </form>
    </Layout>
  )
}

export default withAuth(Survey)

