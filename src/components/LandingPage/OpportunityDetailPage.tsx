"use client"
import React, { useState } from 'react';

function OpportunityDetailPage() {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: '',
    experience: '',
    qualifications: ''
  });

  // Sample opportunity data - in real app, this would come from props or API
  const opportunity = {
    id: 7,
    title: "Registered Nurse - ICU Specialist",
    type: "Nursing Job",
    location: "London, UK",
    duration: "Full-time",
    salary: "£45,000 - £55,000",
    deadline: "2024-03-20",
    company: "Royal London Hospital",
    companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1460&q=80",
    
    images: [
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1467&q=80",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
    ],
    
    description: "Join our state-of-the-art intensive care unit at Royal London Hospital, where you'll work with cutting-edge medical technology and receive comprehensive training programs. This position offers the opportunity to work in one of the UK's leading healthcare facilities with a dedicated team of healthcare professionals.",
    
    fullDescription: `
      As an ICU Specialist Nurse at Royal London Hospital, you will be at the forefront of critical care medicine. Our 30-bed intensive care unit serves a diverse patient population with complex medical needs. You'll work alongside a multidisciplinary team including consultants, physiotherapists, and other healthcare professionals to deliver exceptional patient care.

      Key aspects of this role include:
      • Managing critically ill patients requiring advanced life support
      • Utilizing state-of-the-art monitoring and life support equipment
      • Participating in clinical research and quality improvement initiatives
      • Mentoring junior staff and nursing students
      • Collaborating with the rapid response team for hospital-wide emergencies

      We are committed to your professional development and offer:
      • Comprehensive orientation program
      • Regular in-service training and workshops
      • Opportunities for advanced certification in critical care
      • Support for further education and specialization
      • Career progression pathways to senior nursing roles
    `,
    
    requirements: [
      "Valid NMC registration",
      "Bachelor of Science in Nursing (BSN) or equivalent",
      "Minimum 2 years of ICU experience",
      "Advanced Cardiac Life Support (ACLS) certification",
      "Pediatric Advanced Life Support (PALS) preferred",
      "Excellent communication and teamwork skills",
      "Ability to work in high-pressure environments"
    ],
    
    responsibilities: [
      "Provide comprehensive nursing care to critically ill patients",
      "Monitor and interpret patient vital signs and diagnostic data",
      "Administer medications and treatments as prescribed",
      "Operate and maintain specialized ICU equipment",
      "Collaborate with multidisciplinary healthcare team",
      "Educate patients and families about care plans",
      "Maintain accurate patient records and documentation",
      "Participate in emergency response and code blue situations"
    ],
    
    benefits: [
      "Competitive salary package with London weighting",
      "Comprehensive health insurance including dental and vision",
      "Generous annual leave allowance (35 days including bank holidays)",
      "NHS pension scheme with employer contributions",
      "Professional development and training opportunities",
      "Relocation assistance for eligible candidates",
      "Subsidized accommodation options",
      "Free on-site fitness center and wellness programs",
      "Cycle to work scheme",
      "Employee assistance program",
      "Opportunities for international rotations",
      "Research and publication support"
    ],
    
    applicationProcess: [
      "Submit online application with CV",
      "Initial phone screening (15-20 minutes)",
      "Technical interview with nursing managers",
      "Practical assessment and scenario testing",
      "Final interview with department head",
      "Reference checks and background verification",
      "Job offer and onboarding process"
    ]
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setFormData(prev => ({ ...prev, resume: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Application submitted:', formData);
    setShowApplicationForm(false);
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      resume: null,
      coverLetter: '',
      experience: '',
      qualifications: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center py-4">
            <a href="#" className="flex items-center text-2xl font-bold text-blue-800">
              <i className="fas fa-globe-americas mr-2 text-2xl"></i>
              DreamExplore
            </a>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-blue-800 transition-colors duration-300">
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Opportunities
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Basic Info */}
          <div className="lg:col-span-2">
            {/* Main Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="relative h-96 overflow-hidden">
                <img 
                  src={opportunity.images[selectedImage]}
                  alt={opportunity.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-blue-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {opportunity.type}
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-4 gap-2">
                  {opportunity.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index ? 'border-blue-600' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-blue-600 bg-opacity-20"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center space-x-4">
                <img 
                  src={opportunity.companyLogo} 
                  alt={opportunity.company}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{opportunity.company}</h3>
                  <p className="text-gray-600">Leading Healthcare Provider</p>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Position Overview</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">{opportunity.description}</p>
                <div className="whitespace-pre-line text-gray-600 leading-relaxed">
                  {opportunity.fullDescription}
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Requirements & Qualifications</h2>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Responsibilities</h2>
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
                <h3 className="text-xl font-bold text-gray-800 mb-4">Apply for this Position</h3>
                
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
                    <span>Apply by {new Date(opportunity.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full bg-gradient-to-r from-blue-800 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  Apply Now
                </button>

                <button className="w-full border-2 border-blue-600 text-blue-600 py-4 rounded-xl font-semibold mt-3 hover:bg-blue-50 transition-all duration-300">
                  <i className="far fa-bookmark mr-2"></i>
                  Save Opportunity
                </button>
              </div>

              {/* Benefits Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Benefits & Perks</h3>
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Apply for {opportunity.title}</h2>
                <button 
                  onClick={() => setShowApplicationForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <p className="text-gray-600 mt-2">{opportunity.company} • {opportunity.location}</p>
            </div>

            <form onSubmit={handleSubmitApplication} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume *
                  </label>
                  <input
                    type="file"
                    name="resume"
                    onChange={handleInputChange}
                    required
                    accept=".pdf,.doc,.docx"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relevant Experience
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Describe your relevant experience..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualifications
                </label>
                <textarea
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="List your relevant qualifications..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-800 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  Submit Application
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