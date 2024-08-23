import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import {UserService} from "../../../service/user.service";
import {Utilisateur} from "../../../dto/utilisateur";
import {ManagerDTO} from "../../../dto/manager-dto";

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CrudComponent implements OnInit {

    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Utilisateur[] = [];

    product: Utilisateur = {} as Utilisateur;

    manager: ManagerDTO ={} as ManagerDTO;

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];
    confirmPassword: string ="";

    constructor(private productService: ProductService,
                private messageService: MessageService,
                private userService: UserService,) { }

    ngOnInit() {
        this.getAllProjectManagers();

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }

    getAllProjectManagers(): void {
        this.userService.getAllProjectManagers().subscribe(
            (managers: Utilisateur[]) => {
                this.products = managers;
                console.log("hhh");
            },
            (error: any) => {
                console.error('Failed to fetch project managers', error);
            }
        );
    }

    openNew() {
        this.product = {} as Utilisateur;
        this.manager={} as ManagerDTO;
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Utilisateur) {
        this.product = { ...product };
        this.manager= {
            id:this.product.id,
            username: this.product.username,
            email: this.product.email,
            password: this.product.password,
            phone: this.product.account.phone,
            poste: this.product.poste
        };

        this.productDialog = true;
    }

    deleteProduct(product: Utilisateur) {
        this.deleteProductDialog = true;
        this.product = { ...product };
        this.manager= {
            id:this.product.id,
            username: this.product.username,
            email: this.product.email,
            password: this.product.password,
            phone: this.product.account.phone,
            poste: this.product.poste
        };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.getAllProjectManagers();
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedProducts = [];
    }

    confirmDelete() {
        this.userService.deleteUser(this.product.id).subscribe(
            (response) => {
                console.log('User deleted successfully');
            },
            (error) => {
                console.error('Delete failed:', error);
                this.getAllProjectManagers();
            }
        );
        this.deleteProductDialog = false;
        this.getAllProjectManagers();
        this.product = {} as Utilisateur;
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        // Check if all required fields are filled
        if (!this.manager.username || !this.manager.email || !this.manager.phone || !this.manager.poste) {
            console.error('Please fill in all required fields.');
            return;
        }

        // Check if it's an update operation
        if (this.product && this.product.id) {
            // If editing and password is not provided, remove the password field
            if (!this.manager.password) {
                delete this.manager.password;
            } else {
                // Verify password match if it's provided and confirmPassword matches
                if (this.manager.password !== this.confirmPassword) {
                    console.error('Passwords do not match.');
                    return;
                }
            }

            // Call updateUser method instead of registerProjectManager for update operation
            this.userService.registerProjectManager(this.manager)
                .subscribe(
                    response => {
                        // console.log('Update successful:', response);
                        this.resetForm();
                        this.getAllProjectManagers();

                    },
                    error => {
                        // Handle update error here
                        this.getAllProjectManagers();
                        console.error('Update failed:', error);
                    }
                );
        } else {
            // It's a create operation
            // Verify password match if it's provided and confirmPassword matches
            if (this.manager.password !== this.confirmPassword || !this.manager.password) {
                console.error('Passwords do not match.');
                return;
            }

            // Call registerProjectManager with ManagerDTO
            this.userService.registerProjectManager(this.manager)
                .subscribe(
                    response => {
                        // // Handle successful registration response here
                        // console.log('Registration successful:', response);
                        this.resetForm();
                        this.getAllProjectManagers();

                    },
                    error => {
                        // Handle registration error here
                        this.getAllProjectManagers();
                        console.error('Registration failed:', error);
                    }
                );
        }

        this.productDialog = false;
        this.product = {} as Utilisateur;
        this.manager = {} as ManagerDTO;
    }



    resetForm() {
        // Reset form fields and any other related variables
        this.product = {} as Utilisateur;
        this.confirmPassword = '';
        this.submitted = false;
    }






    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
