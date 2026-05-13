'use client';

import React from 'react';

interface AuthInputProps {
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onEndIconClick?: () => void;
  [key: string]: any;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  icon,
  endIcon,
  onEndIconClick,
  className,
  ...props
}) => {
  return (
    <div className="relative flex items-center">
      {icon && (
        <span className="absolute left-3 text-[#9ab4b0] flex items-center pointer-events-none">
          {icon}
        </span>
      )}
      <input
        className={`w-full bg-[#FFFFFF] border border-[rgba(28,63,59,0.12)] rounded-lg py-2.5 px-3 font-['DM_Sans'] text-sm text-[#333333] outline-none transition-all ${
          icon ? 'pl-9' : 'pl-3'
        } focus:border-[rgba(28,63,59,0.3)] focus:bg-[rgba(28,63,59,0.01)] ${className || ''}`}
        placeholder="..."
        {...props}
      />
      {endIcon && (
        <span
          className="absolute right-3 text-[#9ab4b0] flex items-center cursor-pointer hover:text-[#1C3F3B] transition-colors"
          onClick={onEndIconClick}
        >
          {endIcon}
        </span>
      )}
    </div>
  );
};

interface FormGroupProps {
  label: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onEndIconClick?: () => void;
  [key: string]: any;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  icon,
  endIcon,
  onEndIconClick,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <label className="text-xs font-medium text-[#1C3F3B] tracking-wide">
        {label}
      </label>
      <AuthInput
        icon={icon}
        endIcon={endIcon}
        onEndIconClick={onEndIconClick}
        {...props}
      />
    </div>
  );
};

