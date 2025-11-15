"use client";
import React from "react";
import Image from "next/image";
import Header from "./Header";

function AboutPage() {
  const services = [
    {
      icon: "fas fa-plane-departure",
      title: "Immigration Services",
      description:
        "Complete visa processing with expert guidance for higher approval rates",
      features: [
        "Visa Application",
        "Document Preparation",
        "Interview Coaching",
        "Approval Tracking",
      ],
    },
    {
      icon: "fas fa-briefcase",
      title: "Global Job Placement",
      description: "International career opportunities with relocation support",
      features: [
        "Job Matching",
        "Relocation Assistance",
        "Career Counseling",
        "Employer Connections",
      ],
    },
    {
      icon: "fas fa-graduation-cap",
      title: "Education Abroad",
      description: "University admissions and scholarships worldwide",
      features: [
        "University Placement",
        "Scholarship Assistance",
        "Admission Processing",
        "Student Visa",
      ],
    },
    {
      icon: "fas fa-passport",
      title: "Visa Expertise",
      description: "20+ years of immigration experience ensuring success",
      features: [
        "Expert Consultation",
        "Document Verification",
        "Application Review",
        "Success Strategy",
      ],
    },
  ];

  const immigrationExperts = [
    {
      id: 1,
      name: "Robert Martinez",
      position: "Chief Immigration Officer",
      experience: "25 years",
      expertise: "US, Canada, UK Visas",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      successRate: "98%",
      description:
        "Former immigration officer with extensive knowledge of visa regulations",
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      position: "Education Migration Specialist",
      experience: "20 years",
      expertise: "Student Visas, Scholarships",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      successRate: "96%",
      description:
        "Education consultant specializing in international student placements",
    },
    {
      id: 3,
      name: "Michael Chen",
      position: "Work Visa Specialist",
      experience: "22 years",
      expertise: "Work Permits, Sponsorship",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      successRate: "95%",
      description:
        "Expert in employment-based immigration and work authorization",
    },
    {
      id: 4,
      name: "Aisha Patel",
      position: "Documentation Specialist",
      experience: "18 years",
      expertise: "Document Preparation",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80",
      successRate: "99%",
      description:
        "Perfectionist in visa documentation and application preparation",
    },
  ];

  const successStats = [
    { number: "10,000+", label: "Successful Visa Approvals" },
    { number: "50+", label: "Countries Covered" },
    { number: "20+", label: "Years of Expertise" },
    { number: "98%", label: "Success Rate" },
    { number: "15,000+", label: "Global Placements" },
    { number: "500+", label: "University Partners" },
  ];

  const visaProcess = [
    {
      step: "01",
      title: "Consultation & Assessment",
      description:
        "Comprehensive evaluation of your profile and immigration options",
    },
    {
      step: "02",
      title: "Document Preparation",
      description:
        "Expert guidance in preparing flawless application documents",
    },
    {
      step: "03",
      title: "Application Submission",
      description: "Professional handling of your visa application process",
    },
    {
      step: "04",
      title: "Interview Preparation",
      description: "Mock interviews and coaching for visa success",
    },
    {
      step: "05",
      title: "Visa Approval & Relocation",
      description: "Support from approval through to your relocation",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-800 to-blue-600 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Your Gateway to Global Opportunities
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Expert immigration services combined with global job and education
            opportunities. With 20+ years of experience, we make your
            international dreams achievable and stress-free.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-800 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Start Your Visa Process
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-800 transition-all duration-300">
              Free Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Success Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
            {successStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Comprehensive Global Services
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              End-to-end solutions for immigration, employment, and education
              abroad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <i
                    className={`${service.icon} text-blue-600 group-hover:text-white text-2xl transition-colors duration-300`}
                  ></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, featureIndex) => (
                    <span
                      key={featureIndex}
                      className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Immigration Experts */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Meet Our Immigration Experts
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              With over 20 years of combined experience, our team ensures your
              visa success
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {immigrationExperts.map((expert) => (
              <div
                key={expert.id}
                className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    width={300}
                    height={192}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {expert.successRate} Success
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {expert.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-2">
                    {expert.position}
                  </p>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <i className="fas fa-award text-yellow-500 mr-2"></i>
                    <span>{expert.experience} Experience</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {expert.description}
                  </p>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-blue-800 text-sm font-semibold">
                      Specializes in: {expert.expertise}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa Process */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-800 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Proven Visa Success Process
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              A structured approach that maximizes your chances of visa approval
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {visaProcess.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-white group-hover:text-blue-600 transition-all duration-300">
                    <span className="text-2xl font-bold">{step.step}</span>
                  </div>
                  {index < visaProcess.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-1/2 w-full h-1 bg-white/30 transform translate-x-10">
                      <div className="h-1 bg-white/50 group-hover:bg-white transition-all duration-300"></div>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
                Why Dream Abroad Stands Out
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-shield-alt text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Proven Track Record
                    </h3>
                    <p className="text-gray-600">
                      98% visa approval rate with 10,000+ successful
                      applications across 50+ countries
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-users text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Expert Team
                    </h3>
                    <p className="text-gray-600">
                      Former immigration officers and industry experts with 20+
                      years of combined experience
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-hand-holding-heart text-purple-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Stress-Free Process
                    </h3>
                    <p className="text-gray-600">
                      We handle all documentation, submissions, and follow-ups
                      while you focus on your preparation
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-globe text-orange-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Global Network
                    </h3>
                    <p className="text-gray-600">
                      Partnerships with 500+ universities and employers
                      worldwide for seamless placements
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1551836026-d5cbc2f0c53a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Visa Success"
                width={588}
                height={384}
                className="rounded-2xl shadow-2xl w-full h-64 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl flex items-end p-6">
                <p className="text-white text-lg font-semibold">
                  Transforming visa dreams into reality since 2003
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-green-600 to-green-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Begin Your Global Journey?
          </h2>
          <p className="text-green-100 text-xl mb-8 max-w-2xl mx-auto">
            Let our 20+ years of immigration expertise guide you to success.
            Schedule your free consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-800 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Free Visa Assessment
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-green-800 transition-all duration-300">
              Speak with an Expert
            </button>
          </div>
          <p className="text-green-200 text-sm mt-6">
            ✅ 98% Success Rate • 🕐 20+ Years Experience • 🌍 50+ Countries
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sky-500 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-white">
                Dream Abroad
              </h3>
              <p className="text-white/80 leading-relaxed">
                Your trusted partner for global immigration, education, and
                career opportunities. 20+ years of expertise in visa success.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-white">
                Visa Services
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Work Visas
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Student Visas
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Family Immigration
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Permanent Residency
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-white">
                Opportunities
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Global Jobs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Study Abroad
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Scholarships
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Relocation Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-white">
                Contact Experts
              </h3>
              <div className="space-y-3 text-white/80">
                <p className="flex items-center">
                  <i className="fas fa-phone mr-3"></i>
                  +44 7715 870911
                </p>
                <p className="flex items-center">
                  <i className="fas fa-envelope mr-3"></i>
                  visa@dreamexplore.com
                </p>
                <p className="flex items-center">
                  <i className="fas fa-clock mr-3"></i>
                  Mon-Fri: 9AM-6PM
                </p>
              </div>
              <div className="flex space-x-4 mt-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-sky-500 transition-all duration-300"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-sky-500 transition-all duration-300"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-sky-500 transition-all duration-300"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20 text-center text-white/80">
            <p>
              &copy; 2024 Dream Abroad Immigration Services. All rights
              reserved. Trusted by thousands for visa success since 2003.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AboutPage;
