/**
 * This script generates static data files for the HMA Marketing Dashboard
 * Run with: node scripts/generate-static-data.js
 */

const fs = require('fs');
const path = require('path');

// Ensure the data directory exists
const dataDir = path.join(__dirname, '../public/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`Created directory: ${dataDir}`);
}

// Generate website analytics data
const websiteAnalytics = {
  summaries: [
    {
      period: "April 2025",
      visits: 6245,
      pageViews: 15421,
      avgSessionDuration: "2:37",
      bounceRate: "36.8%",
      lastUpdated: new Date().toISOString()
    },
    {
      period: "March 2025",
      visits: 5623,
      pageViews: 12478,
      avgSessionDuration: "2:45",
      bounceRate: "38.2%"
    }
  ],
  topPages: [
    { url: "/services", views: 1243, change: "+5.2%" },
    { url: "/about", views: 857, change: "+2.7%" },
    { url: "/contact", views: 642, change: "+1.3%" },
    { url: "/blog/tax-updates-2025", views: 511, change: "+12.5%" },
    { url: "/team", views: 386, change: "-1.2%" }
  ],
  reports: [
    { 
      name: "HMA Google Analytics 2024 Calendar Year", 
      url: "/reports/HMA Google Analytics 2024 Calendar Year.pdf",
      date: "2025-01-15"
    },
    { 
      name: "April 2025 MTD 0428", 
      url: "/reports/April 2025 MTD 0428.pdf",
      date: "2025-04-28"
    }
  ]
};

// Generate email analytics data
const emailAnalytics = {
  summaries: [
    {
      period: "April 2025",
      opens: 1568,
      clicks: 621,
      clickThroughRate: "39.6%",
      openRate: "22.3%",
      customEngagement: 834,
      lastUpdated: new Date().toISOString()
    },
    {
      period: "March 2025",
      opens: 530,
      clicks: 111,
      clickThroughRate: "12.1%",
      openRate: "57.9%",
      customEngagement: 530
    }
  ],
  campaigns: [
    {
      id: 1,
      name: "April Newsletter",
      date: "2025-04-15",
      opens: 687,
      clicks: 234,
      ctr: "34.1%",
      topLinks: [
        { url: "example.com/tax-updates", clicks: 87 },
        { url: "example.com/market-insights", clicks: 65 },
        { url: "example.com/retirement-planning", clicks: 42 }
      ]
    },
    {
      id: 2,
      name: "March Newsletter",
      date: "2025-03-15",
      opens: 532,
      clicks: 187,
      ctr: "35.2%",
      topLinks: [
        { url: "example.com/article1", clicks: 42 },
        { url: "example.com/article2", clicks: 37 }
      ]
    }
  ]
};

// Generate LinkedIn analytics data
const linkedinAnalytics = {
  summaries: [
    {
      period: "April 2025",
      impressions: 4562,
      engagements: 623,
      followers: 1324,
      clickThroughRate: "3.2%",
      lastUpdated: new Date().toISOString()
    },
    {
      period: "March 2025",
      impressions: 3245,
      engagements: 567,
      followers: 1243,
      clickThroughRate: "2.8%"
    }
  ],
  topPosts: [
    {
      id: 1,
      title: "Tax Planning Strategies for 2025",
      date: "2025-04-10",
      impressions: 1243,
      engagements: 136
    },
    {
      id: 2,
      title: "Market Insights: Q2 Outlook",
      date: "2025-04-05",
      impressions: 958,
      engagements: 87
    }
  ]
};

