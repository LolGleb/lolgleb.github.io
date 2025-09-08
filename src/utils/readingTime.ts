export function calculateReadingTime(text: string): number {
  // Average reading speed: 200-250 words per minute
  // We'll use 225 as a middle ground
  const wordsPerMinute = 225;
  
  // Remove HTML tags and extra whitespace
  const cleanText = text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .trim();
  
  // Count words (split by whitespace and filter out empty strings)
  const wordCount = cleanText.split(' ').filter(word => word.length > 0).length;
  
  // Calculate reading time in minutes
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  
  // Minimum reading time is 1 minute
  return Math.max(1, readingTimeMinutes);
}

export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return '1 min read';
  }
  return `${minutes} min read`;
}

export function getReadingTimeColor(minutes: number): string {
  if (minutes <= 2) return 'text-green-600';
  if (minutes <= 5) return 'text-blue-600';
  if (minutes <= 10) return 'text-yellow-600';
  return 'text-red-600';
}