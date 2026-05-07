import React from 'react';

type Status =
  | 'active'
  | 'paused'
  | 'trial';

interface StatusBadgeProps {
  status?: Status;
  size?: 'sm' | 'md';
}

const statusStyles = {
  active: {
    label: 'Active',
    className:
      'bg-green-100 text-green-700',
  },

  paused: {
    label: 'Paused',
    className:
      'bg-yellow-100 text-yellow-700',
  },

  trial: {
    label: 'Trial',
    className:
      'bg-purple-100 text-purple-700',
  },
};

export default function StatusBadge({
  status = 'active',
  size = 'md',
}: StatusBadgeProps) {

  const config =
    statusStyles[status] ||
    statusStyles.active;

  return (

    <span
      className={`
        inline-flex items-center rounded-full font-600
        ${config.className}
        ${
          size === 'sm'
            ? 'px-2 py-1 text-xs'
            : 'px-3 py-1 text-sm'
        }
      `}
    >

      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-80" />

      {config.label}

    </span>

  );

}