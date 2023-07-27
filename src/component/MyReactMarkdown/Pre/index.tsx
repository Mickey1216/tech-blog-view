import React from 'react';
import { ReactMarkdownProps } from 'react-markdown/lib/complex-types';
import CodeCopyBtn from '@/component/MyReactMarkdown/Code/CodeCopyBtn';

type PreProps = Pick<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>,
  'key' | keyof React.HTMLAttributes<HTMLPreElement>
> &
  ReactMarkdownProps;

const Pre = (preProps: PreProps) => {
  const { children } = preProps;
  const classNameArray: string[] = (
    children[0] as any
  )?.props?.className?.split('-');
  const language = classNameArray?.length > 1 ? classNameArray[1] : '';

  return (
    <pre className='blog-pre'>
      <CodeCopyBtn language={language}>{children}</CodeCopyBtn>
      {children}
    </pre>
  );
};

export default Pre;
