'use client';

import { ActionProps } from "react-querybuilder";
import { Plus, Trash2 } from "lucide-react";

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

export const RemoveRuleAction = (props: ActionProps) => {
  const { handleOnClick, disabled } = props;

  return (
    <button
      type="button"
      onClick={handleOnClick}
      disabled={disabled}
      className="p-1.5 text-mp-text-secondary hover:text-red-500 hover:bg-red-50 rounded transition-colors"
      title="Remove rule"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
};

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
