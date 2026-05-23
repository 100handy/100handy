import fs from 'node:fs';

function extractAssignedObject(file, varName) {
  const source = fs.readFileSync(file, 'utf8');
  const nameIdx = source.indexOf(varName);
  if (nameIdx === -1) {
    throw new Error(`Could not find ${varName} in ${file}`);
  }
  const eqIdx = source.indexOf('=', nameIdx);
  let i = eqIdx + 1;
  while (/\s/.test(source[i])) i += 1;

  let depth = 0;
  let inString = false;
  let quote = '';
  let prev = '';
  let begun = false;
  let out = '';

  for (; i < source.length; i += 1) {
    const ch = source[i];
    out += ch;

    if (inString) {
      if (ch === quote && prev !== '\\') inString = false;
      prev = ch;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      quote = ch;
      prev = ch;
      continue;
    }

    if (ch === '{') {
      depth += 1;
      begun = true;
    }
    if (ch === '}') {
      depth -= 1;
      if (begun && depth === 0) break;
    }
    prev = ch;
  }

  return Function(`return (${out});`)();
}

function sqlString(value) {
  if (value == null) return 'null';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJson(value) {
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

function safeRouteSlugAssignment(value) {
  if (value == null || value === '') return null;
  return `route_slug = case when (c.route_slug is null or c.route_slug = '') and not exists (select 1 from public.categories c2 where c2.route_slug = ${sqlString(value)} and c2.id <> c.id) then ${sqlString(value)} else c.route_slug end`;
}

function nullableTextAssignment(column, value) {
  if (value == null || value === '') return null;
  return `${column} = case when ${column} is null or ${column} = '' then ${sqlString(value)} else ${column} end`;
}

function nullableJsonAssignment(column, value) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return `${column} = case when ${column} = '[]'::jsonb then ${sqlJson(value)} else ${column} end`;
}

const servicesData = extractAssignedObject('apps/client-web/lib/services-data.ts', 'servicesData');
const bookingMap = extractAssignedObject('apps/client-web/lib/booking-categories.ts', 'BOOKING_CATEGORY_MAP');

const byCategoryName = new Map();

for (const [categorySlug, services] of Object.entries(servicesData)) {
  for (const [serviceSlug, data] of Object.entries(services)) {
    const routeKey = `${categorySlug}/${serviceSlug}`;
    const categoryName = bookingMap[routeKey];
    if (!categoryName) continue;
    if (!byCategoryName.has(categoryName)) {
      byCategoryName.set(categoryName, {
        route_slug: serviceSlug,
        marketing_title: data.title,
        marketing_description: data.description,
        long_description: data.longDescription,
        hero_image_url: data.heroImage ?? null,
        content_image_url: data.contentImage ?? null,
        benefits_json: data.benefits ?? [],
        tasks_json: data.tasks ?? [],
        faqs_json: data.faqs ?? [],
      });
    }
  }
}

const lines = [];
lines.push('-- Generated from apps/client-web/lib/services-data.ts');
lines.push('-- Backfills category/service content into public.categories without overwriting existing edits.');
lines.push('');

for (const [categoryName, content] of byCategoryName.entries()) {
  const assignments = [
    safeRouteSlugAssignment(content.route_slug),
    nullableTextAssignment('marketing_title', content.marketing_title),
    nullableTextAssignment('marketing_description', content.marketing_description),
    nullableTextAssignment('long_description', content.long_description),
    nullableTextAssignment('hero_image_url', content.hero_image_url),
    nullableTextAssignment('content_image_url', content.content_image_url),
    nullableJsonAssignment('benefits_json', content.benefits_json),
    nullableJsonAssignment('tasks_json', content.tasks_json),
    nullableJsonAssignment('faqs_json', content.faqs_json),
  ].filter(Boolean);

  if (assignments.length === 0) continue;

  lines.push('update public.categories as c');
  lines.push('set');
  lines.push(`  ${assignments.join(',\n  ')}`);
  lines.push(`where name = ${sqlString(categoryName)};`);
  lines.push('');
}

process.stdout.write(lines.join('\n'));
