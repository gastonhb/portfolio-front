import { Person } from "./person.interface";
import { WorkTimeType } from "./workTimeType.interface";

export interface Experience {
    id?: string;
    title: string 
    companyName: string;
    startDate: Date | null;
    endDate: Date | null;
    location: string;
    urlImage: string | null;
    personId: string;
    workTimeTypeId: string;
    person?: Person;
    workTimeType: WorkTimeType;
}
