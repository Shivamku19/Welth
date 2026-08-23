"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { scanReceipt } from "@/actions/transaction";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleReceiptScan = async (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result.split(",")[1];
        try {
          const data = await scanReceipt(base64String, file.type);
          if (data) {
            onScanComplete(data);
            toast.success("Receipt scanned successfully");
          } else {
            toast.error("Failed to scan receipt");
          }
        } catch (error) {
          console.error(error);
          toast.error(error.message || "Failed to scan receipt");
        } finally {
          setIsScanning(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      };
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to scan receipt");
      setIsScanning(false);
    }
  };

  return (
    <div className="flex items-center gap-4 w-full">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 text-white hover:text-white hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 border-none"
        onClick={() => fileInputRef.current?.click()}
        disabled={isScanning}
      >
        {isScanning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Scanning Receipt...</span>
          </>
        ) : (
          <>
            <Camera className="mr-2 h-4 w-4" />
            <span>Scan Receipt with AI</span>
          </>
        )}
      </Button>
    </div>
  );
}
