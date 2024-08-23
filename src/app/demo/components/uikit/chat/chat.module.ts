import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
    declarations: [ChatComponent],
    imports: [CommonModule, ChatRoutingModule, FormsModule, BreadcrumbModule],
    providers: [DatePipe],
})
export class ChatModule {}
