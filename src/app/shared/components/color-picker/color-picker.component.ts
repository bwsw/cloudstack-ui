import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { Color } from '../../models/color.model';


@Component({
  selector: 'cs-color-picker',
  templateUrl: 'color-picker.component.html',
  styleUrls: ['color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
  @Input() public selectedColor;
  @Input() public colorList: Array<Color>;
  @Output() public onColorChanged = new EventEmitter();

  constructor(private configService: ConfigService) {
    this.selectedColor = new Color('white', '#FFFFFF');
  }

  public updateColor(color: Color): void {
    this.selectedColor = color;
    this.onColorChanged.emit(this.selectedColor);
  }

  public ngOnInit(): void {
    if (!this.colorList) {
      this.configService.get('vmColors').subscribe(colors => this.colorList = colors);
    }
  }
}
