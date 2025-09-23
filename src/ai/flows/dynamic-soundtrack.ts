'use server';

/**
 * @fileOverview A dynamic soundtrack AI agent.
 *
 * - generateDynamicSoundtrack - A function that generates background music based on the game state.
 * - GenerateDynamicSoundtrackInput - The input type for the generateDynamicSoundtrack function.
 * - GenerateDynamicSoundtrackOutput - The return type for the generateDynamicSoundtrack function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import wav from 'wav';

const GenerateDynamicSoundtrackInputSchema = z.object({
  timeRemaining: z
    .number()
    .describe('The amount of time remaining in the game, in seconds.'),
  level: z.number().describe('The current level of the game.'),
  playerProgress: z
    .number()
    .describe(
      'The player progress through the maze, as a percentage between 0 and 100.'
    ),
});
export type GenerateDynamicSoundtrackInput =
  z.infer<typeof GenerateDynamicSoundtrackInputSchema>;

const GenerateDynamicSoundtrackOutputSchema = z.object({
  musicDataUri: z
    .string()
    .describe('The generated background music as a data URI (WAV format).'),
});
export type GenerateDynamicSoundtrackOutput =
  z.infer<typeof GenerateDynamicSoundtrackOutputSchema>;

export async function generateDynamicSoundtrack(
  input: GenerateDynamicSoundtrackInput
): Promise<GenerateDynamicSoundtrackOutput> {
  return generateDynamicSoundtrackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDynamicSoundtrackPrompt',
  input: {schema: GenerateDynamicSoundtrackInputSchema},
  output: {schema: GenerateDynamicSoundtrackOutputSchema},
  prompt: `You are a music composer creating background music for a maze runner game.
The music should adapt to the game state to create an engaging and tense experience.

Consider the following factors:
- Time Remaining: {{{timeRemaining}}} seconds.  Less time remaining should increase the urgency and tempo of the music.
- Level: {{{level}}}. Higher levels should have more complex and intense music.
- Player Progress: {{{playerProgress}}}%.  More progress should lead to more triumphant and uplifting music, but still maintain a sense of urgency.

Create a short musical piece (around 5-10 seconds) that reflects these conditions.
The music should be simple, using basic chords and melodies.
Incorporate elements to indicate low time, such as a faster tempo or more dissonant chords.

Output the music as a text description, specifying tempo, key, instrumentation (e.g., synth, piano, drums), and chord progression.
For example: "Tempo: 120 bpm, Key: C minor, Instrumentation: Synth lead and bass, Chord Progression: Cm - Ab - Eb - Bb.  Include a fast, repetitive synth arpeggio to indicate low time."
DO NOT include notation or musical code.  Only describe the music.`,
});

const generateDynamicSoundtrackFlow = ai.defineFlow(
  {
    name: 'generateDynamicSoundtrackFlow',
    inputSchema: GenerateDynamicSoundtrackInputSchema,
    outputSchema: GenerateDynamicSoundtrackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);

    // Placeholder for music generation logic.
    // In a real implementation, this would use the text description from the prompt
    // to generate actual audio data (e.g., using Tone.js or similar).
    // For now, return a placeholder WAV data URI.
    const placeholderWavDataUri = 'data:audio/wav;base64,UklGRiwAAABXQVZFZm10IBAAAAABAAEARKwAAIhUAAABAAgAZGF0YRAAAACAgAAAAAgAAAAIA==';

    return {musicDataUri: placeholderWavDataUri};
  }
);
