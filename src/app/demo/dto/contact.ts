import {Utilisateur} from "./utilisateur";

export class Contact {
    id?: number;
    name?: string;
    picture?: string;
    website?: string;
    address?: string;
    mobile?: string;
    email?: string;
    users?: Utilisateur[] = [];
}
