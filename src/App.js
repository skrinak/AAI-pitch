import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const slides = useMemo(() => [
    {
      id: 'title',
      title: 'Applied AI Investing',
      subtitle: 'The YouTube of Algorithmic Trading',
      content: 'Building the first community-driven marketplace for AI trading algorithms'
    },
    {
      id: 'problem',
      title: 'The Problem',
      subtitle: 'Retail Traders Need Better AI Access',
      content: 'Current Solutions Are Broken'
    },
    {
      id: 'solution',
      title: 'Our Solution',
      subtitle: 'BYOA: Bring Your Own Algorithm',
      content: 'Community-Driven Transparency'
    },
    {
      id: 'market',
      title: 'Market Opportunity',
      subtitle: '$600M+ TAM in US Alone',
      content: 'Massive Retail Trading Growth'
    },
    {
      id: 'competition',
      title: 'Competitive Landscape',
      subtitle: 'We\'re Different',
      content: 'Transparent Community vs Closed Platforms'
    },
    {
      id: 'revenue',
      title: 'Revenue Projections',
      subtitle: '$1.8B+ Potential by Year 5',
      content: 'Multiple Monetization Streams'
    },
    {
      id: 'moat',
      title: 'Competitive Moat',
      subtitle: 'Algorithm Database + Community',
      content: 'Network Effects Create Defensibility'
    },
    {
      id: 'risks',
      title: 'Risk Assessment',
      subtitle: 'Regulatory & Competition',
      content: 'Mitigation Strategies'
    },
    {
      id: 'strategy',
      title: 'Go-to-Market Strategy',
      subtitle: 'Build Trust First',
      content: 'Community → Subscription → Revenue Share'
    },
    {
      id: 'founders',
      title: 'The Team',
      subtitle: 'Leadership & Experience',
      content: 'Proven Track Record in AI & Fintech'
    },
    {
      id: 'ask',
      title: 'The Ask',
      subtitle: 'Join the Revolution',
      content: 'Democratizing AI Trading'
    }
  ], []);

  // Animated Number Counter Component
  const AnimatedNumber = ({ value, duration = 2000, suffix = '', prefix = '', className = '' }) => {
    const [currentValue, setCurrentValue] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      // Reset when slide changes
      setCurrentValue(0);
      setIsVisible(false);
      
      // Start animation after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        
        // Parse the numeric value from the string
        const numericValue = parseFloat(value.toString().replace(/[^0-9.]/g, ''));
        
        if (isNaN(numericValue)) {
          setCurrentValue(value);
          return;
        }

        const startTime = Date.now();
        const startValue = 0;
        
        const updateValue = () => {
          const now = Date.now();
          const progress = Math.min((now - startTime) / duration, 1);
          
          // Use easing function for smoother animation
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          const interpolatedValue = startValue + (numericValue - startValue) * easedProgress;
          
          setCurrentValue(Math.floor(interpolatedValue));
          
          if (progress < 1) {
            requestAnimationFrame(updateValue);
          } else {
            setCurrentValue(numericValue);
          }
        };
        
        requestAnimationFrame(updateValue);
      }, 500);

      return () => clearTimeout(timer);
    }, [value, duration, currentSlide]);

    const formatNumber = (num) => {
      if (typeof num !== 'number') return num;
      
      if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
      } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
      } else {
        return num.toFixed(0);
      }
    };

    return (
      <span className={`animated-number ${className} ${isVisible ? 'stat-appear' : ''}`}>
        {prefix}{formatNumber(currentValue)}{suffix}
      </span>
    );
  };

  // Hash-based routing for S3 compatibility
  const updateURL = (slideIndex) => {
    window.location.hash = `#slide/${slideIndex + 1}`;
  };

  const getSlideFromHash = () => {
    const hash = window.location.hash;
    const match = hash.match(/^#slide\/([0-9]+)$/);
    if (match) {
      const slideNum = parseInt(match[1], 10);
      if (slideNum >= 1 && slideNum <= slides.length) {
        return slideNum - 1; // Convert to 0-based index
      }
    }
    return 0; // Default to first slide
  };

  const nextSlide = () => {
    if (isAnimating) return;
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide || index < 0 || index >= slides.length) return;
    setIsAnimating(true);
    updateURL(index);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 300);
  };

  // Handle hash changes (browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const newSlideIndex = getSlideFromHash();
      if (newSlideIndex !== currentSlide && !isAnimating) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentSlide(newSlideIndex);
          setIsAnimating(false);
        }, 300);
      }
    };

    // Set initial slide from URL hash
    const initialSlide = getSlideFromHash();
    if (initialSlide !== currentSlide) {
      setCurrentSlide(initialSlide);
    } else {
      // Update URL if no hash present
      updateURL(currentSlide);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't handle shortcuts if overlay is visible
      if (showShortcuts) {
        if (e.key === 'Escape' || e.key === '?') {
          setShowShortcuts(false);
        }
        return;
      }

      // Navigation shortcuts
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
      
      // Utility shortcuts
      if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts(true);
      }
      if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      }
      if (e.key === 'End') {
        e.preventDefault();
        goToSlide(slides.length - 1);
      }
      
      // Number shortcuts (1-9, 0 for slide 10)
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        e.preventDefault();
        goToSlide(num - 1);
      }
      if (e.key === '0') {
        e.preventDefault();
        goToSlide(9);
      }
      // Special handling for slide 11
      if (e.key === '-' || e.key === '=') {
        e.preventDefault();
        goToSlide(10);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimating, currentSlide, showShortcuts]); // Add showShortcuts to dependencies

  // Update document title based on current slide
  useEffect(() => {
    const slideTitle = slides[currentSlide]?.title || 'Applied AI Investing';
    document.title = `${slideTitle} - Applied AI Investing Pitch`;
  }, [currentSlide, slides]);

  const renderSlideContent = () => {
    const slide = slides[currentSlide];
    
    switch (slide.id) {
      case 'title':
        return (
          <div className="slide-content title-slide">
            <div className="title-animation">
              <h1 className="main-title">Applied AI Investing</h1>
              <div className="subtitle-line"></div>
              <p className="main-subtitle">The YouTube of Algorithmic Trading</p>
              <div className="tagline">Building the first community-driven marketplace for AI trading algorithms</div>
            </div>
            <div className="floating-elements">
              <div className="float-element">🤖</div>
              <div className="float-element">📈</div>
              <div className="float-element">💰</div>
            </div>
          </div>
        );
      
      case 'problem':
        return (
          <div className="slide-content problem-slide">
            <h2>The Problem</h2>
            <div className="problem-grid">
              <div className="problem-card">
                <div className="problem-icon">🔒</div>
                <h3>Expensive & Closed</h3>
                <p>Pre-built trading bots cost thousands with no transparency</p>
              </div>
              <div className="problem-card">
                <div className="problem-icon">⚙️</div>
                <h3>Complex Platforms</h3>
                <p>Retail traders struggle with coding on technical platforms</p>
                <a href="https://www.quantconnect.com" target="_blank" rel="noopener noreferrer" className="reference-link">QuantConnect Example →</a>
              </div>
              <div className="problem-card">
                <div className="problem-icon">🎰</div>
                <h3>Opaque Results</h3>
                <p>No way to verify algorithm performance or methodology</p>
              </div>
            </div>
            <div className="stat-highlight">
              <span className="stat-number">
                <AnimatedNumber value={20} duration={1500} suffix="%" />
              </span>
              <span className="stat-label">of US stock volume from retail traders in 2024</span>
            </div>
          </div>
        );

      case 'solution':
        return (
          <div className="slide-content solution-slide">
            <h2>Our Solution: BYOA</h2>
            <div className="solution-diagram">
              <div className="solution-step">
                <div className="step-number">1</div>
                <h3>Creators Upload</h3>
                <p>AI algo developers share their strategies</p>
              </div>
              <div className="arrow">→</div>
              <div className="solution-step">
                <div className="step-number">2</div>
                <h3>Transparent Validation</h3>
                <p>Real performance tracking & leaderboards</p>
              </div>
              <div className="arrow">→</div>
              <div className="solution-step">
                <div className="step-number">3</div>
                <h3>Community Access</h3>
                <p>Retail traders subscribe to proven strategies</p>
              </div>
            </div>
            <div className="differentiators">
              <div className="diff-item">✅ Open Model Support</div>
              <div className="diff-item">✅ Fair Revenue Sharing</div>
              <div className="diff-item">✅ Transparent Performance</div>
            </div>
          </div>
        );

      case 'market':
        return (
          <div className="slide-content market-slide">
            <h2>Market Opportunity</h2>
            <div className="market-stats">
              <div className="market-stat primary">
                <div className="stat-number">
                  <AnimatedNumber value={50} duration={2000} suffix="M" />
                </div>
                <div className="stat-label">Active US Brokerage Accounts</div>
              </div>
              <div className="market-calc">
                <div className="calc-step">
                  <span>
                    <AnimatedNumber value={2} duration={1000} />-<AnimatedNumber value={5} duration={1200} />% interested in AI strategies
                  </span>
                  <span className="calc-arrow">→</span>
                  <span className="highlight">
                    <AnimatedNumber value={1} duration={1500} />-<AnimatedNumber value={2.5} duration={1800} />M potential users
                  </span>
                </div>
                <div className="calc-step">
                  <span>$<AnimatedNumber value={20} duration={1000} />/month average subscription</span>
                  <span className="calc-arrow">→</span>
                  <span className="highlight">
                    $<AnimatedNumber value={240} duration={2000} />-<AnimatedNumber value={600} duration={2200} />M TAM
                  </span>
                </div>
              </div>
            </div>
            <div className="expansion-markets">
              <h3>Expansion Opportunities</h3>
              <div className="expansion-grid">
                <div className="expansion-item">
                  <span className="flag">🇪🇺</span>
                  <span>EU Retail Traders</span>
                </div>
                <div className="expansion-item">
                  <span className="flag">🌏</span>
                  <span>Asian Markets</span>
                </div>
                <div className="expansion-item">
                  <span className="flag">🏦</span>
                  <span>Institutional Segment</span>
                </div>
              </div>
              <p className="expansion-note">Global expansion could 3-5x TAM</p>
            </div>
          </div>
        );

      case 'competition':
        return (
          <div className="slide-content competition-slide">
            <h2>Competitive Landscape</h2>
            <div className="competitor-grid">
              <div className="competitor-section">
                <h3>Direct Competitors</h3>
                <div className="competitor-list">
                  <div className="competitor-item">
                    <a href="https://www.quantconnect.com" target="_blank" rel="noopener noreferrer">
                      <strong>QuantConnect</strong> - Open-source platform
                    </a>
                  </div>
                  <div className="competitor-item">
                    <a href="https://www.tradingview.com" target="_blank" rel="noopener noreferrer">
                      <strong>TradingView</strong> - Pine Script community
                    </a>
                  </div>
                  <div className="competitor-item">
                    <a href="https://collective2.com" target="_blank" rel="noopener noreferrer">
                      <strong>Collective2</strong> - Strategy marketplace
                    </a>
                  </div>
                </div>
              </div>
              <div className="competitor-section">
                <h3>Indirect Competitors</h3>
                <div className="competitor-list">
                  <div className="competitor-item">
                    <a href="https://www.etoro.com" target="_blank" rel="noopener noreferrer">
                      <strong>eToro</strong> - Social trading
                    </a>
                  </div>
                  <div className="competitor-item">
                    <strong>Darwinex</strong> - Copy trading
                  </div>
                </div>
              </div>
            </div>
            <div className="our-difference">
              <h3>Our Differentiator</h3>
              <div className="diff-highlight">
                Community-driven BYOA model with transparent validation and fair revenue sharing
              </div>
            </div>
          </div>
        );

      case 'revenue':
        return (
          <div className="slide-content revenue-slide">
            <h2>Revenue Projections</h2>
            <div className="revenue-scenarios">
              <div className="scenario-card">
                <div className="scenario-header">
                  <span className="adoption-rate"><AnimatedNumber value={1} duration={1000} />% Adoption</span>
                  <span className="user-count"><AnimatedNumber value={500} duration={1500} />K Users</span>
                </div>
                <div className="revenue-progression">
                  <div className="year-revenue">
                    <span className="year">Year 1</span>
                    <span className="amount">$<AnimatedNumber value={174} duration={2000} />M</span>
                  </div>
                  <div className="year-revenue">
                    <span className="year">Year 5</span>
                    <span className="amount">$<AnimatedNumber value={361} duration={2500} />M</span>
                  </div>
                </div>
              </div>
              <div className="scenario-card highlighted">
                <div className="scenario-header">
                  <span className="adoption-rate"><AnimatedNumber value={3} duration={1000} />% Adoption</span>
                  <span className="user-count"><AnimatedNumber value={1.5} duration={1500} />M Users</span>
                </div>
                <div className="revenue-progression">
                  <div className="year-revenue">
                    <span className="year">Year 1</span>
                    <span className="amount">$<AnimatedNumber value={522} duration={2000} />M</span>
                  </div>
                  <div className="year-revenue">
                    <span className="year">Year 5</span>
                    <span className="amount">$<AnimatedNumber value={1080} duration={2500} />M</span>
                  </div>
                </div>
              </div>
              <div className="scenario-card">
                <div className="scenario-header">
                  <span className="adoption-rate"><AnimatedNumber value={5} duration={1000} />% Adoption</span>
                  <span className="user-count"><AnimatedNumber value={2.5} duration={1500} />M Users</span>
                </div>
                <div className="revenue-progression">
                  <div className="year-revenue">
                    <span className="year">Year 1</span>
                    <span className="amount">$<AnimatedNumber value={870} duration={2000} />M</span>
                  </div>
                  <div className="year-revenue">
                    <span className="year">Year 5</span>
                    <span className="amount">$<AnimatedNumber value={1800} duration={2500} />M+</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="monetization-streams">
              <h3>Revenue Streams</h3>
              <div className="stream-list">
                <div className="stream-item">📱 Subscription Tiers</div>
                <div className="stream-item">💰 Revenue Sharing</div>
                <div className="stream-item">📊 Premium Analytics</div>
                <div className="stream-item">🏢 Institutional Data</div>
              </div>
            </div>
          </div>
        );

      case 'moat':
        return (
          <div className="slide-content moat-slide">
            <h2>Competitive Moat</h2>
            <div className="moat-diagram">
              <div className="moat-center">
                <div className="platform-core">Applied AI Investing Platform</div>
              </div>
              <div className="moat-elements">
                <div className="moat-element">
                  <div className="moat-icon">🗃️</div>
                  <h4>Algorithm Database</h4>
                  <p>Proprietary collection of validated strategies</p>
                </div>
                <div className="moat-element">
                  <div className="moat-icon">👥</div>
                  <h4>Community Network</h4>
                  <p>Creators & users create network effects</p>
                </div>
                <div className="moat-element">
                  <div className="moat-icon">🛡️</div>
                  <h4>Trust & Brand</h4>
                  <p>Transparent performance validation</p>
                </div>
                <div className="moat-element">
                  <div className="moat-icon">🔗</div>
                  <h4>Broker Integrations</h4>
                  <p>API partnerships with major platforms</p>
                </div>
              </div>
            </div>
            <div className="network-effects">
              <p className="effects-description">
                More creators → More algorithms → More users → Stronger network effects
              </p>
            </div>
          </div>
        );

      case 'risks':
        return (
          <div className="slide-content risks-slide">
            <h2>Risk Assessment</h2>
            <div className="risks-grid">
              <div className="risk-category">
                <h3 className="risk-header negative">Key Risks</h3>
                <div className="risk-list">
                  <div className="risk-item">
                    <span className="risk-icon">⚖️</span>
                    <div>
                      <strong>Regulatory</strong>
                      <p>SEC/FINRA compliance requirements</p>
                    </div>
                  </div>
                  <div className="risk-item">
                    <span className="risk-icon">📉</span>
                    <div>
                      <strong>Performance Risk</strong>
                      <p>Poor algo results damage reputation</p>
                    </div>
                  </div>
                  <div className="risk-item">
                    <span className="risk-icon">🏃</span>
                    <div>
                      <strong>Competition</strong>
                      <p>Incumbents could replicate features</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="risk-category">
                <h3 className="risk-header positive">Mitigation Strategies</h3>
                <div className="risk-list">
                  <div className="risk-item">
                    <span className="risk-icon">⚖️</span>
                    <div>
                      <strong>Legal Framework</strong>
                      <p>Engage securities lawyers early</p>
                    </div>
                  </div>
                  <div className="risk-item">
                    <span className="risk-icon">📊</span>
                    <div>
                      <strong>Transparency</strong>
                      <p>Clear performance disclaimers</p>
                    </div>
                  </div>
                  <div className="risk-item">
                    <span className="risk-icon">🏆</span>
                    <div>
                      <strong>First Mover</strong>
                      <p>Build community before competitors</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'strategy':
        return (
          <div className="slide-content strategy-slide">
            <h2>Go-to-Market Strategy</h2>
            <div className="strategy-timeline">
              <div className="strategy-phase">
                <div className="phase-number">1</div>
                <div className="phase-content">
                  <h3>Build Trust & Community</h3>
                  <ul>
                    <li>Transparent performance leaderboards</li>
                    <li>Strong education for non-coders</li>
                    <li>Fair revenue sharing for creators</li>
                  </ul>
                </div>
              </div>
              <div className="strategy-phase">
                <div className="phase-number">2</div>
                <div className="phase-content">
                  <h3>Subscription Model</h3>
                  <ul>
                    <li>Free tier (limited access)</li>
                    <li>Standard ($20/month)</li>
                    <li>Premium ($50+/month)</li>
                  </ul>
                </div>
              </div>
              <div className="strategy-phase">
                <div className="phase-number">3</div>
                <div className="phase-content">
                  <h3>Scale & Integrate</h3>
                  <ul>
                    <li>Broker API integrations</li>
                    <li>Institutional tier launch</li>
                    <li>Global expansion</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="distribution-channels">
              <h3>Distribution Strategy</h3>
              <div className="channel-list">
                <div className="channel-item">
                  <a href="https://reddit.com/r/investing" target="_blank" rel="noopener noreferrer">
                    📱 Reddit investing communities
                  </a>
                </div>
                <div className="channel-item">🎓 Broker education platforms</div>
                <div className="channel-item">🏆 Low-stakes algo competitions</div>
                <div className="channel-item">🔄 Referral programs</div>
              </div>
            </div>
          </div>
        );

      case 'founders':
        return (
          <div className="slide-content founders-slide">
            <h2>The Team</h2>
            <div className="founders-grid">
              <div className="founder-card">
                <div className="founder-photo">
                  <div className="photo-placeholder">KS</div>
                </div>
                <div className="founder-info">
                  <h3>Kris Skrinak</h3>
                  <p className="founder-title">Co-Founder & CEO</p>
                  <div className="founder-bio">
                    <p>Technology Leader at AWS specializing in AI/ML and digital transformation in capital markets. Deep expertise in generative AI, enterprise solutions, and responsible AI implementation.</p>
                    <div className="founder-highlights">
                      <div className="highlight-item">• Organizer: NYC Deep Learning Meetup</div>
                      <div className="highlight-item">• King's College graduate</div>
                      <div className="highlight-item">• Expert in regulated industry AI deployments</div>
                      <div className="highlight-item">• Contact: kris@zimbra.ai</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="founder-card">
                <div className="founder-photo">
                  <div className="photo-placeholder">RF</div>
                </div>
                <div className="founder-info">
                  <h3>Robert Fanini</h3>
                  <p className="founder-title">Co-Founder & CTO</p>
                  <div className="founder-bio">
                    <p>Co-Founder/General Partner at Inspiration VC with 30+ years founding and scaling startup companies. Founded 8 companies including Capital Technologies, Foglight Software, and GroundWork.</p>
                    <div className="founder-highlights">
                      <div className="highlight-item">• UC Berkeley EECS graduate</div>
                      <div className="highlight-item">• 8 successful company exits</div>
                      <div className="highlight-item">• Board positions: Buffer, Polymer, Gladly</div>
                      <div className="highlight-item">• Contact: robert@inspirationvc.com</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="team-vision">
              <div className="vision-quote">
                "Combining deep AI expertise with proven startup execution to democratize algorithmic trading for retail investors."
              </div>
            </div>
          </div>
        );

      case 'ask':
        return (
          <div className="slide-content ask-slide">
            <div className="ask-content">
              <h1>Join the Revolution</h1>
              <div className="vision-statement">
                <p>We're democratizing AI trading for 50M+ retail investors</p>
                <p>Building the infrastructure for the next generation of algorithmic trading</p>
              </div>
              <div className="ask-details">
                <div className="ask-item">
                  <span className="ask-icon">💰</span>
                  <div>
                    <strong>Seeking Series A</strong>
                    <p>To build platform and acquire first 10K creators</p>
                  </div>
                </div>
                <div className="ask-item">
                  <span className="ask-icon">🤝</span>
                  <div>
                    <strong>Strategic Partners</strong>
                    <p>Broker integrations and compliance expertise</p>
                  </div>
                </div>
                <div className="ask-item">
                  <span className="ask-icon">👥</span>
                  <div>
                    <strong>Advisory Board</strong>
                    <p>Fintech and AI industry leaders</p>
                  </div>
                </div>
              </div>
              <div className="contact-info">
                <button className="contact-btn">Let's Build the Future Together</button>
                <p>Contact: founders@appliedaiinvesting.com</p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Slide not found</div>;
    }
  };

  return (
    <div className="presentation-app">
      <div className="presentation-container">
        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>
        
        <div className={`slide ${isAnimating ? 'slide-transitioning' : ''}`}>
          {renderSlideContent()}
        </div>
        
        <div className="presentation-controls">
          <button onClick={prevSlide} className="nav-btn" disabled={isAnimating}>
            ← Previous
          </button>
          
          <div className="slide-indicator">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                disabled={isAnimating}
              />
            ))}
          </div>
          
          <button onClick={nextSlide} className="nav-btn" disabled={isAnimating}>
            Next →
          </button>
        </div>
        
        <div className="slide-counter">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
      
      {/* Keyboard Shortcuts Overlay */}
      <div className={`shortcuts-overlay ${showShortcuts ? 'visible' : ''}`}>
        <div className="shortcuts-container">
          <h2>Keyboard Shortcuts</h2>
          <div className="shortcuts-grid">
            <div className="shortcut-item">
              <span className="shortcut-description">Next slide</span>
              <div className="shortcut-key">
                <span className="key">→</span>
                <span className="key">Space</span>
              </div>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-description">Previous slide</span>
              <div className="shortcut-key">
                <span className="key">←</span>
              </div>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-description">First slide</span>
              <div className="shortcut-key">
                <span className="key">Home</span>
              </div>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-description">Last slide</span>
              <div className="shortcut-key">
                <span className="key">End</span>
              </div>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-description">Go to slide 1-9</span>
              <div className="shortcut-key">
                <span className="key">1</span>
                <span className="key combo">-</span>
                <span className="key">9</span>
              </div>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-description">Go to slide 10</span>
              <div className="shortcut-key">
                <span className="key">0</span>
              </div>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-description">Go to slide 11</span>
              <div className="shortcut-key">
                <span className="key">-</span>
                <span className="key">=</span>
              </div>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-description">Show/hide shortcuts</span>
              <div className="shortcut-key">
                <span className="key">?</span>
              </div>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-description">Close overlay</span>
              <div className="shortcut-key">
                <span className="key">Esc</span>
              </div>
            </div>
          </div>
          <div className="close-hint">
            Press <span className="key">?</span> or <span className="key">Esc</span> to close this overlay
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;