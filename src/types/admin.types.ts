export interface ObjectData {
    client_id: number;
    object_group_id: number;
    object_id: number;
    coordinates: {x: number; y: number};
    status: string;
}

export interface ModifyObjectData extends Omit<ObjectData, 'client_id' | 'object_group_id' | 'coordinates'> {
    coordinates: number[];
}
export interface GroupedObject {
    object_group_id: number;
    objects: ModifyObjectData[];
}

export interface GroupedClient {
    client_id: number;
    groups: GroupedObject[];
}
