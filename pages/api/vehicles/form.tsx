import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
	const {name,model,wheels} = req.body

	{/**Try & Catch Error before submitting Data to Postgresql */}
	try {
		await prisma.vehicle.create({
			data: {
				name,
				model,
                wheels
			}
		})
		res.status(200).json({message: 'Vehicle Created'})
	} catch (error) {
		console.log("Failure");
	}
}
{/** End of Try & Catch Error before submitting Data to Postgresql */}