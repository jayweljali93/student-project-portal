// src/hooks/useAuth.js
import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export const useAuth = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  return { user }
}
