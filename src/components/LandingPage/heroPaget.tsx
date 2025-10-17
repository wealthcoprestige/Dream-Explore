"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../axios/axiosInsatance';

interface Campaign {
  id: number;
  title: string;
  description: string;
  category: number;
  location: string;
  duration: string;
  image: string;
  employment_type: string;
  experience_level: string;
  country: string;
  city: string;
  status: string;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

interface ApiResponseWithData<T> {
  data: {
    results: T[];
    count?: number;
    next?: string | null;
    previous?: string | null;
  };
}

interface ApiResponseDirect<T> {
  results: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

interface ApiResponseArray<T> extends Array<T> {}

type ApiResponse<T> = ApiResponseWithData<T> | ApiResponseDirect<T> | ApiResponseArray<T>;

function HeroPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const [savedOpportunities, setSavedOpportunities] = useState<Set<number>>(new Set());
  const [nurseSlide, setNurseSlide] = useState(0);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const extractDataFromResponse = <T,>(response: any): T[] => {
    if (response && typeof response === 'object' && 'data' in response) {
      const data = response.data;
      if (data && typeof data === 'object' && 'results' in data && Array.isArray(data.results)) return data.results;
      if (Array.isArray(data)) return data;
    }
    if (response && typeof response === 'object' && 'results' in response && Array.isArray(response.results)) return response.results;
    if (Array.isArray(response)) return response;
    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [campaignsResponse, categoriesResponse] = await Promise.all([
          api.get('/campaigns/'),
          api.get('/categories/')
        ]);
        const campaignsData = extractDataFromResponse<Campaign>(campaignsResponse);
        const categoriesData = extractDataFromResponse<Category>(categoriesResponse);
        setCampaigns(campaignsData);
        setCategories(categoriesData);
      } catch {
        setError('Failed to load campaigns. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'General';
  };

  const getSalaryInfo = (employmentType: string, experienceLevel: string): string => {
    const baseSalaries: Record<string, string> = {
      internship: '$30,000 - $45,000',
      full_time: '$60,000 - $100,000',
      contract: '$50,000 - $80,000',
      temporary: '$40,000 - $60,000'
    };
    const experienceBonus: Record<string, string> = {
      entry: '',
      mid: ' (Mid-level)',
      senior: ' (Senior)',
      student: ' (Student)'
    };
    return `${baseSalaries[employmentType] || '$50,000 - $70,000'}${experienceBonus[experienceLevel] || ''}`;
  };

  const getDeadline = (createdAt: string): string => {
    const createdDate = new Date(createdAt);
    const deadline = new Date(createdDate);
    deadline.setMonth(deadline.getMonth() + 3);
    return deadline.toISOString().split('T')[0];
  };

  const handleApplyNow = (campaignId: number) => {
    router.push(`/details?campaign_id=${campaignId}`);
  };

  const mappedCampaigns = campaigns.map(campaign => ({
    id: campaign.id,
    title: campaign.title,
    description: campaign.description,
    type: getCategoryName(campaign.category),
    location: campaign.location,
    duration: campaign.duration,
    image: campaign.image,
    salary: getSalaryInfo(campaign.employment_type, campaign.experience_level),
    deadline: getDeadline(campaign.created_at),
    employment_type: campaign.employment_type,
    experience_level: campaign.experience_level,
    country: campaign.country,
    city: campaign.city,
    status: campaign.status
  }));

  const healthcareCampaigns = mappedCampaigns.filter(campaign => campaign.type === 'Healthcare');

  const slides = [
    {
      title: "Discover Your Global Career Path",
      description: "Find exciting international job opportunities tailored to your skills and aspirations. Your dream career abroad is within reach.",
      primaryBtn: "Explore Jobs",
      secondaryBtn: "Learn More",
      bgImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "World-Class Education Awaits",
      description: "Access top universities and educational programs worldwide with our guidance and scholarship assistance.",
      primaryBtn: "Find Programs",
      secondaryBtn: "View Scholarships",
      bgImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Transform Your Life Through Travel",
      description: "Experience new cultures, build global connections, and create unforgettable memories with our curated travel programs.",
      primaryBtn: "Plan Your Journey",
      secondaryBtn: "View Destinations",
      bgImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1470&q=80"
    }
  ];

  const filteredOpportunities = mappedCampaigns.filter(opp => activeFilter === 'All' || opp.type === activeFilter);

  const toggleSaveOpportunity = (id: number) => {
    const newSaved = new Set(savedOpportunities);
    if (newSaved.has(id)) newSaved.delete(id);
    else newSaved.add(id);
    setSavedOpportunities(newSaved);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNurseSlide(prev => (prev + 1) % Math.ceil(healthcareCampaigns.length / 3));
    }, 4000);
    return () => clearInterval(interval);
  }, [healthcareCampaigns.length]);

  const nextNurseSlide = () => {
    setNurseSlide(prev => (prev + 1) % Math.ceil(healthcareCampaigns.length / 3));
  };

  const prevNurseSlide = () => {
    setNurseSlide(prev => (prev - 1 + Math.ceil(healthcareCampaigns.length / 3)) % Math.ceil(healthcareCampaigns.length / 3));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="fixed w-full top-0 z-50 bg-white bg-opacity-95 shadow-lg transition-all duration-300">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center py-5">
            <div className="flex items-center text-2xl font-bold text-blue-800 cursor-pointer" onClick={() => router.push('/')}>
              <i className="fas fa-globe-americas mr-2 text-2xl"></i>
              DreamExplore
            </div>
            <div className="hidden md:flex space-x-8">
              {['Home', 'Services', 'Jobs', 'Schools', 'Scholarships', 'Tourism'].map((item, i) => (
                <div
                  key={i}
                  className="text-gray-800 font-medium hover:text-blue-800 transition-colors duration-300 relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-blue-800 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="hidden md:flex items-center">
              <div className="text-gray-800 font-medium mr-5 hover:text-blue-800 transition-colors duration-300">Login</div>
              <div className="bg-gradient-to-r from-blue-800 to-blue-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300">
                Get Started
              </div>
            </div>
            <div className="md:hidden text-2xl">
              <i className="fas fa-bars"></i>
            </div>
          </nav>
        </div>
      </header>

      <section className="relative h-[70vh] mt-20 overflow-hidden">
        <div className="relative h-full w-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundImage: `url('${slide.bgImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-blue-500/60"></div>
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className={`max-w-2xl text-white transform transition-all duration-1000 ${index === activeSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{slide.title}</h1>
                  <p className="text-xl mb-8 opacity-90">{slide.description}</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="bg-gradient-to-r from-blue-800 to-blue-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300">
                      {slide.primaryBtn}
                    </div>
                    <div className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-800 transition-all duration-300">
                      {slide.secondaryBtn}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${index === activeSlide ? 'bg-white scale-125' : 'bg-white bg-opacity-50'}`}
            />
          ))}
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Opportunities</h2>
              <p className="text-gray-600 max-w-2xl">Discover hand-picked opportunities from around the world</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
              {['All', 'Healthcare', 'Education', 'Public Health', 'Scholarships', 'NGO Programs', 'Job', 'School', 'Scholarship'].map(filter => (
                <div
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer ${
                    activeFilter === filter ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  {filter}
                </div>
              ))}
            </div>
          </div>

          {filteredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredOpportunities.map(opportunity => (
                <div key={opportunity.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-400 group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={opportunity.image}
                      alt={opportunity.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={({ currentTarget }) => {
                        currentTarget.src = 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1470&q=80';
                      }}
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
                          {opportunity.salary || 'Salary not specified'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div
                        onClick={() => handleApplyNow(opportunity.id)}
                        className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300 flex items-center cursor-pointer"
                      >
                        Apply Now
                        <i className="fas fa-arrow-right ml-2 text-xs"></i>
                      </div>
                      <div
                        onClick={() => toggleSaveOpportunity(opportunity.id)}
                        className={`transition-colors duration-300 cursor-pointer ${
                          savedOpportunities.has(opportunity.id) ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'
                        }`}
                      >
                        <i className={`${savedOpportunities.has(opportunity.id) ? 'fas' : 'far'} fa-bookmark`}></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No opportunities found</h3>
              <p className="text-gray-500">Try selecting a different filter or check back later for new opportunities.</p>
            </div>
          )}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-800 to-blue-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300">
              Load More Opportunities
              <i className="fas fa-arrow-down ml-2"></i>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HeroPage;
