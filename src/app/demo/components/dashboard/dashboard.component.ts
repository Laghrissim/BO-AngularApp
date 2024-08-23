import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {DashboardService} from "../../service/dashboard.service";
import {ProjectDto} from "../../dto/project-dto";
import {ProjectService} from "../../service/project.service";
import {TaskDto} from "../../dto/task-dto";
import {TaskService} from "../../service/task.service";

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    items!: MenuItem[];

    products!: ProjectDto[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;


    projectCount: number;
    contactCount: number;
    solutionCount: number;
    userCount: number;
    labels: string[] = [];
    data: number[] = [];

    constructor(private productService: ProductService,
                public layoutService: LayoutService,
                private dashboardService: DashboardService,
                private projectService: ProjectService,
                private taskService: TaskService,
                ) {
        this.subscription = this.layoutService.configUpdate$
        .pipe(debounceTime(25))
        .subscribe((config) => {
            this.initChart();
        });
    }

    ngOnInit() {
        this.initChart();
        this.getDefaultSolutionData();

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
        this.loadCounts();
        this.fetchTaskData();


    }

    loadCounts(): void {
        this.dashboardService.getProjectCount().subscribe(count => this.projectCount = count);
        this.dashboardService.getContactCount().subscribe(count => this.contactCount = count);
        this.dashboardService.getSolutionCount().subscribe(count => this.solutionCount = count);
        this.dashboardService.getUserCount().subscribe(count => this.userCount = count);
    }
    fetchTaskData(): void {
        this.taskService.getAllProjects().subscribe((tasks: TaskDto[]) => {
            this.processTaskData(tasks);
            this.updateChartData();

        });
    }

    processTaskData(tasks: TaskDto[]): void {
        const taskCountByDate: { [date: string]: number } = {};

        tasks.forEach(task => {
            const date = new Date(task.creationDate!).toLocaleDateString();
            if (taskCountByDate[date]) {
                taskCountByDate[date]++;
            } else {
                taskCountByDate[date] = 1;
            }
        });

        this.labels = Object.keys(taskCountByDate);
        this.data = Object.values(taskCountByDate);
    }
    updateChartData(): void {
        const documentStyle = getComputedStyle(document.documentElement);

        this.chartData = {
            labels: this.labels,
            datasets: [
                {
                    label: 'Number of Requests',
                    data: this.data,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: 0.4
                }
            ]
        };
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: this.labels,
            datasets: [
                {
                    label: 'Number of Requests',
                    data: this.data,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                // {
                //     label: 'Second Dataset',
                //     data: [28, 48, 40, 19, 86, 27, 90],
                //     fill: false,
                //     backgroundColor: documentStyle.getPropertyValue('--green-600'),
                //     borderColor: documentStyle.getPropertyValue('--green-600'),
                //     tension: .4
                // }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }
    getDefaultSolutionData(): void {
        this.projectService.getAllSolutions().subscribe(
            (data: ProjectDto[]) => {
                this.products = data;
                console.log('Solutions:', this.products); // Log solutions data to console
            },
            (error) => {
                console.error('Error fetching solutions:', error);
            }
        );
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
