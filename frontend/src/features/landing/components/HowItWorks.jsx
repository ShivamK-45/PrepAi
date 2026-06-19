// e:\Projects\PrepAI\frontend\src\features\landing\components\HowItWorks.jsx
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Configure Your Session',
      description: 'Select your target job title, expertise level, and define your preparation scope.'
    },
    {
      num: '02',
      title: 'Run AI Simulation',
      description: 'Engage with our AI interviewer, answering realistic situational or technical questions.'
    },
    {
      num: '03',
      title: 'Analyze Insights',
      description: 'Get deep instant analytics showing key highlights, vocabulary issues, and model answers.'
    }
  ];

  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="section-header">
        <span className="section-tag">Workflow</span>
        <h2>How does PrepAI work?</h2>
      </div>
      
      <div className="steps-container">
        {steps.map((step, idx) => (
          <div className="step-card" key={idx}>
            <div className="step-num">{step.num}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
