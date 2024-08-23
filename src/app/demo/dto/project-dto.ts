export class ProjectDto {
    id?: number;
    name?: string;
    description!: string;
    website?: string;
    picture?: string;
    video?: string;
    active?: boolean;
    status?: string;
    requestCount?:number;


}
