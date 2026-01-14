'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { FieldSelectorProps } from 'react-querybuilder';

export const FieldSelector = (props: FieldSelectorProps) => {
    const { handleOnChange, options, value, disabled } = props;
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
  
    const flatOptions = useMemo(() => (options.filter((opt) => 'name' in opt)), [options]);
  
    const selectedOption = flatOptions.find((opt) => opt.name === value);
    const displayLabel = selectedOption?.label || value;
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    const handleSelect = (optionName: string) => {
      handleOnChange(optionName);
      setIsOpen(false);
    };
  
    return (
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-sm font-medium transition-colors rounded-md border bg-white min-w-0 sm:min-w-[120px] flex-shrink justify-between cursor-pointer
            ${isOpen 
              ? 'text-mp-primary border-mp-primary' 
              : 'text-mp-text-primary border-mp-border hover:text-mp-primary hover:border-mp-primary'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
            <span className="text-xs font-semibold text-gray-400 hidden sm:inline">Aa</span>
            <span className="truncate">{displayLabel}</span>
          </div>
          <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
  
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 sm:w-56 bg-white border border-mp-border rounded-xl shadow-xl z-50 py-1.5 px-1.5 overflow-hidden animate-in fade-in zoom-in duration-150 max-h-64 overflow-y-auto">
            {flatOptions.map((opt) => {
              const isSelected = opt.name === value;
              return (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => handleSelect(opt.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isSelected 
                      ? 'bg-mp-primary text-white' 
                      : 'text-mp-text-primary hover:text-mp-primary hover:bg-mp-primary/5'
                    }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };