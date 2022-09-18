import { SkillType } from "./skillType.interface";

export interface Skill {
    id?: string;
    name: string
    grade: number;
    personId: string;
    skillTypeId: string;
    skillType: SkillType;
}
