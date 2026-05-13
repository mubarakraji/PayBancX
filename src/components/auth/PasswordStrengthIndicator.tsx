'use client';

import React from 'react';
import { MdCheckCircle, MdCancel } from 'react-icons/md';

interface PasswordStrengthIndicatorProps {
  password: string;
  showDetails?: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showDetails = true,
}) => {
  const requirements = {
    minLength: password.length >= 8,
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
  };

  const getStrength = () => {
    const metRequirements = Object.values(requirements).filter(Boolean).length;
    if (metRequirements === 0) return { level: 'empty', color: 'bg-gray-300', text: 'No password' };
    if (metRequirements === 1) return { level: 'weak', color: 'bg-red-500', text: 'Weak' };
    if (metRequirements === 2) return { level: 'fair', color: 'bg-orange-500', text: 'Fair' };
    if (metRequirements === 3) return { level: 'good', color: 'bg-yellow-500', text: 'Good' };
    return { level: 'strong', color: 'bg-green-500', text: 'Strong' };
  };

  const strength = getStrength();

  return (
    <div className="space-y-2">
      {/* Strength bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`flex-1 h-1 rounded-full transition-colors ${
              index < Object.values(requirements).filter(Boolean).length
                ? strength.color
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Strength text */}
      <div className="text-xs text-gray-600 font-medium">
        Password strength: <span className={strength.color.replace('bg-', 'text-')}>{strength.text}</span>
      </div>

      {/* Requirements checklist */}
      {showDetails && password && (
        <div className="bg-blue-50 rounded-lg p-2.5 space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            {requirements.minLength ? (
              <MdCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
              <MdCancel className="w-4 h-4 text-red-500 flex-shrink-0" />
            )}
            <span className={requirements.minLength ? 'text-green-700' : 'text-gray-600'}>
              At least 8 characters
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {requirements.hasNumber ? (
              <MdCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
              <MdCancel className="w-4 h-4 text-red-500 flex-shrink-0" />
            )}
            <span className={requirements.hasNumber ? 'text-green-700' : 'text-gray-600'}>
              At least one number
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {requirements.hasSpecialChar ? (
              <MdCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
              <MdCancel className="w-4 h-4 text-red-500 flex-shrink-0" />
            )}
            <span className={requirements.hasSpecialChar ? 'text-green-700' : 'text-gray-600'}>
              One special character (!@#$%^&*)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {requirements.hasUpperCase ? (
              <MdCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
              <MdCancel className="w-4 h-4 text-red-500 flex-shrink-0" />
            )}
            <span className={requirements.hasUpperCase ? 'text-green-700' : 'text-gray-600'}>
              One uppercase letter
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
