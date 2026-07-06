import { clients, currency, invoices, kpis, weddings, daysUntil, formatDate } from "@/data/mock";

export type VoiceAction =
  | { type: "navigate"; path: string }
  | { type: "invoice.addOvertime" }
  | { type: "invoice.setDiscount"; value: number }
  | { type: "invoice.setDeposit"; value: number }
  | { type: "invoice.setTax"; value: number }
  | { type: "invoice.applyPackage"; key: string }
  | { type: "invoice.adjustRate"; delta: number }
  | { type: "invoice.setRate"; value: number }
  | { type: "invoice.addLine"; description: string; rate: number }
  | { type: "invoice.selectClient"; clientId: string };

export interface VoiceResult {
  response: string;
  actions?: VoiceAction[];
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^\w\s%$.-]/g, " ").replace(/\s+/g, " ").trim();
}

function parseNumber(text: string): number | null {
  const words: Record<string, number> = {
    zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, fifteen: 15, twenty: 20,
    thirty: 30, forty: 40, fifty: 50, hundred: 100,
  };

  const digit = text.match(/(\d+(?:\.\d+)?)/);
  if (digit) return parseFloat(digit[1]);

  let total = 0;
  for (const part of text.split(/\s+/)) {
    if (words[part] !== undefined) {
      if (part === "hundred") total = (total || 1) * 100;
      else total += words[part];
    }
  }
  return total || null;
}

function findClient(query: string) {
  const q = normalize(query);
  return clients.find(
    (c) =>
      normalize(c.couple).includes(q) ||
      normalize(c.partnerA).includes(q) ||
      normalize(c.partnerB).includes(q) ||
      q.split(" ").some((w) => w.length > 2 && normalize(c.couple).includes(w)),
  );
}

