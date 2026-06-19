// e:\Projects\PrepAI\frontend\src\features\landing\components\Testimonials.jsx
import React from 'react';

const Testimonials = () => {
  const reviews = [
    {
      quote: "The interactive AI feedback felt like sitting with an experienced technical lead. It pointed out precisely where my system design explanation was weak.",
      name: "Sarah Jenkins",
      role: "Software Engineer @ Google",
      initial: "S"
    },
    {
      quote: "PrepAI gave me the confidence I was missing. Being able to practice custom company-specific behavioral loops was the key to my success.",
      name: "Marcus Thorne",
      role: "Product Manager @ Amazon",
      initial: "M"
    },
    {
      quote: "The grammar and pacing analytics really helped me slow down and speak more clearly. Highly recommend for any job seeker.",
      name: "Elena Rostova",
      role: "Frontend Developer",
      initial: "E"
    }
  ];

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="section-header">
        <span className="section-tag">Success Stories</span>
        <h2>Loved by candidates worldwide</h2>
      </div>
      
      <div className="testimonials-grid">
        {reviews.map((review, idx) => (
          <div className="testimonial-card" key={idx}>
            <p className="quote">{review.quote}</p>
            <div className="user-info">
              <div className="avatar">
                {review.initial}
              </div>
              <div className="details">
                <div className="name">{review.name}</div>
                <div className="role">{review.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
