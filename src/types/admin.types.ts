export interface InfoData {
    client_id: number;
    name_org: string;
    object_group_id: number;
    optimal_object_id?: number;
    object_id: number;
    coordinates: {x: number; y: number};
    status: string;
}

export interface ModifyObjectData
    extends Omit<InfoData, 'client_id' | 'object_group_id' | 'optimal_object_id' | 'coordinates' | 'name_org'> {
    coordinates: number[];
}
export interface GroupedObject {
    object_group_id: number;
    optimal_object_id?: number;
    objects: ModifyObjectData[];
}

export interface GroupedClient {
    client_id: number;
    name_org: string;
    groups: GroupedObject[];
}
