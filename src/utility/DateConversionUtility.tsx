export const formatBackendTimestamp = (timestamp: string) => {
  if (!timestamp) return 'Not Available';
  try {
    const standardized = timestamp.replace(' ', 'T');
    const [mainPart, fractionalPart] = standardized.split('.');
    const cleanIso = fractionalPart 
      ? `${mainPart}.${fractionalPart.substring(0, 3)}Z` // Appending Z forces UTC processing if required
      : `${mainPart}Z`;
      
    return new Date(cleanIso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return timestamp; // Fallback to raw string if parsing breaks
  }
};