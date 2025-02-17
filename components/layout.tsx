import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { toast } from "@/components/ui/use-toast"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            PsychSafe
          </Link>
          <div className="space-x-4">
            {!loading &&
              (user ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/survey">Survey</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="outline" onClick={handleSignOut}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="outline" asChild>
                  <Link href="/auth">Login</Link>
                </Button>
              ))}
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <footer className="bg-muted p-4 text-center">
        <p>&copy; 2025 PsychSafe. All rights reserved.</p>
      </footer>
    </div>
  )
}

