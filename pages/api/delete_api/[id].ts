import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

type vehicleUpdate = {
	name?: string
	model?: string
	wheels?: string
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse){
	const vehicleId = req.query.id;

	if(req.method === 'DELETE') {
		const vehicles = await prisma.vehicle.delete({
			where: {id: Number(vehicleId)}
		})
		res.json(vehicles)
	} else {
		console.log("vehicle could not be deleted");
	}

	if (req.method === "PUT") {
		const vehicleId = req.query.id;
		const { name,model,wheels } = req.body
	
		const updatedData: vehicleUpdate = {}
		if (name) updatedData.name = name
		if (model) updatedData.model = model
		if (wheels) updatedData.wheels = wheels
		
		const id: string = vehicleId !!.toString()
		const vehicles = await prisma.vehicle.update({
		  where: { id: Number(vehicleId)},
		  data: updatedData,
		})
	
		return res.json(vehicles)
	  }

}

