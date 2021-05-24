import { Component, OnInit } from '@angular/core';
import { TuraService } from '../shared/ture.service';
import * as $ from 'jquery';
import { ITura } from '../shared/tura.interface';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Chart} from 'chart.js';

@Component({
    selector:"pm-duple",
    templateUrl: './duple.component.html',
    styleUrls: ['./duple.component.css']
})

export class DupleComponent implements OnInit
{
    nizDuplih:Array<ITura>=[];
    duplePoMjesecima:Array<number>=[];
    LineChart=[];

    constructor(private turaService:TuraService,
        private modalService: NgbModal,
        ){}

    ngOnInit()
    {
        this.nizDuplih=this.turaService.dupleTure();
        this.duplePoMjesecima=this.turaService.dupleTurePoMjesecima();

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
                    data: [this.turaService.obradeniPodaci2018[1].Duple, this.turaService.obradeniPodaci2018[2].Duple, this.turaService.obradeniPodaci2018[3].Duple, this.turaService.obradeniPodaci2018[4].Duple,this.turaService.obradeniPodaci2018[5].Duple,this.turaService.obradeniPodaci2018[6].Duple,this.turaService.obradeniPodaci2018[7].Duple,this.turaService.obradeniPodaci2018[0].Duple,0],
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
                    data: [this.turaService.obradeniPodaci2019[1].Duple, this.turaService.obradeniPodaci2019[2].Duple, this.turaService.obradeniPodaci2019[3].Duple, this.turaService.obradeniPodaci2019[4].Duple,this.turaService.obradeniPodaci2019[5].Duple,this.turaService.obradeniPodaci2019[6].Duple,this.turaService.obradeniPodaci2019[7].Duple,this.turaService.obradeniPodaci2019[0].Duple,0],
                    fill:false,
                    lineTension:0.1,
                    borderColor:"red",
                    borderWidth: 1.5,
                    backgroundColor:'rgba(255, 0, 0, 1)',     
                },
                {
                    label: '2020',
                    data: [this.turaService.obradeniPodaci2020[1].Duple, this.turaService.obradeniPodaci2020[2].Duple, this.turaService.obradeniPodaci2020[3].Duple, this.turaService.obradeniPodaci2020[4].Duple,this.turaService.obradeniPodaci2020[5].Duple,this.turaService.obradeniPodaci2020[6].Duple,this.turaService.obradeniPodaci2020[7].Duple,this.turaService.obradeniPodaci2020[0].Duple,0],
                    fill:false,
                    lineTension:0.1,
                    borderColor:"black",
                    borderWidth: 1.5,
                    backgroundColor:'rgba(0, 0, 0, 1)',   
                },
                {
                    label: '2021',
                    data: this.duplePoMjesecima,
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
                data: this.duplePoMjesecima,
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
            text:"Duple po mjesecu",
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

    open(content,tura:ITura):void
    {        
        this.modalService.open(content, {windowClass: 'dark-modal'});

        //Ispis podataka ture u modal box
        $("#modal-basic-title").text("Detalji ture "+"#"+tura.RedniBroj);
        $("#lblDatum").text(tura.Datum);
        $("#lblVrijeme").text(tura.Vrijeme);
        $("#lblVrsta").text(tura.Vrsta);
        $("#lblPlaca").text(tura.Placa);
        $("#lblBaksis").text(tura.Baksis);
        $("#lblSlike").text(tura.Slike);
        $("#lblVoznja").text(tura.Voznja);
        $("#lblGosti").text(tura.Gosti);
        $("#lblIzvlacenja").text(tura.Izvlacenja);
        $("#lblKolege").text(tura.Kolege);
        $("#lblUkupno").text(tura.Ukupno);
    }
}