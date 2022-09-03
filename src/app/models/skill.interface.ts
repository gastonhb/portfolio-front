export interface Skill {
    id?: string;
    name: string 
    type: string;
    grade: number;
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
