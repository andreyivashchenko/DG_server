import {InfoData, GroupedClient, ModifyObjectData, GroupedObject} from '../types/admin.types';

export const transformInfoData = (objects: InfoData[]): GroupedClient[] => {
    const groupedDataMap = new Map<number, Map<number, ModifyObjectData[]>>();

    const createModifyObject = (object: InfoData): ModifyObjectData => {
        const {client_id, object_group_id, ...newObj} = object;
        const ModifyObject: ModifyObjectData = {
            object_id: newObj.object_id,
            coordinates: [newObj.coordinates.x, newObj.coordinates.y],
            status: newObj.status
        };
        return ModifyObject;
    };

    for (const obj of objects) {
        if (!groupedDataMap.has(obj.client_id)) {
            groupedDataMap.set(obj.client_id, new Map<number, ModifyObjectData[]>());
        }

        const clientGroupMap = groupedDataMap.get(obj.client_id);

        if (clientGroupMap && clientGroupMap.has(obj.object_group_id)) {
            clientGroupMap.get(obj.object_group_id)!.push(createModifyObject(obj));
        } else {
            if (clientGroupMap) {
                clientGroupMap.set(obj.object_group_id, [createModifyObject(obj)]);
            }
        }
    }

    const result: GroupedClient[] = [];

    for (const [clientId, groupMap] of groupedDataMap) {
        const groups: GroupedObject[] = [];

        for (const [groupId, groupObjects] of groupMap) {
            groups.push({
                object_group_id: groupId,
                objects: groupObjects
            });
        }

        result.push({
            client_id: clientId,
            groups: groups
        });
    }

    return result;
};
