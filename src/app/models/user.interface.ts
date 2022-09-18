import { Person } from "./person.interface";

export interface User {
    id?: string;
    username: string 
    email: string;
    person: Person
}
