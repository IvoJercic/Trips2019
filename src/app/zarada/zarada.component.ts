import { Component, OnInit } from '@angular/core';
import { TuraService } from '../shared/ture.service';
import {Chart} from 'chart.js';
import * as $ from 'jquery';

@Component({
    selector:"pm-zarada",
    templateUrl: './zarada.component.html',
    styleUrls: ['./zarada.component.css']
})

export class ZaradaComponent implements OnInit
{
    PieChart=[];
    LineChart=[];
    zaradaPlaca:number;
    zaradaBaksis:number;
    zaradaVoznja:number;
    zaradaSlike:number;

    zCanBas:number;
    zCanAdv:number;
    zKay:number;
    zHik:number
    zCyc:number;
    zRCli:number;

    podaciPoMjesecima:Array<number>;

    constructor(private turaService:TuraService){}

    ngOnInit()
    {
        this.openTab("vrsta");
        this.zaradaPlaca=parseInt(localStorage.getItem("Placa"));
        this.zaradaBaksis=parseInt(localStorage.getItem("Baksis"));
        this.zaradaSlike=parseInt(localStorage.getItem("Slike"));
        this.zaradaVoznja=parseInt(localStorage.getItem("Voznja"));        

        //Zarada po aktivnostima
        let nizZarada =this.turaService.zaradaPoVrsti();
        this.zCanBas=nizZarada[1];
        this.zCanAdv=nizZarada[2];
        this.zKay=nizZarada[3];
        this.zHik=nizZarada[4];
        this.zCyc=nizZarada[5];
        this.zRCli=nizZarada[6];
        
        //PIE CHART za zaradu po nacinzu
        //#region 
        this.PieChart = new Chart('pieChart', {
            type: 'pie',
            data: {
                labels: ["Placa", "Baksis", "Slike", "Voznja"],
                datasets: [{
                    label: 'Broj tura',
                    data: [this.zaradaPlaca,this.zaradaBaksis,this.zaradaSlike,this.zaradaVoznja],
                    backgroundColor: [                      
                        'rgba(0, 0, 0, 1)',
                        'rgba(0, 155, 0, 1)',
                        'rgba(190, 190, 190, 1)',
                        'rgba(255, 255, 255, 1)',
        ],       
        borderColor: [
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
                text:"Zarada po nacinu",
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

        //PIE CHART za zaradu po vrsti
        //#region 
        this.PieChart = new Chart('pieChart2', {
            type: 'pie',
            data: {
                labels: ["CanBas", "Kay", "Hik", "Cyc","CanAdv","RCli"],
                datasets: [{
                    label: 'Broj tura',
                    data: [this.zCanBas,this.zKay,this.zHik,this.zCyc,this.zCanAdv,this.zRCli],
                    backgroundColor: [                      
                        'rgba(0, 0, 0, 1)',
                        'rgba(0, 155, 0, 1)',
                        'rgba(190, 190, 190, 1)',
                        'rgba(255, 255, 255, 1)',
                        'rgba(0, 128, 255, 1)',
                        'rgba(255, 255, 0, 1)',
        ],       
        borderColor: [
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)'
],
        borderWidth: 1.5
        }]
        }, 
        options: {
            responsive:false,
            title:{
                text:"Zarada po vrsti",
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

        //Pomocu "zaradaUMjesecu" izlistavamo sve ture te sumiramo zaradu po mjesecu
        let podaciZaMjesec=[];
        this.podaciPoMjesecima=[];
        for(let i=3;i<12;i++)
        {
            podaciZaMjesec=this.turaService.zaradaUMjesecu(i);
            this.podaciPoMjesecima.push(podaciZaMjesec[0]);
        }

        let dataSetTemp;
        //Ovisi dali podaci od prosle godine postoje ili ne,ako nisu saljemo grafu samo podatke ove godine
        //Zastavica se postavlja u pregled.component u ngOnInit metodi
        if(this.turaService.postojePodaciOdGodinePrije==true)
        {
            dataSetTemp=[                                
                {
                    label: '2018',
                    //Pogledaj Bazu,zbog krivog numeriranja listopad(10) je prvi u nizu a poslije toga mjeseci idu redom krečuci od ozujka
                    //2018-e, u studenom nisam radio pa je 0
                    data: [this.turaService.obradeniPodaci2018[1].Ukupno, this.turaService.obradeniPodaci2018[2].Ukupno, this.turaService.obradeniPodaci2018[3].Ukupno, this.turaService.obradeniPodaci2018[4].Ukupno,this.turaService.obradeniPodaci2018[5].Ukupno,this.turaService.obradeniPodaci2018[6].Ukupno,this.turaService.obradeniPodaci2018[7].Ukupno,this.turaService.obradeniPodaci2018[0].Ukupno,0],
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
                    data: [this.turaService.obradeniPodaci2019[1].Ukupno, this.turaService.obradeniPodaci2019[2].Ukupno, this.turaService.obradeniPodaci2019[3].Ukupno, this.turaService.obradeniPodaci2019[4].Ukupno,this.turaService.obradeniPodaci2019[5].Ukupno,this.turaService.obradeniPodaci2019[6].Ukupno,this.turaService.obradeniPodaci2019[7].Ukupno,this.turaService.obradeniPodaci2019[0].Ukupno,0],
                    fill:false,
                    lineTension:0.1,
                    borderColor:"red",
                    borderWidth: 1.5,
                    backgroundColor:'rgba(255, 0, 0, 1)',     
                },
                {
                    label: '2020',
                    data: [this.turaService.obradeniPodaci2020[1].Ukupno, this.turaService.obradeniPodaci2020[2].Ukupno, this.turaService.obradeniPodaci2020[3].Ukupno, this.turaService.obradeniPodaci2020[4].Ukupno,this.turaService.obradeniPodaci2020[5].Ukupno,this.turaService.obradeniPodaci2020[6].Ukupno,this.turaService.obradeniPodaci2020[7].Ukupno,this.turaService.obradeniPodaci2020[0].Ukupno,0],
                    fill:false,
                    lineTension:0.1,
                    borderColor:"black",
                    borderWidth: 1.5,
                    backgroundColor:'rgba(0, 0, 0, 1)',   
                }
                ,
                {
                    label: '2021',
                    data: this.podaciPoMjesecima,
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
                label: '2020',
                data: this.podaciPoMjesecima,
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
            text:"Zarada po mjesecu",
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

    openTab( tabName):void
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
        if(tabName=="vrsta")
        {
            $("#lblPoVrsti").prop("disabled",true);
            $("#lblPoMjesecu").prop("disabled",false);
            $("#lblPoNacinu").prop("disabled",false);

        }
        else if(tabName=="nacin")
        {
            $("#lblPoMjesecu").prop("disabled",false);
            $("#lblPoVrsti").prop("disabled",false);
            $("#lblPoNacinu").prop("disabled",true);
        }
        else
        {
            $("#lblPoMjesecu").prop("disabled",true);
            $("#lblPoVrsti").prop("disabled",false);
            $("#lblPoNacinu").prop("disabled",false);
        }
    }  
}
