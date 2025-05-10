/**
 * Detects crisis-related words in user input that may indicate suicidal ideation
 * or serious mental health crisis
 */
export function detectCrisisWords(input: string): boolean {
  // Convert input to lowercase for case-insensitive matching
  const lowercaseInput = input.toLowerCase();
  
  // Define patterns for crisis detection
  const crisisPatterns = [
    /suicide/i,
    /死にたい/i,
    /kill myself/i,
    /end my life/i,
    /want to die/i,
    /harming myself/i,
    /self-harm/i,
    /hurt myself/i,
    /ending it all/i,
    /不要だ/i,
    /邪魔/i,
    /消えたい/i
  ];
  
  // Check if any pattern matches the input
  return crisisPatterns.some(pattern => pattern.test(lowercaseInput));
}