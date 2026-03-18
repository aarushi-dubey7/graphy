export function classifyEquation(input) {
  const str = input.toLowerCase().replace(/\s/g, '');
  if (str.includes('sin')) return 'sin';
  if (str.includes('cos')) return 'cos';
  if (str.includes('tan')) return 'tan';
  if (str.includes('x^2') || str.includes('x²') || str.includes('x**2')) return 'quadratic';
  if (str.match(/[0-9]?x/) || str.includes('mx') || str.includes('b')) return 'linear';
  return 'unknown';
}
