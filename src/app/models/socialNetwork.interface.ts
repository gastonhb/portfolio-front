import { SocialNetworkType } from "./socialNetworkType.interface";

export interface SocialNetwork {
    id?: string;
    content: string; 
    personId: string;
    socialNetworkTypeId: string;
    socialNetworkType: SocialNetworkType;
}
