import { Component, OnInit, Input } from '@angular/core';
import { Trabajo } from '../../interfaces/interfaces';

@Component({
  selector: 'app-trabajos',
  templateUrl: './trabajos.component.html',
  styleUrls: ['./trabajos.component.scss'],
})
export class TrabajosComponent implements OnInit {
  @Input() trabajos: Trabajo[] = [];
  constructor() { }

  ngOnInit() {
    // console.log(this.trabajos);
  }

}
