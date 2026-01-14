'use client';

import { useState, useRef, useEffect } from 'react';
import { ValueEditorProps } from 'react-querybuilder';
import { ChevronDown } from 'lucide-react';
import { VALUE_LESS_OPERATORS, BOOLEAN_OPTIONS } from '@/constants';

export const ValueEditor = (props: ValueEditorProps) => {
  const { handleOnChange, value, disabled, inputType, fieldData, operator } = props;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isBoolean = fieldData?.datatype === 'boolean';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isBoolean) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isBoolean]);

  if (VALUE_LESS_OPERATORS.includes(operator)) {
    return null;
  }

  if (isBoolean) {
    const selectedOption = BOOLEAN_OPTIONS.find((opt) => opt.value === value);
    const displayLabel = selectedOption?.label || 'Select...';

    return (
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-sm font-medium transition-colors rounded-md border bg-white min-w-0 sm:min-w-[100px] flex-shrink justify-between cursor-pointer
            ${isOpen 
              ? 'text-mp-primary border-mp-primary' 
              : 'text-mp-text-primary border-mp-border hover:text-mp-primary hover:border-mp-primary'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className={`truncate ${selectedOption ? '' : 'text-gray-400'}`}>{displayLabel}</span>
          <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-28 sm:w-32 bg-white border border-mp-border rounded-xl shadow-xl z-50 py-1.5 px-1.5 overflow-hidden animate-in fade-in zoom-in duration-150">
            {BOOLEAN_OPTIONS.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => {
                    handleOnChange(opt.value);
                    setIsOpen(false);
                  }}
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
  }

  const isDate = fieldData?.datatype === 'date' || fieldData?.datatype === 'datetime-local';

  if (isDate) {
    const getLocalDateTimeString = (isoString: string): string => {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const displayValue = value ? getLocalDateTimeString(String(value)) : '';

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const localValue = e.target.value;
      if (localValue) {
        const isoValue = new Date(localValue).toISOString();
        handleOnChange(isoValue);
      } else {
        handleOnChange('');
      }
    };

    return (
      <input
        type="datetime-local"
        value={displayValue}
        onChange={handleDateChange}
        disabled={disabled}
        className="bg-white text-mp-text-primary px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium border border-mp-border min-w-0 w-full sm:w-auto sm:min-w-[80px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-mp-primary focus:border-mp-primary transition-colors"
      />
    );
  }

  return (
    <input
      type={inputType || 'text'}
      value={value as string}
      onChange={(e) => handleOnChange(e.target.value)}
      disabled={disabled}
      placeholder={fieldData?.placeholder || 'Value'}
      className="bg-white text-mp-text-primary px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium border border-mp-border min-w-0 flex-1 sm:flex-initial sm:min-w-[80px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-mp-primary focus:border-mp-primary transition-colors"
    />
  );
};