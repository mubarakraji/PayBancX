'use client';

import React from 'react';
import { MdCheckCircle, MdCancel } from 'react-icons/md';

interface EmailValidationIndicatorProps {
  email: string;
}

export const EmailValidationIndicator: React.FC<EmailValidationIndicatorProps> = ({ email }) => {
  const isValid = email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const hasEmail = email.trim().length > 0;

  return (
    <div className="flex items-center gap-2 text-xs mt-1">
      {hasEmail ? (
        <>
          {isValid ? (
            <>
              <MdCheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium">Valid email</span>
            </>
          ) : (
            <>
              <MdCancel className="w-4 h-4 text-red-500" />
              <span className="text-red-600 font-medium">Invalid email format</span>
            </>
          )}
        </>
      ) : null}
    </div>
  );
};
