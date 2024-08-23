import { Component, OnInit } from '@angular/core';
import {MessageService, SelectItem} from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import {ProjectDto} from "../../../dto/project-dto";
import {ProjectService} from "../../../service/project.service";

@Component({
    templateUrl: './listdemo.component.html'
})
export class ListDemoComponent implements OnInit {

    products: Product[] = [];
    projects: ProjectDto[] = [];

    sortOptions: SelectItem[] = [];

    sortOrder: number = 0;

    sortField: string = '';

    sourceCities: any[] = [];

    targetCities: any[] = [];

    orderCities: any[] = [];
    items: any;
    productDialog: boolean=false;
    deleteProductDialog: boolean=false;
    product: ProjectDto= {} as ProjectDto;

    submitted: boolean = false;
    selectedPicture: File | null = null;

    constructor(private productService: ProductService,
                private projectService:ProjectService,
                private messageService: MessageService) { }

    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data);
        this.getDefaultSolutionData();

        this.sourceCities = [
            { name: 'San Francisco', code: 'SF' },
            { name: 'London', code: 'LDN' },
            { name: 'Paris', code: 'PRS' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Berlin', code: 'BRL' },
            { name: 'Barcelona', code: 'BRC' },
            { name: 'Rome', code: 'RM' }];

        this.targetCities = [];

        this.orderCities = [
            { name: 'San Francisco', code: 'SF' },
            { name: 'London', code: 'LDN' },
            { name: 'Paris', code: 'PRS' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Berlin', code: 'BRL' },
            { name: 'Barcelona', code: 'BRC' },
            { name: 'Rome', code: 'RM' }];

        this.sortOptions = [
            { label: 'Task number High to Low', value: '!requestCount' },
            { label: 'Task number low to High', value: 'requestCount' }
        ];
    }

    onSortChange(event: any) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }

    getDefaultSolutionData(): void {
        this.projectService.getAllSolutions().subscribe(
            (data: ProjectDto[]) => {
                this.projects = data;
                console.log('Solutions:', this.projects); // Log solutions data to console
            },
            (error) => {
                console.error('Error fetching solutions:', error);
            }
        );
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    openNew() {
            this.product = {} as ProjectDto;
            this.submitted = false;
            this.productDialog = true;

    }

    saveProduct() {
        this.submitted = true;
        if (this.product.name && this.product.description && this.product.picture) {
            const formData = new FormData();
            if (this.selectedPicture) {
                formData.append('file', this.selectedPicture);
            }
            formData.append('solutionDTO', new Blob([JSON.stringify(this.product)], { type: 'application/json' }));
            this.projectService.createSolution(formData).subscribe(
                response => {
                    // Handle successful save
                    console.log('Product saved successfully', response);
                    this.productDialog = false;
                    this.product = {} as ProjectDto;
                    this.selectedPicture=null;
                    this.getDefaultSolutionData();

                },
                error => {
                    // Handle save error
                    console.error('Error saving product', error);
                }
            );
        }
    }
    onFileSelect(event: any) {
        if (event.currentFiles.length > 0) {
            this.selectedPicture = event.currentFiles[0]; // Store the file
            const reader = new FileReader();
            reader.onload = () => {
                this.product.picture = reader.result as string; // Read file as data URL and assign to product.picture
            };
            reader.readAsDataURL(this.selectedPicture); // Convert the file to data URL for display
        }
    }
    editProduct(product: ProjectDto) {
        this.product = { ...product } ;
        this.productDialog = true;
    }

    deleteProduct(product: ProjectDto) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }
    confirmDelete() {
        this.deleteProductDialog = false;
        this.projectService.deleteSolution(this.product.id).subscribe(
            () => {
                this.getDefaultSolutionData();
                console.log('Solution deleted successfully');
            },
            error => {
                // Handle error here
                console.error('Error deleting solution:', error);
            }
        );
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project Deleted', life: 3000 });
        this.product = {} as ProjectDto;
    }
}
