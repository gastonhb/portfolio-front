import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { faImage, faPen } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Person } from 'src/app/models/person.interface';
import { PersonService } from 'src/app/services/person.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  @Input() personId: string = "";

  image: any;
  showUpdateAbout: boolean = false;
  hasCurrentUser: boolean = false;
  subscription?: Subscription

  person: Person = {
    id: "", 
    name: "", 
    lastname: "", 
    title: "", 
    abstracts: "", 
    urlImage: "", 
    urlCoverPhoto: ""
  };

  faImage = faImage;
  faPen = faPen;

  constructor(private personService: PersonService, private storageService: StorageService, 
  private authenticationService: AuthenticationService) { 
    this.hasCurrentUser = authenticationService.hasCurrentUser;
    this.subscription = this.authenticationService.onToggle().subscribe(value => {
      this.hasCurrentUser = value
    });
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) {
    this.personId = changes['personId'].currentValue;
    if (this.personId != '') {
      this.personService.get(this.personId).subscribe(person => {
        this.person = person;
      })
    }
  }

  // Guardar imagen de perfil del usuario
  async saveProfile(event:any){
    let archivos = event.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(archivos[0]);
    reader.onloadend = async () => {
      this.image = reader.result
      
      if (this.person.urlImage) {
        await this.deleteImage(this.person.urlImage);
      };
      
      await this.storageService.uploadImage("persons/" + this.personId + "/profile" , this.image)
      .then(async urlImage => {
        this.person.urlImage = urlImage;
        await this.updatePerson(this.person)
     })
    }
  }

  // Guardar imagen de portada
  async saveCoverPhoto(event:any){
    let archivos = event.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(archivos[0]);
    reader.onloadend = async () => {
      this.image = reader.result
      
      if (this.person.urlCoverPhoto) {
        await this.deleteImage(this.person.urlCoverPhoto);
      };
      
      await this.storageService.uploadImage("persons/" + this.personId + "/coverPhoto" , this.image)
      .then(async urlCoverPhoto => {
        this.person.urlCoverPhoto =  urlCoverPhoto;
        await this.updatePerson(this.person)
     })
    }
  }

  // Actualizar persona
  async updatePerson(person: Person){
    if (this.showUpdateAbout) {
      this.showUpdateAbout = false;
    }
    await this.personService.update(person)
    .subscribe((person) =>{
      this.person = person;
    });
  }

  // Borrar imagen en Firebase
  async deleteImage(url: string) {
    await this.storageService.deleteImage(url)
  }

  // Mostrar about update
  toggleUpdateAbout(){
    this.showUpdateAbout = !this.showUpdateAbout;
  }

  // Cerrar update de about
  closeUpdateAbout(showUpdateAbout: boolean){
    this.showUpdateAbout = showUpdateAbout;
  }

}
