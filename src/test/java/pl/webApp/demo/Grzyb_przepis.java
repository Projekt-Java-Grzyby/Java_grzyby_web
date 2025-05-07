package pl.webApp.demo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Grzyb_przepis {
    private int id_grzyb;
    private int id_przepis;

    public int getId_grzyb() {
        return id_grzyb;
    }

    public int getId_przepis() {
        return id_przepis;
    }
}
