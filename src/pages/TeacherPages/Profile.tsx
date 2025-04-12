import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Topbar from "components/Topbar";
import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";
import { Pencil, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

// Type definitions
type ContactInfo = {
  primary_number: string;
  secondary_number: string;
  primary_email_id: string;
  secondary_email_id: string;
  current_address: string;
  permanent_address: string;
};

type Dependent = {
  dependent_name: string;
  relation: string;
  date_of_birth: string;
};

type Education = {
  education_level: string;
  institution: string;
  specialization: string;
  field_of_study: string;
  year_of_passing: number | null;
  percentage: number | null;
};

type Employee = {
  date_of_hire: string;
  dob: string;
  gender: string;
  marital_status: string;
  nationality: string;
};

type EmergencyContact = {
  emergency_contact_name: string;
  relation: string;
  emergency_contact_number: number | null;
};

type Languages = {
  languages: string;
};

type Skill = {
  skill: string;
  certification: string;
  license: string;
};

type TeacherData = {
  Teacher_id?: string;
  name: string;
  email: string;
  profile_photo?: string;
  contact_info: ContactInfo;
  dependent: Dependent;
  education: Education;
  employee: Employee;
  emergency_contact: EmergencyContact;
  languages_spoken: Languages;
  skill: Skill;
};

const TeacherProfile = () => {
  const { user }:any = useAuthContext();
  const [activeSection, setActiveSection] = useState('Personal Info');
  const [userData, setUserData] = useState<TeacherData>({
    name: "",
    email: "",
    contact_info: {
      primary_number: "",
      secondary_number: "",
      primary_email_id: "",
      secondary_email_id: "",
      current_address: "",
      permanent_address: "",
    },
    dependent: {
      dependent_name: "",
      relation: "",
      date_of_birth: "",
    },
    education: {
      education_level: "",
      institution: "",
      specialization: "",
      field_of_study: "",
      year_of_passing: null,
      percentage: null,
    },
    employee: {
      date_of_hire: "",
      dob: "",
      gender: "",
      marital_status: "",
      nationality: "",
    },
    emergency_contact: {
      emergency_contact_name: "",
      relation: "",
      emergency_contact_number: null,
    },
    languages_spoken: {
      languages: "",
    },
    skill: {
      skill: "",
      certification: "",
      license: "",
    },
  });

  const profilePhotoUrl = userData?.profile_photo || '/api/placeholder/150/150';

  useEffect(() => {
    getMyData();
  }, [user.user_id, user.token]);

  const getMyData = async () => {
    try {
      const response = await axios.get(`api/teachers/${user.user_id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      Swal.fire({
        text: "Failed to load profile data, please Edit profile",
        icon: "error",
        confirmButtonColor: "#7066E0",
      });
    }
  };

  const renderField = (label: string, value: string | number | null) => (
    <div className="flex justify-between border-b-2 py-2">
      <span className="font-semibold w-1/3 text-indigo-500 text-lg">
        {label}:
      </span>
      <span className="w-2/3">{value || "N/A"}</span>
    </div>
  );

  const renderSection = () => {
    const sections = {
      'Personal Info': () => (
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-lg font-semibold">Personal Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderField("Name", userData.name)}
            {/* {renderField("Email", userData.email)} */}
            {renderField("Date of Birth", userData.employee.dob)}
            {renderField("Gender", userData.employee.gender)}
            {renderField("Nationality", userData.employee.nationality)}
            {renderField("Marital Status", userData.employee.marital_status)}
            {renderField("Date of Hire", userData.employee.date_of_hire)}
          </CardContent>
        </Card>
      ),

      'Contact Info': () => (
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-lg font-semibold">Contact Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderField("Primary Number", userData.contact_info.primary_number)}
            {renderField("Secondary Number", userData.contact_info.secondary_number)}
            {renderField("Primary Email", userData.contact_info.primary_email_id)}
            {renderField("Secondary Email", userData.contact_info.secondary_email_id)}
            {renderField("Current Address", userData.contact_info.current_address)}
            {renderField("Permanent Address", userData.contact_info.permanent_address)}
          </CardContent>
        </Card>
      ),

      'Education': () => (
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-lg font-semibold">Education Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderField("Education Level", userData.education.education_level)}
            {renderField("Institution", userData.education.institution)}
            {renderField("Specialization", userData.education.specialization)}
            {renderField("Field of Study", userData.education.field_of_study)}
            {renderField("Year of Passing", userData.education.year_of_passing)}
            {renderField("Percentage", userData.education.percentage)}
          </CardContent>
        </Card>
      ),

      'Emergency Contact': () => (
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-lg font-semibold">Emergency Contact</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderField("Name", userData.emergency_contact.emergency_contact_name)}
            {renderField("Relation", userData.emergency_contact.relation)}
            {renderField("Contact Number", userData.emergency_contact.emergency_contact_number)}
          </CardContent>
        </Card>
      ),

      'Skills & Languages': () => (
        <Card className="w-full">
          <CardHeader>
            <h2 className="text-lg font-semibold">Skills and Languages</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Skills</h3>
              {renderField("Skills", userData.skill.skill)}
              {renderField("Certification", userData.skill.certification)}
              {renderField("License", userData.skill.license)}
            </div>
            <div>
              <h3 className="text-md font-semibold mb-2">Languages</h3>
              {renderField("Languages Spoken", userData.languages_spoken.languages)}
            </div>
          </CardContent>
        </Card>
      ),
    };

    return sections[activeSection]?.() || null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar heading="Teacher Profile" />
      
      <div className="flex  items-start p-8 gap-8">
        {/* Sidebar */}
        <div className="w-80 bg-white rounded-lg shadow-lg p-6 h-[49rem]">
          <div className="flex flex-col items-center space-y-4">
          <UserCircle size={80} className="text-gray-600" />
            
            <h2 className="text-2xl font-bold text-center">
              {userData.name || 'Teacher'}
            </h2>
            
            <Link
              to="/dashboard/Edit"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit profile
            </Link>

            <nav className="w-full mt-6">
              <ul className="space-y-2">
                {['Personal Info', 'Contact Info', 'Education', 'Emergency Contact', 'Skills & Languages'].map((section) => (
                  <li
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`
                      p-3 rounded cursor-pointer transition-colors
                      ${activeSection === section 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'hover:bg-gray-100'}
                    `}
                  >
                    {section}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-4xl">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;