import type React from "react";

export function BorderedBox(props: { children: React.ReactNode }) {
  return (
    <div className="shrink grow basis-0 border-4 border-darkgray p-3 text-xs">
      {props.children}
    </div>
  );
}
