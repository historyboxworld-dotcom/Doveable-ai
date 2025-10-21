// Temporary simple auth - remove Stack Auth for now
export const stack = {
  signInWithGoogle: async () => {
    // Return a mock user for now
    return { 
      id: 'temp-user-' + Date.now(), 
      email: 'user@example.com',
      name: 'Demo User'
    }
  },
  signOut: async () => {
    return true
  },
  getCurrentUser: async () => {
    return null // No user logged in initially
  }
}
