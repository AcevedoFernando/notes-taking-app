import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryLabel } from '../../../components/atoms/CategoryLabel';

describe('CategoryLabel', () => {
  it('renders the category name', () => {
    render(<CategoryLabel name="Work" color="#ff0000" />);
    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('applies the color to the dot element', () => {
    const { container } = render(<CategoryLabel name="Personal" color="#00ff00" />);
    const dot = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(dot.style.backgroundColor).toBe('rgb(0, 255, 0)');
  });

  it('marks the color dot as aria-hidden', () => {
    const { container } = render(<CategoryLabel name="Work" color="#ff0000" />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
