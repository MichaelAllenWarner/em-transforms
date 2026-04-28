import { MathJax } from 'better-react-mathjax';
import { ComponentProps, type HTMLAttributes } from 'react';

interface Props
  extends Omit<ComponentProps<typeof MathJax>, 'inline' | 'children'> {
  /**
   * The string must include a MathJax expression like `'\\( ... \\)'`
   * but may optionally begin and/or end with characters that should
   * never be separated from the expression by a line-break
   * (typically punctuation).
   */
  content: `${string}\\(${string}\\)${string}`;
  /**
   * If supplied, makes the MathJax expression decorative (inert/non-interactive)
   * and renders the supplied text in a visually-hidden span.
   */
  srOnlyText?: string;
}

const MathJaxInline = ({ content, srOnlyText, ...rest }: Props) => {
  const [expression] = content.match(/\\\(.*\\\)/) || [];
  if (!expression) {
    throw Error(`No MathJax expression found in ${content}`);
  }

  const math = (
    <>
      <MathJax
        {...rest}
        inline
        className={srOnlyText ? 'pointer-events-none' : ''}
        {...(srOnlyText ? { inert: '' } : {})}
      >
        {expression}
      </MathJax>
    </>
  );

  const [prefix] = content.split('\\(');
  const [, suffix] = content.split('\\)');

  return (
    <span className="whitespace-nowrap">
      {prefix}
      {math}
      {srOnlyText && <span className="sr-only">{srOnlyText}</span>}
      {suffix}
    </span>
  );
};

export default MathJaxInline;
