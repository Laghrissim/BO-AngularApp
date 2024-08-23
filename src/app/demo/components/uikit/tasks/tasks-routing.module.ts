import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {TableDemoComponent} from "../table/tabledemo.component";
import {TasksComponent} from "./tasks.component";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
          { path: '', component: TasksComponent }
      ])
  ],
    exports:[RouterModule]
})
export class TasksRoutingModule { }
