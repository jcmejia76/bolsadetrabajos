"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const MAX_SKILLS = 30;

interface SkillsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function SkillsInput({ value, onChange }: SkillsInputProps) {
  const [draft, setDraft] = useState("");

  function commitDraft() {
    const trimmed = draft.trim();
    if (!trimmed) {
      setDraft("");
      return;
    }
    if (value.includes(trimmed) || value.length >= MAX_SKILLS) {
      setDraft("");
      return;
    }
    onChange([...value, trimmed]);
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitDraft();
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {value.map((skill, i) => (
          <Badge key={`${skill}-${i}`} variant="secondary" className="gap-1">
            {skill}
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label={`Quitar ${skill}`}
              className="rounded-full hover:bg-muted-foreground/20"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitDraft}
        placeholder={
          value.length >= MAX_SKILLS
            ? `Máximo ${MAX_SKILLS} habilidades`
            : "Escribe y presiona Enter o coma..."
        }
        disabled={value.length >= MAX_SKILLS}
      />
    </div>
  );
}
