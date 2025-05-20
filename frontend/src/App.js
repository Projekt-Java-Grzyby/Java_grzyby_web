import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [grzyby, setGrzyby] = useState([]);
    const [przepisy, setPrzepisy] = useState([]);
    const [selectedPrzepis, setSelectedPrzepis] = useState(null);
    const [selectedGrzyb, setSelectedGrzyb] = useState(null);
    const [fullscreenImage, setFullscreenImage] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/grzyby/przepisy')
            .then(res => res.json())
            .then(data => setPrzepisy(data))
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

    if (selectedGrzyb) {
        return (
            <div className="App detail-container">
                <button className="cssbuttons-io" onClick={() => setSelectedGrzyb(null)}>
                    <span>← Powrót do grzybów</span>
                </button>

                <h2>{selectedGrzyb.nazwa}</h2>
                <h3 className="common-name">({selectedGrzyb.nazwa_powszechna})</h3>

                <div className="detail-content">
                    {selectedGrzyb.nazwa_zdjecia && (
                        <img
                            src={`http://localhost:8080/grzyby/zdjecia/${selectedGrzyb.nazwa_zdjecia}`}
                            alt={selectedGrzyb.nazwa_powszechna}
                            className="detail-image clickable"
                            onClick={() => setFullscreenImage(`http://localhost:8080/grzyby/zdjecia/${selectedGrzyb.nazwa_zdjecia}`)}
                        />
                    )}
                    <p className="detail-description">
                        {selectedGrzyb.opis || 'Brak opisu.'}
                    </p>

                    {fullscreenImage && (
                        <div className="fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
                            <img
                                src={fullscreenImage}
                                alt="fullscreen"
                                className="fullscreen-image"
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (selectedPrzepis) {
        const skladnikiArray = selectedPrzepis.skladniki
            ? selectedPrzepis.skladniki.split(';').map(s => s.trim())
            : [];

        return (
            <div className="App detail-container">
                <button className="cssbuttons-io" onClick={() => setSelectedPrzepis(null)}>
                    <span>← Powrót do przepisów</span>
                </button>

                <h2>{selectedPrzepis.nazwa}</h2>

                <div className="detail-content">
                    {selectedPrzepis.nazwa_zdjecia && (
                        <img
                            src={`http://localhost:8080/grzyby/zdjecia/${selectedPrzepis.nazwa_zdjecia}`}
                            alt={selectedPrzepis.nazwa}
                            className="detail-image clickable"
                            onClick={() => setFullscreenImage(`http://localhost:8080/grzyby/zdjecia/${selectedPrzepis.nazwa_zdjecia}`)}
                        />
                    )}

                    <div className="detail-description">
                        <p>{selectedPrzepis.opis || "Brak opisu."}</p>

                        <h3>Składniki:</h3>
                        <ul>
                            {skladnikiArray.map((skladnik, index) => (
                                <li key={index}>{skladnik}</li>
                            ))}
                        </ul>
                    </div>

                    {fullscreenImage && (
                        <div className="fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
                            <img
                                src={fullscreenImage}
                                alt="fullscreen"
                                className="fullscreen-image"
                            />
                        </div>
                    )}
                </div>
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
                            {przepis.nazwa_zdjecia && (
                                <img
                                    src={`http://localhost:8080/grzyby/zdjecia/${przepis.nazwa_zdjecia}`}
                                    alt={przepis.nazwa}
                                    className="przepis-image"
                                />
                            )}
                            <h2 className="przepis-title">{przepis.nazwa}</h2>
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