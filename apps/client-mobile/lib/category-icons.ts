import React from 'react';
import type { SvgProps } from 'react-native-svg';
import {
  Home,
  ShoppingBag,
  Baby,
  Music,
  HeartPulse,
  Coffee,
  Camera,
  Briefcase,
  Palette,
  Users,
  Hammer,
  Laptop,
  Car,
  Heart,
  Dumbbell,
  Calendar,
  Smile,
  Hand,
  Droplets,
  UserCircle,
  Snowflake,
  Wifi,
} from 'lucide-react-native';

// Custom SVG category icons (from /icons/ design assets)
import IkeaAssemblyIcon from '@/assets/icons/categories/ikea-assembly.svg';
import CribAssemblyIcon from '@/assets/icons/categories/crib-assembly.svg';
import WardrobeAssemblyIcon from '@/assets/icons/categories/wardrobe-assembly.svg';
import OfficeFurnitureIcon from '@/assets/icons/categories/office-furniture-assembly.svg';
import TvMountingIcon from '@/assets/icons/categories/tv-mounting.svg';
import PutUpShelvesIcon from '@/assets/icons/categories/put-up-shelves.svg';
import HangingArtworkIcon from '@/assets/icons/categories/hanging-ictures-and-art-work.svg';
import LightInstallationIcon from '@/assets/icons/categories/light-installation.svg';
import CurtainsAndBlindsIcon from '@/assets/icons/categories/curtains-and-blinds.svg';
import DoorCabinetIcon from '@/assets/icons/categories/door-cabinet-and-furniture-repairs.svg';
import WindowBlindsRepairIcon from '@/assets/icons/categories/window-and-blinds-repair.svg';
import SealingCaulkingIcon from '@/assets/icons/categories/sealing-and-caulking.svg';
import LightCarpentryIcon from '@/assets/icons/categories/light-carpentry.svg';
import IndoorPaintingIcon from '@/assets/icons/categories/ndoor-painting.svg';
import LeakFixingIcon from '@/assets/icons/categories/leak-fixing.svg';
import DrainUnblockingIcon from '@/assets/icons/categories/drain-unblocking.svg';
import TapReplacementIcon from '@/assets/icons/categories/tap-replacement.svg';
import WashingMachineIcon from '@/assets/icons/categories/washing-machine-installation.svg';
import WaterFilterIcon from '@/assets/icons/categories/water-filter-installation.svg';
import SocketsIcon from '@/assets/icons/categories/sockets-installation-and-repair.svg';
import SwitchesIcon from '@/assets/icons/categories/switches-installation-and-repair.svg';
import CablesRepairIcon from '@/assets/icons/categories/cables-repair.svg';
import DeepCleanIcon from '@/assets/icons/categories/deep-clean.svg';
import PartyCleanUpIcon from '@/assets/icons/categories/party-clean-up.svg';
import EndOfTenancyIcon from '@/assets/icons/categories/end-of-tenancy.svg';
import AirbnbCleaningIcon from '@/assets/icons/categories/airbnb-cleaning.svg';
import OfficeCleaningIcon from '@/assets/icons/categories/office-cleaning.svg';
import WasteRemovalIcon from '@/assets/icons/categories/waste-and-and-furniture-removal.svg';
import VanMovingIcon from '@/assets/icons/categories/van-assisted-moving-help.svg';
import HeavyLiftingIcon from '@/assets/icons/categories/heavy-lifting-and-loading.svg';
import PackingMovingIcon from '@/assets/icons/categories/packing-and-moving.svg';
import FullServiceMoversIcon from '@/assets/icons/categories/full-service-movers.svg';
import GardeningIcon from '@/assets/icons/categories/gardening.svg';
import LawnCareIcon from '@/assets/icons/categories/lawn-care.svg';
import LandscapingIcon from '@/assets/icons/categories/landscaping.svg';
import LeafRakingIcon from '@/assets/icons/categories/leaf-raking-and-removal.svg';
import RoofGutterIcon from '@/assets/icons/categories/roof-and-gutter-cleaning.svg';
import BranchHedgeIcon from '@/assets/icons/categories/branch-and-hedge-trimming.svg';
import FurnitureAssemblyIcon from '@/assets/icons/categories/furniture-assembly.svg';
import CleanIcon from '@/assets/icons/categories/clean.svg';
import MinorHomeRepairsIcon from '@/assets/icons/categories/minor-home-repairs.svg';
import MovingHelpIcon from '@/assets/icons/categories/moving-help.svg';
import WallMountingIcon from '@/assets/icons/categories/wall-mouting.svg';

// Unified icon type that works for both SVG imports and Lucide icons
export type CategoryIcon = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

/**
 * Wraps an SVG import component to accept { size, color } props
 * like Lucide icons for consistent usage across the app.
 */
