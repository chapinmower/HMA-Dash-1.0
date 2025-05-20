import React from 'react';

const MarketingAnalyticsSummary = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', lineHeight: '1.6' }}>
      <h1>Marketing Analytics Summary: March & Q1 2025</h1>

      <section style={{ marginBottom: '30px' }}>
        <h2>March 2025 Performance</h2>

        <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Email Campaigns (Newsletter & ADV Part 2B)</h3>
        <ul>
          <li><strong>Total Unique Recipients:</strong> 737</li>
          <li><strong>Total Unique Opens:</strong> 526</li>
          <li><strong>Overall Open Rate:</strong> 71.4%</li>
          <li><strong>Total Clicks:</strong> 193</li>
          <li><strong>Overall Click Rate (vs. Recipients):</strong> 26.2%</li>
          <li><strong>Key Campaigns:</strong>
            <ul>
              <li><strong>Newsletter:</strong> 536 Recipients | 319 Opens (59.5% OR) | 110 Clicks (20.5% Click Rate, 34.5% CTOR)</li>
              <li><strong>ADV Part 2B:</strong> 466 Recipients | 375 Opens (80.5% OR) | 83 Clicks (17.8% Click Rate, 22.1% CTOR)</li>
            </ul>
          </li>
        </ul>

        <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '20px' }}>Website Analytics (March - <em>Estimated</em>)</h3>
        <p><em>Note: Website data is currently only available aggregated for Q1. Monthly breakdown requires specific GA4 reporting.</em></p>
        <ul>
          <li><strong>Q1 Average Monthly Sessions:</strong> ~568 (1703 Sessions / 3 Months)</li>
          <li><strong>Q1 Average Monthly Users:</strong> ~426 (1277 Users / 3 Months)</li>
        </ul>
      </section>

      <hr style={{ margin: '30px 0' }} />

      <section style={{ marginBottom: '30px' }}>
        <h2>Q1 2025 Performance (Jan 1 - Mar 31)</h2>

        <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Email Newsletter Performance (Jan, Feb, Mar Newsletters)</h3>
        <ul>
          <li><strong>Total Sends:</strong> 1,595</li>
          <li><strong>Total Opens:</strong> 971</li>
          <li><strong>Total Clicks:</strong> 265</li>
          <li><strong>Average Open Rate:</strong> 60.9%</li>
          <li><strong>Average Click-to-Open Rate (CTOR):</strong> 27.3%</li>
          <li><strong>Top Performing Content (Clicks):</strong>
            <ul>
              <li>Mar: Newsletter Links (110)</li>
              <li>Feb: Investment Outlook 2025 (47)</li>
              <li>Jan: 2025 Tax Reference Guide (54)</li>
            </ul>
          </li>
        </ul>

        <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '20px' }}>Website Analytics (GA4 Data: Jan 1 - Mar 31)</h3>
        <ul>
          <li><strong>Total Sessions:</strong> 1,703 (-7.1% YoY)</li>
          <li><strong>Total Users:</strong> 1,277 (-18.1% YoY)</li>
          <li><strong>New Users:</strong> 1,235 (-18.2% YoY)</li>
          <li><strong>Avg. Engagement Time / Session:</strong> 49 seconds (+51.3% YoY)</li>
          <li><strong>Pages / Session:</strong> 1.81 (+14.2% YoY)</li>
          <li><strong>Top Acquisition Source:</strong> Direct Traffic (1,463 Views)</li>
          <li><strong>Top Page (Sessions):</strong> Homepage (<code>/</code>) (833 Sessions)</li>
          <li><strong>Search Performance (vs. Q4 2024):</strong>
            <ul>
              <li>Impressions: 9.7K (-8.4%)</li>
              <li>Clicks: 332 (+19.9%)</li>
              <li>CTR: 3.4% (+30.9%)</li>
            </ul>
          </li>
        </ul>
      </section>

      <hr style={{ margin: '30px 0' }} />

      <section>
        <h2>Key Takeaways & Discussion Points</h2>
        <ul>
          <li><strong>Email:</strong> March saw high engagement, boosted by the ADV campaign's high open rate. Newsletter performance remained relatively consistent across Q1, with strong CTOR suggesting relevant content.</li>
          <li><strong>Website:</strong> While overall user/session counts are down YoY, engagement metrics (Time/Session, Pages/Session) are significantly up, indicating users are finding value once on the site. Direct traffic remains dominant. Search CTR improved significantly QoQ despite lower impressions.</li>
          <li><strong>Strategy:</strong>
            <ul>
              <li>Analyze the ADV campaign's success - what drove the high open rate?</li>
              <li>Continue focusing on content quality for newsletters to maintain high CTOR.</li>
              <li>Investigate reasons for YoY decline in website users/sessions. Is this seasonal, market-driven, or related to acquisition strategy changes?</li>
              <li>Leverage improved search CTR - are there opportunities to increase impressions for high-performing queries?</li>
              <li>How does website engagement correlate with email clicks? (Requires deeper analysis)</li>
            </ul>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default MarketingAnalyticsSummary;
