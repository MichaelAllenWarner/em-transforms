import { MathJax } from 'better-react-mathjax';
import { ComponentProps } from 'react';

interface Props
  extends Omit<ComponentProps<typeof MathJax>, 'inline' | 'children'> {
  /**
   * The string must include a MathJax expression like `'\\( ... \\)'`
   * but may optionally begin and/or end with characters that should
   * never be separated from the expression by a line-break
   * (typically punctuation).
   */
  content: `${string}\\(${string}\\)${string}`;
}

const MathJaxInline = ({ content, ...rest }: Props) => {
  const [expression] = content.match(/\\\(.*\\\)/) || [];
  if (!expression) {
    throw Error(`No MathJax expression found in ${content}`);
  }

  const math = (
    <MathJax {...rest} inline>
      {expression}
    </MathJax>
  );

  const [prefix] = content.split('\\(');
  const [, suffix] = content.split('\\)');

  return prefix || suffix ? (
    <span className="whitespace-nowrap">
      {prefix}
      {math}
      {suffix}
    </span>
  ) : (
    <>{math}</>
  );
};

export default MathJaxInline;
