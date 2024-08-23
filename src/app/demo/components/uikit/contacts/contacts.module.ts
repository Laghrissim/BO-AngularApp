import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsRoutingModule } from './contacts-routing.module';
import {ContactsComponent} from "./contacts.component";
import {ButtonModule} from "primeng/button";
import {DataViewModule} from "primeng/dataview";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {FileUploadModule} from "primeng/fileupload";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {RippleModule} from "primeng/ripple";
import {MessageService, SharedModule} from "primeng/api";
import {ToolbarModule} from "primeng/toolbar";
import {ListDemoRoutingModule} from "../list/listdemo-routing.module";
import {PickListModule} from "primeng/picklist";
import {OrderListModule} from "primeng/orderlist";
import {RatingModule} from "primeng/rating";
import {SplitButtonModule} from "primeng/splitbutton";
import {InputNumberModule} from "primeng/inputnumber";
import {RadioButtonModule} from "primeng/radiobutton";
import {PluralizePipe} from "../../pipes/pluralize.pipe";
import {UIkitModule} from "../uikit.module";



@NgModule({
  declarations: [ContactsComponent],
    imports: [
        CommonModule,
        FormsModule,
        ContactsRoutingModule,
        DataViewModule,
        PickListModule,
        OrderListModule,
        InputTextModule,
        DropdownModule,
        RatingModule,
        ButtonModule,
        SplitButtonModule,
        ToolbarModule,
        DialogModule,
        InputNumberModule,
        InputTextareaModule,
        RadioButtonModule,
        RippleModule,
        FileUploadModule,
        UIkitModule,

    ],
    providers: [
        MessageService,

    ],
})
export class ContactsModule { }
