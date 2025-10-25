"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";

function ContactPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeForm, setActiveForm] = useState("general");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    service: "",
    message: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Thank you for your inquiry! We'll contact you within 24 hours.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      country: "",
      service: "",
      message: "",
    });
  };

  const officeLocations = [
    {
      id: 1,
      country: "United Kingdom",
      city: "Bishop's Stortford",
      address: "12 Potter Street, Bishop's Stortford, Hertfordshire CM23 3UT",
      phone: "+44 (0) 1279 654 321",
      email: "uk@dreamabroadopportunities.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM",
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      coordinates: { lat: 51.8717, lng: 0.1589 },
    },
    {
      id: 2,
      country: "Canada",
      city: "Stratford",
      address: "17 Ontario Street, Stratford, Ontario N5A 3H1",
      phone: "+1 (519) 271-4567",
      email: "canada@dreamabroadopportunities.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM",
      image:
        "https://images.unsplash.com/photo-1543365067-f488401f5c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      coordinates: { lat: 43.37, lng: -80.982 },
    },
    {
      id: 3,
      country: "United States",
      city: "Bend",
      address: "234 Bond Street, Bend, Oregon 97701",
      phone: "+1 (541) 123-4567",
      email: "us@dreamabroadopportunities.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM",
      image:
        "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      coordinates: { lat: 44.0582, lng: -121.3153 },
    },
  ];

  const contactMethods = [
    {
      icon: "fas fa-phone",
      title: "Call Us",
      description: "Speak directly with our immigration experts",
      details: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: "fas fa-envelope",
      title: "Email Us",
      description: "Send us your questions and documents",
      details: "info@dreamabroadopportunities.com",
      action: "mailto:info@dreamabroadopportunities.com",
    },
    {
      icon: "fas fa-comments",
      title: "Live Chat",
      description: "Instant messaging with our support team",
      details: "Available 24/7",
      action: "#chat",
    },
    {
      icon: "fas fa-video",
      title: "Video Call",
      description: "Face-to-face virtual consultation",
      details: "Schedule online",
      action: "/book-interview",
    },
  ];

  const inquiryTypes = [
    {
      id: "general",
      title: "General Inquiry",
      description: "General questions about our services",
    },
    {
      id: "visa",
      title: "Visa Consultation",
      description: "Specific visa and immigration questions",
    },
    {
      id: "employment",
      title: "Job Placement",
      description: "International employment opportunities",
    },
    {
      id: "education",
      title: "Study Abroad",
      description: "University admissions and scholarships",
    },
  ];

  const faqs = [
    {
      question: "How long does the visa process typically take?",
      answer:
        "Processing times vary by country and visa type. Generally, it takes 4-8 weeks for most applications, but some complex cases may take longer.",
    },
    {
      question: "Do you offer refunds if my application is denied?",
      answer:
        "We offer partial refunds based on our service agreement. Our 98% success rate ensures most applications are approved.",
    },
    {
      question: "Can you help with family sponsorship applications?",
      answer:
        "Yes, we specialize in family sponsorship and reunification services across all our service countries.",
    },
    {
      question: "What documents do I need to start the process?",
      answer:
        "Basic requirements include passport, educational certificates, work experience letters, and financial documents. We provide a complete checklist during consultation.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-800 to-blue-600 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Get In Touch With Us
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Ready to start your global journey? Our immigration experts are here
            to guide you every step of the way. Contact us today for
            personalized assistance.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() =>
                document
                  .getElementById("contact-form")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="bg-white text-blue-800 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Send Message
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("locations")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-800 transition-all duration-300"
            >
              Visit Our Offices
            </button>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Multiple Ways to Connect
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose the most convenient way to reach our immigration experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() => {
                  if (
                    method.action.startsWith("http") ||
                    method.action.startsWith("/")
                  ) {
                    router.push(method.action);
                  } else if (
                    method.action.startsWith("tel:") ||
                    method.action.startsWith("mailto:")
                  ) {
                    window.location.href = method.action;
                  }
                }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                  <i
                    className={`${method.icon} text-blue-600 group-hover:text-white text-2xl transition-colors duration-300`}
                  ></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {method.description}
                </p>
                <div className="text-blue-600 font-semibold">
                  {method.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section
        id="locations"
        className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Our Global Offices
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Visit us at any of our conveniently located offices worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {officeLocations.map((office) => (
              <div
                key={office.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url(${office.image})` }}
                  ></div>
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {office.country}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {office.city} Office
                  </h3>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start">
                      <i className="fas fa-map-marker-alt text-blue-600 mt-1 mr-3"></i>
                      <p className="text-gray-600 text-sm">{office.address}</p>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-phone text-blue-600 mr-3"></i>
                      <p className="text-gray-600 text-sm">{office.phone}</p>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-envelope text-blue-600 mr-3"></i>
                      <p className="text-gray-600 text-sm">{office.email}</p>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-clock text-blue-600 mr-3"></i>
                      <p className="text-gray-600 text-sm">{office.hours}</p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() =>
                        (window.location.href = `tel:${office.phone.replace(
                          /[^0-9+]/g,
                          ""
                        )}`)
                      }
                      className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300"
                    >
                      Call Office
                    </button>
                    <button
                      onClick={() =>
                        window.open(
                          `https://maps.google.com/?q=${office.address}`,
                          "_blank"
                        )
                      }
                      className="px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <i className="fas fa-directions"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Inquiry Type Selection */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
                Send Us a Message
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Tell us about your immigration goals and we'll match you with
                the perfect expert
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {inquiryTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setActiveForm(type.id)}
                    className={`p-4 rounded-2xl text-left transition-all duration-300 ${
                      activeForm === type.id
                        ? "bg-blue-600 text-white shadow-lg transform -translate-y-1"
                        : "bg-gray-50 text-gray-700 hover:shadow-md hover:-translate-y-1"
                    }`}
                  >
                    <div className="font-semibold mb-1">{type.title}</div>
                    <div className="text-sm opacity-70">{type.description}</div>
                  </button>
                ))}
              </div>

              {/* FAQ Section */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Country of Interest *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select a country</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="USA">United States</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Service Interested In *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select a service</option>
                    <option value="visa">Visa Processing</option>
                    <option value="employment">Job Placement</option>
                    <option value="education">Study Abroad</option>
                    <option value="family">Family Immigration</option>
                    <option value="business">Business Immigration</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Tell us about your immigration goals, timeline, and any specific questions..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  Send Message to Experts
                </button>

                <p className="text-gray-500 text-sm text-center">
                  We typically respond within 2-4 hours during business hours
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Need Immediate Assistance?
          </h2>
          <p className="text-green-100 text-xl mb-8 max-w-2xl mx-auto">
            Call us now for urgent immigration inquiries or schedule a same-day
            consultation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => (window.location.href = "tel:+15551234567")}
              className="bg-white text-green-800 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Call Now: +1 (555) 123-4567
            </button>
            <button
              onClick={() => router.push("/book-interview")}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-green-800 transition-all duration-300"
            >
              Emergency Consultation
            </button>
          </div>
          <p className="text-green-200 text-sm mt-6">
            ✅ 24/7 Emergency Support • 🕐 Same-Day Appointments • 🌍 Global
            Coverage
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
                career opportunities. 20+ years of expertise in international
                success.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-white">
                Our Offices
              </h3>
              <ul className="space-y-3 text-white/80">
                <li>Bishop's Stortford, UK</li>
                <li>Stratford, Canada</li>
                <li>Bend, USA</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-white">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-white">
                Emergency Contact
              </h3>
              <div className="space-y-3 text-white/80">
                <p className="flex items-center">
                  <i className="fas fa-phone mr-3"></i>
                  +1 (555) 123-4567
                </p>
                <p className="flex items-center">
                  <i className="fas fa-envelope mr-3"></i>
                  urgent@dreamabroadopportunities.com
                </p>
                <p className="flex items-center">
                  <i className="fas fa-clock mr-3"></i>
                  24/7 Emergency Line
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
              reserved. Trusted by thousands for international success since
              2003.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ContactPage;