export function parseVoiceCommand(raw: string, userName = "Matt"): VoiceResult {
  const text = normalize(raw);
  if (!text) {
    return { response: "I didn't catch that, Matt. Try again?" };
  }

  // Help
  if (/help|what can you do|commands/.test(text)) {
    return {
      response:
        "I can navigate the app, create invoices, check revenue and weddings, add overtime, change discounts or deposits, and select clients. Try: go to invoices, create invoice, add overtime, or what's my revenue.",
    };
  }

  // Navigation
  const navMap: Array<[RegExp, string, string]> = [
    [/dashboard|home|main screen/, "/app", "Opening your dashboard."],
    [/clients?|couples/, "/app/clients", "Opening clients."],
    [/weddings?/, "/app/weddings", "Opening weddings."],
    [/calendar|schedule/, "/app/calendar", "Opening your calendar."],
    [/invoices?|billing/, "/app/invoices", "Opening invoices."],
    [/payments?|transactions/, "/app/payments", "Opening payments."],
    [/analytics|stats|reports/, "/app/analytics", "Opening analytics."],
  ];

  if (/^(go to|open|show|take me to|navigate)/.test(text) || /open my/.test(text)) {
    for (const [re, path, msg] of navMap) {
      if (re.test(text)) return { response: msg, actions: [{ type: "navigate", path }] };
    }
  }

  for (const [re, path, msg] of navMap) {
    if (re.test(text) && /^(invoices|clients|weddings|calendar|payments|analytics|dashboard)/.test(text)) {
      return { response: msg, actions: [{ type: "navigate", path }] };
    }
  }

  // Create invoice
  if (/create (a )?invoice|new invoice|start invoice|make invoice/.test(text)) {
    return {
      response: "Opening the invoice builder for you.",
      actions: [{ type: "navigate", path: "/app/invoices/new" }],
    };
  }

  // Revenue / KPIs
  if (/revenue|how much (did i|have i) make|monthly income|earnings/.test(text)) {
    return {
      response: `Your monthly revenue is ${currency(kpis.monthlyRevenue)}, up ${kpis.monthlyRevenueDelta} percent.`,
    };
  }

  if (/pending payments?|money owed|outstanding payments?/.test(text)) {
    return {
      response: `You have ${currency(kpis.pendingPayments)} in pending payments across your open invoices.`,
    };
  }

  if (/outstanding invoices?|unpaid invoices?|overdue/.test(text)) {
    const overdue = invoices.filter((i) => i.status === "overdue");
    const pending = invoices.filter((i) => ["partial", "pending", "overdue"].includes(i.status));
    if (/overdue/.test(text) && overdue.length) {
      return {
        response: `${overdue.length} invoice${overdue.length > 1 ? "s are" : " is"} overdue. ${overdue[0].couple} owes ${currency(overdue[0].amount - overdue[0].paid)} on ${overdue[0].number}.`,
        actions: [{ type: "navigate", path: "/app/invoices" }],
      };
    }
    return {
      response: `You have ${pending.length} outstanding invoices totaling about ${currency(pending.reduce((s, i) => s + (i.amount - i.paid), 0))}.`,
      actions: [{ type: "navigate", path: "/app/invoices" }],
    };
  }

  if (/send reminder|remind (them|client|invoice)/.test(text)) {
    return {
      response: "I'll take you to invoices where you can send reminders for unpaid balances.",
      actions: [{ type: "navigate", path: "/app/invoices" }],
    };
  }

  if (/payment link|send (the )?link/.test(text)) {
    return {
      response: "Opening the invoice builder so you can send a payment link after the event.",
      actions: [{ type: "navigate", path: "/app/invoices/new" }],
    };
  }

  // Weddings
  if (/weddings? this week|upcoming weddings?|what weddings/.test(text)) {
    const upcoming = weddings.filter((w) => daysUntil(w.date) >= 0 && daysUntil(w.date) <= 7);
    if (!upcoming.length) {
      return { response: "No weddings scheduled this week, Matt." };
    }
    const list = upcoming
      .slice(0, 3)
      .map((w) => `${w.couple} on ${formatDate(w.date, { weekday: "short", month: "short", day: "numeric" })}`)
      .join(", ");
    return {
      response: `You have ${upcoming.length} wedding${upcoming.length > 1 ? "s" : ""} this week: ${list}.`,
      actions: [{ type: "navigate", path: "/app/weddings" }],
    };
  }

  // Invoice builder commands
  if (/add overtime|overtime|overcharge|overage/.test(text)) {
    const hours = parseNumber(text);
    const rate = text.includes("hour") ? (parseNumber(text.replace(/.*hour/, "")) ?? 350) : 350;
    if (hours && /hour/.test(text)) {
      return {
        response: `Added ${hours} hour${hours > 1 ? "s" : ""} of overtime at ${currency(rate)} per hour.`,
        actions: [
          { type: "invoice.addLine", description: `Overtime (${hours} hr)`, rate: rate * hours },
        ],
      };
    }
    return {
      response: "Added an overtime line to the invoice.",
      actions: [{ type: "invoice.addOvertime" }],
    };
  }

  const discountMatch = text.match(/(?:discount|take off|reduce by)\s*(?:to|by|of)?\s*([\w\s.%]+)/);
  if (discountMatch) {
    const val = parseNumber(discountMatch[1]);
    if (val !== null) {
      return {
        response: `Discount set to ${val} percent.`,
        actions: [{ type: "invoice.setDiscount", value: val }],
      };
    }
  }

  const depositMatch = text.match(/(?:deposit|down payment|advance)\s*(?:to|of|at)?\s*([\w\s.%]+)/);
  if (depositMatch) {
    const val = parseNumber(depositMatch[1]);
    if (val !== null) {
      return {
        response: `Deposit set to ${val} percent, due before the event.`,
        actions: [{ type: "invoice.setDeposit", value: val }],
      };
    }
  }

  const taxMatch = text.match(/(?:tax|taxes)\s*(?:to|at|of)?\s*([\w\s.%]+)/);
  if (taxMatch) {
    const val = parseNumber(taxMatch[1]);
    if (val !== null) {
      return {
        response: `Tax rate set to ${val} percent.`,
        actions: [{ type: "invoice.setTax", value: val }],
      };
    }
  }

  if (/essential package|essential collection/.test(text)) {
    return {
      response: "Applied the Essential package.",
      actions: [{ type: "invoice.applyPackage", key: "essential" }],
    };
  }
  if (/signature package|signature collection/.test(text)) {
    return {
      response: "Applied the Signature package.",
      actions: [{ type: "invoice.applyPackage", key: "signature" }],
    };
  }
  if (/heirloom package|heirloom collection/.test(text)) {
    return {
      response: "Applied the Heirloom package.",
      actions: [{ type: "invoice.applyPackage", key: "heirloom" }],
    };
  }

  if (/increase|raise|add|charge more|overcharge/.test(text) && /(\d+|hundred|thousand)/.test(text)) {
    const amount = parseNumber(text);
    if (amount !== null) {
      return {
        response: `Increased the last line item by ${currency(amount)}.`,
        actions: [{ type: "invoice.adjustRate", delta: amount }],
      };
    }
  }

  if (/decrease|reduce|lower|undercharge|discount amount|take off/.test(text) && /(\d+|hundred)/.test(text)) {
    const amount = parseNumber(text);
    if (amount !== null) {
      return {
        response: `Reduced the last line item by ${currency(amount)}.`,
        actions: [{ type: "invoice.adjustRate", delta: -amount }],
      };
    }
  }

  const rateMatch = text.match(/(?:set|change|update).*(?:rate|price|amount|cost).*(?:to|at)\s*([\w\s$]+)/);
  if (rateMatch) {
    const val = parseNumber(rateMatch[1]);
    if (val !== null) {
      return {
        response: `Updated the line item rate to ${currency(val)}.`,
        actions: [{ type: "invoice.setRate", value: val }],
      };
    }
  }

  // Select client by name
  if (/select|choose|invoice|bill|client/.test(text)) {
    for (const c of clients) {
      const parts = [c.partnerA.split(" ")[0], c.partnerB.split(" ")[0], ...c.couple.split(" & ")].map(normalize);
      if (parts.some((p) => p.length > 2 && text.includes(p))) {
        return {
          response: `Selected ${c.couple} for this invoice.`,
          actions: [{ type: "invoice.selectClient", clientId: c.id }],
        };
      }
    }
  }

  if (/hello|hey|hi|good morning|good afternoon/.test(text)) {
    const hour = new Date().getHours();
    const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    return {
      response: `${greet}, ${userName}. I'm Lens Assistant. Say help to hear what I can do.`,
    };
  }

  return {
    response: `I'm not sure about that one, ${userName}. Try help, go to invoices, create invoice, or what's my revenue.`,
  };
}
