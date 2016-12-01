import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Observable } from 'rxjs';

declare var firebase: any;

interface Image {
    path: string;
    filename: string;
    downloadURL: string;
    $key: string;
}

@Component({
    selector: 'image-upload',
    templateUrl: './photo.component.html'
})
export class PhotoComponent {
    /**
     * The name of the folder for images
     * eg. posts/angular-is-awesome
     */



    @Input() folder: string;
    
    fileList : FirebaseListObservable<Image[]>;
    imageList : Observable<Image[]>;

    constructor(public af: AngularFire, public router: Router) {
    }
    ngOnInit() {
            console.log('This if the value for user-id: ' + this.folder);
    }

    ngOnChanges() {
        
        console.log("new values for folder");
        let storage = firebase.storage();
        
        this.fileList = this.af.database.list(`/master`);
        console.log("Rendering all images in ",`/master/`)
        this.imageList = this.fileList.map( itemList =>
            itemList.map( item => {
                var pathReference = storage.ref(item.path);
                let result = {$key: item.$key, downloadURL: pathReference.getDownloadURL(), path: item.path, filename: item.filename};
                console.log(result);
                return result;
            })
        );
    }


    upload() {
        // Create a root reference
        let storageRef = firebase.storage().ref('/master/');

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
                console.log('Uploaded a blob or file! Now storing the reference at',`/master/`);
                af.database.list(`/master`).push({ path: path, filename: selectedFile.name })
            });
        }
        
    }
    delete(image: Image) {
        let storagePath = image.path;
        let referencePath = `/master/` + image.$key;

        // Do these as two separate steps so you can still try delete ref if file no longer exists

        // Delete from Storage
        firebase.storage().ref('/master/').child(storagePath).delete()
        .then(
            () => {},
            (error) => console.error("Error deleting stored file",storagePath)
        );

        // Delete references
        this.af.database.object(referencePath).remove()
            
        

    }
}