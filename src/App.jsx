import { useState, useEffect, useRef } from 'react';
import styles from './App.module.css';
import {
  companyInfo,
  aboutUs,
  hsePolicy,
  qaPolicy,
  civilServices,
  vehicleList,
  equipmentList,
  manpowerList,
  completedProjects,
  ongoingProjects
} from './data';

const carouselSlides = [
  {
    id: 1,
    image: '/images/page_11_img_4.jpg',
    title: 'Jafurah GIS Substation (GCP 1)',
    client: 'Larsen & Toubro Saudi Arabia LLC',
    desc: '230 Kv GIS Substation Building and Outdoor Equipment Foundations, Civil and Finishing Works.',
    projectId: 'completed-3',
    tab: 'completed'
  },
  {
    id: 2,
    image: '/images/page_13_img_13.jpg',
    title: 'Jafurah Phase II (GCP 01)',
    client: 'Larsen & Toubro Saudi Arabia LLC',
    desc: '230 kV Substation Building Civil and Finishing works at Jafurah Gas Field.',
    projectId: 'completed-5',
    tab: 'completed'
  },
  {
    id: 3,
    image: '/images/page_10_img_6.jpg',
    title: 'PWIS Substation Building',
    client: 'Larsen & Toubro Saudi Arabia LLC',
    desc: 'Produced Water Injection Station Package 1 - Substation Building Civil and Finishing Works.',
    projectId: 'completed-1',
    tab: 'completed'
  },
  {
    id: 4,
    image: '/images/page_14_img_13.jpg',
    title: 'Fencing & Bollards Civil Works',
    client: 'Larsen & Toubro Saudi Arabia LLC',
    desc: 'Ongoing physical perimeter security and civil utility protection installations.',
    projectId: 'ongoing-1',
    tab: 'ongoing'
  }
];

function App() {
  // Navigation active view state
  const [activeTab, setActiveTab] = useState('default');
  const [scrollTarget, setScrollTarget] = useState(null);

  // Mobile navigation drawer toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Accordion expanded sections state
  const [expandedSections, setExpandedSections] = useState({
    companyProfile: true,
    services: false,
    projects: false,
    compliance: false
  });

  // Selected document to inspect in Compliance tab
  const [selectedDoc, setSelectedDoc] = useState('cr');

  // Selected project in Portfolio tabs
  const [selectedCompletedId, setSelectedCompletedId] = useState('completed-1');
  const [selectedOngoingId, setSelectedOngoingId] = useState('ongoing-1');
  const [lightboxImg, setLightboxImg] = useState(null);

  // Projects filter and sort states
  const [projectSearch, setProjectSearch] = useState('');
  const [projectSort, setProjectSort] = useState('default');

  // Fleet active list tab (vehicles vs equipment)
  const [fleetTab, setFleetTab] = useState('vehicles');

  // Refs for smooth scroll
  const aboutUsRef = useRef(null);

  // Carousel states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Autoplay carousel slide change
  useEffect(() => {
    if (activeTab !== 'default' || isCarouselHovered) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselSlides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeTab, isCarouselHovered]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      setCurrentSlide(prev => (prev + 1) % carouselSlides.length);
    }
    if (isRightSwipe) {
      setCurrentSlide(prev => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleSlideClick = (slide) => {
    setActiveTab(slide.tab);
    if (slide.tab === 'completed') {
      setSelectedCompletedId(slide.projectId);
    } else {
      setSelectedOngoingId(slide.projectId);
    }
    // Wait for the tab to change and render the section
    setTimeout(() => {
      const detailsEl = document.getElementById('project-detail-view');
      if (detailsEl) {
        detailsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  // Toggle sidebar accordion sections
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Switch view tabs and manage scroll targets
  const handleNavClick = (tabName, scrollDest = null) => {
    setIsSidebarOpen(false); // Close mobile drawer if open
    
    if (tabName === 'default') {
      setActiveTab('default');
      if (scrollDest) {
        setScrollTarget(scrollDest);
      }
    } else {
      setActiveTab(tabName);
      setScrollTarget(null);
    }
  };

  // Perform smooth scroll to target refs when active view swaps to default
  useEffect(() => {
    if (activeTab === 'default' && scrollTarget === 'about-us') {
      const targetRef = aboutUsRef;
      if (targetRef.current) {
        setTimeout(() => {
          targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
      setScrollTarget(null);
    }
  }, [activeTab, scrollTarget]);

  // Calculate stats
  const totalVehicles = vehicleList.reduce((acc, curr) => acc + curr.qty, 0);
  const totalEquipment = equipmentList.reduce((acc, curr) => acc + curr.qty, 0);
  const totalManpower = manpowerList.reduce((acc, curr) => acc + curr.qty, 0);
  const totalCompletedValue = "SAR 57.7M+";

  // Helper to render project images in a structured grid
  const renderProjectImages = (images) => {
    if (!images || images.length === 0) return null;
    
    if (images.length === 1) {
      return (
        <div className={styles.projectImagesContainer}>
          <img src={images[0]} className={styles.projectSingleImg} alt="Project work" />
        </div>
      );
    }
    
    if (images.length === 2) {
      return (
        <div className={styles.projectImagesContainer}>
          <div className={styles.projectImgGrid}>
            <img src={images[0]} className={styles.projectMainImg} alt="Project work main" />
            <img src={images[1]} className={styles.projectStackImg} alt="Project work secondary" />
          </div>
        </div>
      );
    }

    // 3 or more images: main image + side stack of 2 images (with +X if more than 3)
    return (
      <div className={styles.projectImagesContainer}>
        <div className={styles.projectImgGrid}>
          <img src={images[0]} className={styles.projectMainImg} alt="Project work main" />
          <div className={styles.projectSideStack}>
            <img src={images[1]} className={styles.projectStackImg} alt="Project work stack 1" />
            {images.length === 3 ? (
              <img src={images[2]} className={styles.projectStackImg} alt="Project work stack 2" />
            ) : (
              <div className={styles.projectStackImgMore}>
                <img src={images[2]} alt="Project work stack 2" />
                <div className={styles.projectOverlayText}>+{images.length - 2}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Mobile top header */}
      <div className={styles.mobileHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/images/logo.png" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} alt="Shasar Arabia Logo" />
          <div>
            <h1 className={styles.brandTitle} style={{ fontSize: '13px', color: 'var(--accent-blue)' }}>Shasar Arabia</h1>
            <span className={styles.brandSubtitle} style={{ fontSize: '8px' }}>Contracting Company</span>
          </div>
        </div>
        <button className={styles.menuToggleBtn} onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
          <svg className={styles.menuIcon} viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
      </div>

      {/* Sidebar overlay for mobile drawer */}
      {isSidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Fixed Left Sidebar Navigation */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <img src="/images/logo.png" className={styles.logoImage} alt="Shasar Arabia Logo" />
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>Shasar Arabia</span>
            <span className={styles.brandSubtitle}>Contracting Company</span>
          </div>
        </div>

        <nav className={styles.navTree}>
          {/* Company Profile Accordion Group */}
          <div className={styles.navGroup}>
            <button 
              className={`${styles.navHeader} ${['default', 'company-info'].includes(activeTab) ? styles.navHeaderActive : ''}`}
              onClick={() => toggleSection('companyProfile')}
            >
              <span>Company Profile</span>
              <svg className={`${styles.arrow} ${expandedSections.companyProfile ? styles.arrowRotated : ''}`} viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </button>
            <div className={`${styles.submenu} ${expandedSections.companyProfile ? styles.submenuOpen : ''}`}>
              <div 
                className={`${styles.navItem} ${activeTab === 'default' ? styles.navItemActive : ''}`}
                onClick={() => handleNavClick('default', 'about-us')}
              >
                About Us
              </div>
              <div 
                className={`${styles.navItem} ${activeTab === 'company-info' ? styles.navItemActive : ''}`}
                onClick={() => handleNavClick('company-info')}
              >
                Company Information
              </div>
            </div>
          </div>

          {/* Capabilities & Services Accordion Group */}
          <div className={styles.navGroup}>
            <button 
              className={`${styles.navHeader} ${['civil-scope', 'fleet', 'manpower'].includes(activeTab) ? styles.navHeaderActive : ''}`}
              onClick={() => toggleSection('services')}
            >
              <span>Capabilities & Services</span>
              <svg className={`${styles.arrow} ${expandedSections.services ? styles.arrowRotated : ''}`} viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </button>
            <div className={`${styles.submenu} ${expandedSections.services ? styles.submenuOpen : ''}`}>
              <div 
                className={`${styles.navItem} ${activeTab === 'civil-scope' ? styles.navItemActive : ''}`}
                onClick={() => handleNavClick('civil-scope')}
              >
                Civil Scope
              </div>
              <div 
                className={`${styles.navItem} ${activeTab === 'fleet' ? styles.navItemActive : ''}`}
                onClick={() => handleNavClick('fleet')}
              >
                Fleet Machinery
              </div>
              <div 
                className={`${styles.navItem} ${activeTab === 'manpower' ? styles.navItemActive : ''}`}
                onClick={() => handleNavClick('manpower')}
              >
                Manpower Assets
              </div>
            </div>
          </div>

          {/* Projects Showroom Accordion Group */}
          <div className={styles.navGroup}>
            <button 
              className={`${styles.navHeader} ${['completed', 'ongoing'].includes(activeTab) ? styles.navHeaderActive : ''}`}
              onClick={() => toggleSection('projects')}
            >
              <span>Projects Showroom</span>
              <svg className={`${styles.arrow} ${expandedSections.projects ? styles.arrowRotated : ''}`} viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </button>
            <div className={`${styles.submenu} ${expandedSections.projects ? styles.submenuOpen : ''}`}>
              <div 
                className={`${styles.navItem} ${activeTab === 'completed' ? styles.navItemActive : ''}`}
                onClick={() => handleNavClick('completed')}
              >
                Completed Portfolio
              </div>
              <div 
                className={`${styles.navItem} ${activeTab === 'ongoing' ? styles.navItemActive : ''}`}
                onClick={() => handleNavClick('ongoing')}
              >
                Ongoing Projects
              </div>
            </div>
          </div>

          {/* Compliance & Registry (Single Section Link) */}
          <div className={styles.navGroup}>
            <button 
              className={`${styles.navHeader} ${activeTab === 'compliance' ? styles.navHeaderActive : ''}`}
              onClick={() => { handleNavClick('compliance'); setSelectedDoc('cr'); }}
            >
              <span>Compliance & Registry</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={styles.canvas}>
        <div className={styles.contentWrapper}>
          
          {/* Default Combined View (About Us stacked on Contact Us) */}
          {activeTab === 'default' && (
            <>
              {/* Hero Banner Section */}
              <div className={styles.heroBanner}>
                <h2 className={styles.heroTitle}>{companyInfo.name}</h2>
                <div style={{ color: '#38bdf8', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>
                  {companyInfo.nameAr}
                </div>
                <p className={styles.heroSubtitle}>
                  A premier industrial general contracting partner in the Kingdom of Saudi Arabia. Specializing in mechanical, civil, and infrastructure works for refineries, petrochemical plants, and large-scale industrial complexes.
                </p>
              </div>

              {/* Interactive Image Slideshow (Carousel) */}
              <div 
                className={styles.carouselContainer}
                onMouseEnter={() => setIsCarouselHovered(true)}
                onMouseLeave={() => setIsCarouselHovered(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  className={styles.carouselSlidesWrapper}
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {carouselSlides.map((slide) => (
                    <div 
                      key={slide.id} 
                      className={styles.carouselSlide}
                      onClick={() => handleSlideClick(slide)}
                    >
                      <img src={slide.image} className={slide.id === 4 ? styles.carouselImgPortrait : styles.carouselImg} alt={slide.title} />
                      <div className={styles.carouselOverlay}>
                        <div className={styles.carouselContent}>
                          <span className={styles.carouselClient}>{slide.client}</span>
                          <h3 className={styles.carouselTitle}>{slide.title}</h3>
                          <p className={styles.carouselDesc}>{slide.desc}</p>
                          <button className={styles.carouselBtn}>
                            View Project Details & Specs
                            <svg viewBox="0 0 24 24" width="16" height="16" style={{ fill: 'currentColor' }}>
                              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Left/Right desktop chevron controls */}
                <button 
                  className={`${styles.carouselControl} ${styles.carouselControlLeft}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(prev => (prev - 1 + carouselSlides.length) % carouselSlides.length);
                  }}
                  aria-label="Previous Slide"
                >
                  &#10094;
                </button>
                <button 
                  className={`${styles.carouselControl} ${styles.carouselControlRight}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(prev => (prev + 1) % carouselSlides.length);
                  }}
                  aria-label="Next Slide"
                >
                  &#10095;
                </button>

                {/* Slide index dots */}
                <div className={styles.carouselDots}>
                  {carouselSlides.map((_, idx) => (
                    <button 
                      key={idx}
                      className={`${styles.carouselDot} ${currentSlide === idx ? styles.carouselDotActive : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide(idx);
                      }}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* General Metrics Bar */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statCardHeader}>
                    <svg className={styles.statIcon} viewBox="0 0 24 24" width="24" height="24">
                      <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17 12H7v-2h10v2zm0 4H7v-2h10v2zM12 8H7V6h5v2z"/>
                    </svg>
                    <span className={styles.statVal}>{totalCompletedValue}</span>
                  </div>
                  <span className={styles.statLabel}>Completed Projects</span>
                  <span className={styles.statDesc}>High-scale industrial deliverables</span>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statCardHeader}>
                    <svg className={styles.statIcon} viewBox="0 0 24 24" width="24" height="24">
                      <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                    <span className={styles.statVal}>{totalManpower}</span>
                  </div>
                  <span className={styles.statLabel}>Staff & Skilled Force</span>
                  <span className={styles.statDesc}>100% Aramco-certified standard team</span>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statCardHeader}>
                    <svg className={styles.statIcon} viewBox="0 0 24 24" width="24" height="24">
                      <path fill="currentColor" d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm12 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1-5.5h-3V9h3v4z"/>
                    </svg>
                    <span className={styles.statVal}>{totalVehicles + totalEquipment}</span>
                  </div>
                  <span className={styles.statLabel}>Fleet & Heavy Assets</span>
                  <span className={styles.statDesc}>Dump trucks, loaders, excavators</span>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statCardHeader}>
                    <svg className={styles.statIcon} viewBox="0 0 24 24" width="24" height="24">
                      <path fill="currentColor" d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4.02-2.52 7.74-6 8.78-3.48-1.04-6-4.76-6-8.78V6.15l6-2.25 6 2.25v4.94zM8.5 12.5l1.5-1.5 2 2 4.5-4.5 1.5 1.5-6 6-3.5-3.5z"/>
                    </svg>
                    <span className={styles.statVal}>4+</span>
                  </div>
                  <span className={styles.statLabel}>ISO Audited Standards</span>
                  <span className={styles.statDesc}>Certified Quality & HSE management</span>
                </div>
              </div>

              {/* Trusted by Industry Leaders Logo Marquee */}
              <div className={styles.marqueeContainer}>
                <h3 className={styles.marqueeTitle}>Trusted by Major Enterprises</h3>
                <div className={styles.marqueeTrack}>
                  <div className={styles.marqueeContent}>
                    <div className={styles.logoBadge}>Saudi Aramco</div>
                    <div className={styles.logoBadge}>SABIC</div>
                    <div className={styles.logoBadge}>SEC</div>
                    <div className={styles.logoBadge}>Ma'aden</div>
                    {/* Duplicate for infinite loop effect */}
                    <div className={styles.logoBadge}>Saudi Aramco</div>
                    <div className={styles.logoBadge}>SABIC</div>
                    <div className={styles.logoBadge}>SEC</div>
                    <div className={styles.logoBadge}>Ma'aden</div>
                  </div>
                </div>
              </div>

              {/* About Us Sub-Section (Ref target) */}
              <section ref={aboutUsRef} id="about-us" className={styles.section}>
                <div className={styles.aboutZigZagContainer}>
                  {/* Row 1: Image on Left / Text on Right */}
                  <div className={styles.aboutZigZagRow}>
                    {/* Left Column: Image */}
                    <div className={styles.aboutZigZagImgWrapper}>
                      <img 
                        src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop" 
                        className={styles.aboutZigZagImg} 
                        alt="Industrial Earthworks & Excavation" 
                      />
                    </div>
                    {/* Right Column: Title and Paragraph 0 & 1 */}
                    <div className={styles.aboutZigZagTextCol}>
                      <div className={styles.sectionHeader} style={{ marginBottom: '16px' }}>
                        <div className={styles.sectionAccent}></div>
                        <h2 className={styles.sectionTitle}>About Shasar Arabia</h2>
                      </div>
                      <div className={styles.aboutText}>
                        <p className={styles.highlightParagraph}>{aboutUs.paragraphs[0]}</p>
                        <p>{aboutUs.paragraphs[1]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Text on Left / Image on Right */}
                  <div className={`${styles.aboutZigZagRow} ${styles.alternateRow}`}>
                    {/* Left Column: Paragraphs 2 & 3 */}
                    <div className={styles.aboutZigZagTextCol}>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '12px', color: 'var(--text-primary)' }}>
                        Proven Field Expertise
                      </h3>
                      <div className={styles.aboutText}>
                        <p>{aboutUs.paragraphs[2]}</p>
                        <p>{aboutUs.paragraphs[3]}</p>
                      </div>
                    </div>
                    {/* Right Column: Image */}
                    <div className={styles.aboutZigZagImgWrapper}>
                      <img 
                        src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop" 
                        className={styles.aboutZigZagImg} 
                        alt="Civil Concrete Foundation works" 
                      />
                    </div>
                  </div>

                  {/* Row 3: Image on Left / Text on Right */}
                  <div className={styles.aboutZigZagRow}>
                    {/* Left Column: Image */}
                    <div className={styles.aboutZigZagImgWrapper}>
                      <img 
                        src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop" 
                        className={styles.aboutZigZagImg} 
                        alt="Industrial Plant Rigging & Heavy Assets" 
                      />
                    </div>
                    {/* Right Column: Paragraph 4 */}
                    <div className={styles.aboutZigZagTextCol}>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '12px', color: 'var(--text-primary)' }}>
                        Executing Client Commitments
                      </h3>
                      <div className={styles.aboutText}>
                        <p>{aboutUs.paragraphs[4]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Text on Left / Image on Right */}
                  <div className={`${styles.aboutZigZagRow} ${styles.alternateRow}`}>
                    {/* Left Column: Paragraph 5 & Trusted enterprise sub-heading */}
                    <div className={styles.aboutZigZagTextCol}>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '12px', color: 'var(--text-primary)' }}>
                        Enterprise Partnerships
                      </h3>
                      <div className={styles.aboutText}>
                        <p>{aboutUs.paragraphs[5]}</p>
                      </div>
                      
                      {/* Trusted Enterprise Standards */}
                      <div className={styles.trustedStandardsSection} style={{ marginTop: '20px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>
                          Trusted by Industry Leaders
                        </h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', fontWeight: '700' }}>
                          Executing civil and infrastructure works that meet the strict compliance and safety benchmarks demanded by enterprise giants like Saudi Aramco, SABIC, SEC, and Ma'aden.
                        </p>
                      </div>
                    </div>
                    {/* Right Column: Image */}
                    <div className={styles.aboutZigZagImgWrapper}>
                      <img 
                        src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop" 
                        className={styles.aboutZigZagImg} 
                        alt="Mechanical Piping Inspection" 
                      />
                    </div>
                  </div>
                </div>

                {/* Vision, Mission & Core Values Row */}
                <div className={styles.visionMissionValuesRow} style={{ marginTop: '56px' }}>
                  <div className={styles.sectionHeader} style={{ marginBottom: '24px' }}>
                    <div className={styles.sectionAccent}></div>
                    <h2 className={styles.sectionTitle}>Vision, Mission & Core Values</h2>
                  </div>
                  
                  <div className={styles.vmvGrid}>
                    {/* Left Column: Text */}
                    <div className={styles.vmvTextCol}>
                      <div style={{ marginBottom: '28px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '10px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Corporate Vision
                        </h3>
                        <p className={styles.sectionParagraph}>
                          To establish Shasar Arabia as a leading benchmark for industrial contracting, civil engineering, and infrastructure development in the region. We aim to inspire trust and construct progress through sustainable engineering methods, advanced project management, and absolute dedication to environmental stewardship.
                        </p>
                      </div>

                      <div style={{ marginBottom: '36px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '10px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Operational Mission
                        </h3>
                        <p className={styles.sectionParagraph}>
                          To execute complex projects with excellence, delivering superior value and reliability to our clients. We strive to foster long-term partnerships by executing work efficiently, maintaining strict timelines, and cultivating a high-performance culture that embraces safety and innovation at every level.
                        </p>
                      </div>

                      <div>
                        <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '20px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Core Engineering Values
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div className={styles.valueBlock}>
                            <span className={styles.valueLabel}>Community First</span>
                            <p className={styles.valueText}>Fostering local partnerships, encouraging knowledge transfer, and actively supporting regional growth.</p>
                          </div>
                          <div className={styles.valueBlock}>
                            <span className={styles.valueLabel}>Engineering Reliability</span>
                            <p className={styles.valueText}>Executing projects precisely on schedule with unmatched structural dependability and compliance.</p>
                          </div>
                          <div className={styles.valueBlock}>
                            <span className={styles.valueLabel}>Uncompromising Integrity</span>
                            <p className={styles.valueText}>Conducting business with absolute transparency, honesty, and ethical practices across all stakeholders.</p>
                          </div>
                          <div className={styles.valueBlock}>
                            <span className={styles.valueLabel}>Zero-Harm Safety</span>
                            <p className={styles.valueText}>Maintaining an ironclad zero-compromise approach toward health, environmental hazards, and site safety.</p>
                          </div>
                          <div className={styles.valueBlock} style={{ marginBottom: 0 }}>
                            <span className={styles.valueLabel}>Flawless Quality</span>
                            <p className={styles.valueText}>Adhering strictly to international QA/QC specifications to deliver defect-free infrastructure at the first attempt.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Visual */}
                    <div className={styles.vmvVisualCol}>
                      <img 
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" 
                        className={styles.vmvImg} 
                        alt="Visionary Glass and Steel Infrastructure Landmark" 
                      />
                    </div>
                  </div>
                </div>

                {/* HSE Commitment & Quality Assurance Row */}
                <div className={styles.complianceValuesRow} style={{ marginTop: '56px' }}>
                  <div className={styles.sectionHeader} style={{ marginBottom: '24px' }}>
                    <div className={styles.sectionAccent}></div>
                    <h2 className={styles.sectionTitle}>HSE Commitment & Quality Assurance</h2>
                  </div>
                  
                  <div className={styles.compGrid}>
                    {/* Left Column: Visual */}
                    <div className={styles.compVisualCol}>
                      <img 
                        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop" 
                        className={styles.compImg} 
                        alt="Industrial Engineer Carrying Out QA/QC Welded Joint Safety Audit" 
                      />
                    </div>

                    {/* Right Column: Text */}
                    <div className={styles.compTextCol}>
                      <div style={{ marginBottom: '36px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '10px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Health, Safety & Environment (HSE) Policy
                        </h3>
                        <p className={styles.sectionParagraph}>
                          Our HSE policy is driven by a deep commitment to protecting human lives and preserving natural habitats. Operating under a rigorous 'Target Zero' incident framework, we ensure that every worker is comprehensively trained, every risk is systematically mapped, and every construction site is equipped with state-of-the-art hazard prevention systems. We believe that a safe workplace is the absolute foundation of structural excellence.
                        </p>
                      </div>

                      <div>
                        <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '10px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Quality Assurance & Quality Control (QA/QC)
                        </h3>
                        <p className={styles.sectionParagraph}>
                          Quality is built into every phase of our construction lifecycle, from material sourcing to final engineering verification. Our QA/QC framework follows strict ISO compliance, deploying certified inspectors to audit structural foundations, mechanical setups, and concrete formulations. By conducting rigorous non-destructive testing (NDT) and structural audits, we guarantee that all deliverables exceed municipal, national, and client-specific standards.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Corporate Matrix Table (Untouched, placed below) */}
                <div className={styles.quickDetailsCard} style={{ marginTop: '48px' }}>
                  <h3 className={styles.quickTitle}>Corporate Matrix</h3>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Founded</span>
                    <span className={styles.detailVal}>2022</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Corporate HQ</span>
                    <span className={styles.detailVal}>Al Khobar, Saudi Arabia</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Aramco Vendor ID</span>
                    <span className={styles.detailVal} style={{ color: 'var(--accent-blue)' }}>{companyInfo.registry.aramcoVendorId}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>SEC Bidder ID</span>
                    <span className={styles.detailVal} style={{ color: 'var(--accent-blue)' }}>{companyInfo.registry.secVendorId}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Certifications</span>
                    <span className={styles.detailVal}>ISO 9001 / 14001 / 45001</span>
                  </div>
                </div>
              </section>


            </>
          )}

          {/* Company Information View */}
          {activeTab === 'company-info' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionAccent}></div>
                <h2 className={styles.sectionTitle}>Company Information</h2>
              </div>
              <div className={styles.heroBanner}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: 'var(--accent-blue)' }}>Corporate Registry Registry</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div className={styles.detailRow} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <span className={styles.detailLabel}>Official Company Name</span>
                    <span className={styles.detailVal}>{companyInfo.name}</span>
                  </div>
                  <div className={styles.detailRow} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <span className={styles.detailLabel}>Chamber of Commerce No</span>
                    <span className={styles.detailVal} style={{ fontFamily: 'var(--mono)', fontSize: '15px' }}>{companyInfo.registry.chamberOfCommerce}</span>
                  </div>
                  <div className={styles.detailRow} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <span className={styles.detailLabel}>Commercial Registration</span>
                    <span className={styles.detailVal} style={{ fontFamily: 'var(--mono)', fontSize: '15px' }}>{companyInfo.registry.commercialRegistration} (Issued: {companyInfo.registry.crDate})</span>
                  </div>
                  <div className={styles.detailRow} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <span className={styles.detailLabel}>VAT Registration No</span>
                    <span className={styles.detailVal} style={{ fontFamily: 'var(--mono)', fontSize: '15px' }}>{companyInfo.registry.vatRegistration}</span>
                  </div>
                  <div className={styles.detailRow} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <span className={styles.detailLabel}>Zakat Certification Code</span>
                    <span className={styles.detailVal} style={{ fontFamily: 'var(--mono)', fontSize: '15px' }}>{companyInfo.registry.zakatCert}</span>
                  </div>
                  <div className={styles.detailRow} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <span className={styles.detailLabel}>GOSI Registry No</span>
                    <span className={styles.detailVal} style={{ fontFamily: 'var(--mono)', fontSize: '15px' }}>{companyInfo.registry.gosiNumber}</span>
                  </div>
                  <div className={styles.detailRow} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <span className={styles.detailLabel}>Saudi Aramco Vendor ID</span>
                    <span className={styles.detailVal} style={{ color: 'var(--accent-blue)', fontFamily: 'var(--mono)', fontSize: '15px' }}>{companyInfo.registry.aramcoVendorId}</span>
                  </div>
                  <div className={styles.detailRow} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <span className={styles.detailLabel}>Saudi Electricity Vendor ID</span>
                    <span className={styles.detailVal} style={{ color: 'var(--accent-blue)', fontFamily: 'var(--mono)', fontSize: '15px' }}>{companyInfo.registry.secVendorId}</span>
                  </div>
                </div>
              </div>
            </section>
          )}


          {/* Civil Scope View */}
          {activeTab === 'civil-scope' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionAccent}></div>
                <h2 className={styles.sectionTitle}>Civil Engineering Scope</h2>
              </div>
              <p style={{ marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '15px' }}>
                Shasar Arabia Contracting is fully equipped to deliver high-quality civil services across residential, industrial, commercial, and petrochemical infrastructure sectors in the Kingdom.
              </p>
              <div className={styles.servicesGrid}>
                {civilServices.map((service, index) => (
                  <div key={index} className={styles.serviceItem}>
                    <span className={styles.serviceNumber}>{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.serviceText}>{service}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Fleet Machinery View */}
          {activeTab === 'fleet' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionAccent}></div>
                <h2 className={styles.sectionTitle}>Fleet & Machinery Assets</h2>
              </div>
              <div className={styles.fleetTabs}>
                <button 
                  className={`${styles.tabBtn} ${fleetTab === 'vehicles' ? styles.tabBtnActive : ''}`}
                  onClick={() => setFleetTab('vehicles')}
                >
                  Heavy Vehicles ({totalVehicles})
                </button>
                <button 
                  className={`${styles.tabBtn} ${fleetTab === 'equipment' ? styles.tabBtnActive : ''}`}
                  onClick={() => setFleetTab('equipment')}
                >
                  Machinery & Equipment ({totalEquipment})
                </button>
              </div>

              {fleetTab === 'vehicles' ? (
                <div className={styles.fleetGrid}>
                  {vehicleList.map((veh, i) => (
                    <div key={i} className={styles.fleetCard}>
                      <span className={styles.fleetName}>{veh.name}</span>
                      <span className={styles.fleetQty}>{veh.qty} Units</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.fleetGrid}>
                  {equipmentList.map((eq, i) => (
                    <div key={i} className={styles.fleetCard}>
                      <span className={styles.fleetName}>{eq.name}</span>
                      <span className={styles.fleetQty}>{eq.qty} Units</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Manpower Assets View */}
          {activeTab === 'manpower' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionAccent}></div>
                <h2 className={styles.sectionTitle}>Manpower Assets</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '15px' }}>
                Our manpower is our greatest asset, comprising a highly skilled, certified, and experienced team committed to safety and project excellence.
              </p>
              <div className={styles.manpowerGrid}>
                <div className={styles.manpowerStats}>
                  <div className={styles.manpowerOverviewCard}>
                    <div className={styles.manpowerOverviewHeader}>
                      <h3 className={styles.manpowerOverviewTitle}>Allocation Summary</h3>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Total Personnel Force</span>
                      <span className={styles.detailVal} style={{ fontSize: '28px', color: 'var(--accent-blue)' }}>{totalManpower} Staff</span>
                    </div>
                    <div className={styles.manpowerChart}>
                      <div className={styles.chartRow}>
                        <div className={styles.chartRowLabels}>
                          <span>Management</span>
                          <span>3 Staff</span>
                        </div>
                        <div className={styles.chartBarWrapper}>
                          <div className={styles.chartBar} style={{ width: `${(3/totalManpower)*100}%` }}></div>
                        </div>
                      </div>
                      <div className={styles.chartRow}>
                        <div className={styles.chartRowLabels}>
                          <span>Engineering / Site QA</span>
                          <span>8 Staff</span>
                        </div>
                        <div className={styles.chartBarWrapper}>
                          <div className={styles.chartBar} style={{ width: `${(8/totalManpower)*100}%` }}></div>
                        </div>
                      </div>
                      <div className={styles.chartRow}>
                        <div className={styles.chartRowLabels}>
                          <span>Skilled Labor Force</span>
                          <span>152 Workers</span>
                        </div>
                        <div className={styles.chartBarWrapper}>
                          <div className={styles.chartBar} style={{ width: `${(152/totalManpower)*100}%` }}></div>
                        </div>
                      </div>
                      <div className={styles.chartRow}>
                        <div className={styles.chartRowLabels}>
                          <span>Safety / HSE Officers</span>
                          <span>9 Staff</span>
                        </div>
                        <div className={styles.chartBarWrapper}>
                          <div className={styles.chartBar} style={{ width: `${(9/totalManpower)*100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.manpowerTableWrapper}>
                  <table className={styles.manpowerTable}>
                    <thead>
                      <tr>
                        <th>Role / Designation</th>
                        <th>Standard Quantity</th>
                        <th>Classification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manpowerList.map((m, i) => (
                        <tr key={i}>
                          <td className={styles.manpowerRole}>{m.role}</td>
                          <td style={{ fontFamily: 'var(--mono)', fontWeight: '700' }}>{m.qty} Personnel</td>
                          <td>
                            <span className={`${styles.manpowerTag} ${
                              m.type === 'Management' ? styles.tagManagement :
                              m.type === 'Engineering' ? styles.tagEngineering :
                              m.type === 'Supervision' ? styles.tagSupervision :
                              m.type === 'Safety' ? styles.tagSafety :
                              m.type === 'Skilled Labor' ? styles.tagSkilledLabor :
                              m.type === 'Logistics' ? styles.tagLogistics :
                              m.type === 'Support' ? styles.tagSupport : styles.tagLabor
                            }`}>
                              {m.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Completed Portfolio View */}
          {/* Completed Portfolio View */}
          {activeTab === 'completed' && (() => {
            const selectedProject = completedProjects.find(p => p.id === selectedCompletedId) || completedProjects[0];
            return (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionAccent}></div>
                  <h2 className={styles.sectionTitle}>Completed Projects Portfolio</h2>
                </div>
                
                <div className={styles.projectSplitLayout}>
                  {/* Master List (Left Column) */}
                  <div className={styles.projectMasterList}>
                    {completedProjects.map((p) => (
                      <button 
                        key={p.id}
                        className={`${styles.projectSelectorCard} ${selectedCompletedId === p.id ? styles.projectSelectorCardActive : ''}`}
                        onClick={() => setSelectedCompletedId(p.id)}
                      >
                        <div className={styles.cardThumbnailContainer}>
                          {p.images && p.images.length > 0 ? (
                            <img src={p.images[0]} className={styles.cardThumbnail} alt="" />
                          ) : (
                            <div className={styles.cardThumbnailPlaceholder}>
                              <svg viewBox="0 0 24 24" width="24" height="24" className={styles.placeholderIcon}>
                                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5.5 14.5L11 14l-2.5 3.5h10l-3-4-2 3.5z"/>
                              </svg>
                              <span style={{ fontSize: '9px', fontWeight: 600 }}>NO PHOTOGRAPH</span>
                            </div>
                          )}
                        </div>
                        <div className={styles.projectSelectorHeader}>
                          <span className={styles.projectSelectorClient}>{p.client}</span>
                          <span className={styles.projectSelectorIndex}>#{p.index}</span>
                        </div>
                        <span className={styles.projectSelectorTitle}>{p.name}</span>
                        <div className={styles.projectSelectorMeta}>
                          <span>{p.value}</span>
                          <span>•</span>
                          <span>{p.location}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Detail View (Right Column) */}
                  <div className={styles.projectDetailView}>
                    <div className={styles.projectDetailHeader}>
                      <span className={styles.projectDetailClientLabel}>{selectedProject.client}</span>
                      <h3 className={styles.projectDetailTitle}>{selectedProject.name}</h3>
                    </div>
                    
                    <div className={styles.projectSpecsTable}>
                      <div className={styles.projectSpecRow}>
                        <span className={styles.projectSpecLabel}>Project Value / Scale</span>
                        <span className={styles.projectSpecVal} style={{ color: 'var(--accent-blue)', fontWeight: 800 }}>{selectedProject.value}</span>
                      </div>
                      <div className={styles.projectSpecRow}>
                        <span className={styles.projectSpecLabel}>Execution Site Location</span>
                        <span className={styles.projectSpecVal}>{selectedProject.location}</span>
                      </div>
                      <div className={styles.projectSpecRow}>
                        <span className={styles.projectSpecLabel}>Contract Scope of Work</span>
                        <span className={styles.projectSpecVal}>{selectedProject.scope}</span>
                      </div>
                    </div>

                    <h4 className={styles.galleryTitle}>Project Scans & Proof Portfolio</h4>
                    {selectedProject.images && selectedProject.images.length > 0 ? (
                      <div className={styles.galleryGrid}>
                        {selectedProject.images.map((imgUrl, idx) => (
                          <div key={idx} className={styles.galleryItem} onClick={() => setLightboxImg(imgUrl)}>
                            <img src={imgUrl} className={styles.galleryImg} alt={`${selectedProject.name} scan ${idx + 1}`} />
                            <div className={styles.galleryZoomOverlay}>
                              <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="white" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.noImagesNotice}>
                        No photograph scan available in the official company profile for this project.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          })()}

          {/* Ongoing Projects View */}
          {activeTab === 'ongoing' && (() => {
            const selectedProject = ongoingProjects.find(p => p.id === selectedOngoingId) || ongoingProjects[0];
            return (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionAccent}></div>
                  <h2 className={styles.sectionTitle}>Ongoing Works & RFPs</h2>
                </div>

                <div className={styles.projectSplitLayout}>
                  {/* Master List (Left Column) */}
                  <div className={styles.projectMasterList}>
                    {ongoingProjects.map((p) => (
                      <button 
                        key={p.id}
                        className={`${styles.projectSelectorCard} ${selectedOngoingId === p.id ? styles.projectSelectorCardActive : ''}`}
                        onClick={() => setSelectedOngoingId(p.id)}
                      >
                        <div className={styles.cardThumbnailContainer}>
                          {p.images && p.images.length > 0 ? (
                            <img src={p.images[0]} className={styles.cardThumbnail} alt="" />
                          ) : (
                            <div className={styles.cardThumbnailPlaceholder}>
                              <svg viewBox="0 0 24 24" width="24" height="24" className={styles.placeholderIcon}>
                                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5.5 14.5L11 14l-2.5 3.5h10l-3-4-2 3.5z"/>
                              </svg>
                              <span style={{ fontSize: '9px', fontWeight: 600 }}>NO PHOTOGRAPH</span>
                            </div>
                          )}
                        </div>
                        <div className={styles.projectSelectorHeader}>
                          <span className={styles.projectSelectorClient}>{p.client}</span>
                          <span className={styles.projectSelectorIndex}>Ongoing</span>
                        </div>
                        <span className={styles.projectSelectorTitle}>{p.name}</span>
                        <div className={styles.projectSelectorMeta}>
                          <span>{p.value}</span>
                          <span>•</span>
                          <span>{p.location}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Detail View (Right Column) */}
                  <div className={styles.projectDetailView}>
                    <div className={styles.projectDetailHeader}>
                      <span className={styles.projectDetailClientLabel}>{selectedProject.client}</span>
                      <h3 className={styles.projectDetailTitle}>{selectedProject.name}</h3>
                    </div>

                    <div className={styles.projectSpecsTable}>
                      <div className={styles.projectSpecRow}>
                        <span className={styles.projectSpecLabel}>Project Value / Scale</span>
                        <span className={styles.projectSpecVal} style={{ color: 'var(--accent-blue)', fontWeight: 800 }}>{selectedProject.value}</span>
                      </div>
                      <div className={styles.projectSpecRow}>
                        <span className={styles.projectSpecLabel}>Execution Site Location</span>
                        <span className={styles.projectSpecVal}>{selectedProject.location}</span>
                      </div>
                      <div className={styles.projectSpecRow}>
                        <span className={styles.projectSpecLabel}>Works Underway</span>
                        <span className={styles.projectSpecVal}>{selectedProject.scope}</span>
                      </div>
                    </div>

                    <h4 className={styles.galleryTitle}>Project Scans & Proof Portfolio</h4>
                    {selectedProject.images && selectedProject.images.length > 0 ? (
                      <div className={styles.galleryGrid}>
                        {selectedProject.images.map((imgUrl, idx) => (
                          <div key={idx} className={styles.galleryItem} onClick={() => setLightboxImg(imgUrl)}>
                            <img src={imgUrl} className={styles.galleryImg} alt={`${selectedProject.name} scan ${idx + 1}`} />
                            <div className={styles.galleryZoomOverlay}>
                              <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="white" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.noImagesNotice}>
                        No photograph scan available in the official company profile for this project.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          })()}

          {/* Compliance & Registry Sub-Options */}
          {activeTab === 'compliance' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionAccent}></div>
                <h2 className={styles.sectionTitle}>Compliance & Government Registry</h2>
              </div>
              <p className={styles.complianceIntro}>
                Shasar Arabia Contracting operates in absolute compliance with municipal, ministerial, and utility requirements in KSA. Click any credential below to verify the electronic proof scan.
              </p>

              <div className={styles.certificatesGrid}>
                <div 
                  className={`${styles.certificateCard} ${selectedDoc === 'cr' ? styles.certCardHovered : ''}`} 
                  onClick={() => setSelectedDoc('cr')}
                >
                  <div className={styles.certHeader}>
                    <span className={`${styles.certBadge} ${styles.certBadgeActive}`}>Active</span>
                    <svg className={styles.certIcon} viewBox="0 0 24 24">
                      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v-2zm3-4H7v-2h10v-2zm0-4H7V7h10v2z" />
                    </svg>
                  </div>
                  <h3 className={styles.certTitle}>Commercial Registry</h3>
                  <div className={styles.certDetails}>
                    <span>No: {companyInfo.registry.commercialRegistration}</span>
                    <span>Class: Limited Liability (LLC)</span>
                  </div>
                  <button className={styles.certBtn}>Verify Certificate</button>
                </div>

                <div 
                  className={`${styles.certificateCard} ${selectedDoc === 'vat' ? styles.certCardHovered : ''}`} 
                  onClick={() => setSelectedDoc('vat')}
                >
                  <div className={styles.certHeader}>
                    <span className={`${styles.certBadge} ${styles.certBadgeActive}`}>Registered</span>
                    <svg className={styles.certIcon} viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.25z" />
                    </svg>
                  </div>
                  <h3 className={styles.certTitle}>VAT Certificate</h3>
                  <div className={styles.certDetails}>
                    <span>No: {companyInfo.registry.vatRegistration}</span>
                    <span>VAT Registration Authority</span>
                  </div>
                  <button className={styles.certBtn}>Verify Certificate</button>
                </div>

                <div 
                  className={`${styles.certificateCard} ${selectedDoc === 'address' ? styles.certCardHovered : ''}`} 
                  onClick={() => setSelectedDoc('address')}
                >
                  <div className={styles.certHeader}>
                    <span className={`${styles.certBadge} ${styles.certBadgeActive}`}>Verified</span>
                    <svg className={styles.certIcon} viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <h3 className={styles.certTitle}>National Address</h3>
                  <div className={styles.certDetails}>
                    <span>Building: 3240, Al Khobar</span>
                    <span>Official SPL Registry</span>
                  </div>
                  <button className={styles.certBtn}>Verify Address</button>
                </div>

                <div 
                  className={`${styles.certificateCard} ${selectedDoc === 'vendor' ? styles.certCardHovered : ''}`} 
                  onClick={() => setSelectedDoc('vendor')}
                >
                  <div className={styles.certHeader}>
                    <span className={`${styles.certBadge} ${styles.certBadgeActive}`}>Approved</span>
                    <svg className={styles.certIcon} viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 15l-4-4 1.41-1.41L10 13.17l7.59-7.59L19 7l-9 9z" />
                    </svg>
                  </div>
                  <h3 className={styles.certTitle}>Vendor Approvals</h3>
                  <div className={styles.certDetails}>
                    <span>Aramco Code: {companyInfo.registry.aramcoVendorId}</span>
                    <span>SEC Bidder: {companyInfo.registry.secVendorId}</span>
                  </div>
                  <button className={styles.certBtn}>Verify Letter</button>
                </div>

                <div 
                  className={`${styles.certificateCard} ${selectedDoc === 'iso' ? styles.certCardHovered : ''}`} 
                  onClick={() => setSelectedDoc('iso')}
                >
                  <div className={styles.certHeader}>
                    <span className={`${styles.certBadge} ${styles.certBadgeActive}`}>Compliant</span>
                    <svg className={styles.certIcon} viewBox="0 0 24 24">
                      <path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm1-15h-2v6h2V7zm0 8h-2v2h2v-2z" />
                    </svg>
                  </div>
                  <h3 className={styles.certTitle}>ISO Registry</h3>
                  <div className={styles.certDetails}>
                    <span>9001, 14001, 45001</span>
                    <span>Quality, Environment, safety</span>
                  </div>
                  <button className={styles.certBtn}>Verify Registry</button>
                </div>
              </div>

              {/* Certificate Scan Viewer */}
              {selectedDoc && (
                <div className={styles.documentViewer}>
                  <div className={styles.documentHeader}>
                    <span className={styles.documentTitle}>
                      Government Proof Document Scan: {selectedDoc.toUpperCase()}
                    </span>
                    <button className={styles.documentCloseBtn} onClick={() => setSelectedDoc(null)}>Close Viewer</button>
                  </div>

                  <div className={styles.actualDocumentImgContainer}>
                    {selectedDoc === 'cr' && (
                      <img src="/images/page_15_img_1.png" className={styles.actualDocumentImg} alt="Commercial Registration Certificate" />
                    )}
                    {selectedDoc === 'vat' && (
                      <img src="/images/page_16_img_1.jpg" className={styles.actualDocumentImg} alt="VAT Registration Certificate" />
                    )}
                    {selectedDoc === 'address' && (
                      <img src="/images/page_17_img_1.jpg" className={styles.actualDocumentImg} alt="SPL National Address Details" />
                    )}
                    {selectedDoc === 'vendor' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', color: 'var(--text-secondary)' }}>Saudi Aramco Registration Letter</div>
                        <img src="/images/page_18_img_1.jpg" className={styles.actualDocumentImg} alt="Saudi Aramco Vendor Registration Approval" />
                        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', color: 'var(--text-secondary)', marginTop: '20px' }}>Saudi Electricity Bidder Approval</div>
                        <img src="/images/page_19_img_1.png" className={styles.actualDocumentImg} alt="Saudi Electricity Partner Registration" />
                      </div>
                    )}
                    {selectedDoc === 'iso' && (
                      <img src="/images/page_20_img_1.jpg" className={styles.actualDocumentImg} alt="ISO Certifications Proofs" />
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

        </div>

        {/* Global Sub-Footer Component */}
        <footer className={styles.footer}>
          {/* Footer Contact Details Row */}
          <div className={styles.footerContactGrid}>
            <div className={styles.footerContactItem} style={{ gridColumn: 'span 2' }}>
              <span className={styles.footerLabel}>Corporate Headquarters</span>
              <span className={styles.footerContactValue}>{companyInfo.address}</span>
            </div>
            <div className={styles.footerContactItem}>
              <span className={styles.footerLabel}>Hotlines & Communications</span>
              <div className={styles.footerContactList}>
                {companyInfo.contacts.map((c, i) => (
                  <span key={i} className={styles.footerContactValue}>
                    {c.value} <span className={styles.footerContactType}>({c.type})</span>
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.footerContactItem}>
              <span className={styles.footerLabel}>Electronic Inquiry</span>
              <a href={`mailto:${companyInfo.email}`} className={styles.footerContactValue} style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>
                {companyInfo.email}
              </a>
            </div>
          </div>

          <div className={styles.footerDivider}></div>

          {/* Footer Registry Grid */}
          <div className={styles.footerGrid}>
            <div className={styles.footerItem}>
              <span className={styles.footerLabel}>Commercial Registration</span>
              <span className={styles.footerValue}>{companyInfo.registry.commercialRegistration}</span>
            </div>
            <div className={styles.footerItem}>
              <span className={styles.footerLabel}>Aramco Vendor No</span>
              <span className={styles.footerValue}>{companyInfo.registry.aramcoVendorId}</span>
            </div>
            <div className={styles.footerItem}>
              <span className={styles.footerLabel}>SEC Bidder No</span>
              <span className={styles.footerValue}>{companyInfo.registry.secVendorId}</span>
            </div>
            <div className={styles.footerItem}>
              <span className={styles.footerLabel}>Chamber of Commerce</span>
              <span className={styles.footerValue}>{companyInfo.registry.chamberOfCommerce}</span>
            </div>
            <div className={styles.footerItem}>
              <span className={styles.footerLabel}>VAT Registry</span>
              <span className={styles.footerValue}>{companyInfo.registry.vatRegistration}</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Lightbox Overlay */}
      {lightboxImg && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxImg(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImg} className={styles.lightboxImg} alt="Enlarged project proof scan" />
            <button className={styles.lightboxCloseBtn} onClick={() => setLightboxImg(null)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
