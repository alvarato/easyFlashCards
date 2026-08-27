export type DisplayChar = { char: string; isTarget: boolean };

export const isLetter = (char: string) => /[a-zA-ZÀ-ÿ]/.test(char);

// Quita los () del string y marca qué caracteres van dentro (target = adivinable)
export const parseDisplayChars = (raw: string): DisplayChar[] => {
  const hasParens = raw.includes("(");
  const result: DisplayChar[] = [];
  let inside = false;

  for (const ch of raw) {
    if (ch === "(") {
      inside = true;
      continue;
    }
    if (ch === ")") {
      inside = false;
      continue;
    }
    // Si no hay paréntesis en la palabra, todo es "target" (comportamiento original)
    result.push({ char: ch, isTarget: hasParens ? inside : true });
  }

  return result;
};

export const isEditable = (entry: DisplayChar) =>
  entry.isTarget && isLetter(entry.char);

export const fillWord = (chars: DisplayChar[], typed: string) => {
  let typedIndex = 0;
  return chars
    .map((entry) =>
      isEditable(entry) ? (typed[typedIndex++] ?? "·") : entry.char,
    )
    .join("");
};

export type LineChar = { char: string; typedIndex: number | null };

// Arma las líneas (separadas por espacios) con el índice de tipeo de cada letra editable
export const buildLines = (chars: DisplayChar[]): LineChar[][] => {
  let letterCursor = 0;
  const lines: LineChar[][] = [[]];

  chars.forEach((entry) => {
    if (entry.char === " ") {
      lines.push([]);
      return;
    }
    const editable = isEditable(entry);
    const line = editable
      ? { char: entry.char, typedIndex: letterCursor++ }
      : { char: entry.char, typedIndex: null };
    lines[lines.length - 1].push(line);
  });

  return lines;
};
