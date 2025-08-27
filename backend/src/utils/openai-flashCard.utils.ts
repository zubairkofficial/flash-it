import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: 'your-openai-api-key', // Replace with your OpenAI API key
});

export async function generateFlashcardSlides(text: string) {
  try {
    // Concise, Standard, Detailed prompts
    const prompt = `
      Generate flashcard slides based on the text provided. The slides should be categorized into three types:
      
      1. Concise: Short, to-the-point, and simple.
      2. Standard: A detailed version of the flashcard, including key information.
      3. Detailed: A full explanation with more context, examples, and details.

      Here is the input text:
      "${text}"

      Output the slides in the following format:
      {
        "concise": [
          { "title": "Slide title", "text": "Slide text" },
          ...
        ],
        "standard": [
          { "title": "Slide title", "text": "Slide text" },
          ...
        ],
        "detailed": [
          { "title": "Slide title", "text": "Slide text" },
          ...
        ]
      }
    `;

    // Call OpenAI to generate flashcard slides
    const response = await openai.completions.create({
      model: 'gpt-4',
      prompt: prompt,
      max_tokens: 500,
    });

    return response.choices[0].text;
  } catch (error) {
    console.error("Error generating flashcard slides:", error);
    throw new Error('Failed to generate flashcards');
  }
}
