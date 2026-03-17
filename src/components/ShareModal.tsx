import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Copy, Download, Share2, MessageCircle, Mail, Smartphone,
  Linkedin, Send, Check, QrCode, Link2, ExternalLink
} from "lucide-react";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  cardUrl: string;
  cardName: string;
}

type Tab = "link" | "qr" | "share";

const ShareModal = ({ open, onClose, cardUrl, cardName }: ShareModalProps) => {
  const [tab, setTab] = useState<Tab>("link");
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const copyLink = async () => {
    await navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 1024, 1024);
      const a = document.createElement("a");
      a.download = `${cardName}-qr.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const shareOptions = [
    { label: "WhatsApp", icon: MessageCircle, color: "bg-green-500", url: `https://wa.me/?text=${encodeURIComponent(`Check out my digital card: ${cardUrl}`)}` },
    { label: "Email", icon: Mail, color: "bg-blue-500", url: `mailto:?subject=${encodeURIComponent(`${cardName} - Digital Card`)}&body=${encodeURIComponent(`Check out my digital card: ${cardUrl}`)}` },
    { label: "SMS", icon: Smartphone, color: "bg-purple-500", url: `sms:?body=${encodeURIComponent(`Check out my digital card: ${cardUrl}`)}` },
    { label: "LinkedIn", icon: Linkedin, color: "bg-sky-600", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cardUrl)}` },
    { label: "Messenger", icon: Send, color: "bg-indigo-500", url: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(cardUrl)}&app_id=0&redirect_uri=${encodeURIComponent(cardUrl)}` },
  ];

  const tabs: { id: Tab; label: string; icon: typeof Link2 }[] = [
    { id: "link", label: "Link", icon: Link2 },
    { id: "qr", label: "QR Code", icon: QrCode },
    { id: "share", label: "Share", icon: Share2 },
  ];

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-card rounded-3xl border border-border shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-bold text-lg">Share Card</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-1 p-3 bg-secondary/50">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tab === t.id ? "brand-gradient text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon size={14} />{t.label}
              </button>
            ))}
          </div>

          <div className="p-5 min-h-[280px]">
            {tab === "link" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Share your digital card with anyone using this link.</p>
                <div className="flex items-center gap-2 p-3 bg-secondary rounded-xl">
                  <span className="text-sm truncate flex-1 text-foreground">{cardUrl}</span>
                  <button onClick={copyLink} className="flex items-center gap-1 px-3 py-2 rounded-lg brand-gradient text-xs font-semibold text-primary-foreground shrink-0">
                    {copied ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy</>}
                  </button>
                </div>
                <a href={cardUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors">
                  <ExternalLink size={14} />Open in new tab
                </a>
              </div>
            )}

            {tab === "qr" && (
              <div className="flex flex-col items-center space-y-4">
                <p className="text-sm text-muted-foreground text-center">Scan this QR code to view the card.</p>
                <div ref={qrRef} className="p-6 bg-white rounded-2xl shadow-lg">
                  <QRCodeSVG value={cardUrl} size={200} level="H" />
                </div>
                <div className="flex gap-2 w-full">
                  <button onClick={downloadQR} className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl brand-gradient text-sm font-semibold text-primary-foreground">
                    <Download size={14} />Download
                  </button>
                  <button onClick={copyLink} className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors">
                    <Copy size={14} />{copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>
            )}

            {tab === "share" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Share your card on social platforms.</p>
                {shareOptions.map(opt => (
                  <a
                    key={opt.label}
                    href={opt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${opt.color} text-white`}>
                      <opt.icon size={16} />
                    </div>
                    <span className="text-sm font-medium">{opt.label}</span>
                    <ExternalLink size={12} className="ml-auto text-muted-foreground" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShareModal;
