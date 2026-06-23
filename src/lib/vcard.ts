export interface ParsedVCard {
  full_name?: string;
  job_title?: string;
  company_name?: string;
  phone?: string;
  secondary_phone?: string;
  email?: string;
  secondary_email?: string;
  website?: string;
  address?: string;
}

/**
 * Unfolds vCard line continuations (lines starting with a space or tab
 * are continuations of the previous line, per RFC 6350) and normalizes
 * line endings before parsing.
 */
const unfold = (raw: string): string[] => {
  const lines = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const unfolded: string[] = [];
  for (const line of lines) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && unfolded.length > 0) {
      unfolded[unfolded.length - 1] += line.slice(1);
    } else if (line.trim().length > 0) {
      unfolded.push(line);
    }
  }
  return unfolded;
};

/** Splits a vCard property line into its name+params and value, handling escaped characters. */
const splitLine = (line: string): { name: string; params: string[]; value: string } => {
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return { name: "", params: [], value: "" };
  const left = line.slice(0, colonIdx);
  const value = line.slice(colonIdx + 1)
    .replace(/\\n/gi, ", ")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .trim();
  const [name, ...params] = left.split(";");
  return { name: name.toUpperCase(), params, value };
};

export const parseVCard = (raw: string): ParsedVCard => {
  const lines = unfold(raw);
  const result: ParsedVCard = {};
  let sawPrimaryPhone = false;
  let sawPrimaryEmail = false;

  for (const line of lines) {
    const { name, params, value } = splitLine(line);
    if (!value) continue;
    const paramStr = params.join(";").toUpperCase();

    switch (name) {
      case "FN":
        result.full_name = value;
        break;
      case "N":
        if (!result.full_name) {
          // N format: Family;Given;Middle;Prefix;Suffix
          const parts = value.split(";").filter(Boolean);
          result.full_name = [parts[1], parts[2], parts[0]].filter(Boolean).join(" ");
        }
        break;
      case "TITLE":
        result.job_title = value;
        break;
      case "ORG":
        result.company_name = value.split(";")[0];
        break;
      case "TEL":
        if (!sawPrimaryPhone) {
          result.phone = value;
          sawPrimaryPhone = true;
        } else if (!result.secondary_phone) {
          result.secondary_phone = value;
        }
        break;
      case "EMAIL":
        if (!sawPrimaryEmail) {
          result.email = value;
          sawPrimaryEmail = true;
        } else if (!result.secondary_email) {
          result.secondary_email = value;
        }
        break;
      case "URL":
        if (!result.website) result.website = value;
        break;
      case "ADR": {
        // ADR format: PO Box;Extended;Street;City;Region;PostalCode;Country
        const parts = value.split(";").filter(Boolean);
        if (parts.length) result.address = parts.join(", ");
        break;
      }
      default:
        break;
    }
    void paramStr; // reserved for future TYPE= filtering (e.g. preferring TYPE=cell)
  }

  return result;
};

/** Returns true if the file looks like a vCard based on its name or content. */
export const looksLikeVCard = (filename: string, content: string) =>
  filename.toLowerCase().endsWith(".vcf") || content.trim().toUpperCase().startsWith("BEGIN:VCARD");

// ---------------------------------------------------------------------------
// vCard generation (the reverse direction) — builds a downloadable .vcf
// from a published card, so visitors can save the card owner straight to
// their phone's native contacts app with one tap.
// ---------------------------------------------------------------------------

export interface VCardSource {
  full_name: string;
  job_title?: string;
  company_name?: string;
  phone?: string;
  secondary_phone?: string;
  email?: string;
  secondary_email?: string;
  website?: string;
  address?: string;
  avatar_url?: string;
}

const escapeVCardValue = (v: string) => v.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");

/** Builds a vCard 3.0 text block from a card's public data. */
export const generateVCardText = (card: VCardSource): string => {
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];
  const name = card.full_name || "Contact";
  lines.push(`FN:${escapeVCardValue(name)}`);
  const parts = name.trim().split(/\s+/);
  const given = parts.shift() || "";
  const family = parts.join(" ");
  lines.push(`N:${escapeVCardValue(family)};${escapeVCardValue(given)};;;`);

  if (card.job_title) lines.push(`TITLE:${escapeVCardValue(card.job_title)}`);
  if (card.company_name) lines.push(`ORG:${escapeVCardValue(card.company_name)}`);
  if (card.phone) lines.push(`TEL;TYPE=CELL:${escapeVCardValue(card.phone)}`);
  if (card.secondary_phone) lines.push(`TEL;TYPE=WORK:${escapeVCardValue(card.secondary_phone)}`);
  if (card.email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(card.email)}`);
  if (card.secondary_email) lines.push(`EMAIL;TYPE=INTERNET,WORK:${escapeVCardValue(card.secondary_email)}`);
  if (card.website) lines.push(`URL:${escapeVCardValue(card.website)}`);
  if (card.address) lines.push(`ADR;TYPE=WORK:;;${escapeVCardValue(card.address)};;;;`);

  lines.push("END:VCARD");
  return lines.join("\r\n");
};

/** Triggers a browser download of the generated vCard — this is what powers the "Save Contact" / "Add to Phone Contacts" button. */
export const downloadVCard = (card: VCardSource) => {
  const text = generateVCardText(card);
  const blob = new Blob([text], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = (card.full_name || "contact").trim().replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  a.download = `${safeName || "contact"}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
