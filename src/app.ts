import express, { Express, Request, Response, NextFunction } from "express";
import z from 'zod';
import { Recommendation } from './services/recommendation';

const app: Express = express();

//Engages multiple isolated residents (those who have not been to a program recently) 
/**
 * @openapi
 * /programs/isolated-residents:
 *    get:
 *      description: Get programs that engage multiple isolated residents (those who have not been to a program recently)  
 *      parameters:
 *        - in: query
 *          name: fromDate
 *          schema:
 *            type: string
 *            description: specifies the date on which the isolated resident should start being considered (inclusive)
 *            required: false
 *            example: 2022-06-01T00:00:00.000Z
 *            default: 2022-06-01T00:00:00.000Z
 *      responses:
 *        200:
 *          description: Returns upto 3 progams that engage multiple isolated residents
 *          schema:
 *            type: array
 *            items:
 *              type: string
 *        400:
 *          description: Invalid Date string provided
 */
app.get("/programs/isolated-residents", (req: Request, res: Response, next: NextFunction) => {
  
  const querySchema = z.object({
    fromDate: z.string().datetime().default('2022-06-01T00:00:00.000Z'),
  });
  const validate = querySchema.safeParse(req.query);
  if (!validate.success){
    res.status(400).send(validate.error.format());
  } else {
    // date to start considering isolation 
    const { fromDate } = req.query as z.infer<typeof querySchema>;
    const fromDateTime = new Date(fromDate).getTime();
    const topProgramNames = Recommendation
      .getProgramsForIsolatedResidents(fromDateTime)
      .slice(0, 3);
    res.status(200).send(topProgramNames);
  }
});

export default app;
