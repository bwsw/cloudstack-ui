import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { Color } from '../../models/color.model';


@Component({
  selector: 'cs-color-picker',
  templateUrl: 'color-picker.component.html',
  styleUrls: ['color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
  @Input() public color;
  @Input() public colors: Array<Color>;
  @Output() public onColorChanged = new EventEmitter();

  constructor(private configService: ConfigService) {
    this.color = new Color('white', '#FFFFFF');
  }

  public updateColor(color: Color): void {
    this.color = color;
    this.onColorChanged.emit(this.color);
  }

  public ngOnInit(): void {
    if (!this.colors) {
      this.configService.get('vmColors').subscribe(colors => this.colors = colors);
    }
  }
}
