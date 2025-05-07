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
    private String opis;

    public String getNazwa(){
        return nazwa;
    }
    public String getNazwa_powszechna(){
        return nazwa_powszechna;
    }
    public int getId_obrazek(){
        return id_obrazek;
    }
    public int getId_kategoria(){
        return id_kategoria;
    }
    public String getOpis(){
        return opis;
    }
}


