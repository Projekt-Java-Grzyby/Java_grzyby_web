import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [grzyby, setGrzyby] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/grzyby')
            .then((res) => res.json())
            .then((data) => setGrzyby(data))
            .catch((err) => console.error('Błąd podczas pobierania grzybów:', err));
    }, []);

    return (
        <div className="App">
            <div className="navbar">
                <h1>Atlas Grzybów</h1>
                <div className="nav-links">
                    <a href="#">Spis</a>
                    <a href="#">Grzybów</a>
                    <a href="#">Przepisy</a>
                    <a href="#">Kontakt</a>
                </div>
            </div>

            <div className="grzyb-list">
                {grzyby.map((grzyb) => (
                    <div key={grzyb.id} className="grzyb-card">
                        <h3>{grzyb.nazwa_powszechna}</h3>
                        {grzyb.nazwa_zdjecia && (
                            <img
                                src={`http://localhost:8080/grzyby/zdjecia/${grzyb.nazwa_zdjecia}`}
                                alt={grzyb.nazwa_powszechna}
                                className="grzyb-image"
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="footer">
                &copy; 2025 Atlas Grzybów. Wszelkie prawa zastrzeżone.
            </div>
        </div>
    );
}

export default App;
