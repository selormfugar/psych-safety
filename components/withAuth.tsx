import type React from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/hooks/useAuth"

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const { user, loading } = useAuth()
    const router = useRouter()

    if (loading) {
      return <div>Loading...</div>
    }

    if (!user) {
      router.replace("/auth")
      return null
    }

    return <WrappedComponent {...props} />
  }
}

