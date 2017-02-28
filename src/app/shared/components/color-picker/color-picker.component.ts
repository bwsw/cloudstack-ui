import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'cs-color-picker',
  templateUrl: 'color-picker.component.html',
  styleUrls: ['color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
  public color = '#ffffff';
  public colors: Array<string>;

  constructor(private configService: ConfigService) {}

  public ngOnInit(): void {
    this.configService.get('colors')
      .subscribe(colors => this.colors = colors);
  }
}
