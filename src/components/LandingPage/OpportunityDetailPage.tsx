"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError, AxiosResponse } from "axios";
import Image from "next/image";
import Header from "./Header";
import api from "../axios/axiosInsatance";

// Define TypeScript interfaces
interface CampaignData {
  campaign?: {
    id: number;
    title: string;
    employment_type: string;
    city: string;
    state: string;
    location: string;
    duration: string;
    description: string;
    image: string;
    category: {
      name: string;
    };
  };
  gallery?: Array<{
    image: string;
  }>;
  compaign_benefits?: Array<{
    full_description: string;
    requirements: string[];
    responsibilities: string[];
    benefit: string[];
  }>;
}

interface FormData {
  full_name: string;
  email: string;
  phone_number: string;
  location: string;
  passport_number: string;
  whats_app: string;
  nationality: string;
  id_card: string;
  card_image_front: File | null;
  card_image_back: File | null;
  date_of_birth: string;
  profile_photo: File | null;
  bio: string;
  linkedin_profile: string;
  website_or_portfolio: string;
  languages_spoken: string;
  education: string;
  resume: File | null;
  certification: File | null;
  cover_letter: File | null;
  available_start_date: string;
  qualification: string;
}

interface Opportunity {
  id: number;
  title: string;
  type: string;
  location: string;
  duration: string;
  salary: string;
  deadline: string;
  company: string;
  companyLogo: string;
  images: string[];
  description: string;
  fullDescription: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  applicationProcess: string[];
}

// Helper function to safely extract data from API response
const extractDataFromResponse = (response: unknown): CampaignData | null => {
  // If response has data property (Axios structure)
  if (response && typeof response === "object" && "data" in response) {
    return response.data as CampaignData;
  }
  // If response is the data directly
  if (response && typeof response === "object") {
    return response as CampaignData;
  }
  return null;
};

