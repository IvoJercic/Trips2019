import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ITura } from './tura.interface';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as $ from 'jquery';

@Injectable(
{
  providedIn:"root",
}
)

//Ovo je servis sa funkcijama koje rade sa bazom podataka
export class TuraService 
{
  //Nakon sta neko napravi instancu ovog servisa dobije podatke u tipu "Observable" te kad subscriba podatke u svojoj komponenti pomocu this.turaService.dohvaceniPodaci=data ovde imamo dohvacene podatke
  postojePodaciOdGodinePrije=false;
  dohvaceniPodaci2018:Observable<any[]>;
  obradeniPodaci2018:any[];

  dohvaceniPodaci2019: Observable<any[]>;
  obradeniPodaci2019:any[];

  dohvaceniPodaci2020: Observable<any[]>;
  obradeniPodaci2020:any[];

  dohvaceniPodaci2021: Observable<any[]>;
  obradeniPodaci2021:ITura[];

  //Brojac tura,ovo je bitno za prikaz grafa u tura.component.ts
  ukupnoCanBas:number=0;
  ukupnoKay:number=0;
  ukupnoHik:number=0;
  ukupnoCyc:number=0;
  trenutnoPrijavljen:string;
  ovaGod:number=2021;//Trenutna godina
  referncaZaSpremanje:string="users/";//U Firestore ne mozemo ko putanju stavit email jer sadrzi tocku pa je mramo maknit


  //Prilikom stvaranje instance ovog servisa odmah dohvaćamo podatke
  constructor(private db: AngularFirestore,
              private afa: AngularFireAuth,
              private router:Router
              )
  {}

  dodajTuruUBazu(tura:Object,id:number)
  {
    this.db.collection(this.referncaZaSpremanje).doc(id.toString()).set(tura);
  }

