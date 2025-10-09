import type React from "react";

export function Button(props: {
  children: React.ReactNode;
  onClick: () => void;
  fullWidth: boolean;
}) {
  return (
    <button
      onClick={props.onClick}
      className={`${props.fullWidth ? "w-full" : "w-auto"} bg-darkgray p-2 font-bold transition-all hover:bg-semidarkgray`}
      type="button"
    >
      {props.children}
    </button>
  );
}
