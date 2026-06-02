"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

type Props = {
  value: string[];
  onChange: (skills: string[]) => void;
};

export function SkillsInput({ value, onChange }: Props) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function add() {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  }

  function remove(skill: string) {
    onChange(value.filter((s) => s !== skill));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    }
    if (e.key === "Backspace" && input === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div
      className="min-h-10 flex flex-wrap gap-1.5 items-center rounded-lg border border-input bg-background px-3 py-2 cursor-text focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-ring"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((skill) => (
        <Badge key={skill} variant="secondary" className="gap-1 pr-1">
          {skill}
          <button
            type="button"
            onClick={() => remove(skill)}
            className="rounded-full hover:bg-muted-foreground/20 p-0.5"
            aria-label={`Remove ${skill}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={add}
        placeholder={value.length === 0 ? "Type a skill and press Enter…" : ""}
        className="border-0 p-0 h-auto flex-1 min-w-24 focus-visible:ring-0 focus-visible:border-0 shadow-none bg-transparent"
      />
    </div>
  );
}
