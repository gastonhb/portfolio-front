import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Experience } from 'src/app/models/experience.interface';
import { WorkTimeType } from 'src/app/models/workTimeType.interface';
import { StorageService } from 'src/app/services/storage.service';
import { WorkTimeTypeService } from 'src/app/services/workTimeType.service';

@Component({
  selector: 'app-experience-update',
  templateUrl: './experience-update.component.html',
  styleUrls: ['./experience-update.component.css', '../../app.component.css']
})

export class ExperienceUpdateComponent implements OnInit {
  @Output() onUpdateExperience: EventEmitter<Experience> = new EventEmitter();
  @Input() showUpdateExperience: Boolean = false;
  @Output() closeUpdateExperience = new EventEmitter();

  @Input() experience: Experience = {
    id: "", 
    title: "", 
    companyName: "", 
    startDate: null, 
    endDate: null,  
    location: "", 
    urlImage: "", 
    personId: "", 
    workTimeTypeId: "", 
    workTimeType: { 
      id: "",
      name: ""
    }
  };

  image: any;
  urlImage: string | null = null;
  disabledEndDate: boolean = false;
  workTimeTypes: WorkTimeType[] = [];

  faImage = faImage;
  faTimes = faTimes;

  constructor(private workTimeTypeService: WorkTimeTypeService, private storageService: StorageService) { 
    this.urlImage = this.experience.urlImage;
  }

  ngOnInit(): void {
    this.workTimeTypeService.list().subscribe(workTimeTypes => {
      this.workTimeTypes = workTimeTypes;
    });
    this.disabledEndDate = this.experience.endDate ? false : true;

  }

  // Envia la experiencia actualizada a la clase padre
  async save(){
    if (this.experience.title.length === 0 || this.experience.companyName.length === 0 || 
      this.experience.startDate === null || this.experience.location.length === 0 ) {
      // TODO locacion permitir null
      return;
    }

    this.experience.workTimeTypeId =  this.experience.workTimeType.id;
    
    if(this.image){
      if (this.experience.urlImage) {
        await this.deleteImage(this.experience.urlImage);
      };
      await this.saveImage();
      this.image = null;
    }
    
    this.onUpdateExperience.emit(this.experience)
  }

  // Guarda una imagen subida por un usuario
  uploadImage(event:any){
    let archivos = event.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(archivos[0]);
    reader.onloadend = () => {
      this.image = reader.result;
    }
  }

  // Guardar imagen en Firebase
  async saveImage() {
    await this.storageService.uploadImage("persons/" + this.experience.personId + "/workExperiences/" + this.experience.id, this.image)
    .then(urlImagen =>{
      this.experience.urlImage =  urlImagen;
   })
  }

  // Borrar imagen en Firebase
  async deleteImage(url: string) {
    await this.storageService.deleteImage(url)
  }

  // Bloquear fecha de fin y poner en null
  changeDisabledEndDate() {
    this.disabledEndDate = !this.disabledEndDate;
    this.experience.endDate = null;
  }

  // Cerrar formulario
  close() {
    this.showUpdateExperience = false;
    this.closeUpdateExperience.emit(this.showUpdateExperience);
  }

  // Comparar nombres de tipos de jornadas
  compareNames(work1:WorkTimeType, work2:WorkTimeType) {
    return work1.name===work2.name;
  }

}
