package pl.webApp.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class GrzybRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    /// obsluga tabeli grzyb
    public List<Grzyb> getData() {
        return jdbcTemplate.query("SELECT id, nazwa, nazwa_powszechna, id_obrazek, id_kategoria, opis, nazwa_zdjecia  FROM grzyb",
                BeanPropertyRowMapper.newInstance(Grzyb.class));
    }

    public Grzyb getGrzyb(int id) {
        return jdbcTemplate.queryForObject("SELECT id, nazwa, nazwa_powszechna, id_obrazek, id_kategoria, opis, nazwa_zdjecia FROM grzyb WHERE id = ?",
                BeanPropertyRowMapper.newInstance(Grzyb.class), id);
    }

    public int addGrzyby(List<Grzyb> grzyby) {
        grzyby.forEach(nowy_grzyb -> {
            jdbcTemplate.update("INSERT INTO grzyb (nazwa, nazwa_powszechna, id_obrazek,id_kategoria,opis,nazwa_zdjecia) VALUES (?,?,?,?,?)",
                    nowy_grzyb.getNazwa(),nowy_grzyb.getNazwa_powszechna(), nowy_grzyb.getId_obrazek(), nowy_grzyb.getId_kategoria(), nowy_grzyb.getOpis());
        });

        return 1;
    }
    /// obsluga tabeli grzyb przepis
    public List<Grzyb_przepis> getData_grzybPrzepis() {
        return jdbcTemplate.query("SELECT id_grzyb, id_przepis FROM grzyb_przepis",
                BeanPropertyRowMapper.newInstance(Grzyb_przepis.class));
    }

    public Grzyb_przepis getGrzybPrzepis(int id_grzyb, int id_przepis) {
        return jdbcTemplate.queryForObject("SELECT id_grzyb, id_przepis FROM grzyb_przepis WHERE id_grzyb = ? and id_przepis = ?",
                BeanPropertyRowMapper.newInstance(Grzyb_przepis.class), id_grzyb, id_przepis);
    }

    public Grzyb_przepis getGrzyb_odPrzepis(int id_przepis) {
        return jdbcTemplate.queryForObject("SELECT id_grzyb, id_przepis FROM grzyb_przepis WHERE id_przepis = ?",
                BeanPropertyRowMapper.newInstance(Grzyb_przepis.class), id_przepis);
    }
    public Grzyb_przepis get_przepis_odGrzyb(int id_grzyb) {
        return jdbcTemplate.queryForObject("SELECT id_grzyb, id_przepis FROM grzyb_przepis WHERE id_grzyb = ?",
                BeanPropertyRowMapper.newInstance(Grzyb_przepis.class), id_grzyb);
    }

    public int addGrzybPrzepis(List<Grzyb_przepis> grzyby_przepisy) {
        grzyby_przepisy.forEach(nowy_grzyb_przepis -> {
            jdbcTemplate.update("INSERT INTO GRZYB_PRZEPIS (id_grzyb, id_przepis) VALUES (?,?)",
            nowy_grzyb_przepis.getId_grzyb(), nowy_grzyb_przepis.getId_przepis());
        });

        return 1;
    }


    ///  Obsluga tabeli Kategoria
    public List<Kategoria> getData_kategoria() {
        return jdbcTemplate.query("SELECT id, czy_jadalne, niebezpieczenstwo FROM kategoria",
                BeanPropertyRowMapper.newInstance(Kategoria.class));
    }

    public Kategoria getKategoria(int id) {
        return jdbcTemplate.queryForObject("SELECT id, czy_jadalne, niebezpieczenstwo FROM kategoria WHERE id = ?",
                BeanPropertyRowMapper.newInstance(Kategoria.class), id);
    }

    public int addKategoria(List<Kategoria> kategorie) {
        kategorie.forEach(nowa_kategoria -> {
            jdbcTemplate.update("INSERT INTO KATEGORIA (id, czy_jadalne, niebezpieczenstwo) VALUES (?,?,?)",
                    nowa_kategoria.getId(), nowa_kategoria.getCzy_jadalne(), nowa_kategoria.getNiebezpieczenstwo());
        });

        return 1;
    }


    /// Obsluga tabeli Obrazek
    public List<Obrazek> getData_obrazek() {
        return jdbcTemplate.query("SELECT id, url_obrazka, opis FROM obrazek",
                BeanPropertyRowMapper.newInstance(Obrazek.class));
    }

    public Obrazek getObrazek(int id) {
        return jdbcTemplate.queryForObject("SELECT id, url_obrazka FROM obrazek WHERE id = ?",
                BeanPropertyRowMapper.newInstance(Obrazek.class), id);
    }

    public int addObrazek(List<Obrazek> obrazki) {
        obrazki.forEach(nowy_obrazek -> {
            jdbcTemplate.update("INSERT INTO OBRAZEK (id, url_obrazka, opis) VALUES (?,?,?)",
                    nowy_obrazek.getId(), nowy_obrazek.getUrl_obrazka(), nowy_obrazek.getOpis());
        });

        return 1;
    }


    /// obsluga tabeli Przepis
    public List<Przepis> getData_przepis() {
        return jdbcTemplate.query("SELECT id, opis, nazwa, nazwa_zdjecia, skladniki FROM przepis",
                BeanPropertyRowMapper.newInstance(Przepis.class));
    }

    public Przepis getPrzepis(int id) {
        return jdbcTemplate.queryForObject("SELECT id, opis, nazwa, nazwa_zdjecia, skladniki FROM przepis WHERE id = ?",
                BeanPropertyRowMapper.newInstance(Przepis.class), id);
    }

    public int addPrzepis(List<Przepis> przepisy) {
        przepisy.forEach(nowy_przepis -> {
            jdbcTemplate.update("INSERT INTO przepis (id, opis, nazwa, nazwa_zdjecia, skladniki) VALUES (?,?,?,?,?)",
                    nowy_przepis.getId(),
                    nowy_przepis.getOpis(),
                    nowy_przepis.getNazwa(),
                    nowy_przepis.getNazwa_zdjecia(),
                    nowy_przepis.getSkladniki());
        });
        return 1;
    }

    /// obsluga tabeli kategoria itd itd...

}

