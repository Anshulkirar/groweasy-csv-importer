"use client";

import { CrmStatus } from "@/types";

const STATUS_CONFIG: Record<
  NonNullable<CrmStatus>,
  { label: string; classes: string }
> = {
  GOOD_LEAD_FOLLOW_UP: {
    label: "Follow Up",
    classes: "bg-success-dim dark:bg-success-darkDim text-success",
  },
  DID_NOT_CONNECT: {
    label: "No Connect",
    classes: "bg-warn-dim dark:bg-warn-darkDim text-warn",
  },
  BAD_LEAD: {
    label: "Bad Lead",
    classes: "bg-danger-dim dark:bg-danger-darkDim text-danger",
  },
  SALE_DONE: {
    label: "Sale Done",
    classes: "bg-signal-dim dark:bg-signal-darkDim text-signal",
  },
  "": { label: "—", classes: "text-slate-400" },
};

export function StatusBadge({ status }: { status: CrmStatus }) {
  const cfg = STATUS_CONFIG[status || ""];
  return (
    <span
      className={[
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold font-display whitespace-nowrap",
        cfg.classes,
      ].join(" ")}
    >
      {cfg.label}
    </span>
  );
}
