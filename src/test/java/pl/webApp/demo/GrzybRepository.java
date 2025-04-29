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
        return jdbcTemplate.query("SELECT id, nazwa, nazwa_powszechna, id_obrazek, id_kategoria, opis  FROM grzyb",
                BeanPropertyRowMapper.newInstance(Grzyb.class));
    }

    public Grzyb getGrzyb(int id) {
        return jdbcTemplate.queryForObject("SELECT id, nazwa, nazwa_powszechna, id_obrazek, id_kategoria, opis FROM grzyb WHERE id = ?",
                BeanPropertyRowMapper.newInstance(Grzyb.class), id);
    }

    public int addGrzyby(List<Grzyb> grzyby) {
        grzyby.forEach(grzyb -> {
            jdbcTemplate.update("INSERT INTO grzyby (nazwa, nazwa_powszechna, id_obrazek,id_kategoria,opis) VALUES (?, ?,?,?,?)",
                    grzyb.getNazwa(),grzyb.getNazwa_powszechna(), grzyb.getId_obrazek(), grzyb.getId_kategoria(), grzyb.getOpis());
        });

        return 1;
    }
    /// obsluga tabeli grzyb przepis
    public List<Grzyb_przepis> getData_grzybPrzepis() {
        return jdbcTemplate.query("SELECT id_grzyb, id_przepis FROM grzyb_przepis",
                BeanPropertyRowMapper.newInstance(Grzyb_przepis.class));
    }

    /// obsluga tabeli kategoria itd itd...

}

