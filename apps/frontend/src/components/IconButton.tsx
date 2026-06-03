import type { ReactNode } from 'react';

type IconButtonProps = {
  active: boolean;
  children: ReactNode;
  label: string;
  onClick: () => void;
};

export function IconButton({ active, children, label, onClick }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className="icon-button"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
