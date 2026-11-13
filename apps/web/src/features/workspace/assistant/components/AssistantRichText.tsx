import { Fragment, type ReactNode } from "react";
import { Link } from "react-router";

import type { AssistantRichTextProps } from "@/features/workspace/assistant/types/components";

/** `[label](/path)` and `**bold**`. Only in-app paths become links, so a reply can't send users off-site. */
const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
const LINK_CLASS_NAME = "font-medium text-chart-1 underline underline-offset-4 hover:text-foreground";

function renderInline(text: string, onNavigate: () => void): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    const [, label, href, bold] = match;
    if (bold) {
      nodes.push(
        <strong key={index} className="font-semibold">
          {bold}
        </strong>,
      );
    } else if (href?.startsWith("/") && !href.startsWith("//")) {
      nodes.push(
        <Link key={index} to={href} onClick={onNavigate} className={LINK_CLASS_NAME}>
          {label}
        </Link>,
      );
    } else {
      nodes.push(label);
    }
    last = index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** Renders the small markdown subset the assistant is told to use: paragraphs, "- " lists, bold, links. */
export function AssistantRichText({ text, onNavigate }: AssistantRichTextProps) {
  return (
    <div className="space-y-2">
      {text.split(/\n{2,}/).map((block, blockIndex) => {
        const lines = block.split("\n").filter((line) => line.trim());
        if (lines.length && lines.every((line) => /^\s*[-*]\s+/.test(line))) {
          return (
            <ul key={blockIndex} className="list-disc space-y-1 pl-5 marker:text-muted-foreground">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInline(line.replace(/^\s*[-*]\s+/, ""), onNavigate)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={blockIndex}>
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 ? <br /> : null}
                {renderInline(line, onNavigate)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
