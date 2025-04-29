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

    /// http://localhost:8080/grzyby/grzyb_przepis
    @GetMapping("/grzyb_przepis")
    public List<Grzyb_przepis> getAllGrzyb_przepis() {return grzybRepository.getData_grzybPrzepis();}





}
