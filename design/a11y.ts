import { tokens } from './tokens';

/**
 * CSS-in-JS object for focus styles using design tokens.
 * To be used with the :focus-visible pseudo-selector.
 * Note: Not directly used; Tailwind's focus-visible classes with arbitrary values are preferred.
 */
export const focusVisibleStyles = {
  outline: 'none',
  boxShadow: `0 0 0 2px ${tokens.color.surface}, 0 0 0 4px ${tokens.color.focus}`,
};

/**
 * Helper to generate common ARIA properties.
 * `descriptionId` should be the `id` of the element describing the component.
 */
export function getAriaProps(label: string, descriptionId?: string) {
  return {
    'aria-label': label,
    'aria-describedby': descriptionId,
  };
}
