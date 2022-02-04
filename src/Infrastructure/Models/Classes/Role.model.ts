import { Entity } from "./Entity.model";

export class Role extends Entity {
    role: number;
    title: string;
    description: string;
    users: any;
}