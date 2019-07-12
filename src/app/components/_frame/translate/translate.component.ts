import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent implements OnInit {

  constructor(
    public translationService: TranslationService,
  ) {

  }

  Object = Object;

  ngOnInit() {
  }

}
