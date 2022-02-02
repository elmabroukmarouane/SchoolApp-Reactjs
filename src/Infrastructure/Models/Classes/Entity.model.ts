import { ICommonFields } from "../Interfaces/ICommonFields.interface";
import { IIds } from "../Interfaces/IIds.interface";

export class Entity implements IIds, ICommonFields {
    id: number;
    createdate: string;
    updatedate: string;
    createdby: string;
    updatedby: string;

    constructor(id: number = 0, createdate: string, updatedate: string, createdby: string, updatedby: string) {
        this.id = id;
        this.createdate = createdate;
        this.updatedate = updatedate;
        this.createdby = createdby;
        this.updatedby = updatedby;
    }
}