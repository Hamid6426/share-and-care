// export const inactivateItem = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const item = await Item.findById(id);
//   if (!item) return res.sendStatus(404);
//   if (item.donor.toString() !== req.user._id.toString()) return res.sendStatus(403);

//   item.status = "inactive";
//   item.receiver = null;
//   item.requesters = [];
//   item.isRequested = false;
//   item.requestAccepted = false;
//   item.isAccepted = false;
//   item.isClaimed = false;
//   item.isPicked = false;
//   item.isDonated = false;
//   await item.save();

//   res.json({ message: "Item is now inactive.", item });
// };
