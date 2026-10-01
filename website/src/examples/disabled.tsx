"use client";

import * as React from "react";
import { Wheel } from "@/themes/shadcn/wheel";

export function Disabled() {
  const [disabled, setDisabled] = React.useState(true);

  return (
    <div className="flex flex-col items-center gap-6">
      <Wheel defaultValue={40} disabled={disabled} label="Level" className="w-40" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />
        Disabled
      </label>
    </div>
  );
}
