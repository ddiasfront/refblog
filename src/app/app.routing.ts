import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogModule }   from './blog/blog.module';
import { PhotoModule }   from './photo/photo.module';
import { AppComponent }  from './app.component';
const appRoutes: Routes = [
  
  { 
    path: '', 
    redirectTo: '/blog', 
    pathMatch: 'full' 
  }
];
@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) , BlogModule, PhotoModule],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
