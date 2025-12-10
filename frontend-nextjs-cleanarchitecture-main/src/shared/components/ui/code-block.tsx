'use client';

import { Check, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/core/utils';

import { Button } from './button';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function CodeBlock({
  code,
  language = 'tsx',
  title,
  showLineNumbers = false,
  className,
  collapsible = true,
  defaultCollapsed = true,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className={cn('rounded-lg border bg-muted/50', className)}>
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          )}
          <span className="text-xs font-medium text-muted-foreground">
            {title || language.toUpperCase()}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={copyToClipboard}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </Button>
      </div>
      {!isCollapsed && (
        <div className="overflow-x-auto p-4">
          <pre className="text-sm">
            <code>
              {showLineNumbers
                ? lines.map((line, i) => (
                    <div key={i} className="flex">
                      <span className="mr-4 inline-block w-8 text-right text-muted-foreground">
                        {i + 1}
                      </span>
                      <span>{line}</span>
                    </div>
                  ))
                : code}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}
