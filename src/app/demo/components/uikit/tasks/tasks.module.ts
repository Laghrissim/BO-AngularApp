import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksRoutingModule } from './tasks-routing.module';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { TasksComponent } from './tasks.component';
import { RippleModule } from 'primeng/ripple';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import {CarouselModule} from "primeng/carousel";
import {MessageService} from "primeng/api";

@NgModule({
    declarations: [TasksComponent],
    imports: [
        CommonModule,
        TasksRoutingModule,
        TableModule,
        CalendarModule,
        SliderModule,
        DialogModule,
        MultiSelectModule,
        ContextMenuModule,
        DropdownModule,
        ButtonModule,
        ToastModule,
        InputTextModule,
        ProgressBarModule,
        HttpClientModule,
        FormsModule,
        SkeletonModule,
        DragDropModule,
        CardModule,
        ChipModule,
        FormsModule,
        DropdownModule,
        RippleModule,
        AvatarModule,
        AvatarGroupModule,
        ConfirmDialogModule,
        PaginatorModule,
        CarouselModule,
    ],
    providers: [
        MessageService
    ],
})
export class TasksModule {}
