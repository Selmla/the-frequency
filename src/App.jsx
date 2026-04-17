import { useState } from "react";
import story from "./story.json";
import Scene from "./Scene";
import Choices from "./Choices";
import "./App.css";


export default function App() {
  const [currentId, setCurrentId] = useState("1"); // starta på scen 1

  const currentScene = story.find(
    (scene) => scene.id === currentId
  );

  if (!currentScene) {
    return <p>Scene not found</p>;
  }

  const isEnding =
    !currentScene.choices ||
    currentScene.choices.every(c => !c.next);

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
          if (!next) return; // gör inget om tom
          setCurrentId(next);
        }}
      />
    </div>

  );
}