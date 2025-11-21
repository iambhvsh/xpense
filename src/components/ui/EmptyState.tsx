import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-[#1C1C1E] flex items-center justify-center mb-5">
        <Icon className="text-[#8E8E93]" size={40} strokeWidth={2} />
      </div>
      <h3 className="text-[20px] font-bold text-white tracking-[0.38px]">
        {title}
      </h3>
      <p className="text-[15px] text-[#8E8E93] mt-2 tracking-[-0.24px]">
        {description}
      </p>
    </div>
  );
};
