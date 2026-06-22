import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Users2, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useGetStartedModal } from "@/contexts/GetStartedModalContext";

type View = "choose" | "team-form" | "team-success";

const GetStartedModal = () => {
  const { isOpen, close, initialView } = useGetStartedModal();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [view, setView] = useState<View>(initialView);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: "", work_email: "", company_name: "", team_size: "5-10", phone: "" });

  const reset = () => {
    setView(initialView);
    setForm({ full_name: "", work_email: "", company_name: "", team_size: "5-10", phone: "" });
  };

  // Keep the visible view in sync if the modal is reopened with a different entry point
  useEffect(() => {
    if (isOpen) setView(initialView);
  }, [isOpen, initialView]);

  const handleClose = () => {
    close();
    setTimeout(reset, 250);
  };

  const handleIndividual = () => {
    handleClose();
    navigate("/auth");
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("team_inquiries").insert({
      full_name: form.full_name,
      work_email: form.work_email,
      company_name: form.company_name,
      team_size: form.team_size,
      phone: form.phone || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Something went wrong", description: "Please try again or WhatsApp us directly.", variant: "destructive" });
      return;
    }
    setView("team-success");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-navy/60 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl bg-card border border-border card-shadow-lg p-8"
          >
            <button onClick={handleClose} aria-label="Close" className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors">
              <X size={18} />
            </button>

            {view === "choose" && (
              <div className="space-y-6">
                <div className="space-y-1.5 pr-6">
                  <h3 className="text-xl font-bold">How are you planning to use TAP & GO?</h3>
                  <p className="text-sm text-muted-foreground">Pick what fits — you can always change later.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ y: -2 }}
                    onClick={handleIndividual}
                    className="text-left rounded-xl border border-border hover:border-brand-blue/40 bg-secondary p-5 space-y-3 transition-colors duration-200"
                  >
                    <div className="h-10 w-10 rounded-lg brand-gradient flex items-center justify-center">
                      <User size={18} className="text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">For Myself</h4>
                      <p className="text-xs text-muted-foreground mt-1">Create your card and start sharing in under 2 minutes.</p>
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2 }}
                    onClick={() => setView("team-form")}
                    className="text-left rounded-xl border border-border hover:border-brand-blue/40 bg-secondary p-5 space-y-3 transition-colors duration-200"
                  >
                    <div className="h-10 w-10 rounded-lg brand-gradient flex items-center justify-center">
                      <Users2 size={18} className="text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">For My Team</h4>
                      <p className="text-xs text-muted-foreground mt-1">Equip your company with branded cards. We'll set it up with you.</p>
                    </div>
                  </motion.button>
                </div>
              </div>
            )}

            {view === "team-form" && (
              <form onSubmit={handleTeamSubmit} className="space-y-5">
                <button type="button" onClick={() => setView("choose")} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft size={13} /> Back
                </button>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold">Tell us about your team</h3>
                  <p className="text-sm text-muted-foreground">We'll reach out to help set up branded cards for everyone.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input required placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="rounded-xl bg-secondary border border-border px-4 py-3 text-sm outline-none focus:border-brand-blue/50 transition-colors" />
                  <input required type="email" placeholder="Work email" value={form.work_email} onChange={(e) => setForm({ ...form, work_email: e.target.value })}
                    className="rounded-xl bg-secondary border border-border px-4 py-3 text-sm outline-none focus:border-brand-blue/50 transition-colors" />
                  <input required placeholder="Company name" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    className="rounded-xl bg-secondary border border-border px-4 py-3 text-sm outline-none focus:border-brand-blue/50 transition-colors" />
                  <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="rounded-xl bg-secondary border border-border px-4 py-3 text-sm outline-none focus:border-brand-blue/50 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Team size</label>
                  <select value={form.team_size} onChange={(e) => setForm({ ...form, team_size: e.target.value })}
                    className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm outline-none focus:border-brand-blue/50 transition-colors">
                    {["2-4", "5-10", "11-25", "26-50", "50+"].map((s) => <option key={s} value={s}>{s} people</option>)}
                  </select>
                </div>
                <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 rounded-full brand-gradient py-3.5 text-sm font-semibold text-primary-foreground gradient-glow disabled:opacity-60 transition-all">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : "Request Team Setup"}
                </button>
              </form>
            )}

            {view === "team-success" && (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto h-14 w-14 rounded-full brand-gradient flex items-center justify-center gradient-glow">
                  <CheckCircle2 className="text-primary-foreground" size={26} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold">Thanks — we've got it!</h3>
                  <p className="text-sm text-muted-foreground max-w-[36ch] mx-auto">
                    Someone from our team will reach out within one business day to set up branded cards for your team.
                  </p>
                </div>
                <button onClick={handleClose} className="text-sm font-semibold text-brand-blue hover:underline">Done</button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GetStartedModal;
