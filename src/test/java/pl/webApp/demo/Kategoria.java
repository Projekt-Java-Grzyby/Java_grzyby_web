package pl.webApp.demo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Kategoria {
    private int id;
    private Boolean czy_jadalne;
    private String niebezpieczenstwo;
}
