import {Utilisateur} from "./utilisateur";

export class TaskDto {
    id?: number;
    name?: string;
    description?: string;
    stage?: string;
    manager_id?: number;
    manager_name?: string;
    client_id?: number;
    request_id?: number;
    // kanbanBoard: KanbanBoard;
    creationDate?: Date;
    subscriberIds?: number[];
    subscribers?: Utilisateur[];
    client?:Utilisateur;


}
