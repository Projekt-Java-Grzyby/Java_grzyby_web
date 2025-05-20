package pl.webApp.demo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Obrazek {
    private int id;
    private String url_obrazka;
    private String opis;
}