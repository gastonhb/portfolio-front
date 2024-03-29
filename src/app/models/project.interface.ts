export interface Project {
    id: string;
    name: string 
    description: string;
    startDate: Date;
    endDate: Date | null;
    link: string;
    urlImage: string | null;
    personId: string;
}
