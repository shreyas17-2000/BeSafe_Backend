const Joi = require("joi");
const mslf = require("../models/mslf");
const mslfController = {
	async mslf(req, res, next) {
		const { _id } = req.user;
		const data = JSON.parse(req.body.data);
		const mslfSchema = Joi.object({
			incidenceDesc: Joi.string().required(),
			dateFrom: Joi.string().required(),
			dateTo: Joi.string().required(),
			stationName: Joi.string().required(),
			stationAddress: Joi.string().required(),
			reportFor: Joi.string().required(),
			lostLocName: Joi.string().required(),
			lostLocAddress: Joi.string().required(),
			thingDesc: Joi.string().required(),
			thingName: Joi.string().required(),
		});
		const { error } = mslfSchema.validate(data);
		if (error) {
			next(error);
		}
		let complaints;
		let addComplaint;
		try {
			complaints = await mslf.findOne({
				userId: _id,
			});
			if (!complaints) {
				const complaint = await new mslf({
					userId: _id,
					mslf: { ...data, images: req.urls },
				});
				addComplaint = await complaint.save();
			} else {
				addComplaint = await mslf.findOneAndUpdate(
					{
						userId: _id,
					},
					{
						$push: {
							mslf: { ...data, images: req.urls },
						},
					}
				);
			}
			var io = req.app.get("socketio");
			io.emit("statusUpdated", { success: true });
			return res.json({
				success: true,
				addComplaint,
			});
		} catch (error) {
			console.log(error);
		}
	},
	async getmslf(req, res, next) {
		const { _id, role } = req.user;
		let myComplaints;
		try {
			if (role === 5000) {
				myComplaints = await mslf.find({
					$or: [
						{
							userId: _id,
							mslf: { $elemMatch: { status: { $ne: "Solved" } } },
						},
						{
							mslf: {
								$elemMatch: { assignTo: _id, status: { $ne: "Solved" } },
							},
						},
					],
				});
			} else if (role === 4000) {
				myComplaints = await mslf.find({
					$or: [
						{ userId: _id },
						{
							mslf: {
								$elemMatch: {
									stationAddress: req.station,
									status: { $ne: "Solved" },
								},
							},
						},
					],
				});
			} else if (role === 3000) {
				myComplaints = await mslf.find({
					$or: [
						{
							userId: _id,
							mslf: {
								$elemMatch: {
									status: { $ne: "Solved" },
								},
							},
						},
					],
				});
			}

			// var io = req.app.get("socketio");
			// io.on("connection", (socket) => {
			//   console.log("a user connected");
			//   socket.on("g", ({ token }) => {
			//     console.log(token);
			//     if (token) {
			//       socket.to(socket.id).emit(token, {
			//         success: true,
			//         // myComplaints,
			//       });
			//     }
			//   });
			//   // socket.token = socket.handshake.headers.token;
			//   // socket.join(socket.token);
			//   socket.on("disconnect", () => {
			//     console.log("user disconnected");
			//   });
			// });
			res.json({ success: true, myComplaints });
		} catch (error) {
			return next(error);
		}
	},
	async mslfHistory(req, res, next) {
		const { _id, role } = req.user;
		let myComplaints;
		try {
			if (role === 5000) {
				myComplaints = await mslf.find({
					$or: [
						{
							userId: _id,
							mslf: {
								$elemMatch: { status: "Solved" },
							},
						},
						{
							mslf: { $elemMatch: { assignTo: _id, status: "Solved" } },
						},
					],
				});
			} else if (role === 4000) {
				myComplaints = await mslf.find(
					{
						mslf: {
							$elemMatch: { stationAddress: req.station, status: "Solved" },
						},
					},
					{ "complaints.$": 1 }
				);
			} else if (role === 3000) {
				myComplaints = await mslf.find({
					$or: [
						{
							userId: _id,
							mslf: {
								$elemMatch: { status: "Solved" },
							},
						},
					],
				});
			}
			res.json({ success: true });
		} catch (error) {
			return next(error);
		}
	},
};

module.exports = mslfController;
