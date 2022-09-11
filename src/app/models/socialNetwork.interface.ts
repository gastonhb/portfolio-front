import { SocialNetworkType } from "./socialNetworkType.interface";

export interface SocialNetwork {
    id?: string;
    description: string; 
    personId: string;
    socialNetworkTypeId: string;
    socialNetworkType: SocialNetworkType;
}
