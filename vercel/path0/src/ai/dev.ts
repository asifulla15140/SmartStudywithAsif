import { config } from 'dotenv';
config();

import '@/ai/flows/generate-lesson-content.ts';
import '@/ai/flows/generate-slides.ts';
import '@/ai/flows/generate-question-paper-flow.ts';
