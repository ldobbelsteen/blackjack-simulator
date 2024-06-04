import React from "react";

export function RadioRow(props: {
  title: string;
  options: string[];
  selected: string;
  setSelected: (v: string) => void;
}) {
  return (
    <tr role="radiogroup">
      <td>{props.title}</td>
      {props.options.map((option, i) => (
        <td key={i}>
          <input
            type="radio"
            id={props.title + option}
            value={option}
            checked={option === props.selected}
            onChange={() => props.setSelected(option)}
          />
          <label htmlFor={props.title + option}>{option}</label>
        </td>
      ))}
    </tr>
  );
}
