-- Find category names for test handymen
SELECT id, name, description 
FROM categories 
WHERE id IN (
  'category_mz1bf2RxO2SrNTRonBr1F',
  'category_GSF4ZGyYhRbkgNjKduWfS',
  'category_aBz4iaCiPEwwSKnATa63J',
  'category_dwCTx9UJIPo3BeZa3ld40',
  'category_K1K5U70BEm3fs8cAXiYoI',
  'category_2DXRYwNcxuFpAVnQlnypS',
  'category_pTwrkebrsVx3u0SefMu0Y'
)
ORDER BY name;
