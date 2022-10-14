export interface EducationPayload {
    title: string 
    institute: string;
    startDate: number;
    endDate: number | null;
    urlImage: string | null;
    personId: string;
}