// Simple code formatter for the custom language

export const formatCode = (code: string): string => {
  const lines = code.split('\n');
  const formatted: string[] = [];
  let indentLevel = 0;
  const indentSize = 2; // 2 spaces per indent

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();
    
    // Skip empty lines but preserve them
    if (trimmed === '') {
      formatted.push('');
      continue;
    }

    // Decrease indent before closing braces/brackets
    if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add proper indentation
    const indent = ' '.repeat(indentLevel * indentSize);
    formatted.push(indent + trimmed);

    // Increase indent after opening braces/brackets (but not if line ends with closing)
    if (trimmed.endsWith('{') || trimmed.endsWith('[') || (trimmed.endsWith('(') && !trimmed.includes(')'))) {
      indentLevel++;
    }
  }

  return formatted.join('\n');
};
