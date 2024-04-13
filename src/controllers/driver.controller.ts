import {config} from 'dotenv';
import {Request, Response} from 'express';
import {pool} from '../db';
config();

class DriverController {
    async updateCoordinates(req: Request<{}, {}>, res: Response) {
        try {
            const {driver_id, coordinates} = req.body;
            await pool.query(
                'UPDATE drivers \
                SET coordinates = $1\
                WHERE driver_id = $2',
                [`(${coordinates.join(',')})`, driver_id]
            );

            res.status(200).json({message: 'ok!'});
        } catch (err) {
            res.status(500).json({message: `DB error`, err: err});
        }
    }
    async getDriverPosition(req: Request<{driver_id: number}>, res: Response) {
        try {
            res.writeHead(200, 'ok!', {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                connection: 'keep-alive'
            });

            const intervalId = setInterval(async () => {
                if (res.socket!.writable) {
                    const driver_id = +req.params.driver_id;

                    if (Number.isNaN(driver_id)) {
                        return res.status(400).send({
                            success: false,
                            message: 'Invalid driver_id.'
                        });
                    }
                    const driverRowCoordinates = await pool.query(
                        'SELECT coordinates FROM drivers\
                    WHERE  driver_id=$1',
                        [driver_id]
                    );
                    const coordinates = [
                        driverRowCoordinates.rows[0].coordinates.x,
                        driverRowCoordinates.rows[0].coordinates.y
                    ];
                    res.write(`data: ${JSON.stringify(coordinates)}\n\n`);
                } else {
                    clearInterval(intervalId);
                    res.end();
                }
            }, 1000);

            req.on('close', () => {
                clearInterval(intervalId);
                res.end();
            });
        } catch (err) {
            res.status(500).json({message: `DB error`, err: err});
        }
    }
    async getDrivers(
        req: Request,
        res: Response<{
            success: boolean;
            message: string;
            data?: {driver_id: number; object_group_id: number; full_name: string; name_org: string; status: string}[];
        }>
    ) {
        try {
            const drivers = await pool.query(
                'select driver_id, object_group_id, full_name, name_org, status from drivers '
            );
            if (!drivers.rows) {
                return res.status(500).json({
                    success: false,
                    message: 'Drivers not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'ok!',
                data: drivers.rows
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'DB error'
            });
        }
    }
}
export default new DriverController();
