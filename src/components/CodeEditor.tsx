// Code editor component with line numbers and syntax highlighting

import { useEffect, useRef, useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  errorLine?: number | null;
}

const highlightSyntax = (
  code: string,
  selectedWord: string | null = null,
  matchingBracket: number | null = null,
  cursorPos: number | null = null
) => {
  // Mark word positions in original code first (before HTML escaping)
  const wordMarkers: { start: number; end: number; marker: string }[] = [];
  let markedCode = code;
  
  if (selectedWord) {
    const escapedWord = selectedWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordRegex = new RegExp(`\\b${escapedWord}\\b`, 'g');
    let match;
    const markers: { start: number; end: number }[] = [];
    
    while ((match = wordRegex.exec(code)) !== null) {
      const beforeMatch = code.substring(0, match.index);
      const lastComment = beforeMatch.lastIndexOf('//');
      const lastNewline = beforeMatch.lastIndexOf('\n');
      const isInComment = lastComment > lastNewline && lastComment !== -1;
      
      // Simple string detection - check if we're inside quotes
      let inString = false;
      let quoteChar = '';
      for (let i = 0; i < match.index; i++) {
        const char = code[i];
        if ((char === '"' || char === "'") && (i === 0 || code[i - 1] !== '\\')) {
          if (!inString) {
            inString = true;
            quoteChar = char;
          } else if (char === quoteChar) {
            inString = false;
          }
        }
      }
      
      if (!isInComment && !inString) {
        markers.push({ start: match.index, end: match.index + match[0].length });
      }
    }
    
    // Replace matches with markers in reverse order
    for (let i = markers.length - 1; i >= 0; i--) {
      const m = markers[i];
      const marker = `__WORD_MARKER_${i}__`;
      wordMarkers.push({ start: m.start, end: m.end, marker });
      markedCode = markedCode.substring(0, m.start) + marker + markedCode.substring(m.end);
    }
  }
  
  // Now escape HTML
  let highlighted = markedCode
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Process comments first and mark them with placeholders
  const commentPlaceholders: string[] = [];
  highlighted = highlighted.replace(/\/\/.*/g, (match) => {
    const placeholder = `__COMMENT_${commentPlaceholders.length}__`;
    commentPlaceholders.push(match);
    return placeholder;
  });

  // Now process other syntax (only outside comments)
  const keywords = /\b(var|let|const|if|else|while|for|function|return|and|or|not|true|false)\b/g;
  const functions = /\b(setup|loop|size|background|fill|stroke|strokeWeight|ellipse|rect|line|text|print|input|random|triangle|quad|arc|point|map|constrain|dist|abs|sqrt|pow|sin|cos|tan|floor|ceil|round|min|max|createList|append|getLength|getItem|setItem|encrypt|decrypt|delay|mouseX|mouseY|mousePressed|mouseClicked|keyPressed|key|isKeyPressed|isLeftMouse|isRightMouse|keyClicked|button|buttonClicked|clearButtons)\b(?=\()/g;
  const numbers = /\b\d+(\.\d+)?\b/g;
  const strings = /(["'])((?:\\.|(?!\1).)*?)\1/g;

  // Process strings first (they can contain slashes that might look like comments)
  highlighted = highlighted.replace(strings, '<span style="color: #CE9178">$&</span>');
  
  // Then process other syntax - use inline styles instead of Tailwind classes
  highlighted = highlighted.replace(functions, '<span style="color: #DCDCAA">$&</span>');
  highlighted = highlighted.replace(keywords, '<span style="color: #569CD6">$&</span>');
  highlighted = highlighted.replace(numbers, '<span style="color: #B5CEA8">$&</span>');

  // Replace word markers with highlighted spans
  wordMarkers.forEach(({ marker, start, end }) => {
    const markerText = code.substring(start, end);
    const escapedMarkerText = markerText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const highlightedWord = `<span style="background-color: rgba(255, 255, 0, 0.3); border-bottom: 1px solid rgba(255, 255, 0, 0.6);">${escapedMarkerText}</span>`;
    // Escape the marker for regex replacement
    const escapedMarker = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    highlighted = highlighted.replace(new RegExp(escapedMarker, 'g'), highlightedWord);
  });

  // Finally, replace comment placeholders with styled comments (no highlighting inside)
  commentPlaceholders.forEach((comment, index) => {
    const placeholder = `__COMMENT_${index}__`;
    highlighted = highlighted.replace(placeholder, `<span style="color: #6A9955">${comment}</span>`);
  });

  return highlighted;
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  errorLine = null,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);
  const [highlightedCode, setHighlightedCode] = useState('');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matchingBracket, setMatchingBracket] = useState<number | null>(null);
  
  // Sync scroll between textarea, overlay, and line numbers
  useEffect(() => {
    const textarea = textareaRef.current;
    const overlay = overlayRef.current;
    const lineNumbers = lineNumbersRef.current;
    if (!textarea || !overlay) return;
    
    const handleScroll = () => {
      overlay.scrollTop = textarea.scrollTop;
      overlay.scrollLeft = textarea.scrollLeft;
      if (lineNumbers) {
        lineNumbers.scrollTop = textarea.scrollTop;
      }
    };
    
    textarea.addEventListener('scroll', handleScroll);
    return () => textarea.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines);
    setHighlightedCode(highlightSyntax(value));
  }, [value, selectedWord, matchingBracket]);

  // Handle selection change for word highlighting and bracket matching
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    let updateTimeout: NodeJS.Timeout | null = null;

    const handleSelectionChange = () => {
      if (!textarea) return;
      
      // Clear any pending updates
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      
      // Delay the update to avoid interfering with typing/deletion
      updateTimeout = setTimeout(() => {
        if (!textarea) return;
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        // Only highlight if cursor is at a single position (not a selection)
        if (start === end && start >= 0 && start <= value.length) {
          // Check for bracket matching - only if cursor is on a bracket
          if (start < value.length) {
            const char = value[start];
            const bracketPairs: { [key: string]: string } = {
              '(': ')',
              '[': ']',
              '{': '}',
              ')': '(',
              ']': '[',
              '}': '{',
            };
            
            if (char && bracketPairs[char]) {
              const matchPos = findMatchingBracket(value, start, char, bracketPairs[char]);
              setMatchingBracket(matchPos);
            } else {
              setMatchingBracket(null);
            }
          } else {
            setMatchingBracket(null);
          }
          
          // Check for word highlighting
          if (start > 0 && start <= value.length) {
            const wordMatch = getWordAtPosition(value, start - 1);
            if (wordMatch && wordMatch.word.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
              setSelectedWord(wordMatch.word);
            } else {
              setSelectedWord(null);
            }
          } else {
            setSelectedWord(null);
          }
        } else {
          // If there's a selection, clear highlights
          setSelectedWord(null);
          setMatchingBracket(null);
        }
      }, 100); // Small delay to avoid interfering with typing
    };

    const handleMouseUp = () => {
      handleSelectionChange();
    };

    // Only listen to click and mouseup for selection changes
    // Don't interfere with input events
    textarea.addEventListener('click', handleSelectionChange);
    textarea.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      textarea.removeEventListener('click', handleSelectionChange);
      textarea.removeEventListener('mouseup', handleMouseUp);
    };
  }, [value]);

  // Helper function to find matching bracket
  const findMatchingBracket = (
    text: string,
    pos: number,
    openBracket: string,
    closeBracket: string
  ): number | null => {
    const isOpen = ['(', '[', '{'].includes(openBracket);
    const direction = isOpen ? 1 : -1;
    let depth = 1;
    let i = pos + direction;

    while (i >= 0 && i < text.length) {
      if (text[i] === openBracket) {
        depth++;
      } else if (text[i] === closeBracket) {
        depth--;
        if (depth === 0) {
          return i;
        }
      }
      i += direction;
    }

    return null;
  };

  // Helper function to get word at position
  const getWordAtPosition = (text: string, pos: number): { word: string; start: number; end: number } | null => {
    if (pos < 0 || pos >= text.length) return null;
    
    // Find word boundaries
    let start = pos;
    let end = pos;
    
    // Move start backwards to beginning of word
    while (start > 0 && /[a-zA-Z0-9_]/.test(text[start - 1])) {
      start--;
    }
    
    // Move end forwards to end of word
    while (end < text.length && /[a-zA-Z0-9_]/.test(text[end])) {
      end++;
    }
    
    const word = text.substring(start, end);
    if (word.length > 0) {
      return { word, start, end };
    }
    
    return null;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Don't prevent default for backspace, delete, arrow keys, etc. - let them work normally
    // Only prevent default for keys we want to customize
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key.startsWith('Arrow') || 
        e.key === 'Home' || e.key === 'End' || e.key === 'PageUp' || e.key === 'PageDown') {
      // Let these keys work normally - don't interfere
      return;
    }

    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }

    // Handle Enter key - auto indent
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Get current line
      const beforeCursor = value.substring(0, start);
      const currentLineStart = beforeCursor.lastIndexOf('\n') + 1;
      const currentLine = beforeCursor.substring(currentLineStart);
      
      // Count leading spaces
      const match = currentLine.match(/^(\s*)/);  
      const indent = match ? match[1] : '';
      
      // Check if line ends with { to add extra indent
      const trimmedLine = currentLine.trim();
      const extraIndent = trimmedLine.endsWith('{') ? '  ' : '';
      
      const newValue = value.substring(0, start) + '\n' + indent + extraIndent + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after newline and indent
      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = start + 1 + indent.length + extraIndent.length;
          textareaRef.current.selectionStart = newPos;
          textareaRef.current.selectionEnd = newPos;
        }
      }, 0);
    }
  };



  return (
    <div className="flex h-full bg-[#1E1E1E] text-ide-text font-mono text-[14px] overflow-hidden">
      {/* Line numbers */}
      <div 
        ref={lineNumbersRef}
        className="bg-[#1E1E1E] px-4 py-4 text-[#858585] select-none text-right border-r border-[#3E3E42] overflow-auto"
      >
        {Array.from({ length: lineCount }, (_, i) => {
          const lineNum = i + 1;
          const isError = errorLine !== null && errorLine === lineNum;
          return (
            <div
              key={lineNum}
              className={`leading-[1.5] h-[21px] ${isError ? 'text-ide-error font-bold' : ''}`}
            >
              {lineNum}
            </div>
          );
        })}
      </div>

      {/* Editor */}
      <div className="flex-1 relative overflow-hidden">
        {/* Syntax highlighted overlay */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 px-4 py-4 pointer-events-none overflow-auto whitespace-pre-wrap break-words leading-[1.5]"
          style={{ 
            scrollBehavior: 'auto',
            overflowX: 'hidden'
          }}
        >
          {value.split('\n').map((line, i) => {
            const lineNum = i + 1;
            const isError = errorLine !== null && errorLine === lineNum;
            
            // Get cursor position and calculate line start position
            const textarea = textareaRef.current;
            const cursorPos = textarea?.selectionStart ?? null;
            const textBeforeLine = value.split('\n').slice(0, i).join('\n');
            const lineStartPos = textBeforeLine.length + (i > 0 ? 1 : 0);
            
            // Find bracket positions to highlight on this line (relative to line start)
            const bracketPositions = new Set<number>();
            if (matchingBracket !== null && matchingBracket >= 0) {
              const bracketLine = value.substring(0, matchingBracket).split('\n').length - 1;
              if (bracketLine === i) {
                const bracketPosInLine = matchingBracket - lineStartPos;
                if (bracketPosInLine >= 0 && bracketPosInLine < line.length) {
                  bracketPositions.add(bracketPosInLine);
                }
              }
            }
            if (cursorPos !== null) {
              const cursorLine = value.substring(0, cursorPos).split('\n').length - 1;
              if (cursorLine === i) {
                const cursorChar = value[cursorPos];
                if (cursorChar && ['(', ')', '[', ']', '{', '}'].includes(cursorChar)) {
                  const cursorPosInLine = cursorPos - lineStartPos;
                  if (cursorPosInLine >= 0 && cursorPosInLine < line.length) {
                    bracketPositions.add(cursorPosInLine);
                  }
                }
              }
            }
            
            // Mark brackets that need highlighting with placeholders before syntax highlighting
            let lineWithMarkers = line;
            const bracketMarkers: { marker: string; char: string; pos: number }[] = [];
            if (bracketPositions.size > 0) {
              // Replace brackets at positions with unique markers (in reverse order to preserve indices)
              const sortedPositions = Array.from(bracketPositions).sort((a, b) => b - a);
              sortedPositions.forEach((pos) => {
                if (pos >= 0 && pos < line.length) {
                  const bracketChar = line[pos];
                  const marker = `__BRACKET_MARKER_${bracketMarkers.length}__`;
                  bracketMarkers.push({ marker, char: bracketChar, pos });
                  lineWithMarkers = lineWithMarkers.substring(0, pos) + marker + lineWithMarkers.substring(pos + 1);
                }
              });
            }
            
            // Apply syntax highlighting with word highlighting
            let lineHighlighted = highlightSyntax(lineWithMarkers, selectedWord, null, null);
            
            // Replace markers with highlighted brackets
            bracketMarkers.forEach(({ marker, char }) => {
              const bracketHtml = char.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
              const bracketStyle = 'background-color: rgba(0, 122, 204, 0.3); border: 1px solid rgba(0, 122, 204, 0.6);';
              const highlightedBracket = `<span style="${bracketStyle}">${bracketHtml}</span>`;
              // Replace the marker (need to escape it for regex)
              const escapedMarker = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              lineHighlighted = lineHighlighted.replace(new RegExp(escapedMarker, 'g'), highlightedBracket);
            });
            
            return (
              <div
                key={i}
                className={`h-[21px] ${isError ? 'bg-red-900/30' : ''}`}
                dangerouslySetInnerHTML={{ 
                  __html: lineHighlighted || '&nbsp;' 
                }}
              />
            );
          })}
        </div>
        
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          className="code-editor-textarea w-full h-full px-4 py-4 bg-transparent text-transparent caret-white outline-none resize-none leading-[1.5] overflow-auto relative z-10"
          style={{ 
            caretColor: '#CCCCCC',
            fontFamily: 'var(--editor-font-family, monospace)',
            fontSize: 'var(--editor-font-size, 14px)'
          }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
};