function wrapSvg(SvgComponent: React.FC<SvgProps>): CategoryIcon {
  const Wrapped: CategoryIcon = ({ size = 24, color = 'currentColor' }) =>
    React.createElement(SvgComponent, { width: size, height: size, color });
  return Wrapped;
}

// Pre-wrapped SVG icons
const svgIcons = {
  ikeaAssembly: wrapSvg(IkeaAssemblyIcon),
  cribAssembly: wrapSvg(CribAssemblyIcon),
  wardrobeAssembly: wrapSvg(WardrobeAssemblyIcon),
  officeFurniture: wrapSvg(OfficeFurnitureIcon),
  tvMounting: wrapSvg(TvMountingIcon),
  putUpShelves: wrapSvg(PutUpShelvesIcon),
  hangingArtwork: wrapSvg(HangingArtworkIcon),
  lightInstallation: wrapSvg(LightInstallationIcon),
  curtainsBlinds: wrapSvg(CurtainsAndBlindsIcon),
  doorCabinet: wrapSvg(DoorCabinetIcon),
  windowBlinds: wrapSvg(WindowBlindsRepairIcon),
  sealingCaulking: wrapSvg(SealingCaulkingIcon),
  lightCarpentry: wrapSvg(LightCarpentryIcon),
  indoorPainting: wrapSvg(IndoorPaintingIcon),
  leakFixing: wrapSvg(LeakFixingIcon),
  drainUnblocking: wrapSvg(DrainUnblockingIcon),
  tapReplacement: wrapSvg(TapReplacementIcon),
  washingMachine: wrapSvg(WashingMachineIcon),
  waterFilter: wrapSvg(WaterFilterIcon),
  sockets: wrapSvg(SocketsIcon),
  switches: wrapSvg(SwitchesIcon),
  cablesRepair: wrapSvg(CablesRepairIcon),
  deepClean: wrapSvg(DeepCleanIcon),
  partyCleanUp: wrapSvg(PartyCleanUpIcon),
  endOfTenancy: wrapSvg(EndOfTenancyIcon),
  airbnbCleaning: wrapSvg(AirbnbCleaningIcon),
  officeCleaning: wrapSvg(OfficeCleaningIcon),
  wasteRemoval: wrapSvg(WasteRemovalIcon),
  vanMoving: wrapSvg(VanMovingIcon),
  heavyLifting: wrapSvg(HeavyLiftingIcon),
  packingMoving: wrapSvg(PackingMovingIcon),
  fullServiceMovers: wrapSvg(FullServiceMoversIcon),
  gardening: wrapSvg(GardeningIcon),
  lawnCare: wrapSvg(LawnCareIcon),
  landscaping: wrapSvg(LandscapingIcon),
  leafRaking: wrapSvg(LeafRakingIcon),
  roofGutter: wrapSvg(RoofGutterIcon),
  branchHedge: wrapSvg(BranchHedgeIcon),
  furnitureAssembly: wrapSvg(FurnitureAssemblyIcon),
  clean: wrapSvg(CleanIcon),
  minorHomeRepairs: wrapSvg(MinorHomeRepairsIcon),
  movingHelp: wrapSvg(MovingHelpIcon),
  wallMounting: wrapSvg(WallMountingIcon),
};

