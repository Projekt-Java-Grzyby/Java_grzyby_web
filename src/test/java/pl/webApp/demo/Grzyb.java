package pl.webApp.demo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Grzyb {
    private int id;
    private String nazwa;
    private String nazwa_powszechna;
    private int id_obrazek;
    private int id_kategoria;
    private Kategoria kategoria;
    private String opis;
    private String nazwa_zdjecia;

    public void setKategoria(Kategoria kategoria){
        this.kategoria = kategoria;
    }
}