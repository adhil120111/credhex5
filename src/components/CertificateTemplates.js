import React, { useState } from 'react';
import { Award, BookOpen, Code, Shield, Briefcase, Star } from 'lucide-react';

const CertificateTemplates = ({ onSelectTemplate, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 'aws-architect',
      name: 'AWS Solutions Architect',
      category: 'Cloud Computing',
      icon: Shield,
      color: 'from-orange-500 to-red-600',
      data: {
        title: 'AWS Certified Solutions Architect - Associate',
        issuer: 'Amazon Web Services',
        description: 'Validates expertise in designing distributed systems on AWS',
        verification_url: 'https://aws.amazon.com/certification/verify/'
      }
    },
    {
      id: 'google-cloud',
      name: 'Google Cloud Professional',
      category: 'Cloud Computing',
      icon: Shield,
      color: 'from-blue-500 to-indigo-600',
      data: {
        title: 'Google Cloud Professional Cloud Architect',
        issuer: 'Google Cloud',
        description: 'Demonstrates ability to design and manage Google Cloud solutions',
        verification_url: 'https://cloud.google.com/certification/'
      }
    },
    {
      id: 'microsoft-azure',
      name: 'Microsoft Azure Fundamentals',
      category: 'Cloud Computing',
      icon: Shield,
      color: 'from-cyan-500 to-blue-600',
      data: {
        title: 'Microsoft Azure Fundamentals (AZ-900)',
        issuer: 'Microsoft',
        description: 'Foundational knowledge of cloud services and Microsoft Azure',
        verification_url: 'https://docs.microsoft.com/en-us/learn/certifications/'
      }
    },
    {
      id: 'cissp',
      name: 'CISSP Security',
      category: 'Cybersecurity',
      icon: Shield,
      color: 'from-red-500 to-pink-600',
      data: {
        title: 'Certified Information Systems Security Professional (CISSP)',
        issuer: '(ISC)² - International Information System Security Certification Consortium',
        description: 'Advanced cybersecurity certification for experienced professionals',
        verification_url: 'https://www.isc2.org/Certifications/CISSP'
      }
    },
    {
      id: 'pmp',
      name: 'Project Management Professional',
      category: 'Project Management',
      icon: Briefcase,
      color: 'from-green-500 to-emerald-600',
      data: {
        title: 'Project Management Professional (PMP)',
        issuer: 'Project Management Institute (PMI)',
        description: 'Globally recognized project management certification',
        verification_url: 'https://www.pmi.org/certifications/project-management-pmp'
      }
    },
    {
      id: 'scrum-master',
      name: 'Certified Scrum Master',
      category: 'Agile/Scrum',
      icon: Star,
      color: 'from-purple-500 to-violet-600',
      data: {
        title: 'Certified ScrumMaster (CSM)',
        issuer: 'Scrum Alliance',
        description: 'Demonstrates understanding of Scrum framework and ability to act as Scrum Master',
        verification_url: 'https://www.scrumalliance.org/get-certified/scrum-master-track/certified-scrummaster'
      }
    },
    {
      id: 'comptia-security',
      name: 'CompTIA Security+',
      category: 'Cybersecurity',
      icon: Shield,
      color: 'from-red-600 to-orange-600',
      data: {
        title: 'CompTIA Security+ Certification',
        issuer: 'CompTIA',
        description: 'Entry-level cybersecurity certification covering essential security skills',
        verification_url: 'https://www.comptia.org/certifications/security'
      }
    },
    {
      id: 'cisco-ccna',
      name: 'Cisco CCNA',
      category: 'Networking',
      icon: Code,
      color: 'from-blue-600 to-cyan-600',
      data: {
        title: 'Cisco Certified Network Associate (CCNA)',
        issuer: 'Cisco',
        description: 'Foundation-level networking certification covering network fundamentals',
        verification_url: 'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html'
      }
    },
    {
      id: 'oracle-java',
      name: 'Oracle Java Certification',
      category: 'Programming',
      icon: Code,
      color: 'from-orange-600 to-red-600',
      data: {
        title: 'Oracle Certified Professional Java SE Developer',
        issuer: 'Oracle',
        description: 'Validates Java programming skills and knowledge',
        verification_url: 'https://education.oracle.com/oracle-certification-path/pFamily_48'
      }
    },
    {
      id: 'salesforce-admin',
      name: 'Salesforce Administrator',
      category: 'CRM/Business',
      icon: Briefcase,
      color: 'from-blue-500 to-teal-600',
      data: {
        title: 'Salesforce Certified Administrator',
        issuer: 'Salesforce',
        description: 'Demonstrates skills to configure and manage Salesforce applications',
        verification_url: 'https://trailhead.salesforce.com/credentials/administrator'
      }
    },
    {
      id: 'coursera-course',
      name: 'Online Course Certificate',
      category: 'Education',
      icon: BookOpen,
      color: 'from-indigo-500 to-purple-600',
      data: {
        title: 'Course Completion Certificate',
        issuer: 'Online Learning Platform',
        description: 'Certificate of completion for online course or specialization'
      }
    },
    {
      id: 'custom',
      name: 'Custom Certificate',
      category: 'Other',
      icon: Award,
      color: 'from-gray-500 to-gray-600',
      data: {
        title: '',
        issuer: '',
        description: 'Create a custom certificate entry'
      }
    }
  ];

  const categories = [...new Set(templates.map(t => t.category))];

  const handleSelectTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate.data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Choose Certificate Template</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-300 mb-4">Select a template to quickly add common certificates with pre-filled information:</p>
          </div>

          {categories.map(category => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-medium text-white mb-4 border-b border-gray-700 pb-2">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.filter(t => t.category === category).map(template => {
                  const IconComponent = template.icon;
                  return (
                    <div
                      key={template.id}
                      className={`cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                        selectedTemplate?.id === template.id
                          ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-700 hover:bg-gray-650'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="p-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center mb-3`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-medium text-white mb-1">{template.name}</h4>
                        <p className="text-sm text-gray-400">{template.category}</p>
                        {template.data.title && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{template.data.title}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-700">
            <button
              onClick={handleSelectTemplate}
              disabled={!selectedTemplate}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Use Selected Template
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplates;