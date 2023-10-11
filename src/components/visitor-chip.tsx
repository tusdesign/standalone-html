import { FC } from 'react';

export const VisitorChip: FC<{ name: string }> = ({ name }) => (
  <div
    style={{
      borderRadius: '999px',
      overflow: 'hidden',
      padding: '0.1rem 1.5rem',
      fontSize: '0.8rem',
      backgroundColor: 'var(--adm-color-primary)',
      color: 'white',
    }}
  >
    {name}
  </div>
);
