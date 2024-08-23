import {TaskDto} from "./task-dto";

export interface Message {
    id?: number;
    project?: TaskDto; // Assuming you have a Project model as well
    sender: string;
    content: string;
    timestamp?: Date;
    readDate?: Date;
}