// Icon mapping function - maps category names/keywords to icons
export const getCategoryIcon = (categoryName: string): CategoryIcon => {
  const name = categoryName.toLowerCase();

  // Specific subcategory mappings → custom SVG icons
  if (name.includes('ikea')) return svgIcons.ikeaAssembly;
  if (name.includes('crib')) return svgIcons.cribAssembly;
  if (name.includes('wardrobe') || name.includes('closet')) return svgIcons.wardrobeAssembly;
  if (name.includes('office furniture')) return svgIcons.officeFurniture;
  if (name.includes('tv mount')) return svgIcons.tvMounting;
  if (name.includes('shelf') || name.includes('shelves')) return svgIcons.putUpShelves;
  if (name.includes('picture') || name.includes('artwork')) return svgIcons.hangingArtwork;
  if (name.includes('light fixture') || name.includes('light installation')) return svgIcons.lightInstallation;
  if (name.includes('curtain') || name.includes('blind')) return svgIcons.curtainsBlinds;
  if (name.includes('door') || name.includes('cabinet')) return svgIcons.doorCabinet;
  if (name.includes('window')) return svgIcons.windowBlinds;
  if (name.includes('seal') || name.includes('caulk')) return svgIcons.sealingCaulking;
  if (name.includes('floor') || name.includes('tile')) return svgIcons.minorHomeRepairs;
  if (name.includes('carpentry')) return svgIcons.lightCarpentry;
  if (name.includes('paint')) return svgIcons.indoorPainting;
  if (name.includes('leak')) return svgIcons.leakFixing;
  if (name.includes('drain')) return svgIcons.drainUnblocking;
  if (name.includes('tap') || name.includes('faucet')) return svgIcons.tapReplacement;
  if (name.includes('washing machine')) return svgIcons.washingMachine;
  if (name.includes('water filter')) return svgIcons.waterFilter;
  if (name.includes('socket')) return svgIcons.sockets;
  if (name.includes('switch')) return svgIcons.switches;
  if (name.includes('cable')) return svgIcons.cablesRepair;
  if (name.includes('deep clean')) return svgIcons.deepClean;
  if (name.includes('party')) return svgIcons.partyCleanUp;
  if (name.includes('tenancy')) return svgIcons.endOfTenancy;
  if (name.includes('airbnb')) return svgIcons.airbnbCleaning;
  if (name.includes('office clean')) return svgIcons.officeCleaning;
  if (name.includes('van')) return svgIcons.vanMoving;
  if (name.includes('waste') || name.includes('removal')) return svgIcons.wasteRemoval;
  if (name.includes('heavy lift') || name.includes('loading')) return svgIcons.heavyLifting;
  if (name.includes('pack')) return svgIcons.packingMoving;
  if (name.includes('full service')) return svgIcons.fullServiceMovers;
  if (name.includes('garden')) return svgIcons.gardening;
  if (name.includes('lawn')) return svgIcons.lawnCare;
  if (name.includes('landscape')) return svgIcons.landscaping;
  if (name.includes('leaf') || name.includes('raking')) return svgIcons.leafRaking;
  if (name.includes('gutter') || name.includes('roof')) return svgIcons.roofGutter;
  if (name.includes('branch') || name.includes('hedge') || name.includes('trim')) return svgIcons.branchHedge;
  if (name.includes('wall mount')) return svgIcons.wallMounting;

  // General category mappings → custom SVG icons
  if (name.includes('furniture') || name.includes('assembly')) return svgIcons.furnitureAssembly;
  if (name.includes('clean')) return svgIcons.clean;
  if (name.includes('handyman') || name.includes('repair') || name.includes('maintenance') || name.includes('minor')) return svgIcons.minorHomeRepairs;
  if (name.includes('moving') || name.includes('lifting') || name.includes('delivery')) return svgIcons.movingHelp;
  if (name.includes('mount') || name.includes('installation') || name.includes('tv')) return svgIcons.wallMounting;
  if (name.includes('yard') || name.includes('lawn') || name.includes('garden') || name.includes('outdoor') || name.includes('landscaping')) return svgIcons.gardening;
  if (name.includes('plumbing')) return svgIcons.leakFixing;
  if (name.includes('electric')) return svgIcons.sockets;

  // Lucide fallbacks for categories without custom icons
  if (name.includes('shopping') || name.includes('errand')) return ShoppingBag;
  if (name.includes('assistant') || name.includes('virtual') || name.includes('office')) return Briefcase;
  if (name.includes('baby') || name.includes('family') || name.includes('child')) return Baby;
  if (name.includes('seasonal') || name.includes('holiday')) return Snowflake;
  if (name.includes('contactless') || name.includes('online') || name.includes('tech')) return Wifi;
  if (name.includes('entertainment') || name.includes('music') || name.includes('event')) return Music;
  if (name.includes('creative') || name.includes('artistic') || name.includes('art')) return Palette;
  if (name.includes('relaxation') || name.includes('luxury') || name.includes('spa')) return Heart;
  if (name.includes('food') || name.includes('dining') || name.includes('cook') || name.includes('chef')) return Coffee;
  if (name.includes('group') || name.includes('social')) return Users;
  if (name.includes('fitness') || name.includes('gym') || name.includes('workout')) return Dumbbell;
  if (name.includes('themed') || name.includes('experience')) return Calendar;
  if (name.includes('photography') || name.includes('photo') || name.includes('media')) return Camera;
  if (name.includes('hair') || name.includes('salon') || name.includes('barber')) return Home;
  if (name.includes('face') || name.includes('beauty') || name.includes('facial') || name.includes('makeup')) return Smile;
  if (name.includes('nail') || name.includes('manicure') || name.includes('pedicure')) return Hand;
  if (name.includes('body') || name.includes('treatment')) return Droplets;
  if (name.includes('massage') || name.includes('wellness') || name.includes('spa')) return HeartPulse;
  if (name.includes('men') || name.includes('grooming')) return UserCircle;
  if (name.includes('building') || name.includes('construction')) return Hammer;
  if (name.includes('computer') || name.includes('laptop')) return Laptop;
  if (name.includes('car') || name.includes('automotive') || name.includes('vehicle')) return Car;

  // Default icon
  return Home;
};
