import React, { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
    const [grzyby, setGrzyby] = useState([]);
    const [przepisy, setPrzepisy] = useState([]);
    const [selectedPrzepis, setSelectedPrzepis] = useState(null);
    const [showAllPrzepisy, setShowAllPrzepisy] = useState(false);
    const [selectedGrzyb, setSelectedGrzyb] = useState(null);
    const [fullscreenImage, setFullscreenImage] = useState(null);
    const [showAllGrzyby, setShowAllGrzyby] = useState(false);
    const grzybyRef = useRef(null);
    const przepisyRef = useRef(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [mojeGrzyby, setMojeGrzyby] = useState([]);
    const [form, setForm] = useState({
        nazwa: '',
        nazwa_powszechna: '',
        opis: '',
        zdjecie: null
    });

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

    if (selectedGrzyb) {
        return (
            <div className="App detail-container">
                <button className="cssbuttons-io" onClick={() => setSelectedGrzyb(null)}>
                    <span>← Powrót do grzybów</span>
                </button>

                <h2>{selectedGrzyb.nazwa}</h2>
                <h3 className="common-name">({selectedGrzyb.nazwa_powszechna})</h3>

                <div className="detail-content" style={{ display: 'flex', gap: '3rem' }}>
                    <div className="left-column" style={{ flex: '0 0 400px' }}>
                        {selectedGrzyb.nazwa_zdjecia && (
                            <img
                                src={`http://localhost:8080/grzyby/zdjecia/${selectedGrzyb.nazwa_zdjecia}`}
                                alt={selectedGrzyb.nazwa_powszechna}
                                className="detail-image clickable"
                                onClick={() =>
                                    setFullscreenImage(`http://localhost:8080/grzyby/zdjecia/${selectedGrzyb.nazwa_zdjecia}`)
                                }
                                style={{ width: '100%', borderRadius: '10px' }}
                            />
                        )}

                        <div className="extra-info-box" style={{ marginTop: '1rem' }}>
                            <ul style={{ paddingLeft: '1.2rem' }}>
                                <li>
                                    <strong>Jadalny:</strong>{' '}
                                    {String(selectedGrzyb.kategoria?.czy_jadalne).toLowerCase() === 'true' ? 'Tak' : 'Nie'}
                                </li>
                                <li>
                                    <strong>Niebezpieczeństwo:</strong>{' '}
                                    {selectedGrzyb.kategoria?.niebezpieczenstwo ?? 'Brak danych'}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="right-column" style={{ flex: 1 }}>
                        <p className="detail-description">
                            {selectedGrzyb.opis || 'Brak opisu.'}
                            {selectedGrzyb.powszechnosc || 'Brak p.'}
                        </p>
                    </div>

                    {fullscreenImage && (
                        <div className="fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
                            <img src={fullscreenImage} alt="fullscreen" className="fullscreen-image" />
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
                <button
                    className="cssbuttons-io"
                    onClick={() => {
                        setSelectedPrzepis(null);
                        setTimeout(() => {
                            przepisyRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }, 0);
                    }}
                >
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
    if (showAddForm) {
        const handleSubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('nazwa', form.nazwa);
            formData.append('nazwa_powszechna', form.nazwa_powszechna);
            formData.append('opis', form.opis);
            formData.append('powszechnosc', form.powszechnosc || '1');
            formData.append('czy_oryginalne', 'false');
            formData.append('zdjecie', form.zdjecie);

            try {
                const res = await fetch('http://localhost:8080/grzyby/addgrzyb', {
                    method: 'POST',
                    body: formData
                });

                if (res.ok) {
                    alert('Grzyb dodany!');
                    setShowAddForm(false);
                } else {
                    alert('Błąd dodawania grzyba');
                }
            } catch (error) {
                console.error(error);
            }
        };

        return (
            <div className="App add-form">
                <button
                    className="cssbuttons-io"
                    onClick={() => setShowAddForm(false)}
                >
                    <span>← Powrót do grzybów</span>
                </button>

                <h2>Dodaj nowego grzyba</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <input
                        type="text"
                        placeholder="Nazwa łacińska"
                        value={form.nazwa}
                        onChange={(e) => setForm({ ...form, nazwa: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Nazwa powszechna"
                        value={form.nazwa_powszechna}
                        onChange={(e) => setForm({ ...form, nazwa_powszechna: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Opis"
                        value={form.opis}
                        onChange={(e) => setForm({ ...form, opis: e.target.value })}
                        required
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setForm({ ...form, zdjecie: e.target.files[0] })}
                        required
                    />

                    <label>
                        Powszechność (1-10):
                        <select
                            value={form.powszechnosc || '1'}
                            onChange={(e) => setForm({ ...form, powszechnosc: e.target.value })}
                            required
                        >
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                    </label>

                    <input
                        type="hidden"
                        value="false"
                        readOnly
                    />
                    <button type="submit">Dodaj</button>
                </form>
            </div>
        );
    }

    if (mojeGrzyby.length > 0) {
        return (
            <div className="App">
                <h2>Moje Grzyby</h2>
                <div className="grzyb-list">
                    {mojeGrzyby.map(grzyb => (
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
                    <a onClick={() => {
                        setShowAddForm(true);
                        setSelectedGrzyb(null);
                        setSelectedPrzepis(null);
                    }}>Dodaj Grzyba</a>
                    <a onClick={() => {
                        setMojeGrzyby(grzyby.filter(g => g.uzytkownik === true)); // zakładamy, że `uzytkownik` to true dla własnych
                        setShowAddForm(false);
                        setSelectedGrzyb(null);
                        setSelectedPrzepis(null);
                    }}>Moje Grzyby</a>
                </div>
            </div>

            <div id="grzyby" className="grzyb-section">
                <h2 className="grzyb-title">Grzyby</h2>
                <div id="grzyby-list" className="grzyb-list" ref={grzybyRef}>
                {(showAllGrzyby ? grzyby : grzyby.slice(0, 8)).map((grzyb) => (
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
            </div>
            {grzyby.length > 8 && (
                <div className="show-more-container">
                    <button
                        className="show-more-button"
                        onClick={() => {
                            setShowAllGrzyby(prev => {
                                const newValue = !prev;
                                if (!newValue && grzybyRef.current) {
                                    grzybyRef.current.scrollIntoView({ behavior: 'smooth' });
                                }
                                return newValue;
                            });
                        }}
                    >
                        {showAllGrzyby ? 'Zwiń' : 'Zobacz więcej'}
                    </button>
                </div>
            )}

            <div id="przepisy" className="przepisy-section" ref={przepisyRef}>
            <h2 className="grzyb-title">Przepisy</h2>
                <div className="przepisy-list">
                    {(showAllPrzepisy ? przepisy : przepisy.slice(0, 6)).map((przepis) => (
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

            {przepisy.length > 6 && (
                <div className="show-more-container">
                    <button
                        className="show-more-button"
                        onClick={() => {
                            setShowAllPrzepisy(prev => {
                                const newValue = !prev;
                                if (!newValue && przepisyRef.current) {
                                    przepisyRef.current.scrollIntoView({ behavior: 'smooth' });
                                }
                                return newValue;
                            });
                        }}
                    >
                        {showAllPrzepisy ? 'Zwiń' : 'Zobacz więcej'}
                    </button>
                </div>
            )}

            <div className="footer">
                &copy; 2025 Atlas Grzybów. Wszelkie prawa zastrzeżone.
            </div>
        </div>
    );
}

export default App;