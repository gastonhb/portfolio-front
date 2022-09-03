export interface Experience {
    id?: string;
    title: string 
    companyName: string;
    startDate: Date | null;
    endDate: Date | null;
    workTime: string;
    location: string;
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
