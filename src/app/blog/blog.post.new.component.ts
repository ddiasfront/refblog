import{Component,OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {FirebaseListObservable, AngularFire} from 'angularfire2';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { Observable } from 'rxjs';

declare var firebase: any;

interface Image {
    path: string;
    filename: string;
    downloadURL?: string;
    $key?: string;
}

@Component({
    selector:'blog-post-new',
    templateUrl: './blog.post.new.component.html'
})

export class BlogPostNewComponent {


    @Input() folder: string;

        fileList : FirebaseListObservable<Image[]>;
    imageList : Observable<Image[]>;

    items:FirebaseListObservable<any>;
    title:string;
    article:string;
    constructor(private af:AngularFire, private router: Router){

    }
    ngOnInit(){
    this.items = this.af.database.list('posts');
    console.log('i am here')
       console.log("new values for folder");
        let storage = firebase.storage();
        
        this.fileList = this.af.database.list(`/${this.folder}/images`);
        console.log("Rendering all images in ",`/${this.folder}/images`)
        this.imageList = this.fileList.map( itemList =>
            itemList.map( item => {
                var pathReference = storage.ref(item.path);
                let result = {$key: item.$key, downloadURL: pathReference.getDownloadURL(), path: item.path, filename: item.filename};
                console.log(result);
                return result;
            })
        );
    }
    add():void{
        this.items.push({title:this.title,article:this.article})
        this.router.navigateByUrl('/blog/posts');
    }
     keyupHandlerFunction(content:any):void{
    this.article=content;
  }
  
}