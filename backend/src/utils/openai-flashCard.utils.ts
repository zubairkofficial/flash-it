import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: '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', // Replace with your OpenAI API key
});

export async function generateFlashcardSlides(text: string) {
  try {
    // Concise, Standard, Detailed prompts
    const prompt = `
    You are an expert at converting raw educational content into structured flashcards.
    
    Generate flashcard slides in **three levels of detail** based on the input text.
    Every flashcard types same topic on make slides and number of slides generate same means if concise of slides  10 simlarly details also generate 10 slides.
    Every flashcard types of title same come if concise is title Introduction similarly details,concise and standard also same title  
    ---
    
    🔹 Slide Types:
    
    1. **Concise** – Short and simple. Just the essential point, in plain language.
       - Keep text not come come only string "".
      
    2. **Standard** – A complete explanation covering the core concept.
       - One paragraph (50–80 words).
       - Explain the idea clearly, but avoid extra details or examples.
    
    3. **Detailed** – In-depth explanation with examples, background, or real-world applications.
       - 3–4 paragraphs per slide.
       - Add clarity, examples, and reasoning.
    
    ---
    
   🔴 Requirements:

- Each category ( **standard**, **detailed**) must include **at least 10** and **no more than 50** slide **objects**.
- Each object must be in this format:
  { "title": "Slide title", "text": "Slide content" }

--- 
    📄 Input text:
    """${text}"""
    
    ---
    
    🔁 Output **only a valid JSON object** in the following format (no markdown or explanation):
    
    {
      "concise": [
        { "title": "Title 1", "text": "" },
        ...
      ],
      "standard": [
        { "title": "Title 1", "text": "Standard explanation 1" },
        ...
      ],
      "detailed": [
        { "title": "Title 1", "text": "Detailed explanation 1" },
        ...
      ]
    }
    
    DO NOT include any extra commentary, markdown formatting, or headings. Only output the JSON object.
    `;
    

    // Call OpenAI to generate flashcard slides
    // const response = await openai.completions.create({
    //   model: 'gpt-3.5-turbo',
    //   prompt: prompt,
    //   max_tokens: 500,
    // });
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: prompt },
      ],
      max_tokens: 3000,
    });
    console.log("response flashacard------------------", response)

    // return response.choices[0].text;
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating flashcard slides:", error);
    throw new Error('Failed to generate flashcards');
  }
}


export const extractJsonBlock = (jsonText: string): string | null => {
  const match = jsonText.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON block found');

  let json = match[0];

  // Fix common issues

  // 1. Replace broken/missing commas between objects
  json = json.replace(/}\s*{/, '},{'); // handle one case
  json = json.replace(/}\s*{/g, '},{'); // handle multiple

  // 2. Remove duplicate or malformed "text": keys
  json = json.replace(/"text":\s*"[^"]*?"\s*,\s*"text":/g, '"text":');

  // 3. Fix trailing commas before closing arrays or objects
  json = json.replace(/,\s*]/g, ']');
  json = json.replace(/,\s*}/g, '}');

  return json;

};
