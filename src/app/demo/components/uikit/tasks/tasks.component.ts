import { Component, OnInit } from '@angular/core';

import { TaskService } from '../../../service/task.service';
import { TaskDto } from '../../../dto/task-dto';
import { filter, map, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { UserService } from '../../../service/user.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Utilisateur } from '../../../dto/utilisateur';
import { style } from '@angular/animations';
import { ConfirmationService } from 'primeng/api';

interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Component({
    selector: 'app-tasks',
    standalone: false,
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
    public type = '';
    public draggedTask: any;
    public arrears: TaskDto[] = [];
    public specifications: TaskDto[] = [];
    public development: TaskDto[] = [];
    public tests: TaskDto[] = [];
    public delivered: TaskDto[] = [];
    display: boolean = false;
    projectManagers: Utilisateur[] = [];
    selectedManager: Utilisateur | null = null;
    selectedTask: TaskDto | null = null;
    allUsers: Utilisateur[] = [];
    selectedSubscriber: Utilisateur;
    displayAddSubscriberDialog: boolean = false;
    taskToAddSubscriber: TaskDto;

    first: number = 0;

    rows: number = 10;

    onPageChange(event: PageEvent) {
        this.first = event.first;
        this.rows = event.rows;
    }

    constructor(
        private taskService: TaskService,
        private userService: UserService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.loadProjectManagers();
        this.getTasks();
    }

    getFirstPart(input: string, splitter: string): string {
        const index = input.indexOf(splitter);
        return index === -1 ? input : input.substring(0, index);
    }

    getTasks() {
        this.taskService
            .getAllProjects()
            .pipe(
                filter((tasks) => tasks !== null),
                switchMap((tasks) => {
                    const taskObservables = tasks.map((task) => {
                        // Fetch manager if manager_id is present
                        const managerObservable = task.manager_id
                            ? this.userService
                                  .getUserById(task.manager_id)
                                  .pipe(
                                      map((manager) => {
                                          if (manager && manager.username) {
                                              task.manager_name =
                                                  manager.username;
                                          }
                                          return task;
                                      })
                                  )
                            : of(task);

                        // Fetch subscribers if subscriberIds are present
                        const subscriberObservables =
                            task.subscriberIds && task.subscriberIds.length > 0
                                ? forkJoin(
                                      task.subscriberIds.map((id) =>
                                          this.userService.getUserById(id)
                                      )
                                  ).pipe(
                                      map((subscribers) => {
                                          task.subscribers = subscribers;
                                          return task;
                                      })
                                  )
                                : of(task);

                        // Fetch client if client_id is present
                        const clientObservable = task.client_id
                            ? this.userService.getUserById(task.client_id).pipe(
                                  map((client) => {
                                      task.client = client;
                                      console.log(
                                          'client :' + client.contact_id
                                      );
                                      return task;
                                  })
                              )
                            : of(task);

                        // Combine manager, subscriber, and client observables
                        return forkJoin([
                            managerObservable,
                            subscriberObservables,
                            clientObservable,
                        ]).pipe(map(() => task));
                    });
                    return forkJoin(taskObservables);
                })
            )
            .subscribe(
                (tasks) => {
                    this.categorizeTasks(tasks);
                    console.log(
                        'Tasks with manager names, subscribers, and clients:',
                        tasks
                    );
                },
                (error) => {
                    console.error('Error fetching tasks:', error);
                }
            );
    }

    loadProjectManagers(): void {
        this.userService.getAllProjectManagers().subscribe(
            (managers: Utilisateur[]) => {
                this.projectManagers = managers;
            },
            (error) => {
                console.error('Error fetching project managers:', error);
            }
        );
    }

    private categorizeTasks(tasks: TaskDto[]): void {
        tasks.forEach((task) => {
            switch (task.stage) {
                case 'Arriéré':
                    this.arrears.push(task);
                    break;
                case 'Spécifications':
                    this.specifications.push(task);
                    break;
                case 'Développement':
                    this.development.push(task);
                    break;
                case 'Tests':
                    this.tests.push(task);
                    break;
                case 'Livré':
                    this.delivered.push(task);
                    break;
                default:
                    console.warn('Unknown task stage:', task.stage);
            }
        });
    }

    dragStart(task: any) {
        this.draggedTask = task;
    }

    drop(type: string) {
        if (this.draggedTask) {
            this.taskService
                .updateTaskStage(this.draggedTask.id!, type)
                .pipe(
                    switchMap((updatedTask) => {
                        // Fetch manager if manager_id is present
                        const managerObservable = updatedTask.manager_id
                            ? this.userService
                                  .getUserById(updatedTask.manager_id)
                                  .pipe(
                                      map((manager) => {
                                          if (manager && manager.username) {
                                              updatedTask.manager_name =
                                                  manager.username;
                                          }
                                          return updatedTask;
                                      })
                                  )
                            : of(updatedTask);

                        // Fetch subscribers if subscriberIds are present
                        const subscriberObservables =
                            updatedTask.subscriberIds &&
                            updatedTask.subscriberIds.length > 0
                                ? forkJoin(
                                      updatedTask.subscriberIds.map((id) =>
                                          this.userService.getUserById(id)
                                      )
                                  ).pipe(
                                      map((subscribers) => {
                                          updatedTask.subscribers = subscribers;
                                          return updatedTask;
                                      })
                                  )
                                : of(updatedTask);

                        // Fetch client if client_id is present
                        const clientObservable = updatedTask.client_id
                            ? this.userService
                                  .getUserById(updatedTask.client_id)
                                  .pipe(
                                      map((client) => {
                                          updatedTask.client = client;
                                          return updatedTask;
                                      })
                                  )
                            : of(updatedTask);

                        // Combine manager, subscriber, and client observables
                        return forkJoin([
                            managerObservable,
                            subscriberObservables,
                            clientObservable,
                        ]).pipe(map(() => updatedTask));
                    })
                )
                .subscribe(
                    (updatedTask) => {
                        this.removeTaskFromCurrentStage(this.draggedTask!);
                        this.addTaskToNewStage(updatedTask);
                        this.draggedTask = null;
                    },
                    (error) => {
                        console.error('Error updating task stage:', error);
                    }
                );
        }
    }

    private removeTaskFromCurrentStage(task: TaskDto): void {
        switch (task.stage) {
            case 'Arriéré':
                this.arrears = this.arrears.filter((t) => t.id !== task.id);
                break;
            case 'Spécifications':
                this.specifications = this.specifications.filter(
                    (t) => t.id !== task.id
                );
                break;
            case 'Développement':
                this.development = this.development.filter(
                    (t) => t.id !== task.id
                );
                break;
            case 'Tests':
                this.tests = this.tests.filter((t) => t.id !== task.id);
                break;
            case 'Livré':
                this.delivered = this.delivered.filter((t) => t.id !== task.id);
                break;
            default:
                console.warn('Unknown task stage:', task.stage);
        }
    }

    private addTaskToNewStage(task: TaskDto): void {
        switch (task.stage) {
            case 'Arriéré':
                this.arrears.push(task);
                break;
            case 'Spécifications':
                this.specifications.push(task);
                break;
            case 'Développement':
                this.development.push(task);
                break;
            case 'Tests':
                this.tests.push(task);
                break;
            case 'Livré':
                this.delivered.push(task);
                break;
            default:
                console.warn('Unknown task stage:', task.stage);
        }
    }

    dragEnd(task: TaskDto): void | boolean {
        if (this.type) {
            task.stage = this.type;

            switch (this.type) {
                case 'Arriéré':
                case 'Spécifications':
                case 'Développement':
                case 'Tests':
                case 'Livré':
                    return;
                default:
                    return false;
            }
        }
    }

    getTasksByStatus(status: string) {
        switch (status) {
            case 'Arriéré':
                return this.arrears;
            case 'Spécifications':
                return this.specifications;
            case 'Développement':
                return this.development;
            case 'Tests':
                return this.tests;
            case 'Livré':
                return this.delivered;
            default:
                return [];
        }
    }

    getTaskCount(status: string): number {
        return this.getTasksByStatus(status).length;
    }

    onSelectManager() {
        if (this.selectedManager && this.selectedTask) {
            const projectId = this.selectedTask.id;

            this.taskService
                .addOrUpdateManager(projectId, this.selectedManager.id)
                .subscribe((updatedProject: any) => {
                    console.log(
                        'Manager added or updated successfully:',
                        updatedProject
                    );
                    this.selectedTask.manager_name =
                        this.selectedManager.username;
                    this.display = false;
                });
        }
    }

    displayDialog(task: TaskDto) {
        this.display = true;
        this.selectedTask = task;
    }

    close() {
        this.display = false;
        this.selectedTask = null;
    }

    removeManager() {
        if (this.selectedTask) {
            const projectId = this.selectedTask.id;

            this.taskService
                .removeManager(projectId)
                .subscribe((updatedProject: any) => {
                    console.log(
                        'Manager removed successfully:',
                        updatedProject
                    );
                    this.selectedTask.manager_name = null;
                    this.display = false;
                });
        }
    }

    showAddSubscriberDialog(task: TaskDto): void {
        this.taskToAddSubscriber = task;
        this.displayAddSubscriberDialog = true;
        this.loadAllUsers(task);
    }

    hideAddSubscriberDialog(): void {
        this.displayAddSubscriberDialog = false;
        this.selectedSubscriber = null;
    }

    subscribeUserToTask(): void {
        if (this.selectedSubscriber) {
            console.log("Subscribing to task with id:", this.taskToAddSubscriber.id);  // Debug log
            this.taskService
                .subscribeToProject(this.taskToAddSubscriber.id, this.selectedSubscriber.id)
                .pipe(
                    switchMap((updatedTask: TaskDto) => {
                        console.log("Subscribed to task. Updated task received:", updatedTask);  // Debug log

                        // Fetch updated subscribers for the task
                        const subscriberObservables =
                            updatedTask.subscriberIds && updatedTask.subscriberIds.length > 0
                                ? forkJoin(
                                    updatedTask.subscriberIds.map((id) =>
                                        this.userService.getUserById(id)
                                    )
                                ).pipe(
                                    map((subscribers) => {
                                        updatedTask.subscribers = subscribers;
                                        return updatedTask;
                                    })
                                )
                                : of(updatedTask);

                        // Fetch client if client_id is present
                        const clientObservable = updatedTask.client_id
                            ? this.userService
                                .getUserById(updatedTask.client_id)
                                .pipe(
                                    map((client) => {
                                        updatedTask.client = client;
                                        return updatedTask;
                                    })
                                )
                            : of(updatedTask);

                        // Combine subscriber and client observables
                        return forkJoin([subscriberObservables, clientObservable]).pipe(
                            map(() => updatedTask)
                        );
                    })
                )
                .subscribe(
                    (updatedTask) => {
                        console.log("Final updated task:", updatedTask);  // Debug log
                        // Update the task in your tasks array with the new subscriber and client
                        this.removeTaskFromCurrentStage(updatedTask);
                        this.addTaskToNewStage(updatedTask);
                        this.hideAddSubscriberDialog();
                    },
                    (error) => {
                        console.error('Error subscribing user to task:', error);
                    }
                );
        }
    }


    loadAllUsers(task: TaskDto): void {
        this.userService.getAllUsers().subscribe(
            (users: Utilisateur[]) => {
                this.allUsers = users.filter(
                    (user) =>
                        user.contact_id === task.client?.contact_id &&
                        user.id !== task.client?.id &&
                        (!task.subscribers ||
                            !task.subscribers.some(
                                (subscriber) => subscriber.id === user.id
                            ))
                );
                console.log(
                    'lalal:' + (task.client?.contact_id ?? 'undefined')
                );
            },
            (error) => {
                console.error('Error fetching users:', error);
            }
        );
    }

    unsubscribeUser(user: Utilisateur, task: TaskDto): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to unsubscribe user ${user.username}?`,
            accept: () => {
                this.taskService
                    .unsubscribeUserFromTask(task.id, user.id)
                    .subscribe(
                        () => {
                            // Update task subscribers after successful unsubscribe
                            task.subscribers = task.subscribers.filter(
                                (subscriber) => subscriber.id !== user.id
                            );
                        },
                        (error) => {
                            console.error('Error unsubscribing user:', error);
                        }
                    );
            },
        });
    }


}
