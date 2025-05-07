package pl.webApp.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
/// crossOrigin udostępnia front-endowi, zmienić port jeśli nie pasuje
@CrossOrigin(origins = "http://localhost:3000")
@RestController
///aby zobaczyć tabele z grzybami:
/// http://localhost:8080/grzyby
@RequestMapping("/grzyby")
public class GrzybController {

    @Autowired
    private GrzybRepository grzybRepository;

    @GetMapping()
    public List<Grzyb> getAllGrzyby() {
        return grzybRepository.getData();
    }

    /// http://localhost:8080/grzyby/1
    @GetMapping("/{id}")
    public Grzyb getGrzybById(@PathVariable("id") int id) {
        return grzybRepository.getGrzyb(id);
    }

    @PostMapping()
    public int addGrzyb(@RequestBody List<Grzyb> grzyby) {
        return grzybRepository.addGrzyby(grzyby);
    }

    @GetMapping("/przepis")
    public List<Przepis> getAllPrzepis() {return grzybRepository.getData_przepis();}

    @GetMapping("/przepis/{id}")
    public Przepis getPrzepis(@PathVariable("id") int id) {return grzybRepository.getPrzepis(id);}

    @PostMapping()
    public int addPrzepis(@RequestBody List<Przepis> przepisy) {return grzybRepository.addPrzepisy(przepisy);}

    /// http://localhost:8080/grzyby/grzyb_przepis
    @GetMapping("/grzyb_przepis")
    public List<Grzyb_przepis> getAllGrzyb_przepis() {return grzybRepository.getData_grzybPrzepis();}

    @GetMapping("/grzyb_przepis/{id}")
    public Grzyb_przepis getGrzyb_przepisPoGrzyb(@PathVariable("id") int id) {return grzybRepository.getGrzybPrzepisPoGrzyb(id);}

    @GetMapping("/przepis/grzyb_przepis/{id}")
    public Grzyb_przepis getGrzyb_przepisPoPrzepis(@PathVariable("id") int id) {return grzybRepository.getGrzybPrzepisPoPrzepis(id);}

    @PostMapping()
    public int addGrzyb_przepis(@RequestBody List<Grzyb_przepis> grzybPrzepis) {return grzybRepository.addGrzybPrzepis(grzybPrzepis);}

    @GetMapping("/kategoria")
    public List<Kategoria> getAllKategoria() {return grzybRepository.getData_kategoria();}

    @GetMapping("/kategoria/{id}")
    public Kategoria getKategoria(@PathVariable("id") int id) {return grzybRepository.getKategoria(id);}

    @PostMapping()
    public int addKategoria(@RequestBody List<Kategoria> kategorie) {return grzybRepository.addKategorie(kategorie);}


}
