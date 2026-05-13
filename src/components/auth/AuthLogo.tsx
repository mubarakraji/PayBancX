'use client';

import React from 'react';
import { FaChartLine } from 'react-icons/fa';

export const AuthLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2 mb-7">
      <div className="w-9 h-9 bg-[rgba(45,93,89,0.1)] border border-[rgba(45,93,89,0.25)] rounded-2.5 flex items-center justify-center">
        <FaChartLine className="w-4 h-4 text-paybancx-action" />
      </div>
      <span className="font-bold text-xl text-paybancx-action tracking-tight font-['Syne']">
        PayBancX
      </span>
    </div>
  );
};

