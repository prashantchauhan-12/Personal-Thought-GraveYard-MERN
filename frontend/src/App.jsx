import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [thoughts, setThoughts] = useState([]);
    const [input, setInput] = useState("");
    const [theme, setTheme] = useState("dark"); // dark or light

    const API_URL = "http://localhost:5000/thoughts";

    // READ
    const fetchThoughts = async () => {
        const res = await fetch(API_URL);
        const data = await res.json();
        setThoughts(data);
    };

    useEffect(() => { fetchThoughts(); }, []);

    // CREATE
    const addThought = async () => {
        if (!input) return;
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: input })
        });
        setInput("");
        fetchThoughts();
    };

    // DELETE
    const deleteThought = async (id) => {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchThoughts();
    };

    // TOGGLE THEME
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <div className={`app ${theme}`}>
            <div className="container">
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === "dark" ? "☀️" : "🌙"}
                </button>

                <h1>Digital Graveyard</h1>
                <p className="subtitle">Bury your thoughts here...</p>

                <div className="input-section">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="What's on your mind?"
                    />
                    <button onClick={addThought}> Post Thought</button>
                </div>

                <div className="thoughts-list">
                    {thoughts.length === 0 ? (
                        <p className="empty-state">No thoughts yet. Share your first thought!</p>
                    ) : (
                        thoughts.map(t => (
                            <div key={t._id} className="thought-item">
                                <p className="thought-text">{t.text}</p>
                                <button className="delete-btn" onClick={() => deleteThought(t._id)}>
                                    Bury
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;