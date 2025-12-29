import appointment_img from './appointment_img.png'
import admin_logo from './admin_logo.svg'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import doctor_placeholder from './doctor_placeholder.svg'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import people_icon from './people_icon.svg'
import appointment_icon from './appointment_icon.svg'
import home_icon from './home_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'



export const assets = {
    admin_logo,
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo,
    people_icon,
    appointment_icon,
    home_icon,
    doctor_placeholder

}

export const specialityData = [
    {
        speciality: 'General physician',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Richard James',
        image: doc1,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        email: 'doctor1@example.com', // ADD THESE
        password: 'pass1'
    },
    {
        _id: 'doc2',
        name: 'Dr. Emily Larson',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        email: 'doctor2@example.com', // ADD THESE
        password: 'pass2'
    },
    {
        _id: 'doc3',
        name: 'Dr. Rishi Patel',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        email: 'doctor3@example.com', // ADD THESE
        password: 'pass3'
    },
    {
        _id: 'doc4',
        name: 'Dr. Christopher Lee',
        image: doc4,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        email: 'doctor4@example.com', // ADD THESE
        password: 'pass4'
    },
    {
        _id: 'doc5',
        name: 'Dr. Jennifer Garcia',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        email: 'doctor5@example.com', // ADD THESE
        password: 'pass5'
    },
    {
        _id: 'doc6',
        name: 'Dr. Andrew Williams',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        email: 'doctor6@example.com', // ADD THESE
        password: 'pass6' 
    },
    {
        _id: 'doc7',
        name: 'Dr. Christopher Davis',
        image: doc7,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        email: 'doctor7@example.com', // ADD THESE
        password: 'pass7' 
    },
    {
        _id: 'doc8',
        name: 'Dr. Timothy White',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        email: 'doctor8@example.com', // ADD THESE
        password: 'pass8' 
    },
    {
        _id: 'doc9',
        name: 'Dr. Ava Mitchell',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        email: 'doctor9@example.com', // ADD THESE
        password: 'pass9' 
    },
    {
        _id: 'doc10',
        name: 'Dr. Jeffrey King',
        image: doc10,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        email: 'doctor10@example.com', 
        password: 'pass10' 
    },
    {
        _id: 'doc11',
        name: 'Dr. Zoe Kelly',
        image: doc11,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        email: 'doctor11@example.com', 
        password: 'pass11' 
    },
    {
        _id: 'doc12',
        name: 'Dr. Patrick Harris',
        image: doc12,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        email: 'doctor12@example.com', 
        password: 'pass12'
    },
    {
        _id: 'doc13',
        name: 'Dr. Chloe Evans',
        image: doc13,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        email: 'doctor13@example.com', 
        password: 'pass13'
    },
    {
        _id: 'doc14',
        name: 'Dr. Ryan Martinez',
        image: doc14,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        email: 'doctor14@example.com', // ADD THESE
        password: 'pass14'
    },
    {
        _id: 'doc15',
        name: 'Dr. Amelia Hill',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        email: 'doctor15@example.com', // ADD THESE
        password: 'pass15'
    },
    {
        _id: 'doc16',
        name: 'Dr. Emily Larson',
        image: doc2,
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        email: 'doctor16@example.com', // ADD THESE
        password: 'pass16'
    },
]
export const patients = [
    {
        _id: 'pat1',
        name: 'Alice Johnson',
        email: 'patient1@example.com',
        password: 'patient1pass',
        gender: 'Female',
        dob: '1990-05-15',
        phone: '123-456-7890',
         image:assets.profile_pic,
         address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
    },
    {
        _id: 'pat2',
        name: 'Bob Williams',
        email: 'patient2@example.com',
        password: 'patient2pass',
        gender: 'male',
        dob: '1985-11-20',
        phone: '987-654-3210',
         image:assets.profile_pic,
         address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
    },
    {
        _id: 'pat3',
        name: 'Charlie Brown',
        email: 'patient3@example.com',
        password: 'patient3pass',
        gender: 'male',
        dob: '2000-01-01',
        phone: '555-123-4567',
        image:assets.profile_pic,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
    },
    {
        _id: 'pat4',
        name: 'Lily Bloom',
        email: 'patient4@example.com',
        password: 'patient4pass',
        gender: 'female',
        dob: '2000-05-01',
        phone: '556-123-4567',
        image:assets.profile_pic,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
    }
];

