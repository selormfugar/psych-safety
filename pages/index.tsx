import Link from "next/link"
import { Button } from "@/components/ui/button"
import Layout from "@/components/layout"
import { useAuth } from "@/hooks/useAuth"

export default function Home() {
  const { user, loading } = useAuth()

  return (
    <Layout>
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to PsychSafe</h1>
        <p className="mb-8">Measure, analyze, and improve psychological safety in your organization.</p>
        {!loading && (
          <div className="space-x-4">
            {user ? (
              <>
                <Button asChild>
                  <Link href="/survey">Take Survey</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/auth">Get Started</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

