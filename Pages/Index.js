import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { generateAIResponse } from '../lib/openrouter'
import { stack } from '../lib/stackAuth'

export default function DoveableAI() {
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [prompt, setPrompt] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [loading, setLoading] = useState(false)

  // Generate AI response (main functionality)
  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setLoading(true)
    setAiResponse('')
    
    try {
      const response = await generateAIResponse(prompt)
      setAiResponse(response)
      
      // Save to Supabase if user is logged in
      if (user) {
        const { error } = await supabase.from('projects').insert({
          user_id: user.id,
          prompt: prompt,
          response: response,
          created_at: new Date().toISOString()
        })
        
        if (!error) {
          // Refresh projects list
          const { data } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
          
          setProjects(data || [])
        }
      }
    } catch (error) {
      console.error('Generation error:', error)
      setAiResponse('Failed to generate response. Please try again.')
    }
    setLoading(false)
  }

  // Simple login (demo mode)
  const handleLogin = async () => {
    try {
      const user = await stack.signInWithGoogle()
      setUser(user)
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  // Simple logout
  const handleLogout = async () => {
    await stack.signOut()
    setUser(null)
    setProjects([])
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 Doveable AI</h1>
      
      {/* Simple Auth Section */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        {!user ? (
          <div>
            <p>Click below to start demo session</p>
            <button 
              onClick={handleLogin} 
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#4285f4', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Start Demo Session
            </button>
          </div>
        ) : (
          <div>
            <p>Welcome, {user.email}! (Demo Mode)</p>
            <button 
              onClick={handleLogout} 
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#ff4444', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* AI Generator */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>💬 Ask Doveable AI</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What would you like to create today? Example: 'Create a landing page for a eco-friendly product'"
          style={{ 
            width: '100%', 
            height: '100px', 
            padding: '10px', 
            border: '1px solid #ccc', 
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        <button 
          onClick={handleGenerate} 
          disabled={loading || !prompt.trim()}
          style={{ 
            padding: '10px 20px', 
            marginTop: '10px', 
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
        
        {aiResponse && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '4px', border: '1px solid #eee' }}>
            <h3>🤖 AI Response:</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{aiResponse}</p>
          </div>
        )}
      </div>

      {/* User Projects */}
      {user && projects.length > 0 && (
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>📁 Your Projects ({projects.length})</h2>
          {projects.map((project, index) => (
            <div key={project.id || index} style={{ 
              marginBottom: '15px', 
              padding: '10px', 
              border: '1px solid #eee', 
              borderRadius: '4px' 
            }}>
              <p><strong>Prompt:</strong> {project.prompt}</p>
              <p><strong>Response:</strong> {project.response.substring(0, 100)}...</p>
              <small>{new Date(project.created_at).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
