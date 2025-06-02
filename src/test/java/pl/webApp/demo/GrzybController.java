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
        return grzybRepository.getData_przepis();
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
            @RequestParam("czy_oryginalne") boolean czyOryginalne
    ) {
        try {
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
            grzyb.setPowszechnosc(powszechnosc);
            grzyb.setCzy_oryginalne(czyOryginalne);

            grzybRepository.addGrzyb(grzyb);

            return ResponseEntity.ok("Grzyb dodany");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Błąd dodawania grzyba: " + e.getMessage());
        }
    }
}