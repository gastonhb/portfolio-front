export interface Project {
    id?: string;
    name: string 
    description: string;
    startDate: Date | null;
    endDate: Date | null;
    link: string;
    urlImage: string | null;
    personId: string;
    person?: {
        id: string, 
        name: string,
        lastname: string,
        title: string,
        abstracts: string, 
        urlImage: string,
        urlCoverPhoto: string
    }
}
