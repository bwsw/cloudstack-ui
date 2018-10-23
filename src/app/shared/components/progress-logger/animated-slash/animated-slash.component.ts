import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cs-animated-slash',
  template: '{{ slash }}',
})
export class AnimatedSlashComponent implements OnInit {
  private state = 0;
  private states = ['/', '-', '\\', '|'];

  public ngOnInit(): void {
    setInterval(() => this.advance(), 100);
  }

  public get slash(): string {
    return this.states[this.state];
  }

  public advance(): void {
    this.state = (this.state + 1) % this.states.length;
  }
}
