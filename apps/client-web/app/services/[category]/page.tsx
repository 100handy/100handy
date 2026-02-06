import { redirect } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  // Redirect to the services page with the category as a hash anchor
  redirect(`/services#${category}`);
}
