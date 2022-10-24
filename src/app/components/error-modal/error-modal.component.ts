import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent implements OnInit {

  @Input() hasError: Boolean = false;
  @Input() errorMessage: String = '';
  @Output() closeErrorModal = new EventEmitter();

  faTriangleExclamation = faTriangleExclamation;

  constructor() { }

  ngOnInit(): void {  }

  close(){
    this.hasError = false;
    this.closeErrorModal.emit(this.hasError);
  }

}
