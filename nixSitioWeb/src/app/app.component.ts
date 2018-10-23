import { Component } from '@angular/core';

@Component({
    selector: 'app',
    templateUrl: 'app.component.html',
    
})

export class AppComponent { 
    currentUser: any
  


    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

}

