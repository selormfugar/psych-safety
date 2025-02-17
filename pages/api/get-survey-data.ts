import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { userId } = req.query
    const surveysRef = collection(db, "surveys")
    const q = query(surveysRef, where("userId", "==", userId))
    const querySnapshot = await getDocs(q)

    const surveys = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    res.status(200).json(surveys)
  } catch (error) {
    res.status(500).json({ message: "Error retrieving survey data", error: error.message })
  }
}

