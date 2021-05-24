import { Component, OnInit } from '@angular/core';
import { TuraService } from '../shared/ture.service';
import {Chart} from 'chart.js';
import * as $ from 'jquery';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector:"pm-kolege",
    templateUrl: './kolege.component.html',
    styleUrls: ['./kolege.component.css']
})


export class KolegeComponent implements OnInit
{
    constructor(private turaService:TuraService,
                private modalService: NgbModal,
                ){}

    PieChart=[];
    nizKolega:Array<string>=["Solo","IvoB","Jerko","Junto","Toni","Mata","AnteK","Rata","IvoJ"];
    putaZajedno:Array<Kolega>=[];
    zaGraf:Array<number>=[];
    kolega:Kolega;
    

    ngOnInit()
    {        
        this.nizKolega.forEach(element => {
            //U konstruktor saljemo parametre            
            this.kolega=new Kolega(element,this.turaService.turaSKolegom(element));            
            this.putaZajedno.push(this.kolega);
            this.zaGraf.push(this.kolega.Ukupno);
        });

        //PIE CHART za zaradu po vrsti
        //#region 
        this.PieChart = new Chart('pieChart', {
            type: 'pie',
            data: {
                labels: this.nizKolega,
                datasets: [{
                    label: 'Broj tura s kolegom',
                    data: this.zaGraf,
                    backgroundColor: [                      
                        'rgba(0, 0, 0, 1)',
                        'rgba(190, 190, 190, 1)',
                        'rgba(0, 155, 0, 1)',
                        'rgba(0, 128, 255, 1)',
                        'rgba(255, 102, 102, 1)',
                        'rgba(255, 255, 55, 1)',
                        'rgba(127, 0, 255, 1)',
                        'rgba(255, 255, 255, 1)',
                        'rgba(255, 0, 0, 1)',

        ],       
        borderColor: [
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
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
                text:"Broj tura s kolegom",
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
    }

    open(content,ime:string):void
    {        
        this.modalService.open(content, {windowClass: 'dark-modal'});
        $("#modal-basic-title").text(ime);

        //Korisnik posaljie ime kolege, nademo njegov indeks u nizu kolega koji je paralelan sa nizom "puta zajedno"
        let i=this.nizKolega.indexOf(ime);
        $("#lblCanBas").text(this.putaZajedno[i].CanBas);
        $("#lblCanAdv").text(this.putaZajedno[i].CanAdv);
        $("#lblKay").text(this.putaZajedno[i].Kay);
        $("#lblHik").text(this.putaZajedno[i].Hik);
        $("#lblCyc").text(this.putaZajedno[i].Cyc);
        $("#lblRCli").text(this.putaZajedno[i].RCli);
        $("#lblUkupno").text(this.putaZajedno[i].Ukupno);
    }
}

class Kolega
{
    Ime:string;
    Ukupno:number;
    CanBas:number;
    CanAdv:number;
    Kay:number;
    Hik:number;
    Cyc:number;
    RCli:number;    
    constructor(ime:string,podaci:Array<number>)
    {
        this.Ime=ime;
        this.Ukupno=podaci[0];
        this.CanBas=podaci[1];
        this.CanAdv=podaci[2];
        this.Kay=podaci[3];
        this.Hik=podaci[4];
        this.Cyc=podaci[5];
        this.RCli=podaci[6];
    }
}