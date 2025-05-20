import React from 'react';

// Data extracted from analytics/Hummer_Mower_Website_Report_GA4.pdf (Jan 1, 2025 - Mar 31, 2025)
const blogData = [
  { url: '/blogs/insights/february-market-letter', title: 'February Market Letter', views: 190, duration: '00:08:28', scrollDepth: 10 },
  { url: '/blogs/library/2025-tax-reference-guide', title: '2025 Tax Reference Guide', views: 88, duration: '00:05:31', scrollDepth: 11 },
  { url: '/blogs/insights/q125-market-letter', title: '1Q ’25 Market Letter', views: 72, duration: '00:05:19', scrollDepth: 9 },
  // Note: Some URLs appear multiple times with different titles/metrics in the PDF. Including distinct entries.
  { url: '/blogs/insights/february-market-letter-lorraine', title: 'Lorraine’s Monthly Update', views: 18, duration: '00:02:48', scrollDepth: 7 }, // Adjusted URL slightly for uniqueness if needed
  { url: '/blogs/library/new-years-financial-checklist', title: 'New Year’s Financial Checklist', views: 11, duration: '00:01:57', scrollDepth: 9 }, // Assuming this is distinct from tax guide
  // Removed entries below "New Year's Financial Checklist"
];

const BlogPerformance = () => {
  return (
    // Added margin bottom (mb-6) for spacing consistent with other dashboard elements
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      {/* Applied custom green color and updated date range in the title */}
      {/* Title remains green, date range updated */}
      <h2 className="text-xl font-semibold mb-4" style={{ color: '#105938' }}>Blog Performance (Q1 2025)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Reverted header background to default gray, text back to gray */}
          <thead className="bg-gray-50">
            <tr>
              {/* Restored original text styling for light background */}
              {/* Keep Page Title header left-aligned */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Page Title
              </th>
              {/* Center align headers for data columns using inline style */}
              <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ textAlign: 'center' }}>
                Views
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ textAlign: 'center' }}>
                Avg. Session Duration
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ textAlign: 'center' }}>
                Scroll Depth 75% (Count)
              </th>
              {/* <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ textAlign: 'center' }}>
                Landing Page URL
              </th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogData.map((post, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {/* Removed whitespace-nowrap to allow title wrapping */}
                {/* Keep Page Title left-aligned */}
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{post.title}</td>
                 {/* Center align numeric/data columns using inline style */}
                <td className="px-6 py-4 text-sm text-gray-500" style={{ textAlign: 'center' }}>{post.views}</td>
                <td className="px-6 py-4 text-sm text-gray-500" style={{ textAlign: 'center' }}>{post.duration}</td>
                <td className="px-6 py-4 text-sm text-gray-500" style={{ textAlign: 'center' }}>{post.scrollDepth}</td>
                {/* <td className="px-6 py-4 text-sm text-gray-500" style={{ textAlign: 'center' }}>{post.url}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <p className="text-xs text-gray-500 mt-2">Data sourced from Hummer_Mower_Website_Report_GA4.pdf</p>
    </div>
  );
};

export default BlogPerformance;
