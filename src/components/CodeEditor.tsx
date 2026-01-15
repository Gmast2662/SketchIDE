// Code editor component with line numbers and syntax highlighting

import { useEffect, useRef, useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  errorLine?: number | null;
}

const highlightSyntax = (code: string) => {
  // First, escape HTML
  let highlighted = code
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
  const functions = /\b(setup|loop|size|background|fill|stroke|strokeWeight|ellipse|rect|line|text|print|input|random|triangle|quad|arc|point|map|constrain|dist|abs|sqrt|pow|sin|cos|tan|floor|ceil|round|min|max)\b(?=\()/g;
  const numbers = /\b\d+(\.\d+)?\b/g;
  const strings = /(["'])((?:\\.|(?!\1).)*?)\1/g;

  // Process strings first (they can contain slashes that might look like comments)
  highlighted = highlighted.replace(strings, '<span style="color: #CE9178">$&</span>');
  
  // Then process other syntax
  highlighted = highlighted.replace(functions, '<span style="color: #DCDCAA">$&</span>');
  highlighted = highlighted.replace(keywords, '<span style="color: #569CD6">$&</span>');
  highlighted = highlighted.replace(numbers, '<span style="color: #B5CEA8">$&</span>');

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
  const [lineCount, setLineCount] = useState(1);
  const [highlightedCode, setHighlightedCode] = useState('');

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines);
    setHighlightedCode(highlightSyntax(value));
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

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
      <div className="bg-[#1E1E1E] px-4 py-4 text-[#858585] select-none text-right border-r border-[#3E3E42] overflow-hidden">
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
          className="absolute inset-0 px-4 py-4 pointer-events-none overflow-auto whitespace-pre-wrap break-words leading-[1.5]"
          style={{ 
            scrollBehavior: 'auto',
            overflowX: 'hidden'
          }}
        >
          {value.split('\n').map((line, i) => {
            const lineNum = i + 1;
            const isError = errorLine !== null && errorLine === lineNum;
            return (
              <div
                key={i}
                className={`h-[21px] ${isError ? 'bg-red-900/30' : ''}`}
                dangerouslySetInnerHTML={{ 
                  __html: highlightSyntax(line) || '&nbsp;' 
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
          className="w-full h-full px-4 py-4 bg-transparent text-transparent caret-white outline-none resize-none leading-[1.5] overflow-auto relative z-10"
          style={{ caretColor: '#CCCCCC' }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
};
