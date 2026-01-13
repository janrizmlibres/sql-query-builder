'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ActionProps,
  CombinatorSelectorProps,
  FieldSelectorProps,
  OperatorSelectorProps,
  ValueEditorProps,
} from 'react-querybuilder';
import { Plus, Trash2, MoreHorizontal, ChevronDown } from 'lucide-react';

// Type guard to check if option has 'name' property
const isNamedOption = (opt: unknown): opt is { name: string; label: string } => {
  return typeof opt === 'object' && opt !== null && 'name' in opt;
};

// Custom Add Rule Button (+ Filter)
export const AddFilterAction = (props: ActionProps) => {
  const { handleOnClick, disabled } = props;

  return (
    <button
      type="button"
      onClick={handleOnClick}
      disabled={disabled}
      className="flex items-center gap-1.5 text-sm font-medium text-mp-text-secondary hover:text-mp-primary transition-colors py-2"
    >
      <Plus className="w-4 h-4" />
      <span>Filter</span>
    </button>
  );
};

// Custom Remove Rule Button
export const RemoveRuleAction = (props: ActionProps) => {
  const { handleOnClick, disabled } = props;

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        className="p-1.5 text-mp-text-secondary hover:text-mp-text-primary hover:bg-gray-100 rounded transition-colors"
        title="More options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={handleOnClick}
        disabled={disabled}
        className="p-1.5 text-mp-text-secondary hover:text-red-500 hover:bg-red-50 rounded transition-colors"
        title="Remove rule"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

// Custom Remove Group Button
export const RemoveGroupAction = (props: ActionProps) => {
  const { handleOnClick, disabled } = props;

  return (
    <button
      type="button"
      onClick={handleOnClick}
      disabled={disabled}
      className="p-1.5 text-mp-text-secondary hover:text-red-500 hover:bg-red-50 rounded transition-colors"
      title="Remove group"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
};

// Inline Combinator Toggle (between rules) - AND/OR toggle button
export const InlineCombinatorToggle = (props: CombinatorSelectorProps) => {
  const { value, handleOnChange, options, disabled } = props;

  return (
    <div className="flex items-center justify-center py-1 my-1">
      <div className="inline-flex rounded-md overflow-hidden border border-mp-border bg-mp-bg-card shadow-sm">
        {options.map((option) => {
          if (typeof option === 'string') {
            return (
              <button
                key={option}
                type="button"
                disabled={disabled}
                onClick={() => handleOnChange(option)}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  value === option
                    ? 'bg-mp-text-primary text-white'
                    : 'bg-white text-mp-text-secondary hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            );
          }
          if (isNamedOption(option)) {
            return (
              <button
                key={option.name}
                type="button"
                disabled={disabled}
                onClick={() => handleOnChange(option.name)}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  value === option.name
                    ? 'bg-mp-text-primary text-white'
                    : 'bg-white text-mp-text-secondary hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

// Custom Field Selector - dropdown with "Aa" prefix
export const FieldSelector = (props: FieldSelectorProps) => {
  const { handleOnChange, options, value, disabled } = props;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten options and filter to only FullField items
  const flatOptions = options.flatMap((opt) => {
    if (typeof opt === 'string') return [];
    if ('options' in opt && Array.isArray(opt.options)) {
      return opt.options.filter(isNamedOption);
    }
    if (isNamedOption(opt)) return [opt];
    return [];
  });

  // Find selected option label
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
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors rounded-md border bg-white min-w-[120px] justify-between cursor-pointer
          ${isOpen 
            ? 'text-mp-primary border-mp-primary' 
            : 'text-mp-text-primary border-mp-border hover:text-mp-primary hover:border-mp-primary'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-gray-400">Aa</span>
          <span>{displayLabel}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-mp-border rounded-xl shadow-xl z-50 py-1.5 px-1.5 overflow-hidden animate-in fade-in zoom-in duration-150 max-h-64 overflow-y-auto">
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

// Custom Operator Selector - dropdown
export const OperatorSelector = (props: OperatorSelectorProps) => {
  const { handleOnChange, options, value, disabled } = props;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten options and filter to only named options
  const flatOptions = options.flatMap((opt) => {
    if (typeof opt === 'string') return [];
    if ('options' in opt && Array.isArray(opt.options)) {
      return opt.options.filter(isNamedOption);
    }
    if (isNamedOption(opt)) return [opt];
    return [];
  });

  // Find selected option label
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
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors rounded-md border bg-white min-w-[80px] justify-between cursor-pointer
          ${isOpen 
            ? 'text-mp-primary border-mp-primary' 
            : 'text-mp-text-primary border-mp-border hover:text-mp-primary hover:border-mp-primary'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span>{displayLabel}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-mp-border rounded-xl shadow-xl z-50 py-1.5 px-1.5 overflow-hidden animate-in fade-in zoom-in duration-150 max-h-64 overflow-y-auto">
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

// Custom Value Editor - input field with border
export const ValueEditor = (props: ValueEditorProps) => {
  const { handleOnChange, value, disabled, inputType, fieldData } = props;

  return (
    <input
      type={inputType || 'text'}
      value={value as string}
      onChange={(e) => handleOnChange(e.target.value)}
      disabled={disabled}
      placeholder={fieldData?.placeholder || 'Value'}
      className="bg-white text-mp-text-primary px-3 py-1.5 rounded-md text-sm font-medium border border-mp-border min-w-[80px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-mp-primary focus:border-mp-primary transition-colors"
    />
  );
};

export const HiddenAddGroup = () => null;
