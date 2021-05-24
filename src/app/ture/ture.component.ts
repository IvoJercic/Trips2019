import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import * as $ from 'jquery';
import { TuraService } from '../shared/ture.service';
import { ITura } from '../shared/tura.interface';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

//Import JSON datoteke sa podacima o poslu 2018
//declare var require: any;
//var p2018 = require('../../assets/json/2018.json');

@Component({
    selector:"pm-ture",
    templateUrl: './ture.component.html',
    styleUrls: ['./ture.component.css']
})


export class TureComponent implements OnInit
{    
    PieChart=[];
    LineChart=[];
    podaci2019:ITura[];//OVo se zove 2019 ali zapravo ovo su podaci tekuce godine, zbog jednostavnosti nisam htio mjenjati u podaci2020 da nebi morao svaku godinu to raditi
    indeksOdabraneTure:number;
    turePoMjesecima:Array<number>=[];
    filtriraneTure:ITura[];
    nizLabela=["lblDatum","lblVrijeme","lblVrsta","lblPlaca","lblBaksis","lblSlike","lblVoznja","lblGosti","lblIzvlacenja","lblKolege"];

    constructor(private turaService: TuraService,
                private modalService: NgbModal,
                private router: Router) {}
    

    ngOnInit()
    {        
        //Podatke dohvacamo iz servisa jer su tamo spremljeni podaci iz pregled.component koja je roditeljska ovoj pa mozemo bit sigurni da podaci postoje
        this.sortirajPodatke(this.turaService.obradeniPodaci2021)
        this.podaci2019=this.turaService.obradeniPodaci2021;
        //Filtrirane ture su nam bitne jer korisnik moze htjeti samo CanBas ture itd...
        this.filtriraneTure=this.podaci2019;  

        this.turePoMjesecima=[];
        //PIE CHART
        //#region 
        this.PieChart = new Chart('pieChart', {
            type: 'pie',
            data: {
                labels: ["CanBas", "Kay", "Hik", "Cyc","CanAdv","RCli"],
                datasets: [{
                    label: 'Broj tura',
                    data: [parseInt(localStorage.getItem("UkupnoCanBas")),parseInt(localStorage.getItem("UkupnoKay")),parseInt(localStorage.getItem("UkupnoHik")),parseInt(localStorage.getItem("UkupnoCyc")),parseInt(localStorage.getItem("UkupnoCanAdv")),parseInt(localStorage.getItem("UkupnoRCli"))],
                    backgroundColor: 
                    [   
                        'rgba(0, 0, 0, 1)',
                        'rgba(0, 155, 0, 1)',
                        'rgba(190, 190, 190, 1)',
                        'rgba(0, 255, 255, 1)',
                        'rgba(0, 128, 255, 1)',
                        'rgba(255, 255, 0, 1)',
                    ],       
        borderColor: [
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
        ],
        borderWidth: 1.5
        }]
        }, 
        options: {
            responsive:false,
            title:{
                display:true
                },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
    }
    });
    //#endregion  
    
        this.crtajLineGraf(0,"Sve");    
    }

    potvrdiUredivanje():void
    {
        let pop = confirm("Da li ste sigurni da zelite spremiti promjene za Turu #"+Number(this.indeksOdabraneTure+1));
        if (pop == true)
        {   
            //Vrsimo provjeru unosa
            let zastavica :boolean=this.validacijaPodatakaZaAzuriranje();
            if(zastavica==true)
            {
                //Saljemo metodi za azuriranje redni broj ture i nove podatke o turi u nizu
                let noviPodaci=[];

                noviPodaci.push($("#lblDatum").val());
                noviPodaci.push($("#lblVrijeme").val());
                noviPodaci.push($("#lblVrsta").val());
                noviPodaci.push(parseInt($("#lblPlaca").val()));
                noviPodaci.push(parseInt($("#lblBaksis").val()));
                noviPodaci.push(parseInt($("#lblSlike").val()));
                noviPodaci.push(parseInt($("#lblVoznja").val()));
                noviPodaci.push(parseInt($("#lblGosti").val()));
                noviPodaci.push(parseInt($("#lblIzvlacenja").val()));
                let nizKolega = $("#lblKolege").val().split(',');
                noviPodaci.push(nizKolega);          
                noviPodaci.push(parseInt($("#lblPlaca").val())+parseInt($("#lblBaksis").val())+parseInt($("#lblSlike").val())+parseInt($("#lblVoznja").val()));
            
                this.turaService.azurirajTuruUBazi((this.indeksOdabraneTure+1),noviPodaci); 
                this.modalService.dismissAll();
                this.router.navigate(["/menu"]);
            }
            else
            {
                alert("Neispravan unos !\nPogledaj informacije !");
            }
        }
    }

