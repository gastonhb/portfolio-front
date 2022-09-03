export interface Education {
    id?: string;
    title: string 
    institute: string;
    startDate: number | null;
    endDate: number | null;
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
