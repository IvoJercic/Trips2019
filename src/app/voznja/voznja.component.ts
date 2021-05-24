import { Component, OnInit } from '@angular/core';
import { TuraService } from '../shared/ture.service';
import {Chart} from 'chart.js';
import * as $ from 'jquery';

@Component({
    selector:"pm-voznja",
    templateUrl: './voznja.component.html',
    styleUrls: ['./voznja.component.css']
})

export class VoznjaComponent implements OnInit
{
    constructor(private turaService:TuraService){}
    event:Event;

    PieChart=[];
    LineChart=[];
    podaciPoMjesecima:Array<number>;
    vCanBas:number;
    vCanAdv:number;
    vKay:number;
    vHik:number
    vCyc:number;
    vRCli:number;

    ngOnInit()
    {
        this.openTab("vrsta");

        let podaciZaMjesec=[];
        this.podaciPoMjesecima=[];
        for(let i=3;i<12;i++)
        {
            podaciZaMjesec=this.turaService.zaradaUMjesecu(i);
            this.podaciPoMjesecima.push(podaciZaMjesec[4]);
        }

        //Zarada po aktivnostima
        let nizZarada =this.turaService.voznjaPoVrsti();
        this.vCanBas=nizZarada[1];
        this.vCanAdv=nizZarada[2];
        this.vKay=nizZarada[3];
        this.vHik=nizZarada[4];
        this.vCyc=nizZarada[5];
        this.vRCli=nizZarada[6];
        
        
        //PIE CHART za zaradu po vrsti
        //#region 
        this.PieChart = new Chart('pieChart', {
            type: 'pie',
            data: {
                labels: ["CanBas", "Kay", "Hik", "Cyc","CanAdv","RCli"],
                datasets: [{
                    label: 'Broj tura',
                    data: [this.vCanBas,this.vKay,this.vHik,this.vCyc,this.vCanAdv,this.vRCli],
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
                text:"Voznja po vrsti",
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
                    data: [this.turaService.obradeniPodaci2018[1].Voznja, this.turaService.obradeniPodaci2018[2].Voznja, this.turaService.obradeniPodaci2018[3].Voznja, this.turaService.obradeniPodaci2018[4].Voznja,this.turaService.obradeniPodaci2018[5].Voznja,this.turaService.obradeniPodaci2018[6].Voznja,this.turaService.obradeniPodaci2018[7].Voznja,this.turaService.obradeniPodaci2018[0].Voznja,0],
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
                    data: [this.turaService.obradeniPodaci2019[1].Voznja, this.turaService.obradeniPodaci2019[2].Voznja, this.turaService.obradeniPodaci2019[3].Voznja, this.turaService.obradeniPodaci2019[4].Voznja,this.turaService.obradeniPodaci2019[5].Voznja,this.turaService.obradeniPodaci2019[6].Voznja,this.turaService.obradeniPodaci2019[7].Voznja,this.turaService.obradeniPodaci2019[0].Voznja,0],
                    fill:false,
                    lineTension:0.1,
                    borderColor:"red",
                    borderWidth: 1.5,
                    backgroundColor:'rgba(255, 0, 0, 1)',     
                },
                {
                    label: '2020',
                    data: [this.turaService.obradeniPodaci2020[1].Voznja, this.turaService.obradeniPodaci2020[2].Voznja, this.turaService.obradeniPodaci2020[3].Voznja, this.turaService.obradeniPodaci2020[4].Voznja,this.turaService.obradeniPodaci2020[5].Voznja,this.turaService.obradeniPodaci2020[6].Voznja,this.turaService.obradeniPodaci2020[7].Voznja,this.turaService.obradeniPodaci2020[0].Voznja,0],
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
            text:"Voznja po mjesecu",
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