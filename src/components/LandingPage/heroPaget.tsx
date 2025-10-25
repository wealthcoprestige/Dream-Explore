"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "../axios/axiosInsatance";
import Header from "./Header";

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

function HeroPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");
  const [savedOpportunities, setSavedOpportunities] = useState<Set<number>>(
    new Set()
  );
  const [healthcareSlide, setHealthcareSlide] = useState(0);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const extractDataFromResponse = <T,>(response: unknown): T[] => {
    if (response && typeof response === "object" && "data" in response) {
      const data = response.data as { results?: T[] };
      if (
        data &&
        typeof data === "object" &&
        "results" in data &&
        Array.isArray(data.results)
      )
        return data.results as T[];
      if (Array.isArray(data)) return data as T[];
    }
    if (
      response &&
      typeof response === "object" &&
      "results" in response &&
      Array.isArray(response.results)
    )
      return response.results as T[];
    if (Array.isArray(response)) return response as T[];
    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [campaignsResponse, categoriesResponse] = await Promise.all([
          api.get("/campaigns/"),
          api.get("/categories/"),
        ]);
        const campaignsData =
          extractDataFromResponse<Campaign>(campaignsResponse);
        const categoriesData =
          extractDataFromResponse<Category>(categoriesResponse);
        setCampaigns(campaignsData);
        setCategories(categoriesData);
      } catch {
        setError("Failed to load campaigns. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Check for authentication token
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    setIsAuthenticated(!!token);
  }, []);

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://127.0.0.1:8000${imagePath}`;
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "General";
  };

  const getSalaryInfo = (
    employmentType: string,
    experienceLevel: string
  ): string => {
    const baseSalaries: Record<string, string> = {
      internship: "$30,000 - $45,000",
      full_time: "$60,000 - $100,000",
      contract: "$50,000 - $80,000",
      temporary: "$40,000 - $60,000",
    };
    const experienceBonus: Record<string, string> = {
      entry: "",
      mid: " (Mid-level)",
      senior: " (Senior)",
      student: " (Student)",
    };
    return `${baseSalaries[employmentType] || "$50,000 - $70,000"}${
      experienceBonus[experienceLevel] || ""
    }`;
  };

  const getDeadline = (createdAt: string): string => {
    const createdDate = new Date(createdAt);
    const deadline = new Date(createdDate);
    deadline.setMonth(deadline.getMonth() + 3);
    return deadline.toISOString().split("T")[0];
  };

  const getDaysRemaining = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExperienceLevelColor = (level: string): string => {
    const colors: Record<string, string> = {
      entry: "from-green-500 to-green-600",
      mid: "from-blue-500 to-blue-600",
      senior: "from-purple-500 to-purple-600",
      student: "from-orange-500 to-orange-600",
    };
    return colors[level] || "from-gray-500 to-gray-600";
  };

  const getEmploymentTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
      internship: "fas fa-graduation-cap",
      full_time: "fas fa-briefcase",
      contract: "fas fa-file-contract",
      temporary: "fas fa-clock",
    };
    return icons[type] || "fas fa-briefcase";
  };

  const handleApplyNow = (campaignId: number) => {
    router.push(`/details?campaign_id=${campaignId}`);
  };

  const handleLogin = () => {
    router.push("/accounts/login");
  };

  const handleBookAppointment = () => {
    router.push("/book-interview");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavClick = (path?: string) => {
    setIsMobileMenuOpen(false);
    if (path) {
      setTimeout(() => router.push(path), 300);
    }
  };

  const mappedCampaigns = campaigns.map((campaign) => ({
    id: campaign.id,
    title: campaign.title,
    description: campaign.description,
    type: getCategoryName(campaign.category),
    location: campaign.location,
    duration: campaign.duration,
    image: getImageUrl(campaign.image),
    salary: getSalaryInfo(campaign.employment_type, campaign.experience_level),
    deadline: getDeadline(campaign.created_at),
    employment_type: campaign.employment_type,
    experience_level: campaign.experience_level,
    country: campaign.country,
    city: campaign.city,
    status: campaign.status,
    days_remaining: getDaysRemaining(getDeadline(campaign.created_at)),
  }));

  // SIMPLE FILTERING LOGIC - Exact matching
  const filteredOpportunities = mappedCampaigns.filter(
    (opp) => activeFilter === "All" || opp.type === activeFilter
  );

  const healthcareCampaigns = mappedCampaigns.filter(
    (campaign) =>
      campaign.type.toLowerCase().includes("health") ||
      campaign.type.toLowerCase().includes("care") ||
      campaign.title.toLowerCase().includes("nurse") ||
      campaign.title.toLowerCase().includes("doctor") ||
      campaign.title.toLowerCase().includes("medical") ||
      campaign.title.toLowerCase().includes("healthcare")
  );

  const slides = [
    {
      title: "Discover Your Global Career Path",
      description:
        "Find exciting international job opportunities tailored to your skills and aspirations. Your dream career abroad is within reach.",
      primaryBtn: "Explore Jobs",
      secondaryBtn: "Learn More",
      bgImage:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1470&q=80",
    },
    {
      title: "World-Class Education Awaits",
      description:
        "Access top universities and educational programs worldwide with our guidance and scholarship assistance.",
      primaryBtn: "Find Programs",
      secondaryBtn: "View Scholarships",
      bgImage:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1470&q=80",
    },
    {
      title: "Transform Your Life Through Travel",
      description:
        "Experience new cultures, build global connections, and create unforgettable memories with our curated travel programs.",
      primaryBtn: "Plan Your Journey",
      secondaryBtn: "View Destinations",
      bgImage:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1470&q=80",
    },
  ];

  const toggleSaveOpportunity = (id: number) => {
    const newSaved = new Set(savedOpportunities);
    if (newSaved.has(id)) newSaved.delete(id);
    else newSaved.add(id);
    setSavedOpportunities(newSaved);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHealthcareSlide(
        (prev) => (prev + 1) % Math.ceil(healthcareCampaigns.length / 3)
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [healthcareCampaigns.length]);

  const nextHealthcareSlide = () => {
    setHealthcareSlide(
      (prev) => (prev + 1) % Math.ceil(healthcareCampaigns.length / 3)
    );
  };

  const prevHealthcareSlide = () => {
    setHealthcareSlide(
      (prev) =>
        (prev - 1 + Math.ceil(healthcareCampaigns.length / 3)) %
        Math.ceil(healthcareCampaigns.length / 3)
    );
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
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

  // Campaign Card Component
  const CampaignCard = ({ opportunity, isHealthcare = false }) => {
    const cardColors = isHealthcare
      ? {
          gradient: "from-green-500 to-green-600",
          text: "text-green-600",
          bg: "bg-green-50",
        }
      : {
          gradient: "from-blue-500 to-blue-600",
          text: "text-blue-600",
          bg: "bg-blue-50",
        };

    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-400 group border border-gray-100">
        {/* Image Header with Overlay */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={
              opportunity.image ||
              "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1470&q=80"
            }
            alt={opportunity.title}
            width={400}
            height={192}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Category Badge */}
          <div
            className={`absolute top-4 right-4 bg-gradient-to-r ${cardColors.gradient} text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg`}
          >
            {opportunity.type}
          </div>

          {/* Experience Level Badge */}
          <div
            className={`absolute top-4 left-4 bg-white/90 backdrop-blur-sm ${cardColors.text} px-3 py-1 rounded-full text-xs font-semibold`}
          >
            <i
              className={`fas ${getEmploymentTypeIcon(
                opportunity.employment_type
              )} mr-1`}
            ></i>
            {opportunity.employment_type?.replace("_", " ").toUpperCase()}
          </div>

          {/* Days Remaining */}
          <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
            <i className="fas fa-clock mr-1"></i>
            {opportunity.days_remaining > 0
              ? `${opportunity.days_remaining} days left`
              : "Closing soon"}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Title and Save Button */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-800 line-clamp-2 flex-1 mr-3">
              {opportunity.title}
            </h3>
            <div
              onClick={() => toggleSaveOpportunity(opportunity.id)}
              className={`transition-all duration-300 cursor-pointer p-2 rounded-full ${
                savedOpportunities.has(opportunity.id)
                  ? `${cardColors.text} bg-${cardColors.bg.split("-")[1]}-50`
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
            >
              <i
                className={`${
                  savedOpportunities.has(opportunity.id) ? "fas" : "far"
                } fa-bookmark text-lg`}
              ></i>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
            {opportunity.description}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-gray-600 text-sm">
              <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
              <span className="truncate">{opportunity.location}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <i className="fas fa-clock mr-2 text-gray-400"></i>
              <span>{opportunity.duration}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <i className="fas fa-dollar-sign mr-2 text-gray-400"></i>
              <span>{opportunity.salary || "Competitive"}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <i className={`fas fa-user-tie mr-2 text-gray-400`}></i>
              <span className="capitalize">{opportunity.experience_level}</span>
            </div>
          </div>

          {/* Progress Bar for Urgency */}
          {opportunity.days_remaining < 7 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Apply soon</span>
                <span>{opportunity.days_remaining} days left</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`bg-red-500 h-1.5 rounded-full transition-all duration-500`}
                  style={{
                    width: `${Math.max(
                      10,
                      (opportunity.days_remaining / 7) * 100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              onClick={() => handleApplyNow(opportunity.id)}
              className={`bg-gradient-to-r ${cardColors.gradient} hover:shadow-lg transform hover:-translate-y-0.5 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center group`}
            >
              Apply Now
              <i className="fas fa-arrow-right ml-2 text-xs group-hover:translate-x-1 transition-transform duration-300"></i>
            </button>
            <button className="text-gray-500 hover:text-gray-700 transition-colors duration-300 flex items-center text-sm">
              <i className="far fa-eye mr-1"></i>
              Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Rest of the component remains exactly the same */}
      <section className="relative h-[70vh] mt-20 overflow-hidden">
        <div className="relative h-full w-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url('${slide.bgImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-blue-500/60"></div>
              <div className="container mx-auto px-4 h-full flex items-center">
                <div
                  className={`max-w-2xl text-white transform transition-all duration-1000 ${
                    index === activeSlide
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    {slide.title}
                  </h1>
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
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                index === activeSlide
                  ? "bg-white scale-125"
                  : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Healthcare Professionals Section */}
      {healthcareCampaigns.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <i className="fas fa-heartbeat mr-2"></i>
                Healthcare Opportunities
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Healthcare Professionals
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover rewarding healthcare opportunities around the world.
                Join the global healthcare community and make a difference.
              </p>
            </div>

            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${healthcareSlide * 100}%)`,
                  }}
                >
                  {Array.from({
                    length: Math.ceil(healthcareCampaigns.length / 3),
                  }).map((_, slideIndex) => (
                    <div
                      key={slideIndex}
                      className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {healthcareCampaigns
                        .slice(slideIndex * 3, slideIndex * 3 + 3)
                        .map((opportunity) => (
                          <CampaignCard
                            key={opportunity.id}
                            opportunity={opportunity}
                            isHealthcare={true}
                          />
                        ))}
                    </div>
                  ))}
                </div>
              </div>

              {healthcareCampaigns.length > 3 && (
                <>
                  <button
                    onClick={prevHealthcareSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-10"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    onClick={nextHealthcareSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-10"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}

              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({
                  length: Math.ceil(healthcareCampaigns.length / 3),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setHealthcareSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === healthcareSlide
                        ? "bg-green-600 scale-125"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Opportunities Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
            <div className="flex-1">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <i className="fas fa-star mr-2"></i>
                Featured Opportunities
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Your Next Global Adventure Awaits
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl">
                Explore a curated selection of international roles and
                scholarships, each chosen to match your unique skills and
                ambitions.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mt-6 lg:mt-0">
              {[
                "All",
                "Healthcare",
                "Education",
                "Public Health",
                "Scholarships",
                "NGO Programs",
                "Job",
                "School",
                "Scholarship",
              ].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 cursor-pointer border ${
                    activeFilter === filter
                      ? "bg-blue-800 text-white border-blue-800 shadow-lg shadow-blue-500/25"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-800"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {filteredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredOpportunities.map((opportunity) => (
                <CampaignCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">
                  No opportunities found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try selecting a different filter or check back later for new
                  opportunities.
                </p>
                <button
                  onClick={() => setActiveFilter("All")}
                  className="bg-blue-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
                >
                  Show All Opportunities
                </button>
              </div>
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center">
            <button className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 inline-flex items-center">
              <i className="fas fa-sync-alt mr-2"></i>
              Load More Opportunities
            </button>
          </div>
        </div>
      </section>

      {/* Beautiful Footer */}
      <footer className="bg-[#5686fe] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center text-2xl font-bold mb-6">
                <i className="fas fa-globe-americas mr-2"></i>
                Dream Abroad
              </div>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Connecting talented individuals with global opportunities. Your
                journey to international success starts here.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "linkedin", "instagram"].map(
                  (social) => (
                    <div
                      key={social}
                      className="bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
                    >
                      <i className={`fab fa-${social}`}></i>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  "Home",
                  "About Us",
                  "Services",
                  "Jobs",
                  "Schools",
                  "Scholarships",
                  "Tourism",
                  "Contact",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-blue-100 hover:text-white transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Our Services</h3>
              <ul className="space-y-3">
                {[
                  "Job Placement",
                  "Education Consulting",
                  "Scholarship Guidance",
                  "Visa Assistance",
                  "Career Counseling",
                  "Travel Planning",
                ].map((service) => (
                  <li key={service}>
                    <a
                      href="#"
                      className="text-blue-100 hover:text-white transition-colors duration-300"
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt mr-3 text-blue-200"></i>
                  <span className="text-blue-100">
                    123 Global Street, City, Country
                  </span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-phone mr-3 text-blue-200"></i>
                  <span className="text-blue-100">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-envelope mr-3 text-blue-200"></i>
                  <span className="text-blue-100">info@dreamexplore.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trusted Partners */}
          <div className="border-t border-blue-400 pt-12">
            <h3 className="text-center text-lg font-semibold mb-8">
              Trusted by Leading Organizations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-80">
              {[1, 2, 3, 4, 5, 6].map((partner) => (
                <div
                  key={partner}
                  className="bg-white/10 rounded-lg p-4 h-16 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                >
                  <div className="text-blue-200 font-semibold text-sm">
                    Partner {partner}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-blue-400 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-blue-100 text-sm mb-4 md:mb-0">
              © 2024 Dream Abroad. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors duration-300"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HeroPage;
