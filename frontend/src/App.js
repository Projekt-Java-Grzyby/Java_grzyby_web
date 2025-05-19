import React, { useEffect, useState } from 'react';
import './App.css';


function App() {
    const [grzyby, setGrzyby] = useState([]);
    const [przepisy, setPrzepisy] = useState([]);
    const [selectedPrzepis, setSelectedPrzepis] = useState(null);
    const [selectedGrzyb, setSelectedGrzyb] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/grzyby/przepisy')
            .then(res => res.json())
            .then(data => setPrzepisy(data.slice(0, 2)))
            .catch(err => console.error('Błąd podczas pobierania przepisów:', err));
    }, []);

    useEffect(() => {
        fetch('http://localhost:8080/grzyby')
            .then((res) => res.json())
            .then((data) => setGrzyby(data))
            .catch((err) => console.error('Błąd podczas pobierania grzybów:', err));
    }, []);

    function truncateText(text, maxLength = 100) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

    if (selectedPrzepis) {
        return (
            <div className="App" style={{ padding: '2rem' }}>
                <button className="cssbuttons-io" onClick={() => setSelectedPrzepis(null)}>
                    <span>← Powrót do przepisów</span>
                </button>
                <h2>{selectedPrzepis.tytul}</h2>
                <p>{selectedPrzepis.opis}</p>
            </div>
        );
    }

    if (selectedGrzyb) {
        return (
            <div className="App" style={{ padding: '2rem' }}>
                <button className="cssbuttons-io" onClick={() => setSelectedGrzyb(null)}>
                    <span>← Powrót do grzybów</span>
                </button>
                <h2>{selectedGrzyb.nazwa_powszechna}</h2>
                {selectedGrzyb.nazwa_zdjecia && (
                    <img
                        src={`http://localhost:8080/grzyby/zdjecia/${selectedGrzyb.nazwa_zdjecia}`}
                        alt={selectedGrzyb.nazwa_powszechna}
                        style={{ maxWidth: '100%', borderRadius: '10px', marginTop: '1rem' }}
                    />
                )}
                <p style={{ marginTop: '1rem' }}>{selectedGrzyb.opis || 'Brak opisu.'}</p>
            </div>
        );
    }

    return (
        <div className="App">
            <div className="navbar">
                <h1>Atlas Grzybów</h1>
                <div className="nav-links">
                    <a href="#grzyby">Spis Grzybów</a>
                    <a href="#przepisy">Przepisy</a>
                </div>
            </div>

            <div id="grzyby" className="grzyb-list">
                {grzyby.map((grzyb) => (
                    <div
                        key={grzyb.id}
                        className="grzyb-card"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedGrzyb(grzyb)}
                    >
                        {grzyb.nazwa_zdjecia && (
                            <img
                                src={`http://localhost:8080/grzyby/zdjecia/${grzyb.nazwa_zdjecia}`}
                                alt={grzyb.nazwa_powszechna}
                                className="grzyb-image"
                            />
                        )}
                        <div className="grzyb-name">{grzyb.nazwa_powszechna}</div>
                    </div>
                ))}
            </div>

            <div id="przepisy" className="przepisy-section">
                <h2>Przepisy</h2>
                <div className="przepisy-list">
                    {przepisy.map((przepis) => (
                        <div
                            key={przepis.id}
                            className="przepis-card"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedPrzepis(przepis)}
                        >
                            <h3>{przepis.tytul}</h3>
                            <p>
                                {truncateText(przepis.opis)}{' '}
                                <span style={{ color: 'lightblue', textDecoration: 'underline' }}>
                                    czytaj więcej...
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="footer">
                &copy; 2025 Atlas Grzybów. Wszelkie prawa zastrzeżone.
            </div>
        </div>
    );
}

export default App;
