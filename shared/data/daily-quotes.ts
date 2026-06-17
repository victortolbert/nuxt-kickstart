export interface DailyQuote {
  text: string
  author?: string
}

const quotes: DailyQuote[] = [
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Action is the foundational key to all success.', author: 'Pablo Picasso' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt' },
  { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
  { text: 'Quality is not an act, it is a habit.', author: 'Aristotle' },
  { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
  { text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
  { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
  { text: 'Everything you\'ve ever wanted is on the other side of fear.', author: 'George Addair' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
  { text: 'The hard days are what make you stronger.', author: 'Aly Raisman' },
  { text: 'If you are not willing to risk the usual, you will have to settle for the ordinary.', author: 'Jim Rohn' },
  { text: 'Take up one idea. Make that one idea your life. Think of it, dream of it, live on that idea.', author: 'Swami Vivekananda' },
  { text: 'All our dreams can come true if we have the courage to pursue them.', author: 'Walt Disney' },
  { text: 'Good things come to people who wait, but better things come to those who go out and get them.' },
  { text: 'If you do what you always did, you will get what you always got.', author: 'Anonymous' },
  { text: 'Success is walking from failure to failure with no loss of enthusiasm.', author: 'Winston Churchill' },
  { text: 'Just when the caterpillar thought the world was ending, he turned into a butterfly.' },
  { text: 'Successful entrepreneurs are givers and not takers of positive energy.', author: 'Anonymous' },
  { text: 'Whenever you see a successful person, you only see the public glories, never the private sacrifices to reach them.', author: 'Vaibhav Shah' },
  { text: 'Opportunities don\'t happen, you create them.', author: 'Chris Grosser' },
  { text: 'Try not to become a person of success, but rather try to become a person of value.', author: 'Albert Einstein' },
  { text: 'Great minds discuss ideas; average minds discuss events; small minds discuss people.', author: 'Eleanor Roosevelt' },
  { text: 'I have not failed. I\'ve just found 10,000 ways that won\'t work.', author: 'Thomas Edison' },
  { text: 'A successful man is one who can lay a firm foundation with the bricks others have thrown at him.', author: 'David Brinkley' },
  { text: 'No one can make you feel inferior without your consent.', author: 'Eleanor Roosevelt' },
  { text: 'The whole secret of a successful life is to find out what is one\'s destiny to do, and then do it.', author: 'Henry Ford' },
  { text: 'If you\'re going through hell, keep going.', author: 'Winston Churchill' },
  { text: 'What seems to us as bitter trials are often blessings in disguise.', author: 'Oscar Wilde' },
  { text: 'The distance between insanity and genius is measured only by success.', author: 'Bruce Feirstein' },
  { text: 'Don\'t be afraid to give up the good to go for the great.', author: 'John D. Rockefeller' },
  { text: 'I find that the harder I work, the more luck I seem to have.', author: 'Thomas Jefferson' },
  { text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
  { text: 'If you want to achieve excellence, you can get there today.', author: 'Thomas J. Watson' },
  { text: 'All progress takes place outside the comfort zone.', author: 'Michael John Bobak' },
  { text: 'You may only succeed if you desire succeeding; you may only fail if you do not mind failing.', author: 'Philippos' },
]

/**
 * Returns a deterministic daily quote based on the provided date.
 * The same date will always return the same quote.
 *
 * @param date - The date to get a quote for (defaults to today)
 * @returns A daily quote object with text and optional author
 */
export function getDailyQuote(date: Date = new Date()): DailyQuote {
  // Calculate day of year (0-365)
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)

  // Use modulo to cycle through quotes
  const index = dayOfYear % quotes.length

  // Index is guaranteed to be valid since we use modulo with array length
  return quotes[index]!
}
