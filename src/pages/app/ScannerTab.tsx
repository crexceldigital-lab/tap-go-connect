import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import UpgradeModal from "@/components/UpgradeModal";
import { Camera, Upload, Loader2, Check, ScanLine, Crown, User, Phone, Mail, Building2, Globe, MapPin } from "lucide-react";

interface ScannedData {
  full_name: string;
  job_title: string;
  company_name: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}

const MAX_FREE_SCANS = 5;

const ScannerTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [scansUsed, setScansUsed] = useState(0);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const scansLeft = MAX_FREE_SCANS - scansUsed;

  const handleFile = async (file: File) => {
    if (scansLeft <= 0) {
      setUpgradeOpen(true);
      return;
    }

    setPreview(URL.createObjectURL(file));
    setScanning(true);
    setScannedData(null);

    try {
      const ext = file.name.split(".").pop();
      const path = `${user!.id}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("avatars").upload(path, file);
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      const { data, error } = await supabase.functions.invoke("scan-card", { body: { imageUrl: publicUrl } });
      if (error) throw error;

      setScannedData(data.extracted);
      setScansUsed(prev => prev + 1);
      toast({ title: "Card scanned successfully!" });
    } catch (err: any) {
      toast({ title: "Scan failed", description: err.message, variant: "destructive" });
    } finally {
      setScanning(false);
    }
  };

  const handleCreateCard = async () => {
    if (!user || !scannedData) return;
    const { data } = await supabase.from("cards").insert({
      user_id: user.id,
      card_name: scannedData.full_name || "Scanned Card",
      full_name: scannedData.full_name,
      job_title: scannedData.job_title,
      company_name: scannedData.company_name,
      phone: scannedData.phone,
      email: scannedData.email,
      website: scannedData.website,
    }).select("id").single();
    if (data) navigate(`/editor/${data.id}`);
  };

  const updateField = (field: keyof ScannedData, value: string) => {
    if (scannedData) setScannedData({ ...scannedData, [field]: value });
  };

  const fields = [
    { key: "full_name" as const, label: "Name", icon: User },
    { key: "job_title" as const, label: "Title", icon: User },
    { key: "company_name" as const, label: "Company", icon: Building2 },
    { key: "phone" as const, label: "Phone", icon: Phone },
    { key: "email" as const, label: "Email", icon: Mail },
    { key: "website" as const, label: "Website", icon: Globe },
    { key: "address" as const, label: "Address", icon: MapPin },
  ];

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold">AI Scanner</h1>
          <p className="text-xs text-muted-foreground">Scan business cards instantly</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {scansLeft} scan{scansLeft !== 1 ? "s" : ""} left
          </span>
          <button onClick={() => setUpgradeOpen(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-primary/30 text-[10px] font-semibold text-primary">
            <Crown size={10} />Upgrade
          </button>
        </div>
      </div>

      {!scannedData ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Scan Area */}
          <div className="relative bg-card rounded-3xl border border-border overflow-hidden mb-4">
            {preview && scanning ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-64 object-cover opacity-50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Loader2 size={32} className="text-primary animate-spin mb-2" />
                  <p className="text-sm font-medium">Scanning...</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ScanLine size={32} className="text-primary" />
                </div>
                <h3 className="font-bold mb-1">Scan a Business Card</h3>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Take a photo or upload an image to extract contact details
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-3 rounded-full brand-gradient text-sm font-semibold text-primary-foreground gradient-glow"
                  >
                    <Camera size={16} />Capture
                  </button>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-secondary text-sm font-medium"
                  >
                    <Upload size={16} />Upload
                  </button>
                </div>
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {preview && (
            <img src={preview} alt="Scanned" className="w-full h-40 object-cover rounded-2xl" />
          )}

          <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Check size={14} className="text-emerald-500" />
              <span className="text-sm font-semibold">Extracted Details</span>
            </div>
            {fields.map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center gap-3">
                <Icon size={14} className="text-muted-foreground shrink-0" />
                <input
                  value={scannedData[key] || ""}
                  onChange={(e) => updateField(key, e.target.value)}
                  placeholder={label}
                  className="flex-1 bg-secondary rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCreateCard}
              className="flex-1 py-3.5 rounded-full brand-gradient text-sm font-semibold text-primary-foreground gradient-glow"
            >
              Create TAP & GO Card
            </button>
            <button
              onClick={() => { setScannedData(null); setPreview(null); }}
              className="px-5 py-3.5 rounded-full bg-secondary text-sm font-medium"
            >
              Scan Again
            </button>
          </div>
        </motion.div>
      )}

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} reason="Upgrade to PRO for unlimited AI scans." />
    </div>
  );
};

export default ScannerTab;
