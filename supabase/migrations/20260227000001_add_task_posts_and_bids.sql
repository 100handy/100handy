-- Task posts: clients post tasks for professionals to bid on
CREATE TABLE IF NOT EXISTS task_posts (
  id TEXT PRIMARY KEY DEFAULT nanoid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES categories(id),
  title TEXT NOT NULL,
  description TEXT,
  budget_min_cents INTEGER,
  budget_max_cents INTEGER,
  address_street TEXT,
  address_postcode TEXT,
  address_city TEXT,
  address_country TEXT DEFAULT 'UK',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  preferred_date TEXT, -- YYYY-MM-DD or null for flexible
  preferred_time TEXT, -- HH:MM or null for flexible
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'completed', 'cancelled')),
  assigned_handy_id UUID REFERENCES auth.users(id),
  assigned_bid_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bids: professionals bid on task posts
CREATE TABLE IF NOT EXISTS task_bids (
  id TEXT PRIMARY KEY DEFAULT nanoid(),
  task_post_id TEXT NOT NULL REFERENCES task_posts(id) ON DELETE CASCADE,
  handy_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  estimated_hours NUMERIC(5,2) NOT NULL DEFAULT 1,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'withdrawn')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(task_post_id, handy_id) -- One bid per professional per task
);

-- Add foreign key for assigned_bid_id
ALTER TABLE task_posts
  ADD CONSTRAINT task_posts_assigned_bid_fkey
  FOREIGN KEY (assigned_bid_id) REFERENCES task_bids(id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_task_posts_customer ON task_posts(customer_id);
CREATE INDEX IF NOT EXISTS idx_task_posts_status ON task_posts(status);
CREATE INDEX IF NOT EXISTS idx_task_posts_category ON task_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_task_bids_task ON task_bids(task_post_id);
CREATE INDEX IF NOT EXISTS idx_task_bids_handy ON task_bids(handy_id);

-- RLS policies
ALTER TABLE task_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_bids ENABLE ROW LEVEL SECURITY;

-- Task posts: anyone can read open posts, owners can update their own
CREATE POLICY "Anyone can view open task posts" ON task_posts
  FOR SELECT USING (status = 'open' OR customer_id = auth.uid());

CREATE POLICY "Authenticated users can create task posts" ON task_posts
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Owners can update their task posts" ON task_posts
  FOR UPDATE USING (auth.uid() = customer_id);

-- Task bids: post owner and bidder can see bids
CREATE POLICY "Post owners and bidders can view bids" ON task_bids
  FOR SELECT USING (
    handy_id = auth.uid()
    OR task_post_id IN (SELECT id FROM task_posts WHERE customer_id = auth.uid())
  );

CREATE POLICY "Authenticated professionals can create bids" ON task_bids
  FOR INSERT WITH CHECK (auth.uid() = handy_id);

CREATE POLICY "Bidders can update their own bids" ON task_bids
  FOR UPDATE USING (auth.uid() = handy_id);
