export interface ProjectPayload {
    name: string 
    description: string;
    startDate: Date | null;
    endDate: Date | null;
    link: string;
    urlImage: string | null;
    personId: string;
}
