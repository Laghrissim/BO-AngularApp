import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {ListDemoComponent} from "../list/listdemo.component";
import {ContactsComponent} from "./contacts.component";



@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ContactsComponent }
    ])],
    exports: [RouterModule]
})
export class ContactsRoutingModule { }
