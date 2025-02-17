"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, query, getDocs, updateDoc, doc } from "firebase/firestore"
import Layout from "@/components/layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users")
        const q = query(usersRef)
        const querySnapshot = await getDocs(q)
        const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setUsers(usersData)
      } catch (error) {
        console.error("Error fetching users:", error)
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const toggleAdminStatus = async (userId: string, isAdmin: boolean) => {
    try {
      await updateDoc(doc(db, "users", userId), { isAdmin: !isAdmin })
      setUsers(users.map((user) => (user.id === userId ? { ...user, isAdmin: !isAdmin } : user)))
      toast({
        title: "Success",
        description: `User admin status updated`,
      })
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Admin Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.isAdmin ? "Admin" : "User"}</TableCell>
              <TableCell>
                <Button onClick={() => toggleAdminStatus(user.id, user.isAdmin)}>
                  {user.isAdmin ? "Remove Admin" : "Make Admin"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  )
}

