import React, { useEffect, useState, useRef } from 'react';
import grzybImage from './Grzyb.png';
import grzybImage2 from './Grzyb2.png';
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
    const [sortOrder, setSortOrder] = useState('none');
    const [sortOrderPrzepisy, setSortOrderPrzepisy] = useState('none');
    const [currentPage, setCurrentPage] = useState('home');
    const [kategorie, setKategorie] = useState([]);

    const [form, setForm] = useState({
        nazwa: '',
        nazwa_powszechna: '',
        opis: '',
        zdjecie: null
    });

    const poziomyTrudnosci = {
        1: "Poziom trudności: łatwy",
        2: "Poziom trudności: średni",
        3: "Poziom trudności: trudny",
        4: "Poziom trudności: bardzo trudny"
    };

    function getPoziomTrudnosciText(poziom) {
        return poziomyTrudnosci[poziom] || "brak danych";
    }

    useEffect(() => {
        fetch('http://localhost:8080/grzyby')
            .then(res => res.json())
            .then(data => {
                const oryginalne = data.filter(g => g.czy_oryginalne);
                const moje = data.filter(g => !g.czy_oryginalne);
                setGrzyby(oryginalne);
                setMojeGrzyby(moje);
            })
            .catch(err => console.error('Błąd podczas pobierania grzybów:', err));
    }, []);

    useEffect(() => {
        fetch('http://localhost:8080/grzyby/przepisy')
            .then(res => res.json())
            .then(data => setPrzepisy(data))
            .catch(err => console.error('Błąd podczas pobierania przepisów:', err));
    }, []);

    useEffect(() => {
        fetch('http://localhost:8080/grzyby/kategorie')
            .then(res => res.json())
            .then(data => setKategorie(data))
            .catch(err => console.error(err));
    }, []);

    let sortedGrzyby = [...grzyby];
    if (sortOrder === 'asc') {
        sortedGrzyby.sort((a, b) => (a.powszechnosc ?? 0) - (b.powszechnosc ?? 0));
    } else if (sortOrder === 'desc') {
        sortedGrzyby.sort((a, b) => (b.powszechnosc ?? 0) - (a.powszechnosc ?? 0));
    }
    const grzybyToDisplay = showAllGrzyby ? sortedGrzyby : sortedGrzyby.slice(0, 8);

    let sortedPrzepisy = [...przepisy];
    if (sortOrderPrzepisy === 'asc') {
        sortedPrzepisy.sort((a, b) => (a.poziom_trudnosci ?? 0) - (b.poziom_trudnosci ?? 0));
    } else if (sortOrderPrzepisy === 'desc') {
        sortedPrzepisy.sort((a, b) => (b.poziom_trudnosci ?? 0) - (a.poziom_trudnosci ?? 0));
    }
    const przepisyToDisplay = showAllPrzepisy ? sortedPrzepisy : sortedPrzepisy.slice(0, 4);

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
                                src={`http://localhost:8080/grzyby/${selectedGrzyb.czy_oryginalne ? 'zdjecia' : 'mojezdjecia'}/${selectedGrzyb.nazwa_zdjecia}`}
                                alt={selectedGrzyb.nazwa_powszechna}
                                className="detail-image clickable"
                                onClick={() =>
                                    setFullscreenImage(`http://localhost:8080/grzyby/${selectedGrzyb.czy_oryginalne ? 'zdjecia' : 'mojezdjecia'}/${selectedGrzyb.nazwa_zdjecia}`)
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

    if (currentPage === 'mojeGrzyby') {
        return (
            <div className="App detail-container">
                <button className="cssbuttons-io" onClick={() => setCurrentPage('home')}>
                    <span>← Powrót do strony głównej</span>
                </button>
                <h2>Moje Grzyby</h2>
                <div className="grzyb-list">
                    {mojeGrzyby.length > 0 ? mojeGrzyby.map(grzyb => (
                        <div
                            key={grzyb.id}
                            className="grzyb-card"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedGrzyb(grzyb)}
                        >
                            {grzyb.nazwa_zdjecia && (
                                <img
                                    src={`http://localhost:8080/grzyby/mojezdjecia/${grzyb.nazwa_zdjecia}`}
                                    alt={grzyb.nazwa_powszechna}
                                    className="grzyb-image"
                                />
                            )}
                            <div className="grzyb-name">{grzyb.nazwa_powszechna}</div>
                            {fullscreenImage && (
                                <div className="fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
                                    <img src={fullscreenImage} alt="fullscreen" className="fullscreen-image" />
                                </div>
                            )}
                        </div>
                    )) : <p>Brak dodanych grzybów.</p>}
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
                <h3 className="common-name">({getPoziomTrudnosciText(selectedPrzepis.poziom_trudnosci)})</h3>
                <div className="detail-content">
                    {selectedPrzepis.nazwa_zdjecia && (
                        <img
                            src={`http://localhost:8080/grzyby/zdjecia/${selectedPrzepis.nazwa_zdjecia}`}
                            alt={selectedPrzepis.nazwa}
                            className="detail-image clickable"
                            onClick={() => setFullscreenImage(`http://localhost:8080/grzyby/zdjecia/${selectedPrzepis.nazwa_zdjecia}`)}
                        />
                    )}
                    <div className="detail-przepis-description">
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
            formData.append('kategoria_id', form.kategoria_id);
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
            <div className="App detail-container">
                <button
                    className="cssbuttons-io"
                    onClick={() => setShowAddForm(false)}
                >
                    <span>← Powrót do grzybów</span>
                </button>
                <div className="App add-form">
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

                        <label>
                            Wybierz kategorię:
                            <select
                                value={form.kategoria_id || ''}
                                onChange={(e) => setForm({ ...form, kategoria_id: Number(e.target.value) })}
                                required
                            >
                                <option value="">Wybierz</option>
                                {kategorie.map(kategoria => (
                                    <option key={kategoria.id} value={kategoria.id}>
                                        {`Jadalne: ${kategoria.czy_jadalne ? 'Tak' : 'Nie'}, Niebezpieczeństwo: ${kategoria.niebezpieczenstwo}`}
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
                    }} style={{ cursor: 'pointer' }}
                    >Dodaj Grzyba</a>
                    <a onClick={() => {
                        setShowAddForm(false);
                        setSelectedGrzyb(null);
                        setSelectedPrzepis(null);
                        setCurrentPage('mojeGrzyby');
                    }}style={{ cursor: 'pointer' }}
                    >Moje Grzyby</a>
                </div>
            </div>

            <div className="slide-in-container">
                <div className="slide-left">
                    Witaj w atlasie grzybów!
                    <p className="slide-subtext">Znajdziesz tu przeróżne informacje o setkach gatunków grzybów, od tych popularnych, aż po te rzadsze i bardziej egzotyczne. Każdy opis zawiera szczegółowe informacje o ich cechach charakterystycznych, które pomogą Ci bezpiecznie rozpoznać dany gatunek. Dodatkowo poznasz właściwości kulinarne i ewentualne potrawy, które możesz przygotować z grzybów, we własnym mieszkaniu. Ten atlas to doskonałe źródło wiadomości dla każdego miłośnika przyrody — zarówno dla początkujących grzybiarzy, jak i doświadczonych znawców.</p>
                </div>
                <div className="slide-right">
                    Poznaj fascynujący świat grzybów
                    <p className="slide-subtext">Grzyby to niezwykłe organizmy, które łączą w sobie zarówno cenione przysmaki, jak i groźne trucizny. Zadziwiają swoją budową, unikalnym sposobem odżywiania oraz różnorodnością form i barw. Ich znaczenie w przyrodzie jest nie do przecenienia – odgrywają istotną rolę w funkcjonowaniu całych ekosystemów.</p>
                </div>
                <div className="mushroom-image-wrapper">
                    <img src={grzybImage} alt="Grzyb" className="overlapping-mushroom show" />
                </div>
                <div className="mushroom-image-wrapper">
                    <img src={grzybImage2} alt="Grzyb2" className="overlapping-mushroom show left-top" />
                </div>
            </div>

            <div id="grzyby" className="grzyb-section">
                <h2 className="grzyb-title">Grzyby</h2>
                <div className="sort-buttons">
                    <button className="sort-button" onClick={() => setSortOrder('asc')}>
                        Sortuj rosnąco (powszechność)
                    </button>
                    <div className="sort-divider" />
                    <button className="sort-button" onClick={() => setSortOrder('desc')}>
                        Sortuj malejąco (powszechność)
                    </button>
                    <div className="sort-divider" />
                    <button className="sort-button" onClick={() => setSortOrder('none')}>
                        Resetuj sortowanie
                    </button>
                </div>
                <div id="grzyby-list" className="grzyb-list" ref={grzybyRef}>
                    {grzybyToDisplay.map((grzyb) => (
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
                <div className="sort-buttons">
                    <button className="sort-button" onClick={() => setSortOrderPrzepisy('asc')}>
                        Sortuj rosnąco (trudność)
                    </button>
                    <div className="sort-divider" />
                    <button className="sort-button" onClick={() => setSortOrderPrzepisy('desc')}>
                        Sortuj malejąco (trudność)
                    </button>
                    <div className="sort-divider" />
                    <button className="sort-button" onClick={() => setSortOrderPrzepisy('none')}>
                        Resetuj sortowanie
                    </button>
                </div>
                <div className="przepisy-list">
                    {przepisyToDisplay.map((przepis) => (
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