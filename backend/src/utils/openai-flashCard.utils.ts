// import { OpenAI } from 'openai';
// import { SUBSCRIPTION_TYPE } from './subscription.enum';

// const openai = new OpenAI({
//   apiKey: process.env.OPEN_API_KEY,
// });

// export async function generateFlashcardSlides(text: string, language: string,planType:SUBSCRIPTION_TYPE) {
//   try {
//     const prompt = `
//     You are an expert educational content designer specializing in creating structured flashcards from various types of content.

//     # TASK
//     Generate flashcard slides in three distinct levels of detail (Concise, Standard, Detailed) based on the input text.
    
//     # REQUIREMENTS
//     1. All three types must cover the same topics with identical titles
//     2. Each category must contain exactly the same number of slides (10-50)
//     3. No duplicate slides within the same category
//     4. Content must be in ${language}
//     5. Structure must follow this exact JSON format:
    
//     {
//       "concise": [
//         { "title": "Identical Title 1", "text": "Very brief text (5-15 words)" },
//         { "title": "Identical Title 2", "text": "Very brief text (5-15 words)" }
//       ],
//       "standard": [
//         { "title": "Identical Title 1", "text": "Clear explanation (70-90 words)" },
//         { "title": "Identical Title 2", "text": "Clear explanation (70-90 words)" }
//       ],
//       "detailed": [
//         { "title": "Identical Title 1", "text": "Comprehensive explanation with examples (200-500 words)" },
//         { "title": "Identical Title 2", "text": "Comprehensive explanation with examples (200-500 words)" }
//       ]
//     }

//     # CONTENT GUIDELINES
//     - CONCISE: Very brief, just the essential point in plain language
//     - STANDARD: Complete explanation covering the core concept (1 paragraph)
//     - DETAILED: In-depth explanation with examples, background, or real-world applications (3-4 paragraphs)
    
//     # ADDITIONAL CONSIDERATIONS
//     - Ensure content is suitable for team sharing (as per Team Plan requirements)
//     - Structure content to be easily editable by users
//     - Make content export-friendly for PDF, PPT, and JSON formats
//     - Create titles that would work well for search/filter functionality in History Log
    
//     # INPUT TEXT:
//     """${text}"""
    
//     # OUTPUT:
//     Return ONLY a valid JSON object in the specified format with no additional commentary.
//     `;

//     const response = await openai.chat.completions.create({
//       model: planType===SUBSCRIPTION_TYPE.FREE?'gpt-3.5-turbo':'gpt-4o', // Consider upgrading to GPT-4 for better content structuring
//       messages: [
//         { 
//           role: 'system', 
//           content: 'You are a helpful assistant that creates educational flashcards. Always respond with valid JSON only.' 
//         },
//         { role: 'user', content: prompt },
//       ],
//       // max_tokens: 4000, // Increased for detailed content
//       temperature: 0.7, // Balance between creativity and consistency
//     });

//     console.log("Flashcard generation response:", response);

//     // Validate and parse the response
//     const content = response.choices[0].message.content;
//     const parsedResponse = JSON.parse(content);
    
//     // Additional validation to ensure same number of slides
//     const conciseCount = parsedResponse.concise.length;
//     const standardCount = parsedResponse.standard.length;
//     const detailedCount = parsedResponse.detailed.length;
    
//     if (conciseCount !== standardCount || standardCount !== detailedCount) {
//       throw new Error('Flashcard categories have different numbers of slides');
//     }
    
//     // if (conciseCount < 10 || conciseCount > 50) {
//     //   throw new Error(`Invalid number of slides: ${conciseCount}. Must be between 10 and 50.`);
//     // }
    
//     return parsedResponse;
//   } catch (error) {
//     console.error("Error generating flashcard slides:", error);
//     throw new Error('Failed to generate flashcards: ' + error.message);
//   }
// }

// export const extractJsonBlock = (jsonText: any): string | null => {
//   // If it's already an object, stringify it
//   if (typeof jsonText !== 'string' && typeof jsonText === 'object') {
//     return JSON.stringify(jsonText);
//   }
  
//   // If it's not a string, try to convert it
//   if (typeof jsonText !== 'string') {
//     try {
//       jsonText = String(jsonText);
//     } catch (e) {
//       console.error('Cannot convert jsonText to string:', e);
//       return null;
//     }
//   }

//   try {
//     const match = jsonText.match(/\{[\s\S]*\}/);
//     if (!match) throw new Error('No JSON block found');

//     let json = match[0];

//     // Fix common issues
//     // 1. Replace broken/missing commas between objects
//     json = json.replace(/}\s*{/, '},{');
//     json = json.replace(/}\s*{/g, '},{');

//     // 2. Remove duplicate or malformed "text": keys
//     json = json.replace(/"text":\s*"[^"]*?"\s*,\s*"text":/g, '"text":');

//     // 3. Fix trailing commas before closing arrays or objects
//     json = json.replace(/,\s*]/g, ']');
//     json = json.replace(/,\s*}/g, '}');

//     return json;
//   } catch (error) {
//     console.error('Error extracting JSON block:', error);
//     return null;
//   }
// };


