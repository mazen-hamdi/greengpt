import { z } from 'zod';

export const getWeatherSchema = z.object({
  location: z.string().describe('The city and state, e.g. San Francisco, CA'),
});

export type GetWeatherRequest = z.infer<typeof getWeatherSchema>;

export type GetWeatherResponse = {
  temperature: number;
  unit: 'celsius' | 'fahrenheit';
  description: string;
  location: string;
};

export async function getWeather(
  { location }: GetWeatherRequest
): Promise<GetWeatherResponse> {
  try {
    // In a production app, you would use a real weather API here
    // This is a mock implementation for demonstration purposes
    console.log(`Fetching weather for ${location}...`);
    
    // Simulate API call
    return {
      temperature: 22,
      unit: 'celsius',
      description: 'Sunny with occasional clouds',
      location,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error(`Failed to get weather for ${location}`);
  }
}
