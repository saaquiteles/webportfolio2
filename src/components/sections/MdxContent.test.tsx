import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MdxContent } from './MdxContent';

// The function-body form Velite emits for: ## Built with, then a paragraph holding a link.
const code = String.raw`const{Fragment:e,jsx:n,jsxs:t}=arguments[0];function _createMdxContent(i){const c={a:"a",h2:"h2",p:"p",...i.components};return t(e,{children:[n(c.h2,{children:"Built with"}),"\n",n(c.p,{children:n(c.a,{href:"https://example.com/source",children:"Source code"})})]})}return{default:function(i={}){const{wrapper:o}=i.components||{};return o?n(o,{...i,children:n(_createMdxContent,{...i})}):_createMdxContent(i)}};`;

describe('MdxContent', () => {
  it('renders a heading and a link that keeps its href', () => {
    render(<MdxContent code={code} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Built with' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Source code' })).toHaveAttribute(
      'href',
      'https://example.com/source',
    );
  });
});
