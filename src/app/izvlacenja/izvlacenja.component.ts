import { Component, OnInit } from '@angular/core';
import { TuraService } from '../shared/ture.service';
import * as $ from 'jquery';
import { ITura } from '../shared/tura.interface';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector:"pm-izvlacenja",
    templateUrl: './izvlacenja.component.html',
    styleUrls: ['./izvlacenja.component.css']
})

export class IzvlacenjaComponent implements OnInit
{
    //niz tura sa izvlacenjem
    nizTuraSI:Array<ITura>=[];
    constructor(private turaService:TuraService,
        private modalService: NgbModal,
        ){}

    ngOnInit()
    {
        this.nizTuraSI=this.turaService.tureSaIzvlacenjem();
    }

    open(content,tura:ITura):void
    {        
        this.modalService.open(content, {windowClass: 'dark-modal'});

        //Ispis podataka ture u modal box
        $("#modal-basic-title").text("Detalji ture "+"#"+tura.RedniBroj);
        $("#lblDatum").text(tura.Datum);
        $("#lblVrijeme").text(tura.Vrijeme);
        $("#lblVrsta").text(tura.Vrsta);
        $("#lblPlaca").text(tura.Placa+" kn");
        $("#lblBaksis").text(tura.Baksis+" kn");
        $("#lblSlike").text(tura.Slike+" kn");
        $("#lblVoznja").text(tura.Voznja+" kn");
        $("#lblGosti").text(tura.Gosti);
        $("#lblIzvlacenja").text(tura.Izvlacenja);
        $("#lblKolege").text(tura.Kolege);
        $("#lblUkupno").text(tura.Ukupno+" kn");
    }
}