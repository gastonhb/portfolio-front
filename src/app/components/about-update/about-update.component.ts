import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Person } from 'src/app/models/person.interface';

@Component({
  selector: 'app-about-update',
  templateUrl: './about-update.component.html',
  styleUrls: ['./about-update.component.css', '../../app.component.css']
})
export class AboutUpdateComponent implements OnInit {

  @Output() updatePerson: EventEmitter<Person> = new EventEmitter();
  @Input() showUpdateAbout: Boolean = false;
  @Output() closeUpdateAbout = new EventEmitter();

  @Input() person: Person = {
    id: "", 
    name: "", 
    lastname: "", 
    title: "", 
    abstracts: "", 
    urlImage: "", 
    urlCoverPhoto: "" 
  };

  form: FormGroup = new FormGroup({});

  faImage = faImage;
  faTimes = faTimes;

  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.person.name, [Validators.required]), 
      lastname: new FormControl(this.person.lastname, [Validators.required]),
      title: new FormControl(this.person.title, [Validators.required]),
      abstracts: new FormControl(this.person.abstracts, [])
    });
   }

  // Envia la educacion actualizada a la clase padre
  async onSubmit(){
    if (this.form.valid){
      this.person.name = this.form.value.name;
      this.person.lastname =  this.form.value.lastname;
      this.person.title = this.form.value.title;
      this.person.abstracts = this.form.value.abstracts;

      this.updatePerson.emit(this.person)
    }
  }

  // Cerrar formulario
  close() {
    this.showUpdateAbout = false;
    this.closeUpdateAbout.emit(this.showUpdateAbout);
  }

  get name() { return this.form.get('name'); }
  
  get lastname() { return this.form.get('lastname'); }
  
  get title() { return this.form.get('title'); }

  get abstracts() { return this.form.get('abstracts'); }

}
