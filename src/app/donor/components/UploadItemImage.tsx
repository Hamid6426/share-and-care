"use client";
import React, { useState, useRef } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Image from "next/image";

interface Props {
  itemId: string;
  onUploadSuccess?: (imageUrl: string) => void;
}

const UploadItemImage: React.FC<Props> = ({ itemId, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  console.log(selectedFile);
  const centerAspectCrop = (
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
  ) => {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, 4 / 3));
    }
  };

  const getCroppedImg = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!imgRef.current || !completedCrop || !previewCanvasRef.current) {
        resolve(null);
        return;
      }

      const canvas = previewCanvasRef.current;
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(null);
        return;
      }

      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob(
        (blob) => {
          resolve(blob || null);
        },
        "image/jpeg",
        1
      );
    });
  };

  const handleUpload = async () => {
    if (!completedCrop) return toast.error("No cropped image to upload");

    const croppedBlob = await getCroppedImg();
    if (!croppedBlob) return toast.error("Failed to crop image");

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Not authorized");

    const formData = new FormData();
    formData.append("itemImage", croppedBlob, "cropped-image.jpeg");

    try {
      setIsUploading(true);
      const res = await axiosInstance.patch(
        `/api/items/${itemId}/donor-actions/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Image uploaded successfully!");
      if (onUploadSuccess) onUploadSuccess(res.data.imageUrl);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col w-full">
      {/* Hidden file input */}
      <input
        id="fileUpload"
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="hidden w-full"
      />

      {/* Show selected file name (optional) */}
      {/* {selectedFile && <p className="text-sm text-gray-700">Selected: {selectedFile.name}</p>} */}

      {/* Image cropping */}
      {imageSrc && (
        <div>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={4 / 3}
            className="w-full"
          >
            <Image
              ref={imgRef}
              width={1280}
              height={1280}
              src={imageSrc}
              alt="Crop me"
              onLoad={onImageLoad}
              className="w-full aspect-square"
            />
          </ReactCrop>
        </div>
      )}

      {/* Cropped Image Preview */}
      <div>
        <canvas ref={previewCanvasRef} style={{ display: "none" }} />
      </div>

      <div className="flex mt-3 flex-col md:flex-row gap-3 justify-center items-center max-w-sm w-full">
        {/* Custom styled label acting as button */}

        {/* Upload button */}
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading || !completedCrop}
          className="disabled:hidden bg-primary hover:bg-accent text-white max-w-xs w-full text-center  py-2 rounded"
        >
          {isUploading ? "Uploading..." : "Upload Image"}
        </button>

        <label
          htmlFor="fileUpload"
          className="cursor-pointer bg-primary hover:bg-accent text-white font-medium max-w-xs w-full py-2 text-center rounded"
        >
          Choose an image
        </label>
      </div>
    </div>
  );
};

export default UploadItemImage;
