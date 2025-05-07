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
        return jdbcTemplate.query("SELECT * FROM grzyb",
                BeanPropertyRowMapper.newInstance(Grzyb.class));
    }

    public Grzyb getGrzyb(int id) {
        return jdbcTemplate.queryForObject("SELECT id, nazwa, nazwa_powszechna, id_obrazek, id_kategoria, opis FROM grzyb WHERE id = ?",
                BeanPropertyRowMapper.newInstance(Grzyb.class), id);
    }

    public int addGrzyby(List<Grzyb> grzyby) {
        grzyby.forEach(grzyb -> {
            jdbcTemplate.update("INSERT INTO grzyb (nazwa, nazwa_powszechna, id_obrazek,id_kategoria,opis) VALUES (?, ?,?,?,?)",
                    grzyb.getNazwa(),grzyb.getNazwa_powszechna(), grzyb.getId_obrazek(), grzyb.getId_kategoria(), grzyb.getOpis());
        });

        return 1;
    }

    ///obsluga tabeli przepis
    public List<Przepis> getData_przepis() {
        return jdbcTemplate.query("SELECT * FROM przepis",
                BeanPropertyRowMapper.newInstance(Przepis.class));
    }

    public Przepis getPrzepis(int id) {
        return jdbcTemplate.queryForObject("SELECT * FROM przepis WHERE id = ?",
                BeanPropertyRowMapper.newInstance(Przepis.class), id);
    }

    public int addPrzepisy(List<Przepis> przepisy) {
        przepisy.forEach(przepis -> {
            jdbcTemplate.update("INSERT INTO przepis (nazwa, opis) VALUES (?, ?,?,?,?)",
                    przepis.getNazwa(),przepis.getOpis());
        });
        return 1;
    }

    /// obsluga tabeli grzyb przepis
    public List<Grzyb_przepis> getData_grzybPrzepis() {
        return jdbcTemplate.query("SELECT id_grzyb, id_przepis FROM grzyb_przepis",
                BeanPropertyRowMapper.newInstance(Grzyb_przepis.class));
    }

    public Grzyb_przepis getGrzybPrzepisPoGrzyb(int idGrzyba) {
        return jdbcTemplate.queryForObject("SELECT * FROM grzyb_przepis WHERE id_grzyb = ?",
                BeanPropertyRowMapper.newInstance(Grzyb_przepis.class), idGrzyba);
    }
    public Grzyb_przepis getGrzybPrzepisPoPrzepis(int idPrzepisu) {
        return jdbcTemplate.queryForObject("SELECT * FROM grzyb_przepis WHERE id_przepis = ?",
                BeanPropertyRowMapper.newInstance(Grzyb_przepis.class), idPrzepisu);
    }

    public int addGrzybPrzepis(List<Grzyb_przepis> grzybPrzepis) {
        grzybPrzepis.forEach(grzybPrzepis1 -> {
            jdbcTemplate.update("INSERT INTO grzyb_przepis (id_grzyb, id_przepis) VALUES (?, ?,?,?,?)",
                    grzybPrzepis1.getId_grzyb(),grzybPrzepis1.getId_przepis());
        });
        return 1;
    }

    ///obsluga tabeli kategoria

    public List<Kategoria> getData_kategoria() {
        return jdbcTemplate.query("SELECT * FROM kategoria",
                BeanPropertyRowMapper.newInstance(Kategoria.class));
    }

    public Kategoria getKategoria(int id) {
        return jdbcTemplate.queryForObject("SELECT * FROM kategoria WHERE id = ?",
                BeanPropertyRowMapper.newInstance(Kategoria.class), id);
    }

    public int addKategorie(List<Kategoria> kategorie) {
        kategorie.forEach(kategoria -> {
            jdbcTemplate.update("INSERT INTO przepis (nazwa, opis) VALUES (?, ?,?,?,?)",
                    kategoria.getCzyJadalne(),kategoria.getNiebezpieczenstwo());
        });
        return 1;
    }


    /// obsluga tabeli kategoria itd itd...

}