// Generate contacts and engagement data
const contactsData = {
  contacts: [
    {
      id: 1,
      name: "Jamie Harper",
      email: "jamie.harper1@comcast.net",
      company: "Harper Consulting",
      phone: "555-123-4567",
      status: "Client",
      lastEngagement: "2025-04-15"
    },
    {
      id: 2,
      name: "Donna Harper",
      email: "jdjl.harper@comcast.net",
      company: "Harper Consulting",
      phone: "555-987-6543",
      status: "Client",
      lastEngagement: "2025-04-10"
    },
    {
      id: 3,
      name: "John Drennan",
      email: "jpdren1@gmail.com",
      company: "Drennan Industries",
      phone: "555-333-1111",
      status: "Client",
      lastEngagement: "2025-04-15"
    },
    {
      id: 4,
      name: "Susan Barclay",
      email: "barclays2001@yahoo.com",
      company: "Barclay Financial",
      phone: "555-444-2222",
      status: "Client",
      lastEngagement: "2025-04-12"
    },
    {
      id: 5,
      name: "Ryan Ross",
      email: "ryjross@gmail.com",
      company: "Ross Investments",
      phone: "555-555-3333",
      status: "Client",
      lastEngagement: "2025-04-10"
    },
    {
      id: 6,
      name: "Mr. Adelmann",
      email: "jadelmann@openlands.com",
      company: "Openlands",
      phone: "555-666-4444",
      status: "Prospect",
      lastEngagement: "2025-04-01"
    },
    {
      id: 7,
      name: "Neo Ahuja",
      email: "nishchay.ahuja@togrp.com",
      company: "TOGRP",
      phone: "555-777-5555",
      status: "Prospect",
      lastEngagement: "2025-04-01"
    },
    {
      id: 8,
      name: "Joe Arnold",
      email: "josephcarnold@hotmail.com",
      company: "Arnold & Associates",
      phone: "555-888-6666",
      status: "Prospect",
      lastEngagement: "2025-03-28"
    },
    {
      id: 9,
      name: "Dennis Johnson",
      email: "djjohnson929@gmail.com",
      company: "Johnson Consulting",
      phone: "555-999-7777",
      status: "Prospect",
      lastEngagement: "2025-03-25"
    },
    {
      id: 10,
      name: "Grove Mower",
      email: "grove@hummermower.com",
      company: "Hummer Mower",
      phone: "555-000-8888",
      status: "Internal",
      lastEngagement: "2025-04-15"
    }
  ],
  engagementEvents: {
    "1": [
      {
        id: 101,
        type: "Email Click",
        date: "2025-04-15",
        details: "Clicked on Tax Planning article in April Newsletter"
      },
      {
        id: 102,
        type: "Email Open",
        date: "2025-04-15",
        details: "Opened April Newsletter"
      },
      {
        id: 103,
        type: "Email Click",
        date: "2025-04-15",
        details: "Clicked RSVP button for June 18 event"
      },
      {
        id: 104,
        type: "Website Visit",
        date: "2025-04-12",
        details: "Visited /services page"
      },
      {
        id: 105,
        type: "Email Open",
        date: "2025-04-05",
        details: "Opened Client Portal announcement"
      }
    ],
    "2": [
      {
        id: 201,
        type: "Email Click",
        date: "2025-04-15",
        details: "Clicked RSVP button for June 18 event"
      },
      {
        id: 202,
        type: "Email Open",
        date: "2025-04-15",
        details: "Opened April Newsletter"
      },
      {
        id: 203,
        type: "Email Open",
        date: "2025-04-05",
        details: "Opened Client Portal announcement"
      }
    ],
    "3": [
      {
        id: 301,
        type: "Email Click",
        date: "2025-04-15",
        details: "Clicked RSVP button for June 18 event"
      },
      {
        id: 302,
        type: "Email Open",
        date: "2025-04-15",
        details: "Opened April Newsletter"
      },
      {
        id: 303,
        type: "Email Open",
        date: "2025-04-05",
        details: "Opened Client Portal announcement"
      }
    ],
    "4": [
      {
        id: 401,
        type: "Email Open",
        date: "2025-04-15",
        details: "Opened April Newsletter"
      },
      {
        id: 402,
        type: "Email Open",
        date: "2025-04-15",
        details: "Opened RSVP for June 18 event"
      },
      {
        id: 403,
        type: "Email Open",
        date: "2025-04-05",
        details: "Opened Client Portal announcement"
      }
    ],
    "5": [
      {
        id: 501,
        type: "Email Open",
        date: "2025-04-10",
        details: "Opened April Newsletter"
      },
      {
        id: 502,
        type: "Email Open",
        date: "2025-04-05",
        details: "Opened Client Portal announcement"
      }
    ]
  }
};