    validacijaPodatakaZaAzuriranje():boolean
    {
        let datum:string=$("#lblDatum").val();
        let vrijeme:string=$("#lblVrijeme").val();
        let vrsta:string=$("#lblVrsta").val();
        let placa:number=parseInt($("#lblPlaca").val());
        let baksis:number=parseInt($("#lblBaksis").val());
        let slike:number=parseInt($("#lblSlike").val());
        let voznja:number=parseInt($("#lblVoznja").val());
        let gosti:number=parseInt($("#lblGosti").val());
        let izvlacenja:number=parseInt($("#lblIzvlacenja").val());
        let kolege:String[]=($("#lblKolege").val()+",").split(',');
        
        //  if(datum!="" && vrijeme!="" && vrsta !="x" && placa!="" && placa > 0 && baksis>=0 && slike>=0 && voznja>=0 && brojGostiju>=0 && kolege.length>0)
        if(datum!="" && vrijeme!=""  && vrsta.length>0 &&(vrsta == "CanBas" || vrsta =="CanAdv" || vrsta=="Kay" || vrsta=="Cyc"|| vrsta=="Hik" || vrsta =="RCli") && placa > 0 && baksis>=0 && slike>=0 && voznja>=0 && gosti>0 && kolege.length>0 && izvlacenja >=0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    prikaziInfo()
    {
        $("#informacije").toggle(500);
    }
    
    odustaniOdUredivanja():void
    {
        let pop = confirm("Da li ste sigurni da zelite odustati od uredivanja Ture #"+Number(this.indeksOdabraneTure+1));
        if (pop == true)
        {
            for (let i = 0; i < this.nizLabela.length; i++) {            
                $("#"+this.nizLabela[i]).prop( "disabled", true);                        
            }
            $("#btnUredi").css("display","block");
            $("#btnZatvori").css("display","block");

            $("#btnPotvrdi").css("display","none");
            $("#btnOdustani").css("display","none");
            //Ukoliko korisnik odustaje od uredivanja izadi iz modalboxa
            this.modalService.dismissAll();
        }
    }

    urediTuru():void
    {
        let pop = confirm("Da li ste sigurni da zelite urediti Turu #"+Number(this.indeksOdabraneTure+1));
        if (pop == true)
        {
            for (let i = 0; i < this.nizLabela.length; i++) {            
                $("#"+this.nizLabela[i]).prop( "disabled", false );
            }

            //Prikazi botune za potvrdu/odustani
            $("#btnPotvrdi").css("display","block");
            $("#btnOdustani").css("display","block");

            //Sakrij prvotne botune
            $("#btnUredi").css("display","none");
            $("#btnZatvori").css("display","none");
        }
    }

    open(content,tura:ITura):void
    {
        //Otvara skriveni ModalBox na klik botuna s brojem ture
        this.indeksOdabraneTure=tura.RedniBroj-1;
        this.modalService.open(content, {windowClass: 'dark-modal'});

        //Ispis podataka ture u modal box
        $("#modal-basic-title").text("Detalji ture "+"#"+tura.RedniBroj);
        $("#lblDatum").val(tura.Datum);
        $("#lblVrijeme").val(tura.Vrijeme);
        $("#lblVrsta").val(tura.Vrsta);
        $("#lblPlaca").val(tura.Placa);
        $("#lblBaksis").val(tura.Baksis);
        $("#lblSlike").val(tura.Slike);
        $("#lblVoznja").val(tura.Voznja);
        $("#lblGosti").val(tura.Gosti);
        $("#lblIzvlacenja").val(tura.Izvlacenja);
        $("#lblKolege").val(tura.Kolege);
        $("#lblUkupno").val(tura.Ukupno);

        $("#informacije").hide();
    }

    turaPrije(content):void
    { 
        //Ako prethodna tura ima indeks -1 to znaci da je trenutna tura prva pa se automatski prebacimo na zadnju turu
        if(this.indeksOdabraneTure-1<0)
        {
            this.indeksOdabraneTure=this.podaci2019.length-1;
        }     
        //Ako nije samo smanji indeks za 1
        else
        {
            this.indeksOdabraneTure-=1;
        }      
        this.azurirajModalBox(this.indeksOdabraneTure);
    }

    turaPoslije():void
    {
        //Ako iduća tura ima indeks ==length to znaci da je trenutna tura zadnja pa se automatski prebacimo na prvu turu
        if(this.indeksOdabraneTure+1==this.podaci2019.length)
        {
            this.indeksOdabraneTure=0;
        }     
        //Ako nije samo povecaj indeks za 1
        else
        {         
            this.indeksOdabraneTure++;
        }
        this.azurirajModalBox(this.indeksOdabraneTure);
    }

    sortirajPodatke(data:ITura[]):void
    {    
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
    }

    azurirajModalBox(indeks:number):void
    {
        //(this.podaci2019[this.podaci2019.length-1-this.indeksOdabraneTure]);
        //Podaci2019 su obrnuto sortirani, pa od zadnjeg indeksa (length-1) oduzmemo trenutni indeks kako bi dobili komplement tog niza tj da bi dobili prividno normalno sortiran niz     
        $("#modal-basic-title").text("Detalji ture "+"#"+this.podaci2019[this.podaci2019.length-1-indeks].RedniBroj);
        $("#lblDatum").val(this.podaci2019[this.podaci2019.length-1-indeks].Datum);
        $("#lblVrijeme").val(this.podaci2019[this.podaci2019.length-1-indeks].Vrijeme);
        $("#lblVrsta").val(this.podaci2019[this.podaci2019.length-1-indeks].Vrsta);
        $("#lblPlaca").val(this.podaci2019[this.podaci2019.length-1-indeks].Placa);
        $("#lblBaksis").val(this.podaci2019[this.podaci2019.length-1-indeks].Baksis);
        $("#lblSlike").val(this.podaci2019[this.podaci2019.length-1-indeks].Slike);
        $("#lblVoznja").val(this.podaci2019[this.podaci2019.length-1-indeks].Voznja);
        $("#lblGosti").val(this.podaci2019[this.podaci2019.length-1-indeks].Gosti);
        $("#lblIzvlacenja").val(this.podaci2019[this.podaci2019.length-1-indeks].Izvlacenja);
        $("#lblKolege").val(this.podaci2019[this.podaci2019.length-1-indeks].Kolege);
        $("#lblUkupno").val(this.podaci2019[this.podaci2019.length-1-indeks].Ukupno); 
    }

    promjenaVrste():void
    {
        //Potrebno je resetirat ovaj niz kako se nebi nalazile ture druge vrste

        //Ovisno sto korisnik izabere takav graf i popis tura dobije
        this.filtriraneTure=[];
        if((<HTMLSelectElement>document.getElementById('vrstaTure')).value=="Sve")
        {
            this.filtriraneTure=this.podaci2019;
            this.crtajLineGraf(0,"Sve");
        }
        else if((<HTMLSelectElement>document.getElementById('vrstaTure')).value=="CanBas")
        {
            this.napraviSelekciju("CanBas");
            this.crtajLineGraf(1,"CanBas");
        }
        else if((<HTMLSelectElement>document.getElementById('vrstaTure')).value=="CanAdv")
        {
            this.napraviSelekciju("CanAdv");
            this.crtajLineGraf(2,"CanAdv");
        }
        else if((<HTMLSelectElement>document.getElementById('vrstaTure')).value=="Kay")
        {
            this.napraviSelekciju("Kay");
            this.crtajLineGraf(3,"Kay");
        }
        else if((<HTMLSelectElement>document.getElementById('vrstaTure')).value=="RCli")
        {
            this.napraviSelekciju("RCli");
            this.crtajLineGraf(6,"RCli");
        }
        else if((<HTMLSelectElement>document.getElementById('vrstaTure')).value=="Hik")
        {  
            this.napraviSelekciju("Hik");
            this.crtajLineGraf(4,"Hik");
        }
        else if((<HTMLSelectElement>document.getElementById('vrstaTure')).value=="Cyc")
        {
            this.napraviSelekciju("Cyc");
            this.crtajLineGraf(5,"Cyc");
        }    
    }
    
    napraviSelekciju(vrsta:string):void
    {
        //Vrsta je vrsta po kojoj cemo radit selekciju tura
        //Korisnik odabire koja vrsta tura ga zanima, mi punimo niz this.filtiraneTure samo sa turama te vrste te se promjene automatske vide na  tablici u komponenti ture.component
        for (var i = 0; i < this.podaci2019.length; i++)
        {
            if(this.podaci2019[i].Vrsta==vrsta)
            {
                this.filtriraneTure.push(this.podaci2019[i]);
            }
        }
    }

    crtajLineGraf(x:number,oznakaTure:string)    
    {
        this.turePoMjesecima=[];
        //funkcija turaUMjesecu vraca niz brojeva koji oznacavaju ukupan broj tura u mjesecu i broj svake vrste izleta u tom mjesecu
        //indeks koji ta funkcija prima ovisi oce li prikazat npr.ukupan broj tura u tom mjesecu ili broj Canyoninga u tom mjesecu
        for(let i=3;i<12;i++)
        {
            this.turePoMjesecima.push(this.turaService.turauUMjesecu(i)[x]);
        }

        let dataSetTemp;
        //Ovisi dali podaci od prosle godine postoje ili ne,ako nisu saljemo grafu samo podatke ove godine
        //Zastavica se postavlja u pregled.component u ngOnInit metodi
        if(this.turaService.postojePodaciOdGodinePrije==true)
        {
            //Ako je korisnik kliknuo na prikaz svih podataka prikazat ce mu se graf sa svim turama ove i prosle godine
            //Ako je korisnik kliknuo na prikaz svih podataka  za CanBas prikazat ce mu se graf sa svim turama CanBasica ove i prosle godine
            let niz2018;
            if(oznakaTure=="Sve")
            {
                niz2018=[this.turaService.obradeniPodaci2018[1].BrojTura, this.turaService.obradeniPodaci2018[2].BrojTura, this.turaService.obradeniPodaci2018[3].BrojTura, this.turaService.obradeniPodaci2018[4].BrojTura,this.turaService.obradeniPodaci2018[5].BrojTura,this.turaService.obradeniPodaci2018[6].BrojTura,this.turaService.obradeniPodaci2018[7].BrojTura,this.turaService.obradeniPodaci2018[0].BrojTura,0];
            }
            else if(oznakaTure=="CanBas")
            {
                niz2018=[this.turaService.obradeniPodaci2018[1].BrojCanBas, this.turaService.obradeniPodaci2018[2].BrojCanBas, this.turaService.obradeniPodaci2018[3].BrojCanBas, this.turaService.obradeniPodaci2018[4].BrojCanBas,this.turaService.obradeniPodaci2018[5].BrojCanBas,this.turaService.obradeniPodaci2018[6].BrojCanBas,this.turaService.obradeniPodaci2018[7].BrojCanBas,this.turaService.obradeniPodaci2018[0].BrojCanBas,0];
            }
            else if(oznakaTure=="CanAdv")
            {
                niz2018=[this.turaService.obradeniPodaci2018[1].BrojCanAdv, this.turaService.obradeniPodaci2018[2].BrojCanAdv, this.turaService.obradeniPodaci2018[3].BrojCanAdv, this.turaService.obradeniPodaci2018[4].BrojCanAdv,this.turaService.obradeniPodaci2018[5].BrojCanAdv,this.turaService.obradeniPodaci2018[6].BrojCanAdv,this.turaService.obradeniPodaci2018[7].BrojCanAdv,this.turaService.obradeniPodaci2018[0].BrojCanAdv,0];
            }
            else if(oznakaTure=="Kay")
            {
                niz2018=[this.turaService.obradeniPodaci2018[1].BrojKay, this.turaService.obradeniPodaci2018[2].BrojKay, this.turaService.obradeniPodaci2018[3].BrojKay, this.turaService.obradeniPodaci2018[4].BrojKay,this.turaService.obradeniPodaci2018[5].BrojKay,this.turaService.obradeniPodaci2018[6].BrojKay,this.turaService.obradeniPodaci2018[7].BrojKay,this.turaService.obradeniPodaci2018[0].BrojKay,0];
            }
            else if(oznakaTure=="Hik")
            {
                niz2018=[this.turaService.obradeniPodaci2018[1].BrojHik, this.turaService.obradeniPodaci2018[2].BrojHik, this.turaService.obradeniPodaci2018[3].BrojHik, this.turaService.obradeniPodaci2018[4].BrojHik,this.turaService.obradeniPodaci2018[5].BrojHik,this.turaService.obradeniPodaci2018[6].BrojHik,this.turaService.obradeniPodaci2018[7].BrojHik,this.turaService.obradeniPodaci2018[0].BrojHik,0];
            }
            else if(oznakaTure=="Cyc")
            {
                niz2018=[this.turaService.obradeniPodaci2018[1].BrojCyc, this.turaService.obradeniPodaci2018[2].BrojCyc, this.turaService.obradeniPodaci2018[3].BrojCyc, this.turaService.obradeniPodaci2018[4].BrojCyc,this.turaService.obradeniPodaci2018[5].BrojCyc,this.turaService.obradeniPodaci2018[6].BrojCyc,this.turaService.obradeniPodaci2018[7].BrojCyc,this.turaService.obradeniPodaci2018[0].BrojCyc,0];
            }
            else if(oznakaTure=="RCli")
            {
                niz2018=[0,0,0,0,0,0,0,0,0];
            }

            let niz2019;
            if(oznakaTure=="Sve")
            {
                niz2019=[this.turaService.obradeniPodaci2019[1].BrojTura, this.turaService.obradeniPodaci2019[2].BrojTura, this.turaService.obradeniPodaci2019[3].BrojTura, this.turaService.obradeniPodaci2019[4].BrojTura,this.turaService.obradeniPodaci2019[5].BrojTura,this.turaService.obradeniPodaci2019[6].BrojTura,this.turaService.obradeniPodaci2019[7].BrojTura,this.turaService.obradeniPodaci2019[0].BrojTura,0];
            }
            else if(oznakaTure=="CanBas")
            {
                niz2019=[this.turaService.obradeniPodaci2019[1].BrojCanBas, this.turaService.obradeniPodaci2019[2].BrojCanBas, this.turaService.obradeniPodaci2019[3].BrojCanBas, this.turaService.obradeniPodaci2019[4].BrojCanBas,this.turaService.obradeniPodaci2019[5].BrojCanBas,this.turaService.obradeniPodaci2019[6].BrojCanBas,this.turaService.obradeniPodaci2019[7].BrojCanBas,this.turaService.obradeniPodaci2019[0].BrojCanBas,0];
            }
            else if(oznakaTure=="CanAdv")
            {
                niz2019=[this.turaService.obradeniPodaci2019[1].BrojCanAdv, this.turaService.obradeniPodaci2019[2].BrojCanAdv, this.turaService.obradeniPodaci2019[3].BrojCanAdv, this.turaService.obradeniPodaci2019[4].BrojCanAdv,this.turaService.obradeniPodaci2019[5].BrojCanAdv,this.turaService.obradeniPodaci2019[6].BrojCanAdv,this.turaService.obradeniPodaci2019[7].BrojCanAdv,this.turaService.obradeniPodaci2019[0].BrojCanAdv,0];
            }
            else if(oznakaTure=="Kay")
            {
                niz2019=[this.turaService.obradeniPodaci2019[1].BrojKay, this.turaService.obradeniPodaci2019[2].BrojKay, this.turaService.obradeniPodaci2019[3].BrojKay, this.turaService.obradeniPodaci2019[4].BrojKay,this.turaService.obradeniPodaci2019[5].BrojKay,this.turaService.obradeniPodaci2019[6].BrojKay,this.turaService.obradeniPodaci2019[7].BrojKay,this.turaService.obradeniPodaci2019[0].BrojKay,0];
            }
            else if(oznakaTure=="Hik")
            {
                niz2019=[this.turaService.obradeniPodaci2019[1].BrojHik, this.turaService.obradeniPodaci2019[2].BrojHik, this.turaService.obradeniPodaci2019[3].BrojHik, this.turaService.obradeniPodaci2019[4].BrojHik,this.turaService.obradeniPodaci2019[5].BrojHik,this.turaService.obradeniPodaci2019[6].BrojHik,this.turaService.obradeniPodaci2019[7].BrojHik,this.turaService.obradeniPodaci2019[0].BrojHik,0];
            }
            else if(oznakaTure=="Cyc")
            {
                niz2019=[this.turaService.obradeniPodaci2019[1].BrojCyc, this.turaService.obradeniPodaci2019[2].BrojCyc, this.turaService.obradeniPodaci2019[3].BrojCyc, this.turaService.obradeniPodaci2019[4].BrojCyc,this.turaService.obradeniPodaci2019[5].BrojCyc,this.turaService.obradeniPodaci2019[6].BrojCyc,this.turaService.obradeniPodaci2019[7].BrojCyc,this.turaService.obradeniPodaci2019[0].BrojCyc,0];
            }
            else if(oznakaTure=="RCli")
            {
                niz2019=[0,0,0,0,0,0,0,0,0];
            }

            let niz2020;
            if(oznakaTure=="Sve")
            {
                niz2020=[this.turaService.obradeniPodaci2020[1].BrojTura, this.turaService.obradeniPodaci2020[2].BrojTura, this.turaService.obradeniPodaci2020[3].BrojTura, this.turaService.obradeniPodaci2020[4].BrojTura,this.turaService.obradeniPodaci2020[5].BrojTura,this.turaService.obradeniPodaci2020[6].BrojTura,this.turaService.obradeniPodaci2020[7].BrojTura,this.turaService.obradeniPodaci2020[0].BrojTura,0];
            }
            else if(oznakaTure=="CanBas")
            {
                niz2020=[this.turaService.obradeniPodaci2020[1].BrojCanBas, this.turaService.obradeniPodaci2020[2].BrojCanBas, this.turaService.obradeniPodaci2020[3].BrojCanBas, this.turaService.obradeniPodaci2020[4].BrojCanBas,this.turaService.obradeniPodaci2020[5].BrojCanBas,this.turaService.obradeniPodaci2020[6].BrojCanBas,this.turaService.obradeniPodaci2020[7].BrojCanBas,this.turaService.obradeniPodaci2020[0].BrojCanBas,0];
            }
            else if(oznakaTure=="CanAdv")
            {
                niz2020=[this.turaService.obradeniPodaci2020[1].BrojCanAdv, this.turaService.obradeniPodaci2020[2].BrojCanAdv, this.turaService.obradeniPodaci2020[3].BrojCanAdv, this.turaService.obradeniPodaci2020[4].BrojCanAdv,this.turaService.obradeniPodaci2020[5].BrojCanAdv,this.turaService.obradeniPodaci2020[6].BrojCanAdv,this.turaService.obradeniPodaci2020[7].BrojCanAdv,this.turaService.obradeniPodaci2020[0].BrojCanAdv,0];
            }
            else if(oznakaTure=="Kay")
            {
                niz2020=[this.turaService.obradeniPodaci2020[1].BrojKay, this.turaService.obradeniPodaci2020[2].BrojKay, this.turaService.obradeniPodaci2020[3].BrojKay, this.turaService.obradeniPodaci2020[4].BrojKay,this.turaService.obradeniPodaci2020[5].BrojKay,this.turaService.obradeniPodaci2020[6].BrojKay,this.turaService.obradeniPodaci2020[7].BrojKay,this.turaService.obradeniPodaci2020[0].BrojKay,0];
            }
            else if(oznakaTure=="Hik")
            {
                niz2020=[this.turaService.obradeniPodaci2020[1].BrojHik, this.turaService.obradeniPodaci2020[2].BrojHik, this.turaService.obradeniPodaci2020[3].BrojHik, this.turaService.obradeniPodaci2020[4].BrojHik,this.turaService.obradeniPodaci2020[5].BrojHik,this.turaService.obradeniPodaci2020[6].BrojHik,this.turaService.obradeniPodaci2020[7].BrojHik,this.turaService.obradeniPodaci2020[0].BrojHik,0];
            }
            else if(oznakaTure=="Cyc")
            {
                niz2020=[this.turaService.obradeniPodaci2020[1].BrojCyc, this.turaService.obradeniPodaci2020[2].BrojCyc, this.turaService.obradeniPodaci2020[3].BrojCyc, this.turaService.obradeniPodaci2020[4].BrojCyc,this.turaService.obradeniPodaci2020[5].BrojCyc,this.turaService.obradeniPodaci2020[6].BrojCyc,this.turaService.obradeniPodaci2020[7].BrojCyc,this.turaService.obradeniPodaci2020[0].BrojCyc,0];
            }
            else if(oznakaTure=="RCli")
            {
                niz2020=[0,0,0,0,0,0,0,0,0];
            }

            dataSetTemp=[                                
                {
                    label: '2018',
                    //Pogledaj Bazu,zbog krivog numeriranja listopad(10) je prvi u nizu a poslije toga mjeseci idu redom krečuci od ozujka
                    //2018-e, u studenom nisam radio pa je 0
                    data: niz2018,
                    fill:false,
                    lineTension:0.1,
                    borderColor:"white",
                    borderWidth: 1.5,
                    backgroundColor:'rgba(255, 255, 255, 1)',     
                },
                {
                    label: '2019',
                    //Pogledaj Bazu,zbog krivog numeriranja listopad(10) je prvi u nizu a poslije toga mjeseci idu redom krečuci od ozujka
                    //2018-e, u studenom nisam radio pa je 0
                    data: niz2019,
                    fill:false,
                    lineTension:0.1,
                    borderColor:"red",
                    borderWidth: 1.5,
                    backgroundColor:'rgba(255, 0, 0, 1)',     
                },
                {
                    label: '2020',
                    data: niz2020,
                    fill:false,
                    lineTension:0.1,
                    borderColor:"black",
                    borderWidth: 1.5,
                    backgroundColor:'rgba(0, 0, 0, 1)',   
                },
                {
                    label: '2021',
                    data: this.turePoMjesecima,
                    fill:false,
                    lineTension:0.1,
                    borderColor:"green",
                    borderWidth: 1.5,
                    backgroundColor:'rgba(0, 255, 0, 1)',   
                }
            ]
        }
        else
        {
            dataSetTemp=[{
                label: '2019',
                data: this.turePoMjesecima,
                fill:false,
                lineTension:0.1,
                borderColor:"black",
                borderWidth: 1.5,
                backgroundColor:'rgba(0, 0, 0, 1)',   
            }]
        }

        // LINE CHART
        //#region 
        this.LineChart = new Chart('lineChart', {
            type: 'line',
            data: 
            {
                labels: ["Ožu", "Tra", "Svi", "Lip", "Srp","Kol","Ruj","Lis","Stu"],
                datasets: dataSetTemp
                
            }, 
            options: {
            title:{
                text:"Ukupan broj tura ( "+oznakaTure+" )",
                display:true
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            responsive: true
            }
            });
            //#endregion 
    }
}