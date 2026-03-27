import { prisma } from '@/lib/prisma';
import CollegeListClient from './CollegeListClient';

export default async function CollegesPage({
  searchParams,
}: {
  searchParams: Promise<{
    city?: string;
    search?: string;
    stream?: string;
    degree?: string;
    sort?: string
  }>;
}) {
  const params = await searchParams;

  // 1. Properly type the orderBy variable
  // We use Prisma's internal type to ensure compatibility
  let orderBy: Record<string, 'asc' | 'desc'> = { nirf_ranking: 'asc' };

  if (params.sort === 'fees_low') {
    orderBy = { min_fees: 'asc' };
  } else if (params.sort === 'package_high') {
    orderBy = { avg_package: 'desc' };
  }

  // 2. Fetch colleges with all filters
  const colleges = await prisma.colleges.findMany({
    where: {
      AND: [
        params.city ? { city: { equals: params.city, mode: 'insensitive' } } : {},
        params.stream ? { ownership: { equals: params.stream, mode: 'insensitive' } } : {},
        params.search ? {
          OR: [
            { name: { contains: params.search, mode: 'insensitive' } },
            { city: { contains: params.search, mode: 'insensitive' } }
          ]
        } : {},
      ]
    },
    orderBy: orderBy,
  });

  const serializedColleges = JSON.parse(JSON.stringify(colleges));

  return (
    <CollegeListClient
      initialColleges={serializedColleges}
      currentParams={params}
    />
  );
}