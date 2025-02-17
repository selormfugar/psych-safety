import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { userId, responses } = req.body
    const surveyRef = await addDoc(collection(db, "surveys"), {
      userId,
      responses,
      createdAt: serverTimestamp(),
    })

    res.status(200).json({ message: "Survey submitted successfully", id: surveyRef.id })
  } catch (error) {
    res.status(500).json({ message: "Error submitting survey", error: error.message })
  }
}

