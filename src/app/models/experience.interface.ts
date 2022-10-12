import { Person } from "./person.interface";
import { WorkTimeType } from "./workTimeType.interface";

export interface Experience {
    id: string;
    title: string 
    companyName: string;
    startDate: Date;
    endDate: Date | null;
    location: string;
    urlImage: string | null;
    personId: string;
    workTimeTypeId: string;
    workTimeType: WorkTimeType;
}
