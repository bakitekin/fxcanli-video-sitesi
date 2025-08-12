import React from 'react';

type ToggleProps = {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
};

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center h-6 w-11 rounded-full transition-colors ${checked ? 'bg-brand-orange' : 'bg-gray-300'}`}
    >
      <span className={`h-5 w-5 bg-white rounded-full shadow transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
      {label && <span className="ml-2 text-sm">{label}</span>}
    </button>
  );
};

export default Toggle;
