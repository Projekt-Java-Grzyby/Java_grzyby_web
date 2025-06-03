package pl.webApp.demo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Przepis {
    private int id;
    private String opis;
    private String nazwa;
    private String nazwa_zdjecia;
    private String skladniki;
    private int poziom_trudnosci;
    private String poziomTrudnosciTekst;

    public void setPoziomTrudnosciTekst(String tekst) {this.poziomTrudnosciTekst = tekst;}

    public String getPoziomTrudnosciTekst() {return poziomTrudnosciTekst;}

}