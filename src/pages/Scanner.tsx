import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Upload, ArrowLeft, Loader2, Sparkles, Save, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/tapngo-logo.png";

interface ScannedData {
  full_name: string;
  job_title: string;
  company_name: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}

const Scanner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCapture = async (file: File) => {
    setScanning(true);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      // Upload to storage for AI processing
      const ext = file.name.split(".").pop();
      const path = `scans/${user?.id}/${Date.now()}.${ext}`;
      await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);

      // Call AI edge function for OCR
      const { data, error } = await supabase.functions.invoke("scan-card", {
        body: { imageUrl: urlData.publicUrl },
      });

      if (error) throw error;
      setScannedData(data.extracted || {
        full_name: "", job_title: "", company_name: "",
        phone: "", email: "", website: "", address: "",
      });
    } catch (e: any) {
      toast({ title: "Scan failed", description: e.message || "Could not extract data from image.", variant: "destructive" });
      setScannedData({
        full_name: "", job_title: "", company_name: "",
        phone: "", email: "", website: "", address: "",
      });
    } finally {
      setScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleCapture(file);
  };

  const updateField = (field: keyof ScannedData, value: string) => {
    if (scannedData) setScannedData({ ...scannedData, [field]: value });
  };

  const handleSaveContact = () => {
    if (!scannedData) return;
    toast({ title: "Contact saved!", description: `${scannedData.full_name || "Contact"} has been saved.` });
  };

  const handleCreateCard = async () => {
    if (!scannedData || !user) return;
    setSaving(true);
    const { data, error } = await supabase.from("cards").insert({
      user_id: user.id,
      card_name: scannedData.full_name || "Scanned Card",
      full_name: scannedData.full_name,
      job_title: scannedData.job_title,
      company_name: scannedData.company_name,
      phone: scannedData.phone,
      email: scannedData.email,
      website: scannedData.website,
    }).select("id").single();
    setSaving(false);
    if (data) navigate(`/editor/${data.id}`);
    else toast({ title: "Error", description: error?.message || "Failed to create card.", variant: "destructive" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} />Back
          </button>
          <img src={logo} alt="TAP & GO" className="h-7" />
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Sparkles size={14} />AI Powered
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Business Card Scanner</h1>
          <p className="text-muted-foreground text-sm">Take a photo or upload an image of a business card</p>
        </motion.div>

        {!scannedData && !scanning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <label className="flex flex-col items-center justify-center gap-4 p-12 rounded-3xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors bg-card">
              <div className="p-4 rounded-2xl brand-gradient">
                <Camera size={32} className="text-primary-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm">Capture or Upload</p>
                <p className="text-xs text-muted-foreground mt-1">Point at a business card and take a photo</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
            </label>

            <button
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
            >
              <Upload size={16} />Upload from gallery
            </button>
          </motion.div>
        )}

        {scanning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-16">
            {imagePreview && (
              <img src={imagePreview} alt="Scanning" className="w-48 h-32 object-cover rounded-2xl shadow-lg" />
            )}
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-sm text-muted-foreground">Extracting information with AI...</p>
          </motion.div>
        )}

        {scannedData && !scanning && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {imagePreview && (
              <div className="flex justify-center">
                <img src={imagePreview} alt="Scanned card" className="w-64 h-40 object-cover rounded-2xl shadow-lg" />
              </div>
            )}

            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Extracted Information</h3>
              {([
                { field: "full_name", label: "Full Name" },
                { field: "job_title", label: "Job Title" },
                { field: "company_name", label: "Company" },
                { field: "phone", label: "Phone" },
                { field: "email", label: "Email" },
                { field: "website", label: "Website" },
                { field: "address", label: "Address" },
              ] as const).map(({ field, label }) => (
                <div key={field}>
                  <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                  <input
                    value={scannedData[field]}
                    onChange={e => updateField(field, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm outline-none focus:border-primary/50"
                    placeholder={label}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={handleSaveContact} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors">
                <Save size={16} />Save as Contact
              </button>
              <button onClick={handleCreateCard} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl brand-gradient text-sm font-semibold text-primary-foreground gradient-glow disabled:opacity-50">
                <CreditCard size={16} />{saving ? "Creating..." : "Create TAP & GO Card"}
              </button>
            </div>

            <button
              onClick={() => { setScannedData(null); setImagePreview(null); }}
              className="w-full py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Scan another card
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Scanner;
