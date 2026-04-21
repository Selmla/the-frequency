import { useEffect, useState } from "react";
import Scene from "./Scene";
import Choices from "./Choices";
import "./App.css";
import Editor from "./Editor";
import { getBackgroundImage } from "./storyConfig";

export default function App() {
  const isEditorEnabled = import.meta.env.VITE_ENABLE_EDITOR === "true";
  const [storyData, setStoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentId, setCurrentId] = useState("1");
  const path = window.location.pathname;


  useEffect(() => {
    if (path === "/story-ui") {
      setIsLoading(false);
      return;
    }

    const loadStory = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/story");
        if (!response.ok) {
          throw new Error("Failed to load story");
        }

        const data = await response.json();
        setStoryData(data);
      } catch (err) {
        console.error(err);
        setError("Could not load story data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadStory();
  }, [path]);

  if (path === "/story-ui" && isEditorEnabled) {
    return <Editor />;
  }

  if (path === "/story-ui" && !isEditorEnabled) {
    return <div className="route-message">
      <p>Not found</p>
    </div>;
  }

  if (isLoading) {
    return <p>Loading story...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const currentScene = storyData?.find((scene) => scene.id === currentId);

  if (!currentScene) {
    return <p>Scene not found</p>;
  }

  const bgImage = getBackgroundImage(currentScene?.bg);

  const isEnding =
    !currentScene.choices ||
    currentScene.choices.every(c => !c.next); // kolla om det inte finns några val eller om alla val inte leder någonstans

  if (isEnding) {
    return (
      <div
        className="app-shell"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="app">
          <Scene scene={currentScene} />
          <h1>The End</h1>
          <button onClick={() => setCurrentId("1")}>Start over</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="app-shell"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
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
    </div>
  );
}