// export const activateItem = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const item = await Item.findById(id);
//   if (!item) return res.sendStatus(404);
//   if (item.donor.toString() !== req.user._id.toString()) return res.sendStatus(403);

//   item.status = "available";
//   await item.save();

//   res.json({ message: "Item is now available again.", item });
// };
