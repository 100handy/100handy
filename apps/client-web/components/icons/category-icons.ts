import type { FC, SVGProps } from "react";
import { FurnitureIcon } from "./FurnitureIcon";
import { MountingIcon } from "./MountingIcon";
import { RepairIcon } from "./RepairIcon";
import { PlumbingIcon } from "./PlumbingIcon";
import { ElectricalIcon } from "./ElectricalIcon";
import { CleaningIcon } from "./CleaningIcon";
import { MovingIcon } from "./MovingIcon";
import { OutdoorIcon } from "./OutdoorIcon";

type IconComponent = FC<SVGProps<SVGSVGElement>>;

const keywordMap: [string[], IconComponent][] = [
  [["furniture", "assembly", "flat-pack", "flatpack"], FurnitureIcon],
  [["mount", "tv", "shelf", "shelves", "curtain", "blind", "installation"], MountingIcon],
  [["handyman", "repair", "fix", "maintenance", "home repair"], RepairIcon],
  [["plumb", "pipe", "drain", "leak", "tap", "faucet", "water filter"], PlumbingIcon],
  [["electric", "socket", "switch", "wiring", "light fixture"], ElectricalIcon],
  [["clean", "sparkle", "tidy"], CleaningIcon],
  [["moving", "packing", "lifting", "truck", "van", "removal"], MovingIcon],
  [["outdoor", "garden", "yard", "lawn", "landscap", "hedge", "tree"], OutdoorIcon],
  [["paint", "decorat", "wallpaper"], RepairIcon],
];

export function getCategoryIcon(categoryName: string): IconComponent {
  const name = categoryName.toLowerCase();

  for (const [keywords, icon] of keywordMap) {
    if (keywords.some((kw) => name.includes(kw))) {
      return icon;
    }
  }

  // Default fallback
  return RepairIcon;
}
