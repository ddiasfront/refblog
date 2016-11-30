import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotoComponent }   from './photo.component';

const photoRoutes: Routes = [
  { path: 'photo',  component: PhotoComponent },
];
@NgModule({
  imports: [ RouterModule.forChild(photoRoutes) ],
  exports: [ RouterModule ]
})
export class PhotoRoutingModule {}