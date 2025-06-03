package pl.webApp.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.net.MalformedURLException;


import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    @ResponseBody
    public List<Grzyb> getAllGrzyby() {
        return grzybRepository.getData();
    }

    @GetMapping("/mojegrzyby")
    @ResponseBody
    public List<Grzyb> getMojeGrzyby() {
        return grzybRepository.getMojeGrzyby();
    }

    /// http://localhost:8080/grzyby/1
    @GetMapping("/{id}")
    public Grzyb getGrzybById(@PathVariable("id") int id) {
        return grzybRepository.getGrzyb(id);
    }

    @GetMapping("/obrazek")
    public List<Obrazek> getAllObrazki() {
        return grzybRepository.getData_obrazek();
    }
//    @PostMapping()
//    public int addGrzyb(@RequestBody List<Grzyb> grzyby) {
//        return grzybRepository.addGrzyby(grzyby);
//    }

    @GetMapping("/obrazek/{id}")
    public Obrazek getObrazekById(@PathVariable("id") int id) {
        return grzybRepository.getObrazek(id);
    }

    @GetMapping("/przepisy")
    public List<Przepis> getAllPrzepisy() {
        List<Przepis> przepisy = grzybRepository.getData_przepis();

        Map<Integer, String> poziomyTrudnosci = Map.of(
                1, "łatwe",
                2, "średnie",
                3, "trudne",
                4, "bardzo trudne"
        );

        for (Przepis p : przepisy) {
            p.setPoziomTrudnosciTekst(poziomyTrudnosci.getOrDefault(p.getPoziom_trudnosci(), "brak danych"));
        }

        return przepisy;
    }
    /// http://localhost:8080/grzyby/grzyb_przepis
    @GetMapping("/grzyb_przepis")
    public List<Grzyb_przepis> getAllGrzyb_przepis() {return grzybRepository.getData_grzybPrzepis();}

    @GetMapping("/kategorie")
    public List<Kategoria> getKategorie() {
        return grzybRepository.getData_kategoria();
    }

    /// obsługa zdjęć grzybów
    @GetMapping("/zdjecia/{filename}")
    public ResponseEntity<Resource> getGrzybImage(@PathVariable String filename) {
        return getImageFromFolder(filename, "src/zdjecia/");
    }

    /// obsługa zdjęć przepisów
    @GetMapping("/przepisy/zdjecia/{filename}")
    public ResponseEntity<Resource> getPrzepisImage(@PathVariable String filename) {
        return getImageFromFolder(filename, "src/zdjecia/");
    }

    /// obsługa zdjęć dodanych grzybów przez użytkownika
    @GetMapping("/mojezdjecia/{filename}")
    public ResponseEntity<Resource> getMojeZdjecie(@PathVariable String filename) {
        return getImageFromFolder(filename, System.getProperty("user.dir") + "/mojezdjecia/");
    }

    /// wspólna metoda pomocnicza
    private ResponseEntity<Resource> getImageFromFolder(String filename, String folderPath) {
        try {
            Path filePath = Paths.get(folderPath + filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity
                        .ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/addgrzyb")
    public ResponseEntity<?> addGrzybWithImage(
            @RequestParam("nazwa") String nazwa,
            @RequestParam("nazwa_powszechna") String nazwaPowszechna,
            @RequestParam("opis") String opis,
            @RequestParam("powszechnosc") int powszechnosc,
            @RequestParam("zdjecie") MultipartFile zdjecie,
            @RequestParam("czy_oryginalne") boolean czyOryginalne,
            @RequestParam("kategoria_id") int kategoriaId
    ) {
        try {
            List<Kategoria> wszystkieKategorie = grzybRepository.getData_kategoria();

            Kategoria kategoria = wszystkieKategorie.stream()
                    .filter(k -> k.getId() == kategoriaId)
                    .findFirst()
                    .orElse(null);

            if (kategoria == null) {
                return ResponseEntity.badRequest().body("Niepoprawne ID kategorii");
            }

            String fileName = zdjecie.getOriginalFilename();
            Path uploadPath = Paths.get(System.getProperty("user.dir"), "mojezdjecia");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            zdjecie.transferTo(filePath.toFile());

            Grzyb grzyb = new Grzyb();
            grzyb.setNazwa(nazwa);
            grzyb.setNazwa_powszechna(nazwaPowszechna);
            grzyb.setOpis(opis);
            grzyb.setNazwaZdjecia(fileName);
            grzyb.setPowszechnosc(powszechnosc);
            grzyb.setCzy_oryginalne(czyOryginalne);

            grzyb.setKategoria(kategoria);
            grzyb.setId_kategoria(kategoria.getId());

            grzybRepository.addGrzyb(grzyb);

            return ResponseEntity.ok("Grzyb dodany");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Błąd dodawania grzyba: " + e.getMessage());
        }
    }
}