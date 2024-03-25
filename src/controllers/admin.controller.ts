import {config} from 'dotenv';
import {Request, Response} from 'express';
import {pool} from '../db';
config();

interface ObjectData {
    client_id: number;
    object_group_id: number;
    object_id: number;
    coordinates: {x: number; y: number};
    status: string;
}

class AdminController {
    async getAllObjects(req: Request, res: Response) {
        const allObjects = await pool.query(
            'SELECT clients.client_id, objectgroup.object_group_id, objects.object_id, objects.coordinates , objects.status FROM clients JOIN objectgroup ON objectgroup.client_id = clients.client_id JOIN objects ON objects.object_group_id = objectgroup.object_group_id ORDER BY client_id'
        );

        interface ObjectData {
            client_id: number;
            object_group_id: number;
            object_id: number;
            coordinates: {x: number; y: number};
            status: string;
        }

        interface GroupedObject {
            object_group_id: number;
            objects: ObjectData[];
        }

        interface GroupedClient {
            client_id: number;
            groups: GroupedObject[];
        }

        function transformData(objects: ObjectData[]): GroupedClient[] {
            const groupedDataMap = new Map<number, Map<number, ObjectData[]>>();

            for (const obj of objects) {
                if (!groupedDataMap.has(obj.client_id)) {
                    groupedDataMap.set(obj.client_id, new Map<number, ObjectData[]>());
                }

                const clientGroupMap = groupedDataMap.get(obj.client_id);

                if (clientGroupMap && clientGroupMap.has(obj.object_group_id)) {
                    clientGroupMap.get(obj.object_group_id)!.push(obj);
                } else {
                    if (clientGroupMap) {
                        clientGroupMap.set(obj.object_group_id, [obj]);
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
        }

        const transformedData = transformData(allObjects.rows);
        console.log(transformedData);
        res.json(transformedData);
    }
}
export default new AdminController();
