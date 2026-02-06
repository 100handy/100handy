import {
  Armchair,
  Sparkles,
  Wrench,
  Truck,
  Flower2,
  ShoppingBag,
  Baby,
  Music,
  Scissors,
  HeartPulse,
  Coffee,
  Camera,
  Monitor,
  Briefcase,
  Home,
  Palette,
  Users,
  PaintRoller,
  Hammer,
  Laptop,
  Car,
  Heart,
  Dumbbell,
  Calendar,
  Wind,
  Smile,
  Hand,
  Droplets,
  Droplet,
  UserCircle,
  Snowflake,
  Wifi,
  Plug,
  Leaf,
  type LucideIcon,
} from 'lucide-react-native';

// Icon mapping function - maps category names/keywords to icons
export const getCategoryIcon = (categoryName: string): LucideIcon => {
  const name = categoryName.toLowerCase();

  // Specific subcategory mappings
  if (name.includes('ikea')) return Armchair;
  if (name.includes('crib')) return Baby;
  if (name.includes('wardrobe') || name.includes('closet')) return Armchair;
  if (name.includes('office furniture')) return Briefcase;
  if (name.includes('tv mount')) return Monitor;
  if (name.includes('shelf') || name.includes('shelves')) return Home;
  if (name.includes('picture') || name.includes('artwork')) return Camera;
  if (name.includes('light fixture') || name.includes('light installation')) return Plug;
  if (name.includes('curtain') || name.includes('blind')) return Home;
  if (name.includes('door') || name.includes('cabinet')) return Home;
  if (name.includes('window')) return Home;
  if (name.includes('seal') || name.includes('caulk')) return Droplet;
  if (name.includes('floor') || name.includes('tile')) return Home;
  if (name.includes('carpentry')) return Hammer;
  if (name.includes('paint')) return PaintRoller;
  if (name.includes('leak')) return Droplet;
  if (name.includes('drain')) return Droplet;
  if (name.includes('tap') || name.includes('faucet')) return Droplet;
  if (name.includes('washing machine')) return Droplets;
  if (name.includes('water filter')) return Droplet;
  if (name.includes('socket')) return Plug;
  if (name.includes('switch')) return Plug;
  if (name.includes('cable')) return Plug;
  if (name.includes('deep clean')) return Sparkles;
  if (name.includes('party')) return Music;
  if (name.includes('tenancy')) return Home;
  if (name.includes('airbnb')) return Home;
  if (name.includes('van')) return Truck;
  if (name.includes('waste') || name.includes('removal')) return Wind;
  if (name.includes('heavy lift') || name.includes('loading')) return Truck;
  if (name.includes('pack')) return Truck;
  if (name.includes('full service')) return Truck;
  if (name.includes('garden')) return Flower2;
  if (name.includes('lawn')) return Leaf;
  if (name.includes('landscape')) return Flower2;
  if (name.includes('leaf') || name.includes('raking')) return Leaf;
  if (name.includes('gutter') || name.includes('roof')) return Home;
  if (name.includes('branch') || name.includes('hedge') || name.includes('trim')) return Scissors;

  // General category mappings
  if (name.includes('furniture') || name.includes('assembly')) return Armchair;
  if (name.includes('clean')) return Sparkles;
  if (name.includes('handyman') || name.includes('repair') || name.includes('maintenance') || name.includes('minor')) return Wrench;
  if (name.includes('moving') || name.includes('lifting') || name.includes('delivery')) return Truck;
  if (name.includes('mount') || name.includes('installation') || name.includes('tv')) return Monitor;
  if (name.includes('yard') || name.includes('lawn') || name.includes('garden') || name.includes('outdoor') || name.includes('landscaping')) return Flower2;
  if (name.includes('plumbing')) return Droplet;
  if (name.includes('electric')) return Plug;
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
  if (name.includes('hair') || name.includes('salon') || name.includes('barber')) return Scissors;
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