function OpportunityDetailPage() {
  const [showApplicationForm, setShowApplicationForm] =
    useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [unauthenticatedSuccess, setUnauthenticatedSuccess] =
    useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Form data matching the Django Applicant and Application models
  const [formData, setFormData] = useState<FormData>({
    // Applicant fields
    full_name: "",
    email: "",
    phone_number: "",
    location: "",
    whats_app: "",
    passport_number: "",
    nationality: "",
    id_card: "",
    card_image_front: null,
    card_image_back: null,
    date_of_birth: "",
    profile_photo: null,
    bio: "",
    linkedin_profile: "",
    website_or_portfolio: "",
    languages_spoken: "",
    education: "",

    // Application fields
    resume: null,
    certification: null,
    cover_letter: null,
    available_start_date: "",
    qualification: "",
  });

  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaign_id");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!campaignId) {
        console.error("No campaign ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/compaign/details/${campaignId}`);

        // Use helper function to safely extract data
        const responseData = extractDataFromResponse(response);
        setCampaignData(responseData);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
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
  }, [campaignId]);

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `https://backend.dreamabroad.online${imagePath}`;
  };

  // Use actual data if available, otherwise use fallback
  const opportunity: Opportunity = campaignData
    ? {
        id: campaignData.campaign?.id || 0,
        title: campaignData.campaign?.title || "Opportunity Title",
        type: campaignData.campaign?.employment_type || "Full-time",
        location:
          `${campaignData.campaign?.city || ""}, ${
            campaignData.campaign?.state || ""
          }`.trim() ||
          campaignData.campaign?.location ||
          "Location not specified",
        duration: campaignData.campaign?.duration || "Permanent",
        salary: "Competitive Salary",
        deadline: "2024-12-31",
        company: campaignData.campaign?.title || "Company not specified",
        companyLogo: getImageUrl(campaignData.campaign?.image),

        images:
          campaignData.gallery?.map((item) => getImageUrl(item.image)) ||
          [getImageUrl(campaignData.campaign?.image)].filter(Boolean),

        description:
          campaignData.campaign?.description ||
          "Join our team for an exciting opportunity.",

        fullDescription:
          campaignData.compaign_benefits?.[0]?.full_description ||
          campaignData.campaign?.description ||
          `
      This position offers great opportunities for professional growth and development.
      Join our dedicated team and make a difference in healthcare.
    `,

        requirements: Array.isArray(
          campaignData.compaign_benefits?.[0]?.requirements
        )
          ? campaignData.compaign_benefits[0].requirements
          : [
              "Relevant qualifications and experience",
              "Strong communication skills",
              "Team player mentality",
            ],

        responsibilities: Array.isArray(
          campaignData.compaign_benefits?.[0]?.responsibilities
        )
          ? campaignData.compaign_benefits[0].responsibilities
          : [
              "Perform duties as required",
              "Collaborate with team members",
              "Maintain professional standards",
            ],

        benefits: Array.isArray(campaignData.compaign_benefits?.[0]?.benefit)
          ? campaignData.compaign_benefits[0].benefit
          : [
              "Competitive compensation",
              "Professional development",
              "Great work environment",
            ],

        applicationProcess: [
          "Submit online application",
          "Initial screening",
          "Interview process",
          "Offer and onboarding",
        ],
      }
    : {
        // Fallback data while loading or if no data
        id: 7,
        title: "Loading...",
        type: "Loading...",
        location: "Loading...",
        duration: "Loading...",
        salary: "Loading...",
        deadline: "2024-12-31",
        company: "Loading...",
        companyLogo: "",
        images: [],
        description: "Loading...",
        fullDescription: "Loading...",
        requirements: ["Loading..."],
        responsibilities: ["Loading..."],
        benefits: ["Loading..."],
        applicationProcess: ["Loading..."],
      };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.files) {
      const files = e.target.files;
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: keyof FormData
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [fieldName]: file }));
    }
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof FormData)[] = [
      "full_name",
      "email",
      "phone_number",
      "location",
      "passport_number",
      "nationality",
      "id_card",
      "resume",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setSubmitError(`Please fill in the ${field.replace("_", " ")} field`);
        return false;
      }
    }

    // Validate file types
    const resumeFile = formData.resume;
    if (
      resumeFile &&
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(resumeFile.type)
    ) {
      setSubmitError("Resume must be a PDF or Word document");
      return false;
    }

    return true;
  };

  const handleAuthenticatedApply = async () => {
    if (!campaignId) {
      setSubmitError("No campaign selected");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const response: AxiosResponse = await api.post(
        `applicant/application/auth/${campaignId}`
      );

      if (response.status === 200 || response.status === 201) {
        setSubmitSuccess(true);
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      if (error instanceof AxiosError && error.response) {
        const errorData = error.response.data;
        setSubmitError(
          errorData.message || "Failed to submit application. Please try again."
        );
      } else {
        setSubmitError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitApplication = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    if (!campaignId) {
      setSubmitError("No campaign selected");
      return;
    }

    setSubmitting(true);

    // Check for authentication token
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    const isAuthenticated = !!token;

    try {
      if (isAuthenticated) {
        // Authenticated user flow
        const authSubmitData = new FormData();
        // Authenticated users might only need to submit application-specific fields
        authSubmitData.append("resume", formData.resume || "");
        authSubmitData.append("certification", formData.certification || "");
        authSubmitData.append("cover_letter", formData.cover_letter || "");
        authSubmitData.append(
          "available_start_date",
          formData.available_start_date
        );
        authSubmitData.append("qualification", formData.qualification);
        const response: AxiosResponse = await api.post(
          `applicant/application/auth/${campaignId}`,
          authSubmitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          setSubmitSuccess(true);
          setTimeout(() => router.push("/dashboard"), 2000);
        }
      } else {
        // Unauthenticated user flow
        const unauthSubmitData = new FormData();
        Object.keys(formData).forEach((key) => {
          const value = formData[key as keyof FormData];
          if (value !== null && value !== "") {
            unauthSubmitData.append(key, value as string | Blob);
          }
        });

        const response = await api.post<{ success: boolean }>(
          `create/applicant/application/unauthenticated/${campaignId}`,
          unauthSubmitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.success) {
          setUnauthenticatedSuccess(true);
          setShowApplicationForm(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      if (error instanceof AxiosError && error.response) {
        const errorData = error.response.data;
        // Handle specific error for already applied
        if (errorData.applicant && Array.isArray(errorData.applicant)) {
          setSubmitError(errorData.applicant[0]);
        } else {
          setSubmitError(
            errorData.message ||
              "Failed to submit application. Please try again."
          );
        }
      } else {
        setSubmitError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      email: "",
      phone_number: "",
      location: "",
      whats_app: "",
      passport_number: "",
      nationality: "",
      id_card: "",
      card_image_front: null,
      card_image_back: null,
      date_of_birth: "",
      profile_photo: null,
      bio: "",
      linkedin_profile: "",
      website_or_portfolio: "",
      languages_spoken: "",
      education: "",
      resume: null,
      certification: null,
      cover_letter: null,
      available_start_date: "",
      qualification: "",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  if (!campaignId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Campaign Not Found
          </h2>
          <p className="text-gray-600">
            No campaign ID provided. Please go back and select an opportunity.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 bg-blue-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Notification for Authenticated User */}
      {submitSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <i className="fas fa-check-circle mr-2"></i>
            Application submitted successfully! Redirecting to your dashboard...
          </div>
        </div>
      )}

      {/* Success Modal for Unauthenticated User */}
      {unauthenticatedSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full text-center p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check text-green-600 text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Journey Begins!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for applying! We&apos;ve received your application and
              created an account for you. Your login details have been sent to
              your email. Please check your inbox (and spam folder) to access
              your applicant dashboard.
            </p>
            <button
              onClick={() => router.push("/accounts/login")}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Proceed to Login
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Basic Info */}
          <div className="lg:col-span-2">
            {/* Main Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="relative h-96 overflow-hidden">
                {opportunity.images.length > 0 ? (
                  <Image
                    src={opportunity.images[selectedImage]}
                    alt={opportunity.title}
                    width={800}
                    height={384}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <i className="fas fa-image text-gray-400 text-6xl"></i>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-blue-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {opportunity.type}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {opportunity.images.length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="grid grid-cols-4 gap-2">
                    {opportunity.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          selectedImage === index
                            ? "border-blue-600"
                            : "border-transparent"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          width={200}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                        {selectedImage === index && (
                          <div className="absolute inset-0 bg-blue-600 bg-opacity-20"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center space-x-4">
                {opportunity.companyLogo && (
                  <Image
                    src={opportunity.companyLogo}
                    alt={opportunity.company}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {opportunity.company}
                  </h3>
                  <p className="text-gray-600">
                    {campaignData?.campaign?.category?.name || "Healthcare"}{" "}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Position Overview
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  {opportunity.description}
                </p>
                <div className="whitespace-pre-line text-gray-600 leading-relaxed">
                  {opportunity.fullDescription}
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Requirements & Qualifications
              </h2>
              <ul className="space-y-3">
                {opportunity.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-3"></i>
                    <span className="text-gray-600">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Key Responsibilities
              </h2>
              <ul className="space-y-3">
                {opportunity.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start">
                    <i className="fas fa-circle text-blue-500 text-xs mt-2 mr-3"></i>
                    <span className="text-gray-600">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Application Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Application Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Apply for this Position
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <i className="fas fa-map-marker-alt mr-3 text-blue-600"></i>
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <i className="fas fa-clock mr-3 text-blue-600"></i>
                    <span>{opportunity.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <i className="fas fa-dollar-sign mr-3 text-blue-600"></i>
                    <span>{opportunity.salary}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <i className="fas fa-calendar-alt mr-3 text-blue-600"></i>
                    <span>
                      Apply by{" "}
                      {new Date(opportunity.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={
                    isAuthenticated
                      ? handleAuthenticatedApply
                      : () => setShowApplicationForm(true)
                  }
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-800 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                      Applying...
                    </div>
                  ) : (
                    "Apply Now"
                  )}
                </button>

                <button className="w-full border-2 border-blue-600 text-blue-600 py-4 rounded-xl font-semibold mt-3 hover:bg-blue-50 transition-all duration-300">
                  <i className="far fa-bookmark mr-2"></i>
                  Save Opportunity
                </button>
              </div>

              {/* Benefits Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Benefits & Perks
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {opportunity.benefits.slice(0, 6).map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-3"></i>
                      <span className="text-gray-600 text-sm">{benefit}</span>
                    </div>
                  ))}
                  {opportunity.benefits.length > 6 && (
                    <button className="text-blue-600 text-sm font-semibold mt-2 hover:text-blue-800 transition-colors duration-300">
                      +{opportunity.benefits.length - 6} more benefits
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Apply for {opportunity.title}
                </h2>
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                {opportunity.company} • {opportunity.location}
              </p>

              {submitError && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  {submitError}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitApplication} className="p-6">
              {/* Personal Information Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="whats_app"
                      value={formData.whats_app}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your WhatsApp number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passport Number *
                    </label>
                    <input
                      type="text"
                      name="passport_number"
                      value={formData.passport_number}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter passport number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nationality *
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your nationality"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Card Number *
                    </label>
                    <input
                      type="text"
                      name="id_card"
                      value={formData.id_card}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter ID card number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Document Uploads Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Documents & Files
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume/CV *
                    </label>
                    <input
                      type="file"
                      name="resume"
                      onChange={(e) => handleFileUpload(e, "resume")}
                      required
                      accept=".pdf,.doc,.docx"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX files only
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certifications (Optional)
                    </label>
                    <input
                      type="file"
                      name="certification"
                      onChange={(e) => handleFileUpload(e, "certification")}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Card Front *
                    </label>
                    <input
                      type="file"
                      name="card_image_front"
                      onChange={(e) => handleFileUpload(e, "card_image_front")}
                      required
                      accept=".jpg,.jpeg,.png"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Card Back *
                    </label>
                    <input
                      type="file"
                      name="card_image_back"
                      onChange={(e) => handleFileUpload(e, "card_image_back")}
                      required
                      accept=".jpg,.jpeg,.png"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo (Optional)
                    </label>
                    <input
                      type="file"
                      name="profile_photo"
                      onChange={(e) => handleFileUpload(e, "profile_photo")}
                      accept=".jpg,.jpeg,.png"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Brief summary about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter (Optional)
                    </label>
                    <input
                      type="file"
                      name="cover_letter"
                      onChange={(e) => handleFileUpload(e, "cover_letter")}
                      accept=".pdf,.doc,.docx"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX files only
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualifications
                    </label>
                    <textarea
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="List your relevant qualifications..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    <textarea
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your education background..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        name="linkedin_profile"
                        value={formData.linkedin_profile}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website/Portfolio
                      </label>
                      <input
                        type="url"
                        name="website_or_portfolio"
                        value={formData.website_or_portfolio}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Languages Spoken
                      </label>
                      <input
                        type="text"
                        name="languages_spoken"
                        value={formData.languages_spoken}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="English, Spanish, French..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Start Date
                      </label>
                      <input
                        type="date"
                        name="available_start_date"
                        value={formData.available_start_date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-blue-800 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OpportunityDetailPage;
