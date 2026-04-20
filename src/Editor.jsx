import { useEffect, useState } from "react";
import "./App.css";
import { BACKGROUNDS, DEFAULT_BG } from "./storyConfig";

export default function Editor() {
    const [storyData, setStoryData] = useState([]); // Start with empty array to avoid null checks
    const [selectedId, setSelectedId] = useState("1"); // Default to "1" or first scene's id after loading
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(""); // For error messages

    useEffect(() => {
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

                if (data.length > 0) {
                    setSelectedId(data[0].id);
                }
            } catch (err) {
                console.error(err);
                setError("Could not load story data.");
            } finally {
                setIsLoading(false);
            }
        };

        loadStory();
    }, []);

    const currentScene = storyData.find((s) => s.id === selectedId);
    const currentIndex = storyData.findIndex((s) => s.id === selectedId);

    const updateBackground = (newBg) => {
        const updated = storyData.map((scene) => {
            if (scene.id !== selectedId) return scene;

            return { ...scene, bg: newBg };
        });

        setStoryData(updated);
    };

    const updateParagraph = (index, value) => {
        const updated = storyData.map((scene) => {
            if (scene.id !== selectedId) return scene;

            const newContent = [...scene.content];
            newContent[index] = { ...newContent[index], text: value };

            return { ...scene, content: newContent };
        });

        setStoryData(updated);
    };

    const deleteParagraph = (index) => {
        const updated = storyData.map((scene) => {
            if (scene.id !== selectedId) return scene;

            const newContent = [...scene.content];
            newContent.splice(index, 1);

            return { ...scene, content: newContent };
        });

        setStoryData(updated);
    };

    const addParagraph = () => {
        const updated = storyData.map((scene) => {
            if (scene.id !== selectedId) return scene;

            return {
                ...scene,
                content: [...scene.content, { type: "paragraph", text: "" }],
            };
        });

        setStoryData(updated);
    };

    const saveStory = async () => {
        try {
            const response = await fetch("/api/story", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(storyData),
            });

            if (!response.ok) {
                throw new Error("Failed to save story");
            }

            alert("Story saved successfully!");
        } catch (err) {
            console.error("Could not save story data.");
            alert("Failed to save story.");
        }
    };


    const goNext = () => {
        if (currentIndex < storyData.length - 1) {
            setSelectedId(storyData[currentIndex + 1].id);
        }
    };

    const goPrev = () => {
        if (currentIndex > 0) {
            setSelectedId(storyData[currentIndex - 1].id);
        }
    };

    if (isLoading) return <p>Loading story...</p>;
    if (error) return <p>{error}</p>;
    if (!currentScene) return <p>No scene found.</p>;

    return (
        <div className="editor">
            <select
                className="editor-select"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
            >
                {storyData.map((scene) => (
                    <option key={scene.id} value={scene.id}>
                        {scene.id} - {scene.name}
                    </option>
                ))}
            </select>

            <input
                className="editor-search"
                placeholder="Go to id..."
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setSelectedId(e.target.value);
                    }
                }}
            />

            <hr />

            <p>
                <strong>ID:</strong> {currentScene.id}
            </p>
            <p>
                <strong>Name:</strong> {currentScene.name}
            </p>

            <div className="editor-bg-row">
                <label className="editor-bg-label" htmlFor="bg-select">
                    <strong>Background:</strong>
                </label>

                <select
                    id="bg-select"
                    className="editor-select"
                    value={currentScene.bg || DEFAULT_BG}
                    onChange={(e) => updateBackground(e.target.value)}
                >
                    {Object.entries(BACKGROUNDS).map(([bgId, bg]) => (
                        <option key={bgId} value={bgId}>
                            {bg.label}
                        </option>
                    ))}
                </select>

                <div className="editor-bg-preview">
                    <img
                        src={BACKGROUNDS[currentScene.bg || DEFAULT_BG]?.image}
                        alt="Background preview"
                    />
                </div>


            </div>

            {currentScene.content.map((item, index) => (
                <div key={index} className="editor-paragraph">
                    <textarea
                        className="editor-textarea"
                        value={item.text}
                        onChange={(e) => updateParagraph(index, e.target.value)}
                    />

                    <button
                        className="editor-icon-btn editor-delete-inline"
                        onClick={() => deleteParagraph(index)}
                        aria-label="Delete paragraph"
                        title="Delete paragraph"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="currentColor"
                        >
                            <path d="M280-440h400v-80H280v80ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                        </svg>
                    </button>
                </div>
            ))}

            <div className="editor-add-row">
                <button
                    className="editor-icon-btn"
                    onClick={addParagraph}
                    aria-label="Add paragraph"
                    title="Add paragraph"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                        <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                    </svg>
                </button>
            </div>

            <div className="editor-nav">
                <button onClick={goPrev} disabled={currentIndex === 0}>
                    ← Prev
                </button>

                <button
                    onClick={goNext}
                    disabled={currentIndex === storyData.length - 1}
                >
                    Next →
                </button>

                <button onClick={saveStory} className="editor-save-btn">
                    Save Story
                </button>
            </div>
        </div>
    );
}