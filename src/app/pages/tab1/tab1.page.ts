import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TrabajosService } from '../../services/trabajos.service';
import { IonSegment } from '@ionic/angular';
import { Trabajo } from '../../interfaces/interfaces';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, AfterViewInit {
  TodosTrabajo: Trabajo[] = [];
  trabajos: Trabajo[] = [];
  encargados = [];
  trabajosEncargado: Trabajo[] = [];
  @ViewChild(IonSegment, { static: true }) segment: IonSegment;
  constructor(private trabajosService: TrabajosService) { }


  async ngOnInit() {

    await this.trabajosService.getTrabajos()
      .subscribe((t) => {
        // ... para agregar uno por uno al arreglo
        this.trabajos.push(...t.trabajos);
        this.TodosTrabajo.push(...t.trabajos);
        this.listarEncargados();
      });

  }
  recargar(event) {
    this.trabajosService.getTrabajos()
      .subscribe((t) => {
        this.trabajos = [];
        this.TodosTrabajo = [];
        this.trabajos.push(...t.trabajos);
        this.TodosTrabajo.push(...t.trabajos);
      });
    event.target.complete();
    this.segment.value = 'todos';
  }

  listarEncargados() {
    if (this.trabajos) {
      for (const trab of this.trabajos) {

        const existe = this.encargados.find(e => e === trab.encargado);
        if (!existe) {
          this.encargados.push(trab.encargado);
        }

      }
    }
    // console.log(this.encargados);
  }
  ngAfterViewInit() {
    this.segment.value = 'todos';
  }

  select(event) {
    const e = event.target.value;
    if (e === 'todos') {
      this.trabajos = this.TodosTrabajo;
    } else {

      this.trabajos = this.TodosTrabajo.filter(t => {
        if (t.encargado === e) {
          return t;
        }
      });
    }
  }
}
