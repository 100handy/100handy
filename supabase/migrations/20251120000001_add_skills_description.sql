-- Add description field to skills table
ALTER TABLE public.skills
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add descriptions to existing skills
UPDATE public.skills SET description = 'Assemble all types of furniture from flat-pack boxes.' WHERE name = 'Furniture Assembly';
UPDATE public.skills SET description = 'Unpack and assemble all types of IKEA furniture.' WHERE name = 'IKEA Assembly';
UPDATE public.skills SET description = 'Assemble bookshelves and storage units.' WHERE name = 'Bookshelf Assembly';

UPDATE public.skills SET description = 'Regular cleaning of homes and offices.' WHERE name = 'General Cleaning';
UPDATE public.skills SET description = 'Thorough cleaning including hard-to-reach areas.' WHERE name = 'Deep Cleaning';
UPDATE public.skills SET description = 'Complete cleaning for moving in or out of a property.' WHERE name = 'Move In/Out Cleaning';

UPDATE public.skills SET description = 'Repair and maintenance work around the home or office.' WHERE name = 'General Repairs';
UPDATE public.skills SET description = 'Fix holes, cracks, and damage to drywall.' WHERE name = 'Drywall Repair';
UPDATE public.skills SET description = 'Fix leaky faucets, unclog drains, and other minor plumbing tasks.' WHERE name = 'Minor Plumbing';

UPDATE public.skills SET description = 'Mount TVs securely on walls with proper cable management.' WHERE name = 'TV Mounting';
UPDATE public.skills SET description = 'Install shelves securely on various wall types.' WHERE name = 'Shelf Mounting';
UPDATE public.skills SET description = 'Hang pictures, mirrors, and artwork at perfect heights.' WHERE name = 'Picture Hanging';

UPDATE public.skills SET description = 'Help with loading, unloading, and moving items.' WHERE name = 'Moving Help';
UPDATE public.skills SET description = 'Safely move heavy furniture and appliances.' WHERE name = 'Heavy Lifting';
UPDATE public.skills SET description = 'Pack items securely for moving or storage.' WHERE name = 'Packing';

UPDATE public.skills SET description = 'Mow lawns to maintain a neat appearance.' WHERE name = 'Lawn Mowing';
UPDATE public.skills SET description = 'Plant, prune, and maintain gardens.' WHERE name = 'Gardening';
UPDATE public.skills SET description = 'Remove leaves, branches, and debris from yards.' WHERE name = 'Yard Cleanup';

UPDATE public.skills SET description = 'Paint interior walls, ceilings, and trim.' WHERE name = 'Interior Painting';
UPDATE public.skills SET description = 'Paint exterior walls, fences, and decks.' WHERE name = 'Exterior Painting';
UPDATE public.skills SET description = 'Touch up paint on walls and trim.' WHERE name = 'Touch Up';

UPDATE public.skills SET description = 'Run errands and complete tasks around town.' WHERE name = 'Errands';
UPDATE public.skills SET description = 'Shop for groceries and other items.' WHERE name = 'Shopping';
UPDATE public.skills SET description = 'Organize and declutter spaces.' WHERE name = 'Organization';

UPDATE public.skills SET description = 'Care for pets including walking and feeding.' WHERE name = 'Pet Care';
UPDATE public.skills SET description = 'Deliver items to specified locations.' WHERE name = 'Delivery';
UPDATE public.skills SET description = 'Wait in line for tickets, products, or services.' WHERE name = 'Wait in Line';
