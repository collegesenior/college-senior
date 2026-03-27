import { prisma } from '@/lib/prisma';

export default async function DebugPage() {
  let dbStatus = 'Unknown';
  let collegeCount = 0;
  let sampleCollege = null;
  let envStatus = {};

  try {
    // Test database connection
    const colleges = await prisma.colleges.findMany({
      take: 1,
      select: {
        id: true,
        name: true,
        slug: true,
        logo_url: true,
        banner_url: true
      }
    });
    
    collegeCount = await prisma.colleges.count();
    sampleCollege = colleges[0] || null;
    dbStatus = 'Connected';
  } catch (error: any) {
    dbStatus = `Error: ${error.message}`;
  }

  // Check environment variables
  envStatus = {
    DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Missing',
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
    NODE_ENV: process.env.NODE_ENV
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Database Debug Page</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
          <pre className="text-sm">{JSON.stringify(envStatus, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Database Status</h2>
          <p><strong>Status:</strong> {dbStatus}</p>
          <p><strong>College Count:</strong> {collegeCount}</p>
        </div>

        {sampleCollege && (
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Sample College Data</h2>
            <pre className="text-sm">{JSON.stringify(sampleCollege, null, 2)}</pre>
            
            {sampleCollege.logo_url && (
              <div className="mt-4">
                <h3 className="font-semibold">Logo Test:</h3>
                <img 
                  src={sampleCollege.logo_url} 
                  alt="College Logo" 
                  className="w-20 h-20 object-contain border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.border = '2px solid red';
                    (e.target as HTMLImageElement).alt = 'Image failed to load';
                  }}
                />
                <p className="text-sm text-gray-600">URL: {sampleCollege.logo_url}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Public Images Test</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <img src="/avit.png" alt="AVIT" className="w-20 h-20 object-contain border" />
              <p className="text-sm">/avit.png</p>
            </div>
            <div>
              <img src="/Hero.webp" alt="Hero" className="w-20 h-20 object-contain border" />
              <p className="text-sm">/Hero.webp</p>
            </div>
            <div>
              <img src="/logoblue.svg" alt="Logo" className="w-20 h-20 object-contain border" />
              <p className="text-sm">/logoblue.svg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}