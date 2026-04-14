import type { FC, SVGProps } from "react";
import {
  Baby,
  Briefcase,
  Calendar,
  Camera,
  Car,
  Coffee,
  Droplets,
  Dumbbell,
  Hammer,
  Hand,
  Heart,
  HeartPulse,
  Home,
  Laptop,
  Music,
  Palette,
  ShoppingBag,
  Smile,
  Snowflake,
  UserCircle,
  Users,
  Wifi,
} from "lucide-react";
import {
  AirbnbCleaningIcon,
  BranchAndHedgeTrimmingIcon,
  CablesRepairIcon,
  CleanIcon,
  CribAssemblyIcon,
  CurtainsAndBlindsIcon,
  DeepCleanIcon,
  DoorCabinetAndFurnitureRepairsIcon,
  DrainUnblockingIcon,
  EndOfTenancyIcon,
  FullServiceMoversIcon,
  FurnitureAssemblyIcon,
  GardeningIcon,
  HangingPicturesAndArtWorkIcon,
  HeavyLiftingAndLoadingIcon,
  IkeaAssemblyIcon,
  LawnCareIcon,
  LeafRakingAndRemovalIcon,
  LeakFixingIcon,
  LightCarpentryIcon,
  LightInstallationIcon,
  MinorHomeRepairsIcon,
  MovingHelpIcon,
  IndoorPaintingIcon,
  OfficeCleaningIcon,
  OfficeFurnitureAssemblyIcon,
  PackingAndMovingIcon,
  PartyCleanUpIcon,
  PutUpShelvesIcon,
  RoofAndGutterCleaningIcon,
  SealingAndCaulkingIcon,
  SocketsInstallationAndRepairIcon,
  SwitchesInstallationAndRepairIcon,
  TapReplacementIcon,
  TvMountingIcon,
  VanAssistedMovingHelpIcon,
  WallMountingIcon,
  WardrobeAssemblyIcon,
  WashingMachineInstallationIcon,
  WasteAndFurnitureRemovalIcon,
  WaterFilterInstallationIcon,
  WindowAndBlindsRepairIcon,
} from "./categories";

type IconComponent = FC<SVGProps<SVGSVGElement>>;

export function getCategoryIcon(categoryName: string): IconComponent {
  const name = categoryName.toLowerCase();

  // --- Specific subcategory mappings → custom SVG icons ---
  if (name.includes("ikea")) return IkeaAssemblyIcon;
  if (name.includes("crib")) return CribAssemblyIcon;
  if (name.includes("wardrobe") || name.includes("closet"))
    return WardrobeAssemblyIcon;
  if (name.includes("office furniture")) return OfficeFurnitureAssemblyIcon;
  if (name.includes("tv mount")) return TvMountingIcon;
  if (name.includes("shelf") || name.includes("shelves"))
    return PutUpShelvesIcon;
  if (name.includes("picture") || name.includes("artwork"))
    return HangingPicturesAndArtWorkIcon;
  if (
    name.includes("light fixture") ||
    name.includes("light installation")
  )
    return LightInstallationIcon;
  if (name.includes("curtain") || name.includes("blind"))
    return CurtainsAndBlindsIcon;
  if (name.includes("door") || name.includes("cabinet"))
    return DoorCabinetAndFurnitureRepairsIcon;
  if (name.includes("window")) return WindowAndBlindsRepairIcon;
  if (name.includes("seal") || name.includes("caulk"))
    return SealingAndCaulkingIcon;
  if (name.includes("floor") || name.includes("tile"))
    return MinorHomeRepairsIcon;
  if (name.includes("carpentry")) return LightCarpentryIcon;
  if (name.includes("paint")) return IndoorPaintingIcon;
  if (name.includes("leak")) return LeakFixingIcon;
  if (name.includes("drain")) return DrainUnblockingIcon;
  if (name.includes("tap") || name.includes("faucet"))
    return TapReplacementIcon;
  if (name.includes("washing machine"))
    return WashingMachineInstallationIcon;
  if (name.includes("water filter")) return WaterFilterInstallationIcon;
  if (name.includes("socket")) return SocketsInstallationAndRepairIcon;
  if (name.includes("switch")) return SwitchesInstallationAndRepairIcon;
  if (name.includes("cable")) return CablesRepairIcon;
  if (name.includes("deep clean")) return DeepCleanIcon;
  if (name.includes("party")) return PartyCleanUpIcon;
  if (name.includes("tenancy")) return EndOfTenancyIcon;
  if (name.includes("airbnb")) return AirbnbCleaningIcon;
  if (name.includes("office clean")) return OfficeCleaningIcon;
  if (name.includes("van")) return VanAssistedMovingHelpIcon;
  if (name.includes("waste") || name.includes("removal"))
    return WasteAndFurnitureRemovalIcon;
  if (name.includes("heavy lift") || name.includes("loading"))
    return HeavyLiftingAndLoadingIcon;
  if (name.includes("pack")) return PackingAndMovingIcon;
  if (name.includes("full service")) return FullServiceMoversIcon;
  if (name.includes("garden")) return GardeningIcon;
  if (name.includes("lawn")) return LawnCareIcon;
  if (name.includes("landscape")) return GardeningIcon;
  if (name.includes("leaf") || name.includes("raking"))
    return LeafRakingAndRemovalIcon;
  if (name.includes("gutter") || name.includes("roof"))
    return RoofAndGutterCleaningIcon;
  if (
    name.includes("branch") ||
    name.includes("hedge") ||
    name.includes("trim")
  )
    return BranchAndHedgeTrimmingIcon;
  if (name.includes("wall mount")) return WallMountingIcon;

  // --- General category mappings → custom SVG icons ---
  if (name.includes("furniture") || name.includes("assembly"))
    return FurnitureAssemblyIcon;
  if (name.includes("clean")) return CleanIcon;
  if (
    name.includes("handyman") ||
    name.includes("repair") ||
    name.includes("maintenance") ||
    name.includes("minor")
  )
    return MinorHomeRepairsIcon;
  if (
    name.includes("moving") ||
    name.includes("lifting") ||
    name.includes("delivery")
  )
    return MovingHelpIcon;
  if (
    name.includes("mount") ||
    name.includes("installation") ||
    name.includes("tv")
  )
    return WallMountingIcon;
  if (name.includes("yard") || name.includes("outdoor"))
    return GardeningIcon;
  if (name.includes("plumbing")) return LeakFixingIcon;
  if (name.includes("electric")) return SocketsInstallationAndRepairIcon;

  // --- Lucide fallbacks for categories without custom icons ---
  if (name.includes("shopping") || name.includes("errand"))
    return ShoppingBag as unknown as IconComponent;
  if (
    name.includes("assistant") ||
    name.includes("virtual") ||
    name.includes("office")
  )
    return Briefcase as unknown as IconComponent;
  if (
    name.includes("baby") ||
    name.includes("family") ||
    name.includes("child")
  )
    return Baby as unknown as IconComponent;
  if (name.includes("seasonal") || name.includes("holiday"))
    return Snowflake as unknown as IconComponent;
  if (
    name.includes("contactless") ||
    name.includes("online") ||
    name.includes("tech")
  )
    return Wifi as unknown as IconComponent;
  if (
    name.includes("entertainment") ||
    name.includes("music") ||
    name.includes("event")
  )
    return Music as unknown as IconComponent;
  if (
    name.includes("creative") ||
    name.includes("artistic") ||
    name.includes("art")
  )
    return Palette as unknown as IconComponent;
  if (
    name.includes("relaxation") ||
    name.includes("luxury") ||
    name.includes("spa")
  )
    return Heart as unknown as IconComponent;
  if (
    name.includes("food") ||
    name.includes("dining") ||
    name.includes("cook") ||
    name.includes("chef")
  )
    return Coffee as unknown as IconComponent;
  if (name.includes("group") || name.includes("social"))
    return Users as unknown as IconComponent;
  if (
    name.includes("fitness") ||
    name.includes("gym") ||
    name.includes("workout")
  )
    return Dumbbell as unknown as IconComponent;
  if (name.includes("themed") || name.includes("experience"))
    return Calendar as unknown as IconComponent;
  if (
    name.includes("photography") ||
    name.includes("photo") ||
    name.includes("media")
  )
    return Camera as unknown as IconComponent;
  if (
    name.includes("hair") ||
    name.includes("salon") ||
    name.includes("barber")
  )
    return Home as unknown as IconComponent;
  if (
    name.includes("face") ||
    name.includes("beauty") ||
    name.includes("facial") ||
    name.includes("makeup")
  )
    return Smile as unknown as IconComponent;
  if (
    name.includes("nail") ||
    name.includes("manicure") ||
    name.includes("pedicure")
  )
    return Hand as unknown as IconComponent;
  if (name.includes("body") || name.includes("treatment"))
    return Droplets as unknown as IconComponent;
  if (name.includes("massage") || name.includes("wellness"))
    return HeartPulse as unknown as IconComponent;
  if (name.includes("men") || name.includes("grooming"))
    return UserCircle as unknown as IconComponent;
  if (name.includes("building") || name.includes("construction"))
    return Hammer as unknown as IconComponent;
  if (name.includes("computer") || name.includes("laptop"))
    return Laptop as unknown as IconComponent;
  if (
    name.includes("car") ||
    name.includes("automotive") ||
    name.includes("vehicle")
  )
    return Car as unknown as IconComponent;

  // Default fallback
  return Home as unknown as IconComponent;
}
