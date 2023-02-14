import React from "react";
import { GitCommit } from "../api/types";

export default function CommitButton(props: { onClick: () => void; margin: number; i: GitCommit }) {
  return (
    <div className="flex" id={`${props.i.shortSha}_commit`} onClick={props.onClick}>
      <div className="h-20 flex justify-center border-2 transition-all duration-200 px-[0.5px]" style={{ marginLeft: props.margin, marginRight: props.margin }}>
        {props.i.shortSha}
      </div>
    </div>
  );
}
