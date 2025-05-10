import { useState } from 'react';

// This would normally be in an environment variable
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";

export function useGeminiApi() {
  const [isLoading, setIsLoading] = useState(false);
  
  async function sendMessage(message: string): Promise<string> {
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            contents: [
              {
                parts: [
                  {
                    text: message
                  }
                ]
              }
            ],
            // Add safety settings and other parameters
            safetySettings: [
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_ONLY_HIGH"
              }
            ]
          })
        }
      );
      
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I couldn't process that. Could you try again?";
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "Sorry, I'm having trouble connecting right now. Please try again later.";
    } finally {
      setIsLoading(false);
    }
  }
  
  return { sendMessage, isLoading };
}