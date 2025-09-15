import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  
  // Mobile detection for audio features
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Audio narration state (disabled on mobile due to poor voice quality)
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1.0);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [audioProgress, setAudioProgress] = useState(0);

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
    }, [value, duration, currentSlide]); // Reset animations when slide changes

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
    
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 300);
  };

  // Audio Management Functions using Web Speech API
  const loadAudio = async (slideId) => {
    // Disable audio on mobile devices due to poor voice quality
    if (isMobile) {
      console.log('📱 Audio disabled on mobile devices due to poor voice quality');
      return null;
    }
    
    try {
      // Load narration text for this slide
      const response = await fetch('/audio/narration.json');
      const narrationData = await response.json();
      const slideText = narrationData.slides[slideId]?.text;
      
      if (!slideText) {
        console.error(`No narration text found for slide: ${slideId}`);
        return null;
      }

      // Check if Web Speech API is supported
      if (!('speechSynthesis' in window)) {
        console.error('Web Speech API not supported');
        return null;
      }

      // Mobile detection and additional checks
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      console.log(`🔍 Device info: Mobile=${isMobile}, iOS=${isIOS}, UserAgent=${navigator.userAgent.substring(0, 50)}...`);
      
      // Additional mobile checks
      if (isMobile) {
        console.log(`📱 Mobile device detected - checking speechSynthesis status`);
        console.log(`🎤 speechSynthesis.speaking: ${speechSynthesis.speaking}`);
        console.log(`🎤 speechSynthesis.pending: ${speechSynthesis.pending}`);
        console.log(`🎤 speechSynthesis.paused: ${speechSynthesis.paused}`);
      }

      const utterance = new SpeechSynthesisUtterance(slideText);
      
      // Configure British female voice with mobile fallbacks
      const voices = speechSynthesis.getVoices();
      console.log(`🎤 Available voices: ${voices.length}`);
      
      if (isMobile) {
        console.log(`📱 Mobile voices:`, voices.map(v => `${v.name} (${v.lang})`).slice(0, 5));
      }
      
      // Try different voice selection strategies for mobile
      let britishVoice;
      if (isIOS) {
        // iOS-specific voice selection
        britishVoice = voices.find(voice => voice.name.includes('Kate')) ||
                      voices.find(voice => voice.name.includes('Serena')) ||
                      voices.find(voice => voice.lang.includes('en-GB')) ||
                      voices.find(voice => voice.lang.includes('en-US') && voice.name.toLowerCase().includes('female')) ||
                      voices[0]; // Fallback to first available voice
      } else {
        // Original logic for desktop and Android
        britishVoice = voices.find(voice => 
          voice.lang.includes('en-GB') && voice.name.toLowerCase().includes('female')
        ) || voices.find(voice => 
          voice.lang.includes('en-GB')
        ) || voices.find(voice => 
          voice.lang.includes('en-')
        ) || voices[0]; // Fallback to first available voice
      }
      
      if (britishVoice) {
        utterance.voice = britishVoice;
        console.log(`🎙️ Selected voice: ${britishVoice.name} (${britishVoice.lang})`);
      } else {
        console.log(`⚠️ No suitable voice found, using default`);
      }
      
      // Configure speech parameters for swift pace
      utterance.rate = audioSpeed; // Swift pace
      utterance.pitch = 1.0;
      utterance.volume = audioMuted ? 0 : 1.0;
      
      console.log(`🎙️ Loaded British narration for ${slideId}: "${slideText.substring(0, 50)}..."`);
      
      // Create audio-like interface for compatibility
      const audioInterface = {
        utterance,
        duration: Math.ceil(slideText.length / 12), // Estimate duration based on text length
        currentTime: 0,
        paused: true,
        isPlaying: false,
        
        play: () => {
          return new Promise((resolve) => {
            if (audioMuted) {
              console.log(`🔇 Audio muted for slide: ${slideId}`);
              resolve();
              return;
            }
            
            audioInterface.paused = false;
            audioInterface.isPlaying = true;
            utterance.rate = audioSpeed;
            utterance.volume = 1.0;
            
            utterance.onend = () => {
              audioInterface.paused = true;
              audioInterface.isPlaying = false;
              audioInterface.currentTime = audioInterface.duration;
              if (audioInterface.onended) audioInterface.onended();
              resolve();
            };
            
            utterance.onerror = (error) => {
              console.error('🚨 Speech synthesis error:', error);
              console.error('🚨 Error details:', {
                error: error.error,
                type: error.type,
                elapsedTime: error.elapsedTime,
                charIndex: error.charIndex
              });
              audioInterface.paused = true;
              audioInterface.isPlaying = false;
              
              // Mobile-specific error handling
              if (isMobile) {
                console.error('📱 Mobile speech error - this may be due to:');
                console.error('1. iOS Safari Web Speech API limitations');
                console.error('2. User gesture required for audio playback');
                console.error('3. Background tab audio restrictions');
                console.error('4. Voice not available on this device');
              }
              
              resolve();
            };
            
            console.log(`🎙️ Speaking: "${slideText.substring(0, 50)}..." with ${britishVoice?.name || 'default voice'}`);
            
            // Mobile-specific speech initiation
            if (isMobile) {
              console.log('📱 Initiating mobile speech synthesis...');
              
              // For iOS, try to ensure user gesture context
              if (isIOS) {
                // Cancel any existing speech first
                speechSynthesis.cancel();
                
                // Small delay to ensure clean state
                setTimeout(() => {
                  console.log('🍎 iOS: Starting speech synthesis');
                  speechSynthesis.speak(utterance);
                }, 10);
              } else {
                // Android and other mobile
                speechSynthesis.speak(utterance);
              }
            } else {
              // Desktop
              speechSynthesis.speak(utterance);
            }
            
            resolve();
          });
        },
        
        pause: () => {
          speechSynthesis.cancel();
          audioInterface.paused = true;
          audioInterface.isPlaying = false;
          console.log(`⏸️ Paused narration for slide: ${slideId}`);
        },
        
        addEventListener: (event, callback) => {
          if (event === 'loadedmetadata') {
            setTimeout(callback, 100);
          } else if (event === 'timeupdate') {
            // For Web Speech API, we don't have real progress, so we'll just call once at start
            // and once at end to avoid constant re-renders that break animations
            setTimeout(() => {
              if (audioInterface.isPlaying) {
                callback(); // Call once to show initial progress
              }
            }, 100);
          } else if (event === 'ended') {
            audioInterface.onended = callback;
          }
        },
        
        removeEventListener: () => {},
        
        set playbackRate(rate) {
          utterance.rate = rate;
        },
        
        get playbackRate() {
          return utterance.rate;
        }
      };
      
      return audioInterface;
    } catch (error) {
      console.error('Error loading audio:', error);
      return null;
    }
  };

  const playCurrentSlideAudio = async () => {
    if (!audioEnabled || audioMuted) return;
    
    const slideId = slides[currentSlide].id;
    setAudioLoading(true);
    
    try {
      // Ensure voices are loaded
      await new Promise(resolve => {
        if (speechSynthesis.getVoices().length > 0) {
          resolve();
        } else {
          speechSynthesis.addEventListener('voiceschanged', resolve, { once: true });
        }
      });
      
      const audio = await loadAudio(slideId);
      if (!audio) {
        setAudioLoading(false);
        return;
      }
      
      audio.playbackRate = audioSpeed;
      
      // Set up audio event listeners with throttled progress updates
      let lastProgressUpdate = 0;
      const updateProgress = () => {
        const now = Date.now();
        if (audio.duration && now - lastProgressUpdate > 100) { // Throttle to every 100ms
          setAudioProgress((audio.currentTime / audio.duration) * 100);
          lastProgressUpdate = now;
        }
      };
      
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', () => {
        setAudioProgress(0);
        setCurrentAudio(null);
      });
      
      setCurrentAudio(audio);
      await audio.play();
      setAudioLoading(false);
    } catch (error) {
      console.error('Error playing audio:', error);
      setAudioLoading(false);
    }
  };

  const toggleAudioEnabled = () => {
    const wasEnabled = audioEnabled;
    setAudioEnabled(!audioEnabled);
    
    if (!wasEnabled) {
      // Audio was just enabled, initialize for mobile and play current slide
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        console.log('📱 Mobile: Initializing audio with user gesture');
        
        // Initialize speechSynthesis with user gesture for mobile compatibility
        try {
          // Trigger a brief silent utterance to "wake up" the speech synthesis on mobile
          const testUtterance = new SpeechSynthesisUtterance('');
          testUtterance.volume = 0;
          speechSynthesis.speak(testUtterance);
          
          console.log('📱 Mobile: Speech synthesis initialized');
        } catch (error) {
          console.error('📱 Mobile: Failed to initialize speech synthesis:', error);
        }
      }
      
      // Play current slide with slight delay to ensure initialization
      setTimeout(playCurrentSlideAudio, isMobile ? 200 : 100);
    } else {
      // Audio was disabled, stop current audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
        setAudioProgress(0);
      }
    }
  };

  const toggleAudioMuted = () => {
    setAudioMuted(!audioMuted);
    if (currentAudio && !audioMuted) {
      currentAudio.pause();
    } else if (currentAudio && audioMuted) {
      currentAudio.play();
    }
  };

  const changeAudioSpeed = (speed) => {
    setAudioSpeed(speed);
    if (currentAudio) {
      currentAudio.playbackRate = speed;
    }
  };

  const restartCurrentAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setAudioProgress(0);
    }
    if (audioEnabled) {
      playCurrentSlideAudio();
    }
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
      
      // Audio shortcuts
      if (e.key === 'M' || e.key === 'm') {
        e.preventDefault();
        toggleAudioMuted();
      }
      if (e.key === 'R' || e.key === 'r') {
        e.preventDefault();
        restartCurrentAudio();
      }
      if (e.key === '<' || e.key === ',') {
        e.preventDefault();
        const newSpeed = Math.max(0.5, audioSpeed - 0.25);
        changeAudioSpeed(newSpeed);
      }
      if (e.key === '>' || e.key === '.') {
        e.preventDefault();
        const newSpeed = Math.min(2.0, audioSpeed + 0.25);
        changeAudioSpeed(newSpeed);
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

  // Play audio when slide changes (if audio is enabled)
  useEffect(() => {
    if (audioEnabled && !isAnimating) {
      playCurrentSlideAudio();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide, audioEnabled]);

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
            <div className="demo-link">
              <a href="./slideshow.html" target="_blank" rel="noopener noreferrer" className="demo-button">
                📱 View Wireframes
              </a>
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
                  <img src="https://media.licdn.com/dms/image/v2/D5603AQEbRm9iHsPnVQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1725556967615?e=2147483647&v=beta&t=0D_lJw-IpOgKJDH6K2Y-qYGBXrJbCsoJ_1GBq-CeqKk" alt="Kris Skrinak" className="founder-image" />
                </div>
                <div className="founder-info">
                  <h3>Kris Skrinak</h3>
                  <p className="founder-title">Co-Founder & CEO</p>
                  <div className="founder-bio">
                    <p>Technology Leader at AWS specializing in AI/ML and digital transformation in capital markets. Deep expertise in generative AI, enterprise solutions, and responsible AI implementation.</p>
                    <div className="founder-highlights">
                      <div className="highlight-item">• AWS Capital Markets and GenAI specialist 8+ years</div>
                      <div className="highlight-item">• 3 Successful exits</div>
                      <div className="highlight-item">• AI and Regulated industry thought leader</div>
                      <div className="highlight-item">• Contact: kris@zimbra.ai</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="founder-card">
                <div className="founder-photo">
                  <img src="https://www.inspirationvc.com/wp-content/uploads/2015/10/RE-IV-0031-1-scaled.jpg" alt="Robert Fanini" className="founder-image" />
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
                <p>Contact: kris@zimbra.ai</p>
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
        
        {/* Audio Controls - Hidden on mobile due to poor voice quality */}
        {!isMobile && (
          <div className="audio-controls">
          <button 
            onClick={toggleAudioEnabled} 
            className={`audio-btn ${audioEnabled ? 'enabled' : ''}`}
            title="Toggle British narration by Emma"
          >
            {audioLoading ? '⏳' : audioEnabled ? (audioMuted ? '🔇' : '🔊') : '🎙️'}
          </button>
          
          {audioEnabled && (
            <>
              <button 
                onClick={toggleAudioMuted} 
                className="audio-btn"
                title="Mute/Unmute"
              >
                {audioMuted ? '🔇' : '🔊'}
              </button>
              
              <button 
                onClick={restartCurrentAudio} 
                className="audio-btn"
                title="Restart current slide audio"
              >
                ↻
              </button>
              
              <div className="audio-speed">
                <button 
                  onClick={() => changeAudioSpeed(0.75)} 
                  className={`speed-btn ${audioSpeed === 0.75 ? 'active' : ''}`}
                >
                  0.75x
                </button>
                <button 
                  onClick={() => changeAudioSpeed(1.0)} 
                  className={`speed-btn ${audioSpeed === 1.0 ? 'active' : ''}`}
                >
                  1x
                </button>
                <button 
                  onClick={() => changeAudioSpeed(1.25)} 
                  className={`speed-btn ${audioSpeed === 1.25 ? 'active' : ''}`}
                >
                  1.25x
                </button>
              </div>
              
              {audioProgress > 0 && (
                <div className="audio-progress">
                  <div 
                    className="audio-progress-bar" 
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
              )}
              
              <div className="audio-credit">
                Narrated by Emma 🇬🇧
              </div>
            </>
          )}
          </div>
        )}
        
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
              <span className="shortcut-description">Mute/Unmute audio</span>
              <div className="shortcut-key">
                <span className="key">M</span>
              </div>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-description">Restart audio</span>
              <div className="shortcut-key">
                <span className="key">R</span>
              </div>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-description">Speed -/+</span>
              <div className="shortcut-key">
                <span className="key">&lt;</span>
                <span className="key">&gt;</span>
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