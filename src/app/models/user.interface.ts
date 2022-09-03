export interface User {
    id?: string;
    username: string 
    email: string;
    person: {
        id: string, 
        name: string,
        lastname: string,
        title: string,
        abstracts: string, 
        urlImage: string,
        urlCoverPhoto: string
    }
}
