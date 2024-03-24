import {config} from 'dotenv';
import {Request, Response} from 'express';
import type {Point, RawMatrix, RawRoute} from '../types/map.types';
config();

class RouteController {
    async getRoute(req: Request<{}, {}, {}, {waypoints: string}>, res: Response) {
        try {
            const {waypoints} = req.query;
            const formateWaypoints = (JSON.parse(waypoints) as Point[]).map((point) => point.reverse());

            if (formateWaypoints.length < 2) {
                return res.status(401).send({
                    success: false,
                    message: 'There must be at least two waypoints.'
                });
            }

            const routeUrl = new URL('https://api.routing.yandex.net/v2/route');
            routeUrl.searchParams.set('apikey', process.env.ROUTER_API_KEY!);
            routeUrl.searchParams.set('waypoints', formateWaypoints.map((x) => x.join(',')).join('|'));
            const routeRes = await fetch(routeUrl);

            if (routeRes.status !== 200) {
                return res.status(500).send({
                    success: false,
                    message: 'Server error. Failed to build a route.'
                });
            }

            const rawRoute = (await routeRes.json()) as RawRoute;
            const legs = rawRoute.route.legs;

            const points = legs
                .flatMap((leg) => leg.steps)
                .flatMap((step) => step.polyline.points)
                .map((point) => point.reverse());

            let duration = legs.flatMap((leg) => leg.steps).reduce((total, x) => total + x.duration, 0);
            duration = Math.ceil(duration);

            let distance = legs.flatMap((leg) => leg.steps).reduce((total, x) => total + x.length, 0);
            distance = Math.ceil(distance);

            res.send({
                success: true,
                message: 'User created successfully.',
                route: {points, duration, distance}
            });
        } catch (err) {
            res.send({
                success: false,
                message: 'Something went wrong',
                error: err
            });
        }
    }

    async getMatrix(req: Request<{}, {}, {}, {origins: string; destinations: string}>, res: Response) {
        try {
            const {origins, destinations} = req.query;
            const formateOrigins = (JSON.parse(origins) as Point[]).map((point) => point.reverse());
            const formateDestinations = (JSON.parse(destinations) as Point[]).map((point) => point.reverse());
            if (!formateOrigins || !formateDestinations) {
                return res.status(401).send({
                    success: false,
                    message: 'There must be at least two waypoints.'
                });
            }

            const routeUrl = new URL('https://api.routing.yandex.net/v2/distancematrix');
            routeUrl.searchParams.set('apikey', process.env.ROUTER_API_KEY!);
            routeUrl.searchParams.set('traffic', 'disabled');
            routeUrl.searchParams.set('origins', formateOrigins.map((x) => x.join(',')).join('|'));
            routeUrl.searchParams.set('destinations', formateDestinations.map((x) => x.join(',')).join('|'));
            const routeRes = await fetch(routeUrl);
            const rawMatrix = (await routeRes.json()) as RawMatrix;
            const rows = rawMatrix.rows;
            const rawMatrixWithPoints = rows.map((row, i) => {
                row.elements.map((elem, ind) => {
                    elem.origin = formateOrigins[i] as Point;
                    elem.destination = formateDestinations[ind] as Point;
                    return elem;
                });
                return row;
            });

            const filteredRows = rawMatrixWithPoints
                .flatMap((row) => row.elements)
                .filter((elem) => elem.distance.value != 0)
                .reduce((prev, current) => (prev.duration.value < current.duration.value ? prev : current));

            res.send({
                success: true,
                message: 'User created successfully.',
                matrix: filteredRows
            });
        } catch (err) {
            res.send({
                success: false,
                message: 'Something went wrong',
                error: err
            });
        }
    }
}

export default new RouteController();
