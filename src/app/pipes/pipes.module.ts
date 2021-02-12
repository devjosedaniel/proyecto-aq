import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSanitizerPipe } from './image-sanitizer.pipe';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';



@NgModule({
  declarations: [ImageSanitizerPipe, DomSanitizerPipe],
  imports: [
    CommonModule
  ],
  exports: [
    ImageSanitizerPipe,
    DomSanitizerPipe
  ]
})
export class PipesModule { }