  registrirajKorisnika(email:string,password:string)
  {
    return this.afa.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        //Saljemo korisniku mail da potvrdi svoj email
        this.afa.auth.currentUser.sendEmailVerification();
        window.alert("Na "+email+" poslan je link za potvdu E-mail adrese !");
       }).catch((error) => {
        window.alert(error.message)
      })
  }

  prijaviKorisnika(email:string,password:string){    
    return this.afa.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        if(this.afa.auth.currentUser.emailVerified==true)
        {
          $("#btnPrijava").prop("disabled",false);

          //referenca je oblika users/korisnik/2019
          //Prvo formiramo referenca a zatim po toj referenci dohvacamo podatke iz baze
          //Tek prilikom prijave korisnika dohvacamo podatke iz baze, to smo prebacili iz konstuktora ovog servica ovde  
          //Dohvacamo i podatke od prijasenje godine

          //Bitno je da 1.dohvatimo proslogodisnje podatke jer koristimo istu varijablu pa da nova vrijednost prebrise staru
          this.referncaZaSpremanje="users/";
          this.referncaZaSpremanje+=this.afa.auth.currentUser.email.split('.').join('')+"/"+(this.ovaGod-3);
          this.dohvaceniPodaci2018 = this.db.collection(this.referncaZaSpremanje).valueChanges();
          
          this.referncaZaSpremanje="users/";
          this.referncaZaSpremanje+=this.afa.auth.currentUser.email.split('.').join('')+"/"+(this.ovaGod-2);
          this.dohvaceniPodaci2019 = this.db.collection(this.referncaZaSpremanje).valueChanges();

          this.referncaZaSpremanje="users/";
          this.referncaZaSpremanje+=this.afa.auth.currentUser.email.split('.').join('')+"/"+(this.ovaGod-1);
          this.dohvaceniPodaci2020 = this.db.collection(this.referncaZaSpremanje).valueChanges();

          this.referncaZaSpremanje="users/";
          this.referncaZaSpremanje+=this.afa.auth.currentUser.email.split('.').join('')+"/"+(this.ovaGod);
          this.dohvaceniPodaci2021 = this.db.collection(this.referncaZaSpremanje).valueChanges();


          this.router.navigate(['/menu']);
        }
        else
        {
          alert("Morate potvrditi svoju E-mail adresu !");
          $("#passwordPrijava").val("");
        }         
      }).catch((error) => {
        window.alert(error.message)
        $("#passwordPrijava").val("");
        $("#login").val("");
        $("#btnPrijava").prop("disabled",false);
        return;
      })
  }

  odjaviKorisnika()
  {   
    let pop = confirm("Da li ste sigurni da se zelite odjaviti sa racuna : "+this.trenutnoPrijavljen+" ?");
    if (pop == true)
    {
      return this.afa.auth.signOut().then(() => {        
        //Nakon odjavljivanja zelimo izbrisati sve podatke oiz LocalStoragea tako da niko ne moze vidjeti te podatke
        //Ovo dole je niz sa IDovima po kojima cemo vrsiti brisanje

        let idULS =["UkupnoTura","Baksis","Gostiju","Slike","Placa","Voznja","Izvlacenja","UkupnaZarada","DuplihTura","BrojKolega","UkupnoCanBas","UkupnoKay","UkupnoHik","UkupnoCyc","UkupnoCanAdv","UkupnoRCli"] ;
        for(var i=0;i<idULS.length;i++)
        {
          localStorage.removeItem(idULS[i]);
        }
        $("#app:button").attr("disabled",true);
        this.router.navigate(['/prijava']);
      })
    }
  }

  azurirajTuruUBazi(id:number,noviPodaci:String[])
  {
    this.db.collection(this.referncaZaSpremanje).doc(id.toString()).update({
       Datum:noviPodaci[0],
       Vrijeme:noviPodaci[1],
       Vrsta:noviPodaci[2],
       Placa:noviPodaci[3],
       Baksis:noviPodaci[4],
       Slike:noviPodaci[5],
       Voznja:noviPodaci[6],
       Gosti:noviPodaci[7],
       Izvlacenja:noviPodaci[8],
       Kolege:noviPodaci[9],
       Ukupno:noviPodaci[10]
     })
    alert("Tura #"+id+" uspješno promjenjena !");
  }

  zaradaUMjesecu(mjesec:number):Array<number>
  {
    let Placa=0;
    let Baksis=0;
    let Voznja=0;
    let Slike=0;
    this.obradeniPodaci2021.forEach(element => {
      if(parseInt(element.Datum.substring(5,7))==mjesec)
      {
        Placa+=element.Placa;
        Baksis+=element.Baksis;
        Voznja+=element.Voznja;
        Slike+=element.Slike;
      }
    });
    return [(Placa+Baksis+Slike+Voznja),Placa,Baksis,Slike,Voznja];
  }  

  gostijuUMjesecu(mjesec:number):Array<number>
  {
    let gCanBas=0;
    let gKay=0;
    let gHik=0;
    let gCyc=0;
    let gCanAdv=0;
    let gRCli=0;

    this.obradeniPodaci2021.forEach(element => {
      if(parseInt(element.Datum.substring(5,7))==mjesec)
      {
        if(element.Vrsta=="CanBas"){gCanBas+=element.Gosti;}
        else if(element.Vrsta=="CanAdv"){gCanAdv+=element.Gosti;}
        else if(element.Vrsta=="Kay"){gKay+=element.Gosti;}
        else if(element.Vrsta=="Hik"){gHik+=element.Gosti;}
        else if(element.Vrsta=="Cyc"){gCyc+=element.Gosti;}
        else if(element.Vrsta=="RCli"){gRCli+=element.Gosti;}
      }
    });
    return [(gCanBas+gKay+gCanAdv+gHik+gCyc+gRCli),gCanBas,gCanAdv,gKay,gHik,gCyc,gRCli];
  }
  
  zaradaPoVrsti():Array<number>
  {
    let zCanBas=0;
    let zKay=0;
    let zHik=0;
    let zCyc=0;
    let zCanAdv=0;
    let zRCli=0;

    this.obradeniPodaci2021.forEach(element => {      
        if(element.Vrsta=="CanBas"){zCanBas+=element.Ukupno;}
        else if(element.Vrsta=="CanAdv"){zCanAdv+=element.Ukupno;}
        else if(element.Vrsta=="Kay"){zKay+=element.Ukupno;}
        else if(element.Vrsta=="Hik"){zHik+=element.Ukupno;}
        else if(element.Vrsta=="Cyc"){zCyc+=element.Ukupno;}
        else if(element.Vrsta=="RCli"){zRCli+=element.Ukupno;}
    });
    return [(zCanBas+zKay+zCanAdv+zHik+zCyc+zRCli),zCanBas,zCanAdv,zKay,zHik,zCyc,zRCli];
  }

  placaPoVrsti():Array<number>
  {
    let pCanBas=0;
    let pKay=0;
    let pHik=0;
    let pCyc=0;
    let pCanAdv=0;
    let pRCli=0;

    this.obradeniPodaci2021.forEach(element => {      
        if(element.Vrsta=="CanBas"){pCanBas+=element.Placa;}
        else if(element.Vrsta=="CanAdv"){pCanAdv+=element.Placa;}
        else if(element.Vrsta=="Kay"){pKay+=element.Placa;}
        else if(element.Vrsta=="Hik"){pHik+=element.Placa;}
        else if(element.Vrsta=="Cyc"){pCyc+=element.Placa;}
        else if(element.Vrsta=="RCli"){pRCli+=element.Placa;}
    });
    return [(pCanBas+pKay+pCanAdv+pHik+pCyc+pRCli),pCanBas,pCanAdv,pKay,pHik,pCyc,pRCli];
  }

  baksisPoVrsti():Array<number>
  {
    let bCanBas=0;
    let bKay=0;
    let bHik=0;
    let bCyc=0;
    let bCanAdv=0;
    let bRCli=0;

    this.obradeniPodaci2021.forEach(element => {      
        if(element.Vrsta=="CanBas"){bCanBas+=element.Baksis;}
        else if(element.Vrsta=="CanAdv"){bCanAdv+=element.Baksis;}
        else if(element.Vrsta=="Kay"){bKay+=element.Baksis;}
        else if(element.Vrsta=="Hik"){bHik+=element.Baksis;}
        else if(element.Vrsta=="Cyc"){bCyc+=element.Baksis;}
        else if(element.Vrsta=="RCli"){bRCli+=element.Baksis;}
    });
    return [(bCanBas+bKay+bCanAdv+bHik+bCyc+bRCli),bCanBas,bCanAdv,bKay,bHik,bCyc,bRCli];
  }

  slikePoVrsti():Array<number>
  {
    let sCanBas=0;
    let sKay=0;
    let sHik=0;
    let sCyc=0;
    let sCanAdv=0;
    let sRCli=0;

    this.obradeniPodaci2021.forEach(element => {      
        if(element.Vrsta=="CanBas"){sCanBas+=element.Slike;}
        else if(element.Vrsta=="CanAdv"){sCanAdv+=element.Slike;}
        else if(element.Vrsta=="Kay"){sKay+=element.Slike;}
        else if(element.Vrsta=="Hik"){sHik+=element.Slike;}
        else if(element.Vrsta=="Cyc"){sCyc+=element.Slike;}
        else if(element.Vrsta=="RCli"){sRCli+=element.Slike;}
    });
    return [(sCanBas+sKay+sCanAdv+sHik+sCyc+sRCli),sCanBas,sCanAdv,sKay,sHik,sCyc,sRCli];
  }

  voznjaPoVrsti():Array<number>
  {
    let vCanBas=0;
    let vKay=0;
    let vHik=0;
    let vCyc=0;
    let vCanAdv=0;
    let vRCli=0;

    this.obradeniPodaci2021.forEach(element => {      
        if(element.Vrsta=="CanBas"){vCanBas+=element.Voznja;}
        else if(element.Vrsta=="CanAdv"){vCanAdv+=element.Voznja;}
        else if(element.Vrsta=="Kay"){vKay+=element.Voznja;}
        else if(element.Vrsta=="Hik"){vHik+=element.Voznja;}
        else if(element.Vrsta=="Cyc"){vCyc+=element.Voznja;}
        else if(element.Vrsta=="RCli"){vRCli+=element.Voznja;}
    });
    return [(vCanBas+vKay+vCanAdv+vHik+vCyc+vRCli),vCanBas,vCanAdv,vKay,vHik,vCyc,vRCli];
  }

  turaSKolegom(kolega:string):Array<number>
  {
    let CanBas=0;
    let CanAdv=0;
    let Kay=0;
    let Hik=0;
    let Cyc=0;
    let RCli=0;
    this.obradeniPodaci2021.forEach(element => {
      //Za svaki element provjeravamo sve elemente svojstva Kolege koji je objekt tipa niz
      for(let i=0;i<element.Kolege.length;i++)
      {
        //Kad nademo turu u kojoj je trazeni kolega promijeni brojac s obzirom na kojoj turi ste radili zajedno
        if(element.Kolege[i]==kolega)
        {
          if(element.Vrsta=="CanBas"){CanBas++;}
          else if(element.Vrsta=="CanAdv"){CanAdv++;}
          else if(element.Vrsta=="Kay"){Kay++;}
          else if(element.Vrsta=="Hik"){Hik++;}
          else if(element.Vrsta=="Cyc"){Cyc++;}
          else if(element.Vrsta=="RCli"){RCli++;}
        }
      }
    });
    return [(CanBas+Kay+CanAdv+Hik+Cyc+RCli),CanBas,CanAdv,Kay,Hik,Cyc,RCli];
  }

  tureSaIzvlacenjem():Array<ITura>
  {
    let niz=[];
    this.obradeniPodaci2021.forEach(element => {    
      if(element.Izvlacenja>0)
      {
        niz.push(element);
      }
    });
    return niz;
  }

  dupleTure():Array<ITura>
  {
    let niz=[];
    for(var i=0;i<this.obradeniPodaci2021.length -1 ;i++)
    {    
      if(this.obradeniPodaci2021[i].Datum==this.obradeniPodaci2021[i+1].Datum)
      {
        //Kad nademo duplu turu obe ture spremaj u niz
        niz.push(this.obradeniPodaci2021[i]);
        niz.push(this.obradeniPodaci2021[i+1])
      }
    }
   return niz;
  }

  dupleTurePoMjesecima():Array<number>
  {
    let niz=[0,0,0,0,0,0,0,0,0];
    for(var i=0;i<this.obradeniPodaci2021.length -1 ;i++)
    {    
      if(this.obradeniPodaci2021[i].Datum==this.obradeniPodaci2021[i+1].Datum)
      {
        if(parseInt(this.obradeniPodaci2021[i].Datum.substring(5,7))==3){niz[0]++;}
        else if(parseInt(this.obradeniPodaci2021[i].Datum.substring(5,7))==4){niz[1]++;}
        else if(parseInt(this.obradeniPodaci2021[i].Datum.substring(5,7))==5){niz[2]++;}
        else if(parseInt(this.obradeniPodaci2021[i].Datum.substring(5,7))==6){niz[3]++;}
        else if(parseInt(this.obradeniPodaci2021[i].Datum.substring(5,7))==7){niz[4]++;}
        else if(parseInt(this.obradeniPodaci2021[i].Datum.substring(5,7))==8){niz[5]++;}
        else if(parseInt(this.obradeniPodaci2021[i].Datum.substring(5,7))==9){niz[6]++;}
        else if(parseInt(this.obradeniPodaci2021[i].Datum.substring(5,7))==10){niz[7]++;}
        else if(parseInt(this.obradeniPodaci2021[i].Datum.substring(5,7))==11){niz[8]++;}        
      }      
    }
    return niz;
  }

  turauUMjesecu(mjesec:number):Array<number>
  {
    let bCanBas=0;
    let bKay=0;
    let bHik=0;
    let bCyc=0;
    let bCanAdv=0;
    let bRCli=0;

    this.obradeniPodaci2021.forEach(element => {
      if(parseInt(element.Datum.substring(5,7))==mjesec)
      {
        if(element.Vrsta=="CanBas"){bCanBas++;}
        else if(element.Vrsta=="CanAdv"){bCanAdv++;}
        else if(element.Vrsta=="Kay"){bKay++;}
        else if(element.Vrsta=="Hik"){bHik++;}
        else if(element.Vrsta=="Cyc"){bCyc++;}
        else if(element.Vrsta=="RCli"){bRCli++;}
      }
    });
    return [(bCanBas+bKay+bCanAdv+bHik+bCyc+bRCli),bCanBas,bCanAdv,bKay,bHik,bCyc,bRCli];
  }

  preuzmiPodatkeKorisnika(email:string,password:string)
  {        
    return this.afa.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        if(this.afa.auth.currentUser.emailVerified==true)
        {
          $("#btnPreuzmi").prop("disabled",false);

          //referenca je oblika users/korisnik/2019
          //Prvo formiramo referenca a zatim po toj referenci dohvacamo podatke iz baze
          //Tek prilikom prijave korisnika dohvacamo podatke iz baze, to smo prebacili iz konstuktora ovog servica ovde  

          this.referncaZaSpremanje="users/";
          this.referncaZaSpremanje+=this.afa.auth.currentUser.email.split('.').join('')+"/"+this.ovaGod;
          //console.log(this.referncaZaSpremanje);


          this.dohvaceniPodaci2019 = this.db.collection(this.referncaZaSpremanje).valueChanges();
          //console.log( this.dohvaceniPodaci2019);
        }
        else
        {
          alert("Morate potvrditi svoju E-mail adresu !");
          $("#passwordPrijava").val("");
        }         
      }).catch((error) => {
        window.alert(error.message)
        $("#passwordPrijava").val("");
        $("#login").val("");
        $("#btnPrijava").prop("disabled",false);
        return;
      })
  }
}