// Generate project data
const projectsData = {
  projects: [
    {
      id: 1,
      name: "June 18 2025 Event Campaign",
      description: "A comprehensive marketing campaign for the June 18 client appreciation event",
      startDate: "2025-05-01",
      endDate: "2025-06-18",
      status: "In Progress",
      completionPercentage: 35,
      tasks: [
        {
          id: 101,
          title: "Design event invitation",
          description: "Create digital and print invitations for the event",
          status: "Completed",
          progress: 100,
          due_date: "2025-05-10"
        },
        {
          id: 102,
          title: "Send invitations to client list",
          description: "Email invitations to all clients and follow up with print copies",
          status: "In Progress",
          progress: 50,
          due_date: "2025-05-20"
        },
        {
          id: 103,
          title: "Order event materials",
          description: "Order banners, handouts, and promotional items",
          status: "Not Started",
          progress: 0,
          due_date: "2025-05-25"
        }
      ]
    },
    {
      id: 2,
      name: "Q3 2025 Market Letter",
      description: "Quarterly market insights letter for clients",
      startDate: "2025-06-01",
      endDate: "2025-07-15",
      status: "Planned",
      completionPercentage: 5,
      tasks: [
        {
          id: 201,
          title: "Draft market analysis",
          description: "Research and write market analysis section",
          status: "Not Started",
          progress: 0,
          due_date: "2025-06-15"
        },
        {
          id: 202,
          title: "Design newsletter template",
          description: "Update design for Q3 theme",
          status: "Not Started",
          progress: 0,
          due_date: "2025-06-20"
        }
      ]
    }
  ]
};

// Generate team data
const teamData = {
  members: [
    {
      id: 1,
      name: "Jane Doe",
      role: "Marketing Manager",
      email: "jane.doe@hummermower.com",
      photo: "/assets/team/jane-doe.jpg"
    },
    {
      id: 2,
      name: "John Smith",
      role: "Content Specialist",
      email: "john.smith@hummermower.com",
      photo: "/assets/team/john-smith.jpg"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      role: "Digital Marketing Coordinator",
      email: "sarah.johnson@hummermower.com",
      photo: "/assets/team/sarah-johnson.jpg"
    }
  ]
};

// Write all the data files
try {
  fs.writeFileSync(
    path.join(dataDir, 'website_analytics.json'),
    JSON.stringify(websiteAnalytics, null, 2)
  );
  console.log('Generated website_analytics.json');

  fs.writeFileSync(
    path.join(dataDir, 'email_analytics.json'),
    JSON.stringify(emailAnalytics, null, 2)
  );
  console.log('Generated email_analytics.json');

  fs.writeFileSync(
    path.join(dataDir, 'linkedin_analytics.json'),
    JSON.stringify(linkedinAnalytics, null, 2)
  );
  console.log('Generated linkedin_analytics.json');

  fs.writeFileSync(
    path.join(dataDir, 'contacts.json'),
    JSON.stringify(contactsData, null, 2)
  );
  console.log('Generated contacts.json');

  fs.writeFileSync(
    path.join(dataDir, 'projects.json'),
    JSON.stringify(projectsData, null, 2)
  );
  console.log('Generated projects.json');

  fs.writeFileSync(
    path.join(dataDir, 'team.json'),
    JSON.stringify(teamData, null, 2)
  );
  console.log('Generated team.json');

  console.log('Successfully generated all static data files!');
} catch (error) {
  console.error('Error generating static data files:', error);
}