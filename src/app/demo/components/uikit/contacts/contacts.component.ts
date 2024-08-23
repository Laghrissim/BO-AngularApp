import { Component } from '@angular/core';
import {Product} from "../../../api/product";
import {ProjectDto} from "../../../dto/project-dto";
import {MessageService, SelectItem} from "primeng/api";
import {ProductService} from "../../../service/product.service";
import {ProjectService} from "../../../service/project.service";
import {DataView} from "primeng/dataview";
import {ContactService} from "../../../service/contact.service";
import {Contact} from "../../../dto/contact";

@Component({
  selector: 'app-contacts',
  standalone: false,
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

    contacts: Contact[] = [];

    sortOptions: SelectItem[] = [];

    sortOrder: number = 0;

    sortField: string = '';

    sourceCities: any[] = [];

    targetCities: any[] = [];

    orderCities: any[] = [];
    items: any;
    productDialog: boolean=false;
    deleteProductDialog: boolean=false;
    product: Contact= {} as Contact;

    submitted: boolean = false;
    selectedPicture: File | null = null;

    constructor(private productService: ProductService,
                private projectService:ProjectService,
                private messageService: MessageService,
                private contactService: ContactService,
                ) { }

    ngOnInit() {
    this.getDefaultContactData()



        this.sortOptions = [
            { label: 'User number High to Low', value: '!users.length' },
            { label: 'User number low to High', value: 'users.length' }
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


    getDefaultContactData(): void {
        this.contactService.getAllContacts().subscribe(
            (data: Contact[]) => {
                this.contacts = data;
                console.log('Solutions:', this.contacts); // Log solutions data to console
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
        if (this.product.name && this.product.email && this.product.picture) {
            const formData = new FormData();
            if (this.selectedPicture) {
                formData.append('file', this.selectedPicture);
            }
            formData.append('contactDTO', new Blob([JSON.stringify(this.product)], { type: 'application/json' }));
            this.contactService.createContact(formData).subscribe(
                response => {
                    // Handle successful save
                    console.log('Product saved successfully', response);
                    this.productDialog = false;
                    this.product = {} as ProjectDto;
                    this.selectedPicture=null;
                    this.getDefaultContactData();

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
        this.contactService.deleteContact(this.product.id).subscribe(
            () => {
                this.getDefaultContactData();
                console.log('Contact deleted successfully');
            },
            error => {
                // Handle error here
                console.error('Error deleting solution:', error);
            }
        );
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Contact Deleted', life: 3000 });
        this.product = {} as ProjectDto;
    }
}
