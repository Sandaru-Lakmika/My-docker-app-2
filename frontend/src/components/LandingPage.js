import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center group">
                            <div className="bg-indigo-600 p-2 rounded-lg mr-3 transition-transform group-hover:scale-110">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-gray-900">AutoCare</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/signin" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Sign In</Link>
                            <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium btn-press shadow-md hover:shadow-lg">Get Started</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
                        <div className="text-center lg:text-left animate-fade-in-up">
                            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                                <span className="block">Your Car Deserves</span>
                                <span className="block text-indigo-200">The Best Care</span>
                            </h1>
                            <p className="mt-6 text-lg text-indigo-100 sm:text-xl max-w-xl mx-auto lg:mx-0">
                                Professional car service booking made simple. Schedule your vehicle maintenance with certified technicians at your convenience. Quality service, transparent pricing.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-indigo-700 bg-white hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all duration-200 btn-press group"
                                >
                                    <svg className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    Book Service Now
                                </Link>
                                <Link
                                    to="/signin"
                                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-base font-bold rounded-xl text-white hover:bg-white hover:text-indigo-700 transition-all duration-200 btn-press"
                                >
                                    Sign In
                                </Link>
                            </div>
                            <div className="mt-6">
                                <Link
                                    to="/admin/signin"
                                    className="inline-flex items-center text-sm font-medium text-indigo-200 hover:text-white transition-colors group"
                                >
                                    <svg className="w-4 h-4 mr-1 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    </svg>
                                    Admin Portal
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:block mt-12 lg:mt-0 animate-fade-in" style={{ animationDelay: '300ms' }}>
                            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center card-hover">
                                        <div className="text-3xl font-bold text-white">500+</div>
                                        <div className="text-indigo-200 text-sm">Happy Customers</div>
                                    </div>
                                    <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center card-hover">
                                        <div className="text-3xl font-bold text-white">50+</div>
                                        <div className="text-indigo-200 text-sm">Expert Technicians</div>
                                    </div>
                                    <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center card-hover">
                                        <div className="text-3xl font-bold text-white">10+</div>
                                        <div className="text-indigo-200 text-sm">Service Types</div>
                                    </div>
                                    <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center card-hover">
                                        <div className="text-3xl font-bold text-white">24/7</div>
                                        <div className="text-indigo-200 text-sm">Support Available</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center animate-fade-in">
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Services</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Complete Car Care Solutions
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                            From routine maintenance to major repairs, we've got you covered
                        </p>
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Service Cards */}
                        {[
                            { icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", title: "Oil Change", desc: "Regular oil changes to keep your engine running smoothly" },
                            { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Brake Service", desc: "Complete brake inspection, repair, and replacement services" },
                            { icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", title: "Engine Repair", desc: "Expert engine diagnostics and repair services" },
                            { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", title: "Transmission", desc: "Transmission fluid change and complete overhaul" },
                            { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Battery Service", desc: "Battery testing, charging, and replacement" },
                            { icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "AC Service", desc: "Air conditioning repair and maintenance" },
                        ].map((service, index) => (
                            <div 
                                key={index} 
                                className="bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-300 card-hover group animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-indigo-600 group-hover:scale-110">
                                    <svg className="w-6 h-6 text-indigo-600 transition-colors group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={service.icon}></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{service.title}</h3>
                                <p className="text-gray-600">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                        <div className="animate-fade-in">
                            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Why Choose Us</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Trusted by Car Owners Everywhere
                            </p>
                            <p className="mt-4 text-lg text-gray-500">
                                We combine expertise, quality parts, and exceptional customer service to provide the best car care experience.
                            </p>

                            <div className="mt-10 space-y-6">
                                {[
                                    { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Certified Technicians", desc: "All our mechanics are professionally trained and certified" },
                                    { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Transparent Pricing", desc: "No hidden fees, get accurate quotes before any work begins" },
                                    { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Quick Turnaround", desc: "Most services completed same-day for your convenience" },
                                ].map((feature, index) => (
                                    <div 
                                        key={index} 
                                        className="flex items-start group animate-fade-in-up"
                                        style={{ animationDelay: `${index * 150}ms` }}
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon}></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{feature.title}</h4>
                                            <p className="mt-1 text-gray-500">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-12 lg:mt-0 animate-fade-in" style={{ animationDelay: '300ms' }}>
                            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 card-hover">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Book Your Service Today</h3>
                                <div className="space-y-4">
                                    {[
                                        { num: 1, text: "Create your free account" },
                                        { num: 2, text: "Select your service type" },
                                        { num: 3, text: "Choose date & time" },
                                        { num: 4, text: "Get your car serviced!" },
                                    ].map((step, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center p-4 bg-indigo-50 rounded-xl transition-all duration-300 hover:bg-indigo-100 hover:translate-x-2"
                                            style={{ animationDelay: `${(index + 1) * 100}ms` }}
                                        >
                                            <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 transition-transform hover:scale-110">{step.num}</div>
                                            <span className="text-gray-700">{step.text}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    to="/signup"
                                    className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all duration-200 btn-press shadow-lg hover:shadow-xl group"
                                >
                                    Get Started Free
                                    <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-indigo-700 to-purple-700 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
                </div>
                <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl animate-fade-in">
                        <span className="block">Ready to get started?</span>
                        <span className="block text-indigo-200">Book your first service today.</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <div className="inline-flex rounded-xl shadow-lg">
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-indigo-600 bg-white hover:bg-indigo-50 transition-all duration-200 btn-press group"
                            >
                                Get started
                                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                            </Link>
                        </div>
                        <div className="ml-3 inline-flex rounded-xl">
                            <Link
                                to="/signin"
                                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-bold rounded-xl text-white hover:bg-white hover:text-indigo-600 transition-all duration-200 btn-press"
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0 group">
                            <div className="bg-indigo-600 p-2 rounded-lg mr-3 transition-transform group-hover:scale-110">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white">AutoCare</span>
                        </div>
                        <div className="flex items-center space-x-6 mb-4 md:mb-0">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <span className="sr-only">Facebook</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <span className="sr-only">Twitter</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <span className="sr-only">Instagram</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                </svg>
                            </a>
                        </div>
                        <p className="text-gray-400 text-sm">
                            © 2026 AutoCare Service Center. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;