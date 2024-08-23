import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIkitRoutingModule } from './uikit-routing.module';
import {ConfirmationService} from "primeng/api";
import {PluralizePipe} from "../pipes/pluralize.pipe";

@NgModule({
    declarations: [PluralizePipe],
    exports: [PluralizePipe],
    imports: [
		CommonModule,
		UIkitRoutingModule
	],
    providers:[ConfirmationService]
})
export class UIkitModule { }
