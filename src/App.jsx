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
              className={`${styles.navHeader} ${['default', 'company-info', 'vision-values', 'hse-qa'].includes(activeTab) ? styles.navHeaderActive : ''}`}
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
              <div 
                className={`${styles.navItem} ${activeTab === 'vision-values' ? styles.navItemActive : ''}`}
                onClick={() => handleNavClick('vision-values')}
              >
                Vision & Core Values
              </div>
              <div 
                className={`${styles.navItem} ${activeTab === 'hse-qa' ? styles.navItemActive : ''}`}
                onClick={() => handleNavClick('hse-qa')}
              >
                HSE & QA Policies
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
                <div style={{ color: 'var(--accent-blue)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>
                  {companyInfo.nameAr}
                </div>
                <p className={styles.heroSubtitle}>
                  A premier industrial general contracting partner in the Kingdom of Saudi Arabia. Specializing in mechanical, civil, and infrastructure works for refineries, petrochemical plants, and large-scale industrial complexes.
                </p>
              </div>

              {/* General Metrics Bar */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statVal}>{totalCompletedValue}</span>
                  <span className={styles.statLabel}>Completed Projects</span>
                  <span className={styles.statDesc}>High-scale industrial deliverables</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statVal}>{totalManpower}</span>
                  <span className={styles.statLabel}>Staff & Skilled Force</span>
                  <span className={styles.statDesc}>100% Aramco-certified standard team</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statVal}>{totalVehicles + totalEquipment}</span>
                  <span className={styles.statLabel}>Fleet & Heavy Assets</span>
                  <span className={styles.statDesc}>Dump trucks, loaders, excavators</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statVal}>4+</span>
                  <span className={styles.statLabel}>ISO Audited Standards</span>
                  <span className={styles.statDesc}>Certified Quality & HSE management</span>
                </div>
              </div>

              {/* About Us Sub-Section (Ref target) */}
              <section ref={aboutUsRef} id="about-us" className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionAccent}></div>
                  <h2 className={styles.sectionTitle}>About Shasar Arabia</h2>
                </div>
                <div className={styles.profileGrid}>
                  <div className={styles.aboutText}>
                    <p className={styles.highlightParagraph}>{aboutUs.paragraphs[0]}</p>
                    <p>{aboutUs.paragraphs[1]}</p>
                    <p>{aboutUs.paragraphs[2]}</p>
                    <p>{aboutUs.paragraphs[3]}</p>
                    <p>{aboutUs.paragraphs[4]}</p>
                    <p>{aboutUs.paragraphs[5]}</p>
                  </div>
                  <div className={styles.quickDetailsCard}>
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

          {/* Vision & Core Values View */}
          {activeTab === 'vision-values' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionAccent}></div>
                <h2 className={styles.sectionTitle}>Vision, Mission & Core Values</h2>
              </div>
              <div className={styles.visionMissionGrid}>
                <div className={styles.vmCard}>
                  <h3 className={styles.vmTitle}>
                    <svg className={styles.vmIcon} viewBox="0 0 24 24">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                    Corporate Vision
                  </h3>
                  <p className={styles.vmContent}>{aboutUs.vision}</p>
                </div>
                <div className={styles.vmCard}>
                  <h3 className={styles.vmTitle}>
                    <svg className={styles.vmIcon} viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                    </svg>
                    Operational Mission
                  </h3>
                  <p className={styles.vmContent}>{aboutUs.mission}</p>
                </div>
              </div>
              <h3 className={styles.quickTitle} style={{ marginBottom: '16px' }}>Core Engineering Values</h3>
              <div className={styles.valuesList}>
                {aboutUs.coreValues.map((v, i) => (
                  <div key={i} className={styles.valueCard}>
                    <h4 className={styles.valueTitle}>{v.title}</h4>
                    <p className={styles.valueDesc}>{v.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* HSE & QA Policies View */}
          {activeTab === 'hse-qa' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionAccent}></div>
                <h2 className={styles.sectionTitle}>HSE & Quality Assurance Policies</h2>
              </div>
              <div className={styles.policyGrid}>
                <div className={styles.policyCard}>
                  <div className={styles.policyHeader}>
                    <svg className={styles.policyIcon} viewBox="0 0 24 24">
                      <path d="M12 2L1 21h22L12 2zm0 3.5L18.5 18H5.5L12 5.5zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z" />
                    </svg>
                    <h3 className={styles.policyCardTitle}>{hsePolicy.title}</h3>
                  </div>
                  <p className={styles.policyText}>{hsePolicy.content}</p>
                </div>
                <div className={styles.policyCard}>
                  <div className={styles.policyHeader}>
                    <svg className={styles.policyIcon} viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                    <h3 className={styles.policyCardTitle}>{qaPolicy.title}</h3>
                  </div>
                  <p className={styles.policyText}>{qaPolicy.content}</p>
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
