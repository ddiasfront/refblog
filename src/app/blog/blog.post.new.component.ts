import{Component,OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {FirebaseListObservable,FirebaseObjectObservable, AngularFire} from 'angularfire2';
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

    uploadfile : FirebaseListObservable<any>;
    imageList : Observable<any>;

    items:FirebaseListObservable<any>;
    title:string;
    article:string;
    constructor(private af:AngularFire, private router: Router){

    }
    ngOnInit(){
    this.items = this.af.database.list('posts');
    console.log('i am here')
     
    }

      upload() {
        // Create a root reference
        let storageRef = firebase.storage().ref();

        let success = false;
        // This currently only grabs item 0, TODO refactor it to grab them all
        for (let selectedFile of [(<HTMLInputElement>document.getElementById('file')).files[0]]) {
            console.log(selectedFile);
            // Make local copies of services because "this" will be clobbered
            let router = this.router;
            let af = this.af;
            let folder = this.folder;
            let path = `/${this.folder}/${selectedFile.name}`;
            var iRef = storageRef.child(path);
            iRef.put(selectedFile).then((snapshot) => {
                console.log('Uploaded a blob or file! Now storing the reference at',`/${this.folder}/images/`);
                af.database.list(`/${folder}/images/`).push({ path: path, filename: selectedFile.name })
            });
        }
        
    }

     filechange(){
       console.log("new values for folder");
        let storage = firebase.storage();
        
        this.uploadfile = this.af.database.list(`/${this.folder}/images`);
        console.log("Rendering all images in ",`/${this.folder}/images`)
        this.imageList = this.uploadfile.map( itemList =>
            itemList.map( item => {
                var pathReference = storage.ref(item.path);
                let result = {$key: item.$key, downloadURL: pathReference.getDownloadURL(), path: item.path, filename: item.filename};
                console.log(result);
                return result;
            })
        );
    }

       delete(image: Image) {
        let storagePath = image.path;
        let referencePath = `${this.folder}/images/` + image.$key;

        // Do these as two separate steps so you can still try delete ref if file no longer exists

        // Delete from Storage
        firebase.storage().ref().child(storagePath).delete()
        .then(
            () => {},
            (error) => console.error("Error deleting stored file",storagePath)
        );

        // Delete references
        this.af.database.object(referencePath).remove()
            
        

    }

    add():void{
        this.items.push({title:this.title,article:this.article})
        this.router.navigateByUrl('/blog/posts');
    }
     keyupHandlerFunction(content:any):void{
    this.article=content;
  }
  
}