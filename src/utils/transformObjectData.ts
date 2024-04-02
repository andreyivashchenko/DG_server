import {ObjectData} from '../types/object.types';

export const transformObjectData = (objects: ObjectData[]) => {
    return objects.map((object) => ({...object, coordinates: [object.coordinates.x, object.coordinates.y]}));
};
