import {Role} from "./role";
import {Account} from "./account";

export class Utilisateur {
    id !: number;
    username !: string;
    email !: string;
    password !: string;
    roles !: Role[];
    account !: Account;
    poste!: string;
    contact_id!:number;


}
