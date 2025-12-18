import { Check, Copy } from 'lucide-react';
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language?: string;
  children: string;
  inline?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  language = 'text',
  children,
  inline = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (inline) {
    return (
      <code className="px-2 py-0.5 bg-gray-100 border-2 border-black rounded text-sm font-mono text-toon-red">
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border-3 border-black shadow-toon">
      {/* 语言标签和复制按钮 */}
      <div className="flex items-center justify-between bg-gray-900 px-4 py-2 border-b-2 border-black">
        <span className="text-xs font-black text-toon-yellow uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all border-2 border-black ${
            copied ? 'bg-green-500 text-white' : 'bg-white text-gray-900 hover:bg-toon-yellow'
          }`}
        >
          {copied ? (
            <>
              <Check size={14} />
              已复制
            </>
          ) : (
            <>
              <Copy size={14} />
              复制
            </>
          )}
        </button>
      </div>

      {/* 代码内容 */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: '#1e1e1e',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          showLineNumbers
          wrapLines
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
