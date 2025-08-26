'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { google } from '@genkit-ai/googleai';

export const searchWeb = ai.defineTool(
  {
    name: 'searchWeb',
    description: 'Searches the web for the given query and returns a list of search results.',
    inputSchema: z.object({
      query: z.string(),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    console.log(`Searching web for ${input.query}...`);
    
    const searchResult = await google.search({
      q: input.query,
    });
    
    return JSON.stringify(searchResult);
  }
);
