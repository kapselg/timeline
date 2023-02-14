import React, { MouseEventHandler, TransitionEventHandler, useEffect, useRef, useState } from "react";
import "./Home.sass";
import { ReadonlyActionMatcherDescriptionCollection } from "@reduxjs/toolkit/dist/createReducer";
import { fetchRepo, getRepo } from "../api/GithubApi";
import Timeline from "./Timeline";

export const Home = () => {

  return (
    <Timeline/>
  );
};
