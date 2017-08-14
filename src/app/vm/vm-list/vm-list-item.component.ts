import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MdMenuTrigger } from '@angular/material';
import { Color } from '../../shared/models';
import { VirtualMachine } from '../shared/vm.model';


@Component({
  selector: 'cs-vm-list-item',
  templateUrl: 'vm-list-item.component.html',
  styleUrls: ['vm-list-item.component.scss']
})
export class VmListItemComponent implements OnInit, OnChanges {
  @Input() public item: VirtualMachine;
  @Input() public isSelected: (vm: VirtualMachine) => boolean;
  @Output() public onClick = new EventEmitter();
  @Output() public onPulse = new EventEmitter<string>();
  @ViewChild(MdMenuTrigger) public mdMenuTrigger: MdMenuTrigger;

  public color: Color;
  public gigabyte = Math.pow(2, 10); // to compare with RAM which is in megabytes


  public ngOnInit(): void {
    this.updateColor();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName) && propName === 'isSelected') {
        this.isSelected = changes[propName].currentValue;
      }
    }
  }

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.mdMenuTrigger.menuOpen) {
      this.onClick.emit(this.item);
    }
  }

  public getMemoryInMb(): string {
    return this.item.memory.toFixed(2);
  }

  public getMemoryInGb(): string {
    return (this.item.memory / this.gigabyte).toFixed(2);
  }

  private updateColor(): void {
    this.color = this.item.getColor();
  }
}
