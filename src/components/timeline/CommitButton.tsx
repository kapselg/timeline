import React, { useRef } from "react";
import { GitCommit } from "../../api/types";
import CommitDescription from "./CommitDescription";

export default function CommitButton(props: { i: GitCommit; setMouse: (v: boolean) => any }) {
  const descRef = useRef<HTMLDivElement>(document.createElement("div"));
  const descContRef = useRef<HTMLDivElement>(document.createElement("div"));

  // keeps the description within viewport
  // function checkViewport(e: React.MouseEvent) {
  //   descContRef.current.style.opacity = "0%";
  //   const interOb = new IntersectionObserver((entries) => {
  //     const ent = entries[0];
  //     const correct = `${-(ent.boundingClientRect.right - ent.intersectionRect.right) + -(ent.boundingClientRect.left - ent.intersectionRect.left)}px`;

  //     descContRef.current!.style.transform = `translateX(${correct})`;
  //   });
  //   interOb.observe(descRef.current);
  //   descContRef.current.animate([{ opacity: "0%" }, { opacity: "100%" }], { duration: 20, iterations: 1 });
  //   descContRef.current.style.opacity = "100%";
  // }

  return (
    
    <div id={`${props.i.shortSha}_commit`} >
      {/* onMouseEnter={checkViewport} */}
      <div className="grid place-items-start transition-all duration-200 group px-4 cursor-pointer my-2">
        <div className="button !w-full !md:w-auto">
          {props.i.shortSha}
          <div ref={descContRef}>
            <CommitDescription elRef={descRef} {...props}></CommitDescription>
          </div>
        </div>
      </div>
    </div>
  );
}
