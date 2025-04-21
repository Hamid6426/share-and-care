// import UploadItemImage from "@/components/UploadItemImage";
// import EditItemForm from "@/components/EditItemForm";
// import DeleteItemButton from "@/components/DeleteItemButton";

// const SingleItemPage = ({ item }) => {
//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
//       <EditItemForm item={item} />
//       <div className="my-6">
//         <UploadItemImage itemId={item._id} />
//       </div>
//       <DeleteItemButton itemId={item._id} />
//     </div>
//   );
// };

// export default SingleItemPage;
// export async function getServerSideProps(context) {
//   const { itemId } = context.params;
//   const res = await fetch(`https://api.example.com/items/${itemId}`);
//   const item = await res.json();

//   return {
//     props: {
//       item,
//     },
//   };
// }