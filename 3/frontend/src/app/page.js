"use client";

import { useState } from "react";
import { Upload, RefreshCcw } from "lucide-react";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleImageUpload = async (e) => {
    e.preventDefault();

    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setPrediction(data.prediction);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative pt-20">
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center mb-12">
        <h1 className="text-5xl font-extrabold text-slate-800 mb-1 flex items-center justify-center space-x-3">
          <span>NoCap Images</span>
          <img src="/nocapimages.png" alt="logo" width={80} />
        </h1>
      </div>
      <div className="max-w-md w-full mx-auto p-6">
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm">
            {!image && (
              <div className="p-6">
                <div className="flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg p-6 space-y-4">
                  <div className="text-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer"
                    >
                      <span className="text-blue-600 hover:text-blue-500 font-medium flex flex-col items-center justify-center">
                        <Upload className="h-12 w-12 text-gray-400" />
                        Upload image
                      </span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          {previewUrl && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                Prediction score: {prediction}
                <button
                  className="text-black font-semibold py-2 px-2 rounded-lg items-center justify-center gap-2 bottom-50"
                  onClick={() => {
                    setImage(null);
                    setPreviewUrl(null);
                    setPrediction(null);
                  }}
                >
                  <RefreshCcw className="h-8 w-8" />
                </button>
              </h3>
              {prediction < 0.5 ? (
                <span className="text-green-500 text-xl font-semibold flex justify-center items-center">Your image is not capping.</span>
              ) : (
                <div className="flex justify-center items-center text-red-500 text-xl font-semibold">
                  Your image is a cap.
                </div>
              )}
              <div className="rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  className="max-w-full h-auto rounded"
                  alt="Uploaded image preview"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
