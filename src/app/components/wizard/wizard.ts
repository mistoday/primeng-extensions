import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Input,
  Output,
  NgModule
} from '@angular/core';
import {MenuItem} from 'primeng/components/common/api';
import {CommonModule} from '@angular/common';
import {ButtonModule} from 'primeng/components/button/button';
import {StepsModule} from 'primeng/components/steps/steps';

@Component({
  selector: 'pe-step',
  styles: ['.pe-step-container {padding: 45px 25px 45px 25px; margin-bottom: 20px;}'],
  template: `
    <div *ngIf="active" [ngClass]="'ui-widget-content ui-corner-all pe-step-container'" [class]="styleClass">
      <ng-content></ng-content>
    </div>
  `
})
export class StepComponent {
  @Input() styleClass: string;
  @Input() label: string;
  active: boolean = false;
}

@Component({
  selector: 'pe-steps',
  template: `
    <p-steps [model]="items" [(activeIndex)]="activeIndex"
             [class]="styleClass" [readonly]="false"></p-steps>
    <ng-content></ng-content>
    <button pButton type="text" *ngIf="activeIndex > 0"
            (click)="previous()" icon="fa-hand-o-left" label="Previous"></button>
    <button pButton type="text" *ngIf="activeIndex < items.length - 1"
            (click)="next()" icon="fa-hand-o-right" iconPos="right" label="Next"></button>
  `
})
export class StepsComponent implements AfterContentInit, OnChanges {
  @Input() activeIndex: number = 0;
  @Input() styleClass: string;
  @Input() stepClass: string;
  @Output() activeIndexChange: EventEmitter<any> = new EventEmitter();
  @Output() change = new EventEmitter();

  items: MenuItem[] = [];

  @ContentChildren(StepComponent) steps: QueryList<StepComponent>;

  ngAfterContentInit() {
    this.steps.toArray().forEach((step: StepComponent, index: number) => {
      if (!step.styleClass) {
        // set style class if it was not set on step component directly
        step.styleClass = this.stepClass;
      }

      if (index === this.activeIndex) {
        // show this step on init
        step.active = true;
      }

      this.items[index] = {
        label: step.label,
        command: (event: any) => {
          // hide all steps
          this.steps.toArray().forEach((s: StepComponent) => s.active = false);

          // show the step the user has clicked on.
          step.active = true;
          this.activeIndex = index;

          // emit currently selected index (two-way binding)
          this.activeIndexChange.emit(index);
          // emit currently selected label
          this.change.next(step.label);
        }
      };
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.steps) {
      // we could also check changes['activeIndex'].isFirstChange()
      return;
    }

    for (let prop in changes) {
      if (prop === 'activeIndex') {
        let curIndex = changes[prop].currentValue;
        this.steps.toArray().forEach((step: StepComponent, index: number) => {
          // show / hide the step
          let selected = index === curIndex;
          step.active = selected;

          if (selected) {
            // emit currently selected label
            this.change.next(step.label);
          }
        });
      }
    }
  }

  private previous() {
    this.activeIndex--;
    // emit currently selected index (two-way binding)
    this.activeIndexChange.emit(this.activeIndex);
    // show / hide steps and emit selected label
    this.ngOnChanges({
      activeIndex: {
        currentValue: this.activeIndex,
        previousValue: this.activeIndex + 1,
        firstChange: false,
        isFirstChange: () => false
      }
    });
  }

  private next() {
    this.activeIndex++;
    // emit currently selected index (two-way binding)
    this.activeIndexChange.emit(this.activeIndex);
    // show / hide steps and emit selected label
    this.ngOnChanges({
      activeIndex: {
        currentValue: this.activeIndex,
        previousValue: this.activeIndex - 1,
        firstChange: false,
        isFirstChange: () => false
      }
    });
  }
}

@NgModule({
  imports: [CommonModule, ButtonModule, StepsModule],
  exports: [StepComponent, StepsComponent],
  declarations: [StepComponent, StepsComponent]
})
export class WizardModule {
}