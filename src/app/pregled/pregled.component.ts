import { Component, OnInit } from '@angular/core';
import { TuraService } from '../shared/ture.service';
import { ITura } from '../shared/tura.interface';


@Component({
  selector: "pm-pregled",
  templateUrl: './pregled.component.html',
  styleUrls: ['./pregled.component.css']
})
export class PregledComponent implements OnInit 
{  
  danasnjiDatum: Date;
  ukupnoTura: number = 0;
  duplihTura: number = 0;
  ukupnoGostiju: number = 0;
  gostijuPoTuri: any = 0;
  placa: number = 0;
  baksis: number = 0;
  slike: number = 0;
  voznja: number = 0;
  ukupnaZarada: number = 0;
  zaradaPoTuri: any = 0;
  kolege: number = 0;
  izvlacenja: number = 0;

  trenutnoPrijavljen:string;

  constructor(private turaService: TuraService) {

  }
  
  ngOnInit() 
  {        
    this.danasnjiDatum = new Date();          
      //Prilikom stvaranja ove komponente proslijedujemo podatke funkciji za obradu
      this.turaService.dohvaceniPodaci2021.subscribe(
        data => {
          this.obradiPodatke(data);  
          this.turaService.obradeniPodaci2021=data;          
        });  
        

      //Odmah i dohvacamo podatke od prosle godine tako da je svo dohvacanje podataka na ovoj komponenti te da ne moramo iz komponente "zarada" ponovo pristupat podaccim

      this.turaService.dohvaceniPodaci2020.subscribe(
        data => {
          this.turaService.obradeniPodaci2020=data;

          //Ovisno o tome postoje li proslogodisnji podaci postavljamo zastavicu koja nam je bitna 
          if(this.turaService.obradeniPodaci2020.length==0)
          {
            this.turaService.postojePodaciOdGodinePrije=false;
          }
          else
          {
            this.turaService.postojePodaciOdGodinePrije=true;
          }
        });  
        
      this.turaService.dohvaceniPodaci2019.subscribe(
        data => {
          this.turaService.obradeniPodaci2019=data;

          //Ovisno o tome postoje li proslogodisnji podaci postavljamo zastavicu koja nam je bitna 
          if(this.turaService.obradeniPodaci2019.length==0)
          {
            this.turaService.postojePodaciOdGodinePrije=false;
          }
          else
          {
            this.turaService.postojePodaciOdGodinePrije=true;
          }
        });    

      this.turaService.dohvaceniPodaci2018.subscribe(
        data => {
          this.turaService.obradeniPodaci2018=data;

          //Ovisno o tome postoje li proslogodisnji podaci postavljamo zastavicu koja nam je bitna 
          if(this.turaService.obradeniPodaci2018.length==0)
          {
            this.turaService.postojePodaciOdGodinePrije=false;
          }
          else
          {
            this.turaService.postojePodaciOdGodinePrije=true;
          }
        });    
        
      //U servisu imamo identicnu metodu koju cemo ovde prekopirat tako da u HTMLu imamo ime trenutno prijavljenog korisnika
      this.trenutnoPrijavljen=this.turaService.trenutnoPrijavljen;
        
      //Ako odemo na neku drugu komponentu i vratimo se ponovo na /menu podaci nece bit vidljivi pa ih treba procitat iz LS-a i ovde
      this.citajLS();
  }

  citajLS():void
  {
    this.ukupnoTura=parseInt(localStorage.getItem("UkupnoTura"));
    this.baksis = parseInt(localStorage.getItem("Baksis"));
    this.ukupnoGostiju = parseInt(localStorage.getItem("Gostiju"));
    this.slike = parseInt(localStorage.getItem("Slike"));
    this.placa = parseInt(localStorage.getItem("Placa"));
    this.voznja = parseInt(localStorage.getItem("Voznja"));
    this.izvlacenja = parseInt(localStorage.getItem("Izvlacenja"));
    this.ukupnaZarada = parseInt(localStorage.getItem("UkupnaZarada"));
    this.duplihTura=parseInt(localStorage.getItem("DuplihTura"));
    this.kolege=parseInt(localStorage.getItem("BrojKolega"));

    this.gostijuPoTuri=(this.ukupnoGostiju/this.ukupnoTura).toFixed(0);
    this.zaradaPoTuri=(this.ukupnaZarada/this.ukupnoTura).toFixed(0);
    
  }

