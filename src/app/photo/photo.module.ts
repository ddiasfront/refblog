import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoComponent } from './photo.component';
import {PhotoRoutingModule} from './photo.routing';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    PhotoRoutingModule,
    FormsModule
  ],
  declarations: [
    PhotoComponent,
    ]
})
export class PhotoModule { }