import { OpenAI } from 'openai';
import { SUBSCRIPTION_TYPE } from './subscription.enum';

const openai = new OpenAI({
  apiKey: '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',
});

export async function generateFlashcardSlides(text: string, language: string,planType:SUBSCRIPTION_TYPE) {
  try {
    const prompt = `
    You are an expert educational content designer specializing in creating structured flashcards from various types of content.

    # TASK
    Generate flashcard slides in three distinct levels of detail (Concise, Standard, Detailed) based on the input text.

    # REQUIREMENTS
   1. All three types must cover the same topics with identical titles
    2. Each category must contain exactly the same number of slides (10-50)
    3. No duplicate slides within the same category
    4. Content must be in ${language}
    5. Structure must follow this exact JSON format:
    
    {
      "concise": [
        { "title": "Title 1", "text": "Very brief text (5-15 words)" },
        { "title": "Title 2", "text": "Very brief text (5-15 words)" }
    
      ],
      "standard": [
        { "title": "Title 1", "text": "Clear explanation (50-80 words)" },
        { "title": "Title 2", "text": "Clear explanation (50-80 words)" }
      ],
      "detailed": [
        { "title": "Title 1", "text": "Comprehensive explanation with examples (100-200 words)" },
        { "title": "Title 2", "text": "Comprehensive explanation with examples (100-200 words)" }
      ]
    }

    # CONTENT GUIDELINES
   - CONCISE: Very brief, just the essential point (to the point) in plain language
   - STANDARD: Complete explanation covering the core concept (1 paragraph)
   - DETAILED: In-depth explanation with examples, background, or real-world applications (3-4 paragraphs)

    # LANGUAGE REQUIREMENT
    - All titles and content must be in ${language}
    - Do not include any text in other languages
    
    # ADDITIONAL CONSIDERATIONS
    - Ensure content is suitable for team sharing
    - Structure content to be easily editable by users
    - Make content export-friendly for PDF, PPT, and JSON formats
    - Create titles that would work well for search/filter functionality
    
    # INPUT TEXT:
    """${text}"""
    
    # OUTPUT:
    Return ONLY a valid JSON object in the specified format with no additional commentary.
    `;

    const response = await openai.chat.completions.create({
      model: planType===SUBSCRIPTION_TYPE.FREE?'gpt-4o':'gpt-4o', // Consider upgrading to GPT-4 for better content structuring
      messages: [
        { 
          role: 'system', 
         content: 'You are a helpful assistant that creates educational flashcards. Always respond with valid JSON only.' 
        },
        { role: 'user', content: prompt },
      ],
      // max_tokens: 4000,
      temperature: 0.7,
    });

    console.log("Flashcard generation response:", response);

    // Validate and parse the response
    let content = response.choices[0].message.content?.trim() ?? '';

    // Remove code block formatting if present
    if (content.startsWith('```')) {
      content = content.replace(/^```(?:json)?\s*/, '').replace(/```$/, '');
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(content);
    } catch (parseErr) {
      console.error("JSON parsing failed. Raw response:", content);
      throw new Error('Failed to parse JSON from OpenAI response.');
    }
    
    // Additional validation to ensure same number of slides
    const conciseCount = parsedResponse.concise.length;
    const standardCount = parsedResponse.standard.length;
    const detailedCount = parsedResponse.detailed.length;
    
    if (conciseCount !== standardCount || standardCount !== detailedCount) {
      console.warn('Flashcard categories have different numbers of slides');
    }
    
    // Validate that concise slides have empty text
    // for (const slide of parsedResponse.concise) {
    //   if (slide.text !== "") {
    //     console.warn(`Concise slide "${slide.title}" has non-empty text: "${slide.text}"`);
    //     // Force empty text for concise slides
    //     slide.text = "";
    //   }
    // }
    
    return parsedResponse;
  } catch (error) {
    console.error("Error generating flashcard slides:", error);
    throw new Error('Failed to generate flashcards: ' + error.message);
  }
}

export const extractJsonBlock = (jsonText: any): string | null => {
  // If it's already an object, stringify it
  if (typeof jsonText !== 'string' && typeof jsonText === 'object') {
    return JSON.stringify(jsonText);
  }
  
  // If it's not a string, try to convert it
  if (typeof jsonText !== 'string') {
    try {
      jsonText = String(jsonText);
    } catch (e) {
      console.error('Cannot convert jsonText to string:', e);
      return null;
    }
  }

  try {
    const match = jsonText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON block found');

    let json = match[0];

    // Fix common issues
    // 1. Replace broken/missing commas between objects
    json = json.replace(/}\s*{/, '},{');
    json = json.replace(/}\s*{/g, '},{');

    // 2. Remove duplicate or malformed "text": keys
    json = json.replace(/"text":\s*"[^"]*?"\s*,\s*"text":/g, '"text":');

    // 3. Fix trailing commas before closing arrays or objects
    json = json.replace(/,\s*]/g, ']');
    json = json.replace(/,\s*}/g, '}');

    return json;
  } catch (error) {
    console.error('Error extracting JSON block:', error);
    return null;
  }
};