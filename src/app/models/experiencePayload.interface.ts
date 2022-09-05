export interface ExperiencePayload {
    id?: string;
    title: string 
    companyName: string;
    startDate: Date | null;
    endDate: Date | null;
    location: string;
    urlImage: string | null;
    personId: string;
    workTimeTypeId: string;
}
