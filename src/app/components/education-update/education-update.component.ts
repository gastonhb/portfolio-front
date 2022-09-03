import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Education } from 'src/app/models/education.interface';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-education-update',
  templateUrl: './education-update.component.html',
  styleUrls: ['./education-update.component.css', '../../app.component.css']
})
export class EducationUpdateComponent implements OnInit {

  @Output() onUpdateEducation: EventEmitter<Education> = new EventEmitter();
  @Input() showUpdateEducation: Boolean = false;
  @Output() closeUpdateEducation = new EventEmitter();

  @Input() education: Education;

  image: any;
  urlImage: string | null = null;
  disabledEndDate: boolean = false;
  subscription?: Subscription;

  faImage = faImage;
  faTimes = faTimes;

  constructor(private storageService: StorageService) { 
    this.education = { id: "", title: "", institute: "", startDate: null, endDate: null, urlImage: "", personId: "" };
    this.urlImage = this.education.urlImage;
  }

  ngOnInit(): void {
  }

  // Envia la educacion actualizada a la clase padre
  async save(){
    if (this.education.title.length === 0 || this.education.institute.length === 0 || 
      this.education.startDate === null ) {
      return;
    }
    if(this.education.person){
      this.education.personId = this.education.person.id;
    }

    if(this.image){
      if (this.education.urlImage) {
        await this.deleteImage(this.education.urlImage);
      };
      await this.saveImage();
      this.image = null;
    } 
    
    this.onUpdateEducation.emit(this.education)
  }

  // Guarda una imagen subida por un usuario
  uploadImage(event:any){
    let archivos = event.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(archivos[0]);
    reader.onloadend = () => {
      // this.image =  this.domSanitizer.bypassSecurityTrustResourceUrl(''+reader.result);
      this.image = reader.result;
    }
  }

  // Guardar imagen en Firebase
  async saveImage() {
    await this.storageService.uploadImage("persons/" + this.education.personId + "/educations/" + this.education.id, this.image)
    .then(urlImagen =>{
      this.education.urlImage =  urlImagen;
   })
  }

  // Borrar imagen en Firebase
  async deleteImage(url: string) {
    await this.storageService.deleteImage(url)
  }

  // Bloquear fecha de fin y poner en null
  changeDisabledEndDate() {
    this.disabledEndDate = !this.disabledEndDate;
    this.education.endDate = null;
  }

  // Cerrar formulario
  close() {
    this.showUpdateEducation = false;
    this.closeUpdateEducation.emit(this.showUpdateEducation);
  }

}
