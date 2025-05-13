import React from 'react'

const Satact = () => {
  return (
    <div className='container mx-auto p-8 max-w-4xl'>
    <h1 className='text-3xl font-bold mb-6 text-deep_orange-500'>SAT/ACT</h1>
    <p className='text-lg leading-relaxed'>At ILATE, SAT/ACT preparation is approached with precision, structure, and strategy—empowering students to excel in Math. Our program focuses on building core strengths in algebra, advanced math, data analysis, while training students to master time management and test-taking techniques. With personalized attention, expert-led sessions, and access to our exclusive 10-paper mock bank, ILATE ensures students walk into the SAT with confidence, accuracy, and the skills needed to reach top percentile scores.</p>
      <h2 className='text-xl font-semibold mb-4 mt-4 text-teal-900'>Why ILATE?</h2>
      <ul className='list-disc pl-10 mb-6 space-y-2'>
          <li>Expert-Led Quant Coaching with Focus on Strategy, Not Just Speed</li>
          <li>Exclusive 10-Mock Drill Bank with Difficulty-Graded Practice</li>
          <li>Personalized Progress Tracking with Weekly Diagnostics & Feedback</li>
          <li>Time Management & Collegeboard-Aligned Prep</li>
          <li>Small Batch or 1-on-1 Sessions Based on Student Goals</li>
      </ul>
      
      <p className='mb-4 text-lg font-semibold'>Learning Modes Offered</p>
      <ul className='list-disc pl-10 space-y-2'>
          <li><strong>Online Classes</strong> – Live, interactive sessions with digital tools and real-time support</li>
          <li><strong>Private Tuition</strong> – Personalized 1-on-1 sessions designed to match student pace and learning goals</li>
          <li><strong>Small Batch Group Classes (Max 5 Students)</strong> – Balance of individual focus and peer collaboration </li>
      </ul>
  </div>
  )
}

export default Satact;
