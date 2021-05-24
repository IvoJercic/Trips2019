import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { TuraService } from '../shared/ture.service';
import { saveAs } from 'file-saver';

@Component({
    selector:"pm-prijava",
    templateUrl: './prijava.component.html',
    styleUrls: ['./prijava.component.css']
})

export class PrijavaComponent implements OnInit
{
    event:Event;
    constructor(private turaService: TuraService) {}  
    
    ngOnInit():void
    {
        //2.5 sekundi pustimo da se aplikacija ucita
        this.openTab("prijava");
        $("#btnPrijava").attr('disabled','disabled');
        $("#btnPrijava").text("Ucitavanje");
        setTimeout(function(){ 
            $("#btnPrijava").text("Prijavi se");
            $("#btnPrijava").prop("disabled",false);
        }, 2500);
    }
    
    openTab(tabName):void
    {
        //Funkcija za toogle tabova za registraciju i prijavu
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        if(tabName=="prijava")
        {
            $("#lblPrijava").prop("disabled",true);
            $("#lblRegistracija").prop("disabled",false);
        }
        else if(tabName=="registracija")
        {
            $("#lblRegistracija").prop("disabled",true);
            $("#lblPrijava").prop("disabled",false);
            $("#lblPreuzmi").prop("disabled",false);

        }
        else if(tabName=="preuzmi")
        {
            $("#lblRegistracija").prop("disabled",false);
            $("#lblPrijava").prop("disabled",false);
            $("#lblPreuzmi").prop("disabled",true);
        }
        $("#btnRegistracija").prop("disabled",false);
        $("#btnPrijava").prop("disabled",false);
        $("#btnPreuzmi").prop("disabled",false);
    }      
    
    registracija():void
    {
        //Prije nego posaljemo mail i sigru u metodu za kreiranje novog korisnika potrebno je napraviti provjeru unosa sifre
        //Nisam radio provjeru za mail jer FireStore sam to provjerava i javit ce gresku u slucaju nevaljanog emaila
        let email=$("#register").val();
        let password=$("#passwordRegistracija").val();
        let password2=$("#passwordPonovljena").val();
        if(password.length>7)
        {
            if(password==password2)
            {
                $("#btnRegistracija").prop("disabled",true);
                this.turaService.registrirajKorisnika(email,password);
                //Preusmjeravmo korsnika na prijavu
                $("#register").val("");
                $("#passwordRegistracija").val("");
                $("#passwordPonovljena").val("");    

                this.openTab("prijava");
            }
            else
            {
                alert("Potrebno je unijeti istu lozinku 2 puta !");
                $("#passwordRegistracija").val("");
                $("#passwordPonovljena").val("");    
            }
        }
        else
        {
            alert("Lozinka mora sadrzavati minimalno 8 znakova !");
            $("#passwordRegistracija").val("");
        }
    }

    prijava():void
    {
        let email=$("#login").val();
        let password=$("#passwordPrijava").val(); 
        if(password.length<8)
        {
            alert("Vaša lozinka ima minimalno 8 znakova !");       
            $("#passwordPrijava").val("");     
        }
        else
        {      
            $("#btnPrijava").prop("disabled",true);
            this.turaService.trenutnoPrijavljen=email;
            this.turaService.prijaviKorisnika(email,password);
        }  
    }

    preuzmi():void
    {
        let email=$("#loginPreuzmi").val();
        let password=$("#passwordPreuzmi").val(); 
        if(password.length<8)
        {
            alert("Vaša lozinka ima minimalno 8 znakova !");       
            $("#passwordPrijava").val("");     
        }
        else
        {      
            $("#btnPrijava").prop("disabled",true);
            this.turaService.trenutnoPrijavljen=email;
            this.turaService.preuzmiPodatkeKorisnika(email,password);

            setTimeout(() => {
                this.turaService.dohvaceniPodaci2019.subscribe(
                    data => {
                        this.turaService.obradeniPodaci2019 = data;
                        //console.log(data);
                        this.downloadFile(data);

                    });
            }, 2500);

        }  
    }

    downloadFile(data: any) {
        const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
        const header = Object.keys(data[0]);
        let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
        csv.unshift(header.join(';'));
        let csvArray = csv.join('\r\n');

        var blob = new Blob([csvArray], {type: 'text/csv' })
        let email=$("#loginPreuzmi").val();
        let fileName="DATA"+email+".csv";
        saveAs(blob,fileName);
    }
}
