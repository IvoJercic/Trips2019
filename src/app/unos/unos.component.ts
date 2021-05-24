import { Component } from '@angular/core';
import * as $ from 'jquery';
import { TuraService } from '../shared/ture.service';
import { Router } from '@angular/router';


@Component({
    selector:"pm-unos",
    templateUrl: './unos.component.html',
    styleUrls: ['./unos.component.css']
})
export class UnosComponent
{
    //Svojstva
    ukupnoTura:number=parseInt(localStorage.getItem("UkupnoTura"));
    kolegeNiz=["Solo","IvoB","Jerko","Junto","Toni","Mata","AnteK","Rata","IvoJ"];

    //Prilikom stvaranja komponente stvaramo instancu naseg servisa tako da u ngOnInit mozemo ocitat broj tura
    //i instancu klase router kako bi direktno iz kooda mogli vrsit routiranje
    constructor(private turaService:TuraService,private router:Router){}

    provjeraUnosa():void
    { 

        let datum:string=$("#datumTure").val();
        let vrijeme:string=$("#vrijemeTure").val();
        let vrsta:string=$("#vrstaTure").val();
        let placa:number=parseInt($("#placaTure").val());
        let baksis:number=parseInt($("#baksisTure").val());
        let slike:number=parseInt($("#slikeTure").val());
        let voznja:number=parseInt($("#voznjaTure").val());
        let gosti:number=parseInt($("#brojGostijuTure").val());
        let izvlacenja:number=parseInt($("#izvlacenjaTure").val());
        let kolege:String[]=this.provjeraKolega();

    
        //  if(datum!="" && vrijeme!="" && vrsta !="x" && placa!="" && placa > 0 && baksis>=0 && slike>=0 && voznja>=0 && brojGostiju>=0 && kolege.length>0)
        if(datum!="" && vrijeme!="" && vrsta !="x"  && vrsta.length>0 && placa > 0 && baksis>=0 && slike>=0 && voznja>=0 && gosti>0 && kolege.length>0 && izvlacenja >=0)
        {            
            let pop = confirm("Da li ste sigurni da zelite spremiti Turu #"+Number(this.ukupnoTura+1));
            if (pop == true)
            {
                //Disablamo botun da se nebi desilo da vise puta spremimo istu turu
                $("#btnPotvrdi").prop("disabled",true);

                //Dodavanje ture u bazu            
                this.turaService.dodajTuruUBazu({
                    RedniBroj:this.ukupnoTura+1,
                    Datum:datum,
                    Vrijeme:vrijeme,
                    Vrsta:vrsta,
                    Placa:placa,
                    Baksis:baksis,
                    Slike:slike,
                    Voznja:voznja,
                    Gosti:gosti,
                    Izvlacenja:izvlacenja,
                    Kolege:kolege,
                    Ukupno:(placa+baksis+slike+voznja)
                },
                this.ukupnoTura+1//2.argument
                );     

                //Dodajemo podatke u LS tako da se povratkom na pocetnu stranicu ne mora ponovo posezati za podacima u bazi podataka vec se iz cache memorije dohvacaju
                //Time stedimo podatkovni promet
                //Tj na trenutno stanje u LS dodajemo jos i ovu zadnju turu
                localStorage.setItem("UkupnoTura", String(this.ukupnoTura+1));
                localStorage.setItem("Gostiju", String(Number(parseInt(localStorage.getItem("Gostiju"))+gosti)));
                localStorage.setItem("Baksis", String(Number(parseInt(localStorage.getItem("Baksis"))+baksis)));
                localStorage.setItem("Slike", String(Number(parseInt(localStorage.getItem("Slike"))+slike)));
                localStorage.setItem("Placa", String(Number(parseInt(localStorage.getItem("Placa"))+placa)));
                localStorage.setItem("Voznja", String(Number(parseInt(localStorage.getItem("Voznja"))+voznja)));
                localStorage.setItem("Izvlacenja", String(Number(parseInt(localStorage.getItem("Izvlacenja"))+izvlacenja)));
                localStorage.setItem("UkupnaZarada", String(Number(parseInt(localStorage.getItem("UkupnaZarada"))+placa+baksis+slike+voznja)));

                if(vrsta=="CanBas"){
                    localStorage.setItem("UkupnoCanBas", String(Number(parseInt(localStorage.getItem("UkupnoCanBas"))+1)));
                }
                else if(vrsta=="Kay"){
                    localStorage.setItem("UkupnoKay", String(Number(parseInt(localStorage.getItem("UkupnoKay"))+1)));
                }
                else if(vrsta=="Hik"){
                    localStorage.setItem("UkupnoHik", String(Number(parseInt(localStorage.getItem("UkupnoHik"))+1)));
                }
                else if(vrsta=="Cyc"){
                    localStorage.setItem("UkupnoCyc", String(Number(parseInt(localStorage.getItem("UkupnoCyc"))+1)));
                }
                else if(vrsta=="CanAdv"){
                    localStorage.setItem("UkupnoCyc", String(Number(parseInt(localStorage.getItem("UkupnoCanAdv"))+1)));
                }
                else if(vrsta=="RCli"){
                    localStorage.setItem("UkupnoCyc", String(Number(parseInt(localStorage.getItem("UkupnoRCli"))+1)));
                }
                
                alert("Tura #" + (this.ukupnoTura+1) + " uspješno unesena u bazu podataka !");
                this.router.navigate(["/menu"]);
            }
        }
        else
        {
            $("#btnPotvrdi").prop("disabled",false);
            alert("Neispravan unos podataka !"); 
        }
    }

    provjeraKolega():String[]
    {
        let kolegeDanas=[];
      
        for (var i = 0; i < this.kolegeNiz.length; i++)
        {
            let target="#";
            target+=this.kolegeNiz[i];
            
            //Provjera oznacenih checkboxova
            if($(target)[0].checked==true)
            {
                kolegeDanas.push((this.kolegeNiz[i]));
            }
        }        
        return kolegeDanas;      
    }

    //Funckija koja pri izabiranju opcije solo mice sve ostale izabrane kolege
    iskljuciKolege():void
    {
        //Ako vodic ide sam iskljucit sve oznake s ostalim vodicima
        if($("#Solo")[0].checked==true)
        {
            //Idemo od 2.(int = 1) mjesta jer je u nizu Solo na 1.mjestu
            for (var i = 1; i < this.kolegeNiz.length; i++)
            {
                let target="#";
                target+=this.kolegeNiz[i];
                $(target)[0].checked=false;
                $(target)[0].disabled=true;
            }
        }
        //Ako Solo opcija nije checkirana
        else
        {
            for (var i = 1; i < this.kolegeNiz.length; i++)
            {
                let target="#";
                target+=this.kolegeNiz[i];
                $(target)[0].disabled=false;
            }
        }
    }

    //Prilikom oznacsavanja bilo kojeg kolege solo opcija se isključuje
    iskljuciSolo():void
    {
        $('#Solo').prop('checked', false);
    }
}