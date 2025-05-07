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
    private int id_obrazek;
    private int id_kategoria;
    private String opis;
}


