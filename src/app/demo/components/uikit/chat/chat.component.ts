import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { TaskDto } from '../../../dto/task-dto';
import { Utilisateur } from '../../../dto/utilisateur';
import { Message } from '../../../dto/message';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../service/task.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../service/auth.service';
import { UserService } from '../../../service/user.service';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
    selector: 'app-chat',
    standalone: false,
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
    @ViewChild('messageContainer') private messageContainer: ElementRef;

    projectId!: number;
    project!: TaskDto;
    currentDate: string = '';
    manager!: Utilisateur;
    messageList: Message[] = [];
    firstMessages: Message[] = [];
    newMessage: string = '';
    showAllMessages: boolean = false;
    private messagesSubscription: Subscription | null = null;

    isLoggedIn: boolean = false;
    user: Utilisateur = {} as Utilisateur;

    constructor(
        private route: ActivatedRoute,
        private projectService: TaskService,
        private datePipe: DatePipe,
        private authService: AuthService,
        private userService: UserService
    ) {}

    items: MenuItem[] | undefined;

    home: MenuItem | undefined;

    ngOnInit(): void {
        window.scrollTo(0, 0);

        this.items = [
            { icon: 'pi pi-home', route: '/' },
            { label: 'Tasks', route: '/uikit/tasks' },
            { label: 'Chat' },
        ];
    

        this.currentDate = this.getCurrentDate();

        this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
            this.isLoggedIn = loggedIn;
            if (this.isLoggedIn) {
                this.route.params.subscribe((params) => {
                    this.projectId = +params['id']; // Get the project ID from the route
                    this.getProjectById(this.projectId); // Call the method to fetch the project
                    this.projectService.joinRoom(this.projectId);
                    this.projectService
                        .getOldMessages(this.projectId)
                        .subscribe((messages) => {
                            this.messageList = [...messages];
                        });
                });
            }
        });
        this.userService.currentUser.subscribe((user: Utilisateur) => {
            this.user = user;
            console.log('from nav bar', this.user?.username); // Ensure user is defined before accessing its properties
        });
        this.isLoggedIn = this.authService.isLoggedIn();
        this.user = this.userService.currentUserValue;

        this.lisenerMessage();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }
    scrollToBottom(): void {
        try {
            this.messageContainer.nativeElement.scrollTop =
                this.messageContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.error('Scroll to bottom failed', err);
        }
    }
    getProjectById(id: number): void {
        this.projectService.getProjectById(id).subscribe((project) => {
            this.project = project;
            if (project && project.manager_id) {
                this.userService
                    .getUserById(project.manager_id)
                    .subscribe((manager) => (this.manager = manager));
                console.log('manager :' + this.manager);
            }
        });
    }

    private getCurrentDate() {
        const currentDate = new Date();
        const formattedDate = this.datePipe.transform(
            currentDate,
            'MMMM dd yyyy'
        );
        return formattedDate || '';
    }

    sendMessage(content: string): void {
        if (this.project && this.project.id) {
            this.projectService.sendMessage(
                this.project.id,
                this.user.username,
                content
            );
            this.newMessage = '';
        } else {
            console.error('Project ID is undefined.');
        }
    }
    lisenerMessage() {
        this.messagesSubscription = this.projectService
            .getMessageSubject()
            .subscribe((messages: any) => {
                this.messageList.push(...messages);
            });
    }
    showAll() {
        this.showAllMessages = true;
    }
    showLess() {
        this.showAllMessages = false;
    }

    ngOnDestroy(): void {
        this.projectService.leaveRoom(this.projectId);
        if (this.messagesSubscription) {
            this.messagesSubscription.unsubscribe();
            this.messagesSubscription = null;
        }
    }
}
