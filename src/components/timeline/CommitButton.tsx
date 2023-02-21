import { GitCommit } from "../../api/types";
import CommitDescription from "./CommitDescription";

export default function CommitButton(props: { i: GitCommit; setMouse: (v: boolean) => any }) {

  return (
    <div id={`${props.i.shortSha}_commit`}>
      <div className="grid hover:h-screen place-items-start transition-all duration-200 group px-4 cursor-pointer">
        <div className="button">
        {props.i.shortSha}
        <CommitDescription {...props}></CommitDescription>
        </div>
      </div>
    </div>
  );
}
