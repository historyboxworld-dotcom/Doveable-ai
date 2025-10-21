import axios from 'axios'

const OPENROUTER_API_KEY = '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'

export async function generateAIResponse(prompt) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )
    
    return response.data.choices[0]?.message?.content || 'No response generated'
  } catch (error) {
    console.error('OpenRouter API error:', error)
    return 'Sorry, I encountered an error. Please try again.'
  }
}
