import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ConfigService } from '../../services/config.service';


@Component({
  selector: 'cs-color-picker',
  templateUrl: 'color-picker.component.html',
  styleUrls: ['color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
  @Input() public color = '#ffffff';
  @Output() public onColorChanged = new EventEmitter();
  public colors: Array<string>;

  constructor(private configService: ConfigService) {}

  public updateColor(color: string): void {
    this.color = color;
    this.onColorChanged.emit(this.color);
  }

  public ngOnInit(): void {
    this.configService.get('colors')
      .subscribe(colors => this.colors = colors);
  }
}
