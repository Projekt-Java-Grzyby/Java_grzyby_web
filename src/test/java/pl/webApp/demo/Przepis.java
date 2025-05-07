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
}
