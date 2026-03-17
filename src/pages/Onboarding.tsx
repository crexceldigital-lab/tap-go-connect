import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, Globe, Instagram, Linkedin, Twitter, MessageCircle, ChevronRight, ChevronLeft, CheckCircle2, Camera } from "lucide-react";
import logo from "@/assets/tapngo-logo.png";

const steps = ["Personal Info", "Contact Details", "Social Links", "Preview"];

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    full_name: "", job_title: "", company_name: "", avatar_url: "",
    phone: "", email: "", website: "",
    instagram: "", linkedin: "", twitter: "", whatsapp: "",
  });

  useEffect(() => {
    if (user) {
      setData((d) => ({ ...d, email: user.email || "", full_name: user.user_metadata?.full_name || "" }));
    }
  }, [user]);

  const update = (key: string, value: string) => setData((d) => ({ ...d, [key]: value }));

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return; }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    update("avatar_url", urlData.publicUrl);
  };

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update({
      ...data,
      onboarding_completed: true,
    }).eq("user_id", user.id);
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      // Create first card from profile data
      await supabase.from("cards").insert({
        user_id: user.id,
        card_name: "My First Card",
        full_name: data.full_name,
        job_title: data.job_title,
        company_name: data.company_name,
        avatar_url: data.avatar_url,
        phone: data.phone,
        email: data.email,
        website: data.website,
        instagram: data.instagram,
        linkedin: data.linkedin,
        twitter: data.twitter,
        whatsapp: data.whatsapp,
      });
      navigate("/dashboard");
    }
  };

  const InputRow = ({ icon: Icon, placeholder, field }: { icon: any; placeholder: string; field: string }) => (
    <div className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3.5 border border-border focus-within:border-primary/50 transition-colors">
      <Icon size={16} className="text-muted-foreground shrink-0" />
      <input
        value={(data as any)[field]}
        onChange={(e) => update(field, e.target.value)}
        placeholder={placeholder}
        className="bg-transparent text-sm text-foreground outline-none w-full"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="text-center mb-8">
          <img src={logo} alt="TAP & GO" className="h-10 mx-auto mb-6" />
          <h1 className="text-2xl font-extrabold text-foreground">Set up your profile</h1>
          <p className="text-sm text-muted-foreground mt-2">Step {step + 1} of {steps.length}: {steps[step]}</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? "brand-gradient" : "bg-secondary"}`} />
          ))}
        </div>

        <div className="bg-card rounded-2xl p-8 card-shadow-lg border border-border">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              {step === 0 && (
                <>
                  <div className="flex justify-center mb-4">
                    <label className="relative cursor-pointer group">
                      <div className="h-20 w-20 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden group-hover:border-primary/50 transition-colors">
                        {data.avatar_url ? (
                          <img src={data.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          <Camera size={24} className="text-muted-foreground" />
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  </div>
                  <InputRow icon={User} placeholder="Full name" field="full_name" />
                  <InputRow icon={User} placeholder="Job title" field="job_title" />
                  <InputRow icon={Globe} placeholder="Company name" field="company_name" />
                </>
              )}
              {step === 1 && (
                <>
                  <InputRow icon={Phone} placeholder="Phone number" field="phone" />
                  <InputRow icon={Mail} placeholder="Email address" field="email" />
                  <InputRow icon={Globe} placeholder="Website" field="website" />
                </>
              )}
              {step === 2 && (
                <>
                  <InputRow icon={Instagram} placeholder="Instagram" field="instagram" />
                  <InputRow icon={Linkedin} placeholder="LinkedIn" field="linkedin" />
                  <InputRow icon={Twitter} placeholder="Twitter / X" field="twitter" />
                  <InputRow icon={MessageCircle} placeholder="WhatsApp number" field="whatsapp" />
                </>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="mx-auto w-[260px] rounded-[28px] bg-[hsl(var(--brand-navy))] p-5 space-y-4">
                    <div className="text-center space-y-2">
                      <div className="mx-auto h-16 w-16 rounded-full brand-gradient flex items-center justify-center overflow-hidden">
                        {data.avatar_url ? (
                          <img src={data.avatar_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-primary-foreground">
                            {data.full_name.split(" ").map(n => n[0]).join("").slice(0, 2) || "?"}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-primary-foreground">{data.full_name || "Your Name"}</h3>
                      <p className="text-xs text-primary-foreground/60">{data.job_title}{data.company_name ? ` • ${data.company_name}` : ""}</p>
                    </div>
                    <div className="space-y-2">
                      {[data.phone && "📞 " + data.phone, data.email && "✉️ " + data.email, data.website && "🌐 " + data.website].filter(Boolean).map((item, i) => (
                        <div key={i} className="rounded-lg bg-primary-foreground/10 px-3 py-2 text-xs text-primary-foreground/80">{item}</div>
                      ))}
                    </div>
                    <div className="brand-gradient rounded-xl py-2.5 text-center text-xs font-semibold text-primary-foreground">Save Contact</div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="flex-1 py-3 rounded-full border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                <ChevronLeft size={16} className="inline mr-1" />Back
              </button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} className="flex-1 py-3 rounded-full brand-gradient text-sm font-semibold text-primary-foreground gradient-glow">
                Continue<ChevronRight size={16} className="inline ml-1" />
              </button>
            ) : (
              <button onClick={handleComplete} disabled={loading} className="flex-1 py-3 rounded-full brand-gradient text-sm font-semibold text-primary-foreground gradient-glow disabled:opacity-50">
                {loading ? "Saving..." : "Continue to Customize"}
                <CheckCircle2 size={16} className="inline ml-1" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
