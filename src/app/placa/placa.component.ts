import { Component, OnInit } from '@angular/core';
import { TuraService } from '../shared/ture.service';
import {Chart} from 'chart.js';
import * as $ from 'jquery';

@Component({
    selector:"pm-placa",
    templateUrl: './placa.component.html',
    styleUrls: ['./placa.component.css']
})

export class PlacaComponent implements OnInit
{
    constructor(private turaService:TuraService){}
    event:Event;

    PieChart=[];
    LineChart=[];
    podaciPoMjesecima:Array<number>;
    pCanBas:number;
    pCanAdv:number;
    pKay:number;
    pHik:number
    pCyc:number;
    pRCli:number;

    ngOnInit()
    {
        this.openTab("vrsta");

        let podaciZaMjesec=[];
        this.podaciPoMjesecima=[];
        for(let i=3;i<12;i++)
        {
            podaciZaMjesec=this.turaService.zaradaUMjesecu(i);
            this.podaciPoMjesecima.push(podaciZaMjesec[1]);
        }

        //Zarada po aktivnostima
        let nizZarada =this.turaService.placaPoVrsti();
        this.pCanBas=nizZarada[1];
        this.pCanAdv=nizZarada[2];
        this.pKay=nizZarada[3];
        this.pHik=nizZarada[4];
        this.pCyc=nizZarada[5];
        this.pRCli=nizZarada[6];
        
        //PIE CHART za zaradu po vrsti
        //#region 
        this.PieChart = new Chart('pieChart', {
            type: 'pie',
            data: {
                labels: ["CanBas", "Kay", "Hik", "Cyc","CanAdv","RCli"],
                datasets: [{
                    label: 'Broj tura',
                    data: [this.pCanBas,this.pKay,this.pHik,this.pCyc,this.pCanAdv,this.pRCli],
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
                text:"Placa po vrsti",
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
                    data: [this.turaService.obradeniPodaci2018[1].Placa, this.turaService.obradeniPodaci2018[2].Placa, this.turaService.obradeniPodaci2018[3].Placa, this.turaService.obradeniPodaci2018[4].Placa,this.turaService.obradeniPodaci2018[5].Placa,this.turaService.obradeniPodaci2018[6].Placa,this.turaService.obradeniPodaci2018[7].Placa,this.turaService.obradeniPodaci2018[0].Placa,0],
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
                    data: [this.turaService.obradeniPodaci2019[1].Placa, this.turaService.obradeniPodaci2019[2].Placa, this.turaService.obradeniPodaci2019[3].Placa, this.turaService.obradeniPodaci2019[4].Placa,this.turaService.obradeniPodaci2019[5].Placa,this.turaService.obradeniPodaci2019[6].Placa,this.turaService.obradeniPodaci2019[7].Placa,this.turaService.obradeniPodaci2019[0].Placa,0],
                    fill:false,
                    lineTension:0.1,
                    borderColor:"red",
                    borderWidth: 1.5,
                    backgroundColor:'rgba(255, 0, 0, 1)',     
                },
                {
                    label: '2020',
                    data: [this.turaService.obradeniPodaci2020[1].Placa, this.turaService.obradeniPodaci2020[2].Placa, this.turaService.obradeniPodaci2020[3].Placa, this.turaService.obradeniPodaci2020[4].Placa,this.turaService.obradeniPodaci2020[5].Placa,this.turaService.obradeniPodaci2020[6].Placa,this.turaService.obradeniPodaci2020[7].Placa,this.turaService.obradeniPodaci2020[0].Placa,0],
                    fill:false,
                    lineTension:0.1,
                    borderColor:"black",
                    borderWidth: 1.5,
                    backgroundColor:'rgba(0, 0, 0, 1)',   
                },
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
            text:"Placa po mjesecu",
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
        }
        else
        {
            $("#lblPoMjesecu").prop("disabled",true);
            $("#lblPoVrsti").prop("disabled",false);
        }
    }  
}