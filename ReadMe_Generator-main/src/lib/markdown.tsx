import type { ReactNode } from "react";

interface InlinePart {
  text: string;
  strong?: boolean;
  code?: boolean;
}

function inline(text: string): ReactNode[] {
  const parts: InlinePart[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > cursor) parts.push({ text: text.slice(cursor, match.index) });
    const value = match[0];
    if (value.startsWith("**")) parts.push({ text: value.slice(2, -2), strong: true });
    else parts.push({ text: value.slice(1, -1), code: true });
    cursor = match.index + value.length;
  }

  if (cursor < text.length) parts.push({ text: text.slice(cursor) });

  return parts.map((part, index) => {
    if (part.strong) return <strong key={index}>{part.text}</strong>;
    if (part.code) return <code key={index}>{part.text}</code>;
    return part.text;
  });
}

export function renderMarkdown(markdown: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const lines = markdown.split(/\r?\n/);
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      nodes.push(
        <pre className="md-code-block" key={nodes.length}>
          {language && <span>{language}</span>}
          <code>{code.join("\n")}</code>
        </pre>
      );
      index += 1;
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const content = inline(heading[2]);
      if (level === 1) nodes.push(<h1 key={nodes.length}>{content}</h1>);
      else if (level === 2) nodes.push(<h2 key={nodes.length}>{content}</h2>);
      else nodes.push(<h3 key={nodes.length}>{content}</h3>);
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: ReactNode[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(<li key={items.length}>{inline(lines[index].trim().replace(/^[-*]\s+/, ""))}</li>);
        index += 1;
      }
      nodes.push(<ul key={nodes.length}>{items}</ul>);
      continue;
    }

    if (/^\|.+\|$/.test(trimmed)) {
      const rows: string[][] = [];
      while (index < lines.length && /^\|.+\|$/.test(lines[index].trim())) {
        const cells = lines[index].trim().slice(1, -1).split("|").map((cell) => cell.trim());
        if (!cells.every((cell) => /^-+$/.test(cell))) rows.push(cells);
        index += 1;
      }
      const [head, ...body] = rows;
      nodes.push(
        <table key={nodes.length}>
          {head && <thead><tr>{head.map((cell) => <th key={cell}>{inline(cell)}</th>)}</tr></thead>}
          <tbody>{body.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{inline(cell)}</td>)}</tr>)}</tbody>
        </table>
      );
      continue;
    }

    const paragraph: string[] = [trimmed];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{1,3})\s+/.test(lines[index].trim()) && !/^[-*]\s+/.test(lines[index].trim()) && !lines[index].trim().startsWith("```")) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    nodes.push(<p key={nodes.length}>{inline(paragraph.join(" "))}</p>);
  }

  return nodes;
}
