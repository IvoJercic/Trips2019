import { Component, OnInit } from '@angular/core';
import { TuraService } from '../shared/ture.service';
import {Chart} from 'chart.js';
import * as $ from 'jquery';

@Component({
    selector:"pm-gostiPoTuri",
    templateUrl: './gostiPoTuri.component.html',
    styleUrls: ['./gostiPoTuri.component.css']
})

export class GostiPoTuriComponent implements OnInit
{
    event:Event;

    PieChart=[];
    LineChart=[];
    prosjekGostiju:number;

    turaPoMjesecu:Array<number>=[];
    podaciPoMjesecima:Array<number>;//Broj gostiju po mjesecu
    prosjekGostijuPoMjesecu:Array<number>=[];

    gostiPoVrstiTure:Array<number>=[];
    brojTurePoVrstiTure:Array<number>=[];
    prosjekGostijuPoVrstiTure:Array<number>=[];
    
    constructor(private turaService:TuraService){}

    ngOnInit()
    {
        this.openTab("vrsta");
        this.prosjekGostiju=Number((parseInt(localStorage.getItem("Gostiju"))/parseInt(localStorage.getItem("UkupnoTura"))).toFixed(2));

         //Pomocu "zaradaUMjesecu" izlistavamo sve ture te sumiramo zaradu po mjesecu
         let podaciZaMjesec=[];
         this.podaciPoMjesecima=[];
         this.turaPoMjesecu=[];
         this.gostiPoVrstiTure=[0,0,0,0,0,0];//Postavljamo ovo na 0 svaki put kad se instancira komponenta
         this.brojTurePoVrstiTure=[parseInt(localStorage.getItem("UkupnoCanBas")),parseInt(localStorage.getItem("UkupnoCanAdv")),parseInt(localStorage.getItem("UkupnoKay")),parseInt(localStorage.getItem("UkupnoHik")),parseInt(localStorage.getItem("UkupnoCyc")),parseInt(localStorage.getItem("UkupnoRCli"))];

         for(let i=3;i<12;i++)
         {
             podaciZaMjesec=this.turaService.gostijuUMjesecu(i);
             this.gostiPoVrstiTure[0]+=podaciZaMjesec[1];
             this.gostiPoVrstiTure[1]+=podaciZaMjesec[2];
             this.gostiPoVrstiTure[2]+=podaciZaMjesec[3];
             this.gostiPoVrstiTure[3]+=podaciZaMjesec[4];
             this.gostiPoVrstiTure[4]+=podaciZaMjesec[5];
             this.gostiPoVrstiTure[5]+=podaciZaMjesec[6];

             this.podaciPoMjesecima.push(podaciZaMjesec[0]);
             this.turaPoMjesecu.push(this.turaService.turauUMjesecu(i)[0]);             
         }

         
         //Imamo broj gostiju i broj tura po misecima, sad samo podjeli to
         for(let i=0;i<this.podaciPoMjesecima.length;i++)
         {
            let t;            
            if(this.podaciPoMjesecima[i]==0 || this.turaPoMjesecu[i]==0 )
            {
                t=0;
            }
            else
            {
                t=(this.podaciPoMjesecima[i]/this.turaPoMjesecu[i]).toFixed(2);
            }
            this.prosjekGostijuPoMjesecu.push(t);
         }

         //Prosjek po vrsti ture
         for(let i=0;i<this.gostiPoVrstiTure.length;i++)
         {
            let t;            
            if(this.gostiPoVrstiTure[i]==0 || this.brojTurePoVrstiTure[i]==0 )
            {
                t=0;
            }
            else
            {
                t=(this.gostiPoVrstiTure[i]/this.brojTurePoVrstiTure[i]).toFixed(2);
            }
            this.prosjekGostijuPoVrstiTure.push(t);
         }
        
        //PIE CHART
        //#region 
        this.PieChart = new Chart('pieChart', {
            type: 'pie',
            data: {
                labels: ["CanBas", "CanAdv", "Kay", "Hik","Cyc","RCli"],
                datasets: 
                [{
                    label: 'Prosjek gostiju po vrsti ture',
                    data: this.prosjekGostijuPoVrstiTure,
                    backgroundColor: 
                    [
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
                        text:"Prosjek gostiju po vrsti",
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
                     data: [this.turaService.obradeniPodaci2018[1].GPT, this.turaService.obradeniPodaci2018[2].GPT, this.turaService.obradeniPodaci2018[3].GPT, this.turaService.obradeniPodaci2018[4].GPT,this.turaService.obradeniPodaci2018[5].GPT,this.turaService.obradeniPodaci2018[6].GPT,this.turaService.obradeniPodaci2018[7].GPT,this.turaService.obradeniPodaci2018[0].GPT,0],
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
                    data: [this.turaService.obradeniPodaci2019[1].GPT, this.turaService.obradeniPodaci2019[2].GPT, this.turaService.obradeniPodaci2019[3].GPT, this.turaService.obradeniPodaci2019[4].GPT,this.turaService.obradeniPodaci2019[5].GPT,this.turaService.obradeniPodaci2019[6].GPT,this.turaService.obradeniPodaci2019[7].GPT,this.turaService.obradeniPodaci2019[0].GPT,0],
                    fill:false,
                    lineTension:0.1,
                    borderColor:"red",
                    borderWidth: 1.5,
                    backgroundColor:'rgba(255, 0, 0, 1)',     
                },
                 {
                     label: '2020',
                     data: [this.turaService.obradeniPodaci2020[1].GPT, this.turaService.obradeniPodaci2020[2].GPT, this.turaService.obradeniPodaci2020[3].GPT, this.turaService.obradeniPodaci2020[4].GPT,this.turaService.obradeniPodaci2020[5].GPT,this.turaService.obradeniPodaci2020[6].GPT,this.turaService.obradeniPodaci2020[7].GPT,this.turaService.obradeniPodaci2020[0].GPT,0],
                     fill:false,
                     lineTension:0.1,
                     borderColor:"black",
                     borderWidth: 1.5,
                     backgroundColor:'rgba(0, 0, 0, 1)',   
                 },
                 {
                     label: '2021',
                     data: this.prosjekGostijuPoMjesecu,
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
                 data: this.prosjekGostijuPoMjesecu,
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
             text:"Prosjek gostiju po mjesecu",
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
