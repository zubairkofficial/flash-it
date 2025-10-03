import { OpenAI } from 'openai';
import { SUBSCRIPTION_TYPE } from './subscription.enum';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateFlashcardSlides(
  text: string,
  language: string,
  planType: SUBSCRIPTION_TYPE,
) {
  try {
    const model =
      planType === SUBSCRIPTION_TYPE.FREE ? 'gpt-3.5-turbo' : 'gpt-4o';
    const maxTokens = MODEL_TOKEN_LIMITS[model] ?? 16000;

    // 1. Get headings
    const headingsPrompt = `Extract a list of unique, meaningful flashcard headings from the following text.
Each heading should represent a key topic, concept, or section found in the content.
Do NOT use generic words like "STANDARD", "CONCISE", "DETAILED", or any formatting-related terms.
Return a JSON array of strings, each string is a heading that describes a topic or concept from the text. Only return valid JSON.

Text:
"""
${text}
"""
Output example:
["Photosynthesis", "Cell Structure", "Genetic Inheritance"]`;

    const headingsResponse = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Only return valid JSON.',
        },
        { role: 'user', content: headingsPrompt },
      ],
      temperature: 0.7,
    });
    let headingsContent =
      headingsResponse.choices[0].message.content?.trim() ?? '';
    if (headingsContent.startsWith('```')) {
      headingsContent = headingsContent
        .replace(/^```(?:json)?\s*/, '')
        .replace(/```$/, '');
    }
    let headings;
    try {
      headings = JSON.parse(headingsContent);
    } catch (err) {
      throw new Error('Failed to parse headings JSON: ' + headingsContent);
    }

    console.log('Extracted headings:', headings);

    // 2-4. Generate concise, standard, and detailed flashcards in parallel
    const concisePrompt = `For each heading below, generate a concise flashcard (5-15 words). Return an array of objects: [{ "title": heading, "text": conciseText }].
    Headings: ${JSON.stringify(headings)}
    Text:
    """
    ${text}
    """
    Output example:
    [ { "title": "Heading 1", "text": "Very brief text (5-15 words)" }, ... ]`;

    const standardPrompt = `For each heading below, generate a standard flashcard (20-30 words). Return an array of objects: [{ "title": heading, "text": standardText }].
    Headings: ${JSON.stringify(headings)}
    Text:
    """
    ${text}
    """
    Output example:
    [ { "title": "Heading 1", "text": "Clear explanation (20-30 words)" }, ... ]`;

    const detailedPrompt = `For each heading below, generate a detailed flashcard (50-100 words, with examples, background, or real-world applications). Return an array of objects: [{ "title": heading, "text": detailedText }].
    Headings: ${JSON.stringify(headings)}
    Text:
    """
    ${text}
    """
    Output example:
    [ { "title": "Heading 1", "text": "Comprehensive explanation with examples (50-100 words)" }, ... ]`;

    const [conciseResponse, standardResponse, detailedResponse] =
      await Promise.all([
        openai.chat.completions.create({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant. Only return valid JSON.',
            },
            { role: 'user', content: concisePrompt },
          ],
          temperature: 0.7,
        }),
        openai.chat.completions.create({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant. Only return valid JSON.',
            },
            { role: 'user', content: standardPrompt },
          ],
          temperature: 0.7,
        }),
        openai.chat.completions.create({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant. Only return valid JSON.',
            },
            { role: 'user', content: detailedPrompt },
          ],
          temperature: 0.7,
        }),
      ]);

    console.log(
      'Concise response:',
      conciseResponse.choices[0].message.content,
    );
    console.log(
      'Standard response:',
      standardResponse.choices[0].message.content,
    );
    console.log(
      'Detailed response:',
      detailedResponse.choices[0].message.content,
    );

    // Parse concise
    let conciseContent =
      conciseResponse.choices[0].message.content?.trim() ?? '';
    if (conciseContent.startsWith('```')) {
      conciseContent = conciseContent
        .replace(/^```(?:json)?\s*/, '')
        .replace(/```$/, '');
    }
    let concise;
    try {
      concise = JSON.parse(conciseContent);
    } catch (err) {
      throw new Error('Failed to parse concise JSON: ' + conciseContent);
    }

    // Parse standard
    let standardContent =
      standardResponse.choices[0].message.content?.trim() ?? '';
    if (standardContent.startsWith('```')) {
      standardContent = standardContent
        .replace(/^```(?:json)?\s*/, '')
        .replace(/```$/, '');
    }
    let standard;
    try {
      standard = JSON.parse(standardContent);
    } catch (err) {
      throw new Error('Failed to parse standard JSON: ' + standardContent);
    }

    // Parse detailed
    let detailedContent =
      detailedResponse.choices[0].message.content?.trim() ?? '';
    if (detailedContent.startsWith('```')) {
      detailedContent = detailedContent
        .replace(/^```(?:json)?\s*/, '')
        .replace(/```$/, '');
    }
    let detailed;
    try {
      detailed = JSON.parse(detailedContent);
    } catch (err) {
      throw new Error('Failed to parse detailed JSON: ' + detailedContent);
    }

    // Ensure all arrays are in the same order as headings
    function orderByHeadings(arr) {
      if (!Array.isArray(arr)) return [];
      return headings.map(h => arr.find(slide => slide.title === h) || { title: h, text: '' });
    }

    return {
      concise: orderByHeadings(concise),
      standard: orderByHeadings(standard),
      detailed: orderByHeadings(detailed),
    };
  } catch (error) {
    console.error('Error generating flashcard slides:', error);
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

const MODEL_TOKEN_LIMITS: Record<string, number> = {
  'gpt-3.5-turbo': 16_000,
  'gpt-4o': 128_000,
};

function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters in English
  return Math.ceil(text.length / 4);
}
