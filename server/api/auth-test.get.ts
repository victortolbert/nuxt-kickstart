export default defineEventHandler(() => {
  return {
    message: 'Auth test endpoint working',
    timestamp: new Date().toISOString(),
  }
})