export const mockAppointments = [
    // APPOINTMENT 1: Dr. Richard James with Alice Johnson - ONLY IDs are stored
    {
        _id: 'appt_001', 
        amount: 50,
        cancelled: false,
        date: 1730400000000,
        docId: 'doc1', // Foreign Key
        patId: 'pat1', // Foreign Key
        isCompleted: false,
        payment: true,
        slotDate: "01_11_2024",
        slotTime: "10:00 AM",
    },
    
    // APPOINTMENT 2: Dr. Emily Larson with Bob Williams - ONLY IDs are stored
    {
        _id: 'appt_002', 
        amount: 60,
        cancelled: false,
        date: 1730500000000,
        docId: 'doc2', // Foreign Key
        patId: 'pat2', // Foreign Key
        isCompleted: false,
        payment: false,
        slotDate: "02_11_2024",
        slotTime: "03:30 PM",
    },
    {
        _id: 'appt_003', 
        amount: 80,
        cancelled: true,
        date: 1730500000000,
        docId: 'doc2', // Foreign Key
        patId: 'pat3', // Foreign Key
        isCompleted: false,
        payment: true,
        slotDate: "05_12_2024",
        slotTime: "06:30 PM",
    },
    {
        _id: 'appt_004', 
        amount: 90,
        cancelled: true,
        date: 1730500000000,
        docId: 'doc1', // Foreign Key
        patId: 'pat4', // Foreign Key
        isCompleted: false,
        payment: false,
        slotDate: "05_02_2024",
        slotTime: "06:30 PM",
    },
    {
        _id: 'appt_005', 
        amount: 80,
        cancelled: true,
        date: 1730500000000,
        docId: 'doc3', // Foreign Key
        patId: 'pat1', // Foreign Key
        isCompleted: false,
        payment: false,
        slotDate: "05_02_2024",
        slotTime: "06:30 PM",
    },
    {
        _id: 'appt_006', 
        amount: 60,
        cancelled: false,
        date: 1730918400000, // Nov 6, 2024
        docId: 'doc2', // Assigned to Doctor 2
        patId: 'pat3',
        isCompleted: false, // Completed and Paid
        payment: true,
        slotDate: "06_11_2024",
        slotTime: "04:30 PM",
    },
    {
        _id: 'appt_007', 
        amount: 90,
        cancelled: false,
        date: 1731004800000, // Nov 7, 2024
        docId: 'doc2', // Assigned to Doctor 2
        patId: 'pat2',
        isCompleted: false, // Cancelled, no earnings counted
        payment: false,
        slotDate: "07_11_2024",
        slotTime: "10:00 AM",
    },
    
    // --- Appointments for doc3 (Total Earnings: 150 + 200 = 350) ---

    {
        _id: 'appt_008', 
        amount: 150,
        cancelled: false,
        date: 1731091200000, // Nov 8, 2024
        docId: 'doc3', // Assigned to Doctor 3
        patId: 'pat2',
        isCompleted: false, // Completed and Paid
        payment: true,
        slotDate: "08_11_2024",
        slotTime: "03:00 PM",
    },
    {
        _id: 'appt_009', 
        amount: 200,
        cancelled: false,
        date: 1731177600000, // Nov 9, 2024
        docId: 'doc3', // Assigned to Doctor 3
        patId: 'pat3',
        isCompleted: false, // Completed and Paid
        payment: true,
        slotDate: "09_11_2024",
        slotTime: "11:00 AM",
    },
    {
        _id: 'appt_010', 
        amount: 70,
        cancelled: true,
        date: 1731264000000, // Nov 10, 2024
        docId: 'doc3', // Assigned to Doctor 3
        patId: 'pat4',
        isCompleted: false, // Cancelled, no earnings counted
        payment: true,
        slotDate: "10_11_2024",
        slotTime: "04:00 PM",
    },
    {
        _id: 'appt_011', 
        amount: 95,
        cancelled: false,
        date: 1731350400000, // Nov 11, 2024
        docId: 'doc3', // Assigned to Doctor 3
        patId: 'pat3',
        isCompleted: false, // Future appointment
        payment: false,
        slotDate: "11_11_2024",
        slotTime: "08:30 AM",
    }
    
];