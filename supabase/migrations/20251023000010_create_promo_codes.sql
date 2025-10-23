-- Create promo_codes table for discount codes and promotions
CREATE TABLE promo_codes (
  id TEXT PRIMARY KEY DEFAULT nanoid(),
  code TEXT UNIQUE NOT NULL,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  expires_at TIMESTAMPTZ,
  max_uses INTEGER DEFAULT 1 CHECK (max_uses > 0),
  current_uses INTEGER DEFAULT 0 CHECK (current_uses >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_uses CHECK (current_uses <= max_uses)
);

-- Create promo_code_redemptions table to track who redeemed what
CREATE TABLE promo_code_redemptions (
  id TEXT PRIMARY KEY DEFAULT nanoid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  promo_code_id TEXT NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, promo_code_id)
);

-- Enable RLS
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_code_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for promo_codes
-- Anyone can view active promo codes (for validation)
CREATE POLICY "Anyone can view active promo codes"
  ON promo_codes
  FOR SELECT
  USING (
    expires_at IS NULL OR expires_at > NOW()
  );

-- Only admins can insert/update/delete promo codes (handled via service role)
-- No policies for INSERT/UPDATE/DELETE means only service role can do it

-- RLS policies for promo_code_redemptions
-- Users can only view their own redemptions
CREATE POLICY "Users can view own redemptions"
  ON promo_code_redemptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own redemptions
CREATE POLICY "Users can insert own redemptions"
  ON promo_code_redemptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for faster lookups
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_code_redemptions_user_id ON promo_code_redemptions(user_id);
CREATE INDEX idx_promo_code_redemptions_promo_code_id ON promo_code_redemptions(promo_code_id);

-- Create function to increment promo code usage
CREATE OR REPLACE FUNCTION increment_promo_code_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE promo_codes 
    SET current_uses = current_uses + 1
    WHERE id = NEW.promo_code_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-increment usage when redeemed
CREATE TRIGGER promo_code_redeemed
  AFTER INSERT ON promo_code_redemptions
  FOR EACH ROW
  EXECUTE FUNCTION increment_promo_code_usage();

