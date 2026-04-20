import { useState } from "react";
import story from "./story.json";
import Scene from "./Scene";
import Choices from "./Choices";
import "./App.css";
import Editor from "./Editor";

export default function App() {
  const [currentId, setCurrentId] = useState("1");
  const path = window.location.pathname;

  if (path === "/story-ui") {
    return <Editor />;
  }

  const currentScene = story.find(
    (scene) => scene.id === currentId
  );

  if (!currentScene) {
    return <p>Scene not found</p>;
  }

  const isEnding =
    !currentScene.choices ||
    currentScene.choices.every(c => !c.next); // kolla om det inte finns några val eller om alla val inte leder någonstans

  if (isEnding) {
    return (
      <div className="app">
        <Scene scene={currentScene} />
        <h1>The End</h1>
        <button onClick={() => setCurrentId("1")}>Start over</button>
      </div>
    );
  }

  return (
    <div className="app">
      <Scene scene={currentScene} />
      <Choices
        choices={currentScene.choices}
        onChoice={(next) => {
          if (!next) return;
          setCurrentId(next);
        }}
      />
    </div>
  );
}