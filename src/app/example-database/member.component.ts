import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { GridModule, GridComponent, PageSettingsModel, PageService } from '@syncfusion/ej2-angular-grids';
import { TextBoxModule, TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { ButtonAllModule, ButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { Member, MemberService } from './member.service';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, GridModule,TextBoxModule, ButtonAllModule],
  providers: [PageService],
  templateUrl: './member.component.html',
})
export class MemberComponent implements OnDestroy {
  @ViewChild('grid')
  grid?: GridComponent;
  pageOptions?: PageSettingsModel;
  @ViewChild('textbox') public textbox?: TextBoxComponent;
  @ViewChild('button') public button?: ButtonComponent;

  list!: any;
  memberService: MemberService;

  constructor() {
    this.memberService = inject(MemberService);
    this.memberService.getList();
  }

  ngOnDestroy(): void {
    this.memberService.unsubscribe();
  }

  clickHandler(args:any): void {
    (this.button as ButtonComponent).element.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault(); // Prevent any default behavior of the button click
      const pageSize:number = parseInt((this.textbox as TextBoxComponent).value, 10);
      if (pageSize > 0) {
        (this.grid as GridComponent).pageSettings.pageSize = parseInt((this.textbox as TextBoxComponent).value, 10);
      }
    });
  }

}