  obradiPodatke(data: ITura[]) 
  {
    //console.log(data);
    
    
    
    //Sortiranje dobivenih podataka po rednom broju ture ukoliko u bazi nisu sortirani sta moze biti slucaj
    for(var i=0 ; i<data.length-1;i++)
    {
      for(var j=i+1 ; j<data.length;j++)
      {
        if(data[i].RedniBroj<data[j].RedniBroj)
        {
          let c:ITura;
          c=data[i];
          data[i]=data[j];
          data[j]=c;          
        }
      }
    }
    //Jer nam ih obrnuto sortira pa da bude s prave strane
    data.reverse();
    
    //Brojaci
    let tempUkupnoTura = 0;
    let tempDuplihTura = 0;
    let tempGostiju = 0;
    let tempPlaca = 0;
    let tempSlike = 0;
    let tempBaksis = 0;
    let tempVoznja = 0;
    let tempIzvlacenja = 0;
    let tempUkupnaZarada = 0;
    let tempKolege =[];

    let tempCanBas=0;
    let tempKay=0;
    let tempHik=0;
    let tempCyc=0;
    let tempCanAdv=0;
    let tempRCli=0;


    //Citamo podatke iz svake ture pojedinacno
    for(var i= 0;i<data.length;i++)
    {
      tempUkupnoTura += 1;
      tempGostiju += data[i].Gosti;
      tempPlaca += data[i].Placa;
      tempBaksis += data[i].Baksis;
      tempVoznja += data[i].Voznja;
      tempSlike += data[i].Slike;
      tempIzvlacenja += data[i].Izvlacenja;
      tempUkupnaZarada += data[i].Ukupno;
      //Brojaci po vrsti ture, promatram samo ove 4 jer radim aplikaciju za sebe i znam sta cu radit, lako je dodat i ostale vrste
      if(data[i].Vrsta=="CanBas"){tempCanBas++}
      else if(data[i].Vrsta=="Kay"){tempKay++}
      else if(data[i].Vrsta=="Hik"){tempHik++}
      else if(data[i].Vrsta=="Cyc"){tempCyc++}
      else if(data[i].Vrsta=="CanAdv"){tempCanAdv++}
      else if(data[i].Vrsta=="RCli"){tempRCli++}

      data[i].Kolege.forEach(element => {
        //Ukoliko kolega nije u praznom nizu dodaj ga
        if(!tempKolege.includes(element.trim()) && (element != ""))
        {
          //Kolega bez spaceova npr rjesava problem --> "   Solo" 
          tempKolege.push(element.replace(/\s/g, ""));
        }
      });        
    }

    //Provjera duplih tura
     for(var i=0;i<data.length -1 ;i++)
     {    
       if(data[i].Datum==data[i+1].Datum)
       {
         tempDuplihTura++;
       }
     }

      //Spremamo podatke u localStorage tako da se promjenom komponente podaci ne gube, tj gube se ali povlacenjem iz localStoragea zadrzat cemo iste
      //KEY,VALUE
      localStorage.setItem("UkupnoTura", String(tempUkupnoTura));
      localStorage.setItem("Baksis", String(tempBaksis));
      localStorage.setItem("Gostiju", String(tempGostiju));
      localStorage.setItem("Slike", String(tempSlike));
      localStorage.setItem("Placa", String(tempPlaca));
      localStorage.setItem("Voznja", String(tempVoznja));
      localStorage.setItem("Izvlacenja", String(tempIzvlacenja));
      localStorage.setItem("UkupnaZarada", String(tempUkupnaZarada));
      localStorage.setItem("DuplihTura", String(tempDuplihTura));
      localStorage.setItem("BrojKolega", String(tempKolege.length));
      //Ovi brojaci nam koriste u crtanju grafa
      localStorage.setItem("UkupnoCanBas", String(tempCanBas));
      localStorage.setItem("UkupnoKay", String(tempKay));
      localStorage.setItem("UkupnoHik", String(tempHik));
      localStorage.setItem("UkupnoCyc", String(tempCyc));
      localStorage.setItem("UkupnoCanAdv", String(tempCanAdv));
      localStorage.setItem("UkupnoRCli", String(tempRCli));


     //Nakon sta spremimo podatke u LS pozivamo funkciju koja ce procitati zapisani sadrzaj i prenijeti ga na GUI
     this.citajLS();
  }

  odjava():void
  {
    this.turaService.odjaviKorisnika();
  }
}