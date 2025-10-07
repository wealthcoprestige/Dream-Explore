"use client"
import React, { useState, useEffect } from 'react';

function HeroPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [savedOpportunities, setSavedOpportunities] = useState(new Set());
  const [nurseSlide, setNurseSlide] = useState(0);
  
  const slides = [
    {
      title: "Discover Your Global Career Path",
      description: "Find exciting international job opportunities tailored to your skills and aspirations. Your dream career abroad is within reach.",
      primaryBtn: "Explore Jobs",
      secondaryBtn: "Learn More",
      bgImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "World-Class Education Awaits",
      description: "Access top universities and educational programs worldwide with our guidance and scholarship assistance.",
      primaryBtn: "Find Programs",
      secondaryBtn: "View Scholarships",
      bgImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Transform Your Life Through Travel",
      description: "Experience new cultures, build global connections, and create unforgettable memories with our curated travel programs.",
      primaryBtn: "Plan Your Journey",
      secondaryBtn: "View Destinations",
      bgImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
  ];

  const opportunities = [
    {
      id: 1,
      title: "Senior Software Engineer",
      description: "Join our innovative team in Silicon Valley and work on cutting-edge technology projects.",
      type: "Job",
      location: "San Francisco, USA",
      duration: "Full-time",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      salary: "$120,000 - $160,000",
      deadline: "2024-03-15"
    },
    {
      id: 2,
      title: "MBA Scholarship Program",
      description: "Full scholarship for international students at top business schools worldwide.",
      type: "Scholarship",
      location: "Multiple Locations",
      duration: "2 years",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      amount: "Full Tuition",
      deadline: "2024-04-30"
    },
    {
      id: 3,
      title: "Computer Science Master's Program",
      description: "Advanced degree program with research opportunities and industry partnerships.",
      type: "School",
      location: "London, UK",
      duration: "18 months",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      tuition: "$25,000/year",
      deadline: "2024-05-15"
    },
    {
      id: 4,
      title: "Digital Marketing Specialist",
      description: "Lead digital campaigns for global brands in a dynamic agency environment.",
      type: "Job",
      location: "Berlin, Germany",
      duration: "Full-time",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      salary: "€65,000 - €85,000",
      deadline: "2024-03-31"
    },
    {
      id: 5,
      title: "Engineering Scholarship",
      description: "Merit-based scholarship for outstanding engineering students.",
      type: "Scholarship",
      location: "Toronto, Canada",
      duration: "4 years",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      amount: "$50,000",
      deadline: "2024-04-15"
    },
    {
      id: 6,
      title: "Medical School Program",
      description: "Internationally recognized medical degree with clinical rotations.",
      type: "School",
      location: "Sydney, Australia",
      duration: "5 years",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      tuition: "$45,000/year",
      deadline: "2024-06-01"
    }
  ];

  const nursingOpportunities = [
    {
      id: 7,
      title: "Registered Nurse - ICU Specialist",
      description: "Join our state-of-the-art intensive care unit with cutting-edge medical technology and training programs.",
      type: "Nursing Job",
      location: "London, UK",
      duration: "Full-time",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      salary: "£45,000 - £55,000",
      deadline: "2024-03-20",
      requirements: "BSN, 2+ years ICU experience",
      benefits: ["Relocation assistance", "Professional development", "Health insurance"]
    },
    {
      id: 8,
      title: "Pediatric Nursing Program",
      description: "Specialized pediatric nursing program with international certification and placement opportunities.",
      type: "Nursing Education",
      location: "Toronto, Canada",
      duration: "12 months",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1467&q=80",
      tuition: "$18,000",
      deadline: "2024-04-15",
      requirements: "RN license, 1 year experience",
      benefits: ["International certification", "Job placement", "Mentorship program"]
    },
    {
      id: 9,
      title: "Nursing Scholarship - Global Health",
      description: "Full scholarship for nurses pursuing global health initiatives and international healthcare projects.",
      type: "Nursing Scholarship",
      location: "Multiple Countries",
      duration: "2 years",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      amount: "Full Tuition + Stipend",
      deadline: "2024-05-01",
      requirements: "BSN, passion for global health",
      benefits: ["Full tuition coverage", "Monthly stipend", "International placements"]
    },
    {
      id: 10,
      title: "Emergency Room Nurse",
      description: "Fast-paced ER nursing position in a leading trauma center with comprehensive training and support.",
      type: "Nursing Job",
      location: "Dubai, UAE",
      duration: "Full-time",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
      salary: "$65,000 - $80,000",
      deadline: "2024-03-25",
      requirements: "RN license, ACLS certification",
      benefits: ["Tax-free salary", "Housing allowance", "Flight tickets"]
    },
    {
      id: 11,
      title: "Nurse Practitioner Program",
      description: "Advanced practice nursing program with specialization in family medicine and primary care.",
      type: "Nursing Education",
      location: "Melbourne, Australia",
      duration: "24 months",
      image: "https://images.unsplash.com/photo-1584467735871-8db9ac8d55b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      tuition: "$28,000/year",
      deadline: "2024-06-15",
      requirements: "BSN, 2 years experience",
      benefits: ["Clinical placements", "Research opportunities", "Career advancement"]
    },
    {
      id: 12,
      title: "Operating Room Nurse",
      description: "Specialized OR nursing position in a world-class surgical center with advanced technology.",
      type: "Nursing Job",
      location: "Singapore",
      duration: "Full-time",
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
      salary: "SGD 70,000 - 85,000",
      deadline: "2024-04-10",
      requirements: "RN license, OR experience preferred",
      benefits: ["Signing bonus", "Professional development", "Comprehensive benefits"]
    }
  ];

  const filteredOpportunities = opportunities.filter(opp => 
    activeFilter === 'All' || opp.type === activeFilter
  );

  const toggleSaveOpportunity = (id) => {
    const newSaved = new Set(savedOpportunities);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSavedOpportunities(newSaved);
  };

  // Auto-slide for main hero
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-slide for nursing opportunities
  useEffect(() => {
    const interval = setInterval(() => {
      setNurseSlide((prev) => (prev + 1) % Math.ceil(nursingOpportunities.length / 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextNurseSlide = () => {
    setNurseSlide((prev) => (prev + 1) % Math.ceil(nursingOpportunities.length / 3));
  };

  const prevNurseSlide = () => {
    setNurseSlide((prev) => (prev - 1 + Math.ceil(nursingOpportunities.length / 3)) % Math.ceil(nursingOpportunities.length / 3));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-white bg-opacity-95 shadow-lg transition-all duration-300">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center py-5">
            <a href="#" className="flex items-center text-2xl font-bold text-blue-800">
              <i className="fas fa-globe-americas mr-2 text-2xl"></i>
              DreamExplore
            </a>
            
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-800 font-medium hover:text-blue-800 transition-colors duration-300 relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-blue-800 after:transition-all after:duration-300 hover:after:w-full">Home</a>
              <a href="#" className="text-gray-800 font-medium hover:text-blue-800 transition-colors duration-300 relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-blue-800 after:transition-all after:duration-300 hover:after:w-full">Services</a>
              <a href="#" className="text-gray-800 font-medium hover:text-blue-800 transition-colors duration-300 relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-blue-800 after:transition-all after:duration-300 hover:after:w-full">Jobs</a>
              <a href="#" className="text-gray-800 font-medium hover:text-blue-800 transition-colors duration-300 relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-blue-800 after:transition-all after:duration-300 hover:after:w-full">Schools</a>
              <a href="#" className="text-gray-800 font-medium hover:text-blue-800 transition-colors duration-300 relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-blue-800 after:transition-all after:duration-300 hover:after:w-full">Scholarships</a>
              <a href="#" className="text-gray-800 font-medium hover:text-blue-800 transition-colors duration-300 relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-blue-800 after:transition-all after:duration-300 hover:after:w-full">Tourism</a>
            </div>
            
            <div className="hidden md:flex items-center">
              <button className="text-gray-800 font-medium mr-5 hover:text-blue-800 transition-colors duration-300">Login</button>
              <button className="bg-gradient-to-r from-blue-800 to-blue-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300">
                Get Started
              </button>
            </div>
            
            <div className="md:hidden text-2xl">
              <i className="fas fa-bars"></i>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Slider */}
      <section className="relative h-[70vh] mt-20 overflow-hidden">
        <div className="relative h-full w-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === activeSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url('${slide.bgImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-blue-500/60"></div>
              
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className={`max-w-2xl text-white transform transition-all duration-1000 ${
                  index === activeSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl mb-8 opacity-90">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-gradient-to-r from-blue-800 to-blue-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300">
                      {slide.primaryBtn}
                    </button>
                    <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-800 transition-all duration-300">
                      {slide.secondaryBtn}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Slider Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Opportunities</h2>
              <p className="text-gray-600 max-w-2xl">Discover hand-picked opportunities from around the world</p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
              {['All', 'Job', 'School', 'Scholarship'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-blue-800 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Opportunity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-400 group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={opportunity.image}
                    alt={opportunity.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-blue-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {opportunity.type}
                  </div>
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                    Apply by {new Date(opportunity.deadline).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{opportunity.title}</h3>
                  <p className="text-gray-600 mb-4">{opportunity.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-gray-500 text-sm">
                      <span className="flex items-center">
                        <i className="fas fa-map-marker-alt mr-2 text-blue-600"></i>
                        {opportunity.location}
                      </span>
                      <span className="flex items-center">
                        <i className="fas fa-clock mr-2 text-blue-600"></i>
                        {opportunity.duration}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="flex items-center">
                        <i className="fas fa-dollar-sign mr-2 text-blue-600"></i>
                        {opportunity.salary || opportunity.amount || opportunity.tuition}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300 flex items-center">
                      Apply Now
                      <i className="fas fa-arrow-right ml-2 text-xs"></i>
                    </button>
                    <button 
                      onClick={() => toggleSaveOpportunity(opportunity.id)}
                      className={`transition-colors duration-300 ${
                        savedOpportunities.has(opportunity.id) 
                          ? 'text-blue-600' 
                          : 'text-gray-400 hover:text-blue-600'
                      }`}
                    >
                      <i className={`${savedOpportunities.has(opportunity.id) ? 'fas' : 'far'} fa-bookmark`}></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center">
            <button className="bg-gradient-to-r from-blue-800 to-blue-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300">
              Load More Opportunities
              <i className="fas fa-arrow-down ml-2"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Nursing Opportunities Carousel Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Nursing Opportunities Worldwide</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover exclusive nursing positions, educational programs, and scholarships across the globe
            </p>
          </div>

          {/* Nursing Carousel */}
          <div className="relative overflow-hidden rounded-3xl">
            {/* Carousel Navigation Buttons */}
            <button 
              onClick={prevNurseSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl border border-gray-200"
            >
              <i className="fas fa-chevron-left text-blue-800 text-lg"></i>
            </button>
            
            <button 
              onClick={nextNurseSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl border border-gray-200"
            >
              <i className="fas fa-chevron-right text-blue-800 text-lg"></i>
            </button>

            {/* Carousel Track */}
            <div 
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${nurseSlide * 100}%)` }}
            >
              {[0, 1].map((slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {nursingOpportunities.slice(slideIndex * 3, slideIndex * 3 + 3).map((opportunity) => (
                      <div key={opportunity.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-400 group">
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={opportunity.image}
                            alt={opportunity.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-4 right-4 bg-blue-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {opportunity.type}
                          </div>
                          <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                            Apply by {new Date(opportunity.deadline).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-3">{opportunity.title}</h3>
                          <p className="text-gray-600 mb-4">{opportunity.description}</p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-gray-500 text-sm">
                              <span className="flex items-center">
                                <i className="fas fa-map-marker-alt mr-2 text-blue-600"></i>
                                {opportunity.location}
                              </span>
                              <span className="flex items-center">
                                <i className="fas fa-clock mr-2 text-blue-600"></i>
                                {opportunity.duration}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              <span className="flex items-center">
                                <i className="fas fa-dollar-sign mr-2 text-blue-600"></i>
                                {opportunity.salary || opportunity.amount || opportunity.tuition}
                              </span>
                            </div>
                            {opportunity.requirements && (
                              <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                                <span className="font-semibold">Requirements:</span> {opportunity.requirements}
                              </div>
                            )}
                          </div>
                          
                          {/* Benefits Tags */}
                          {opportunity.benefits && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {opportunity.benefits.slice(0, 2).map((benefit, index) => (
                                <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                  {benefit}
                                </span>
                              ))}
                              {opportunity.benefits.length > 2 && (
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                                  +{opportunity.benefits.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <button className="bg-gradient-to-r from-blue-800 to-blue-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center">
                              Quick Apply
                              <i className="fas fa-arrow-right ml-2 text-xs"></i>
                            </button>
                            <button 
                              onClick={() => toggleSaveOpportunity(opportunity.id)}
                              className={`transition-colors duration-300 ${
                                savedOpportunities.has(opportunity.id) 
                                  ? 'text-blue-600' 
                                  : 'text-gray-400 hover:text-blue-600'
                              }`}
                            >
                              <i className={`${savedOpportunities.has(opportunity.id) ? 'fas' : 'far'} fa-bookmark`}></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center space-x-3 mt-8">
              {[0, 1].map((index) => (
                <button
                  key={index}
                  onClick={() => setNurseSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === nurseSlide 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 text-lg">
              Explore All Nursing Opportunities
              <i className="fas fa-arrow-right ml-3"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sky-500 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-white">About Us</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors duration-300">Our Story</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors duration-300">Team</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors duration-300">Careers</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors duration-300">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-white">Services</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors duration-300">Job Placement</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors duration-300">Education Consulting</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors duration-300">Visa Assistance</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors duration-300">Travel Planning</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-white">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors duration-300">Blog</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors duration-300">Success Stories</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors duration-300">FAQ</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors duration-300">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-white">Connect With Us</h3>
              <div className="flex space-x-4 mb-6">
                <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-sky-500 transition-all duration-300">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-sky-500 transition-all duration-300">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-sky-500 transition-all duration-300">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-sky-500 transition-all duration-300">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
              <button className="bg-white text-sky-500 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center">
                Start Your Journey
                <i className="fas fa-arrow-right ml-2 transition-transform duration-300"></i>
              </button>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/20 text-center text-white/80">
            <p>&copy; 2023 DreamExplore. All rights reserved. Your gateway to global opportunities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HeroPage;