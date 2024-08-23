import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {ButtonDemoComponent} from "../button/buttondemo.component";
import {ChatComponent} from "./chat.component";




@NgModule({

    imports: [
        CommonModule,
        RouterModule.forChild([
        { path: '', component: ChatComponent }
    ])],
    exports: [RouterModule]
})
export class ChatRoutingModule { }
