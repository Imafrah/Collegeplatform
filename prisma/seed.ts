import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const colleges = [
  ["IIT Bombay", "Mumbai", "Maharashtra", 250000, 4.9, "Public", ["B.Tech", "M.Tech", "MBA", "PhD"], 28, 210, ["Google", "Microsoft", "Goldman Sachs"]],
  ["ICT Mumbai", "Mumbai", "Maharashtra", 145000, 4.4, "Public", ["B.Tech", "M.Tech", "M.Sc", "PhD"], 10, 45, ["Reliance", "Asian Paints", "Tata Chemicals"]],
  ["VJTI Mumbai", "Mumbai", "Maharashtra", 90000, 4.5, "Public", ["B.Tech", "M.Tech", "MCA"], 13, 62, ["TCS", "Deloitte", "Morgan Stanley"]],
  ["Symbiosis Institute of Business Management", "Pune", "Maharashtra", 2350000, 4.4, "Private", ["MBA", "Executive MBA", "PGDM"], 26, 49, ["Accenture", "KPMG", "HDFC Bank"]],
  ["MIT World Peace University", "Pune", "Maharashtra", 320000, 4.1, "Private", ["B.Tech", "MBA", "BBA", "M.Tech"], 7, 44, ["Infosys", "IBM", "Capgemini"]],
  ["IIT Delhi", "New Delhi", "Delhi", 255000, 4.9, "Public", ["B.Tech", "M.Tech", "MBA", "PhD"], 27, 200, ["Google", "Microsoft", "McKinsey"]],
  ["Delhi Technological University", "New Delhi", "Delhi", 229000, 4.6, "Public", ["B.Tech", "M.Tech", "MBA"], 15, 82, ["Adobe", "Samsung", "Maruti Suzuki"]],
  ["Netaji Subhas University of Technology", "New Delhi", "Delhi", 240000, 4.5, "Public", ["B.Tech", "M.Tech", "PhD"], 14, 64, ["Amazon", "Texas Instruments", "Zomato"]],
  ["Faculty of Management Studies Delhi", "New Delhi", "Delhi", 100000, 4.8, "Public", ["MBA", "Executive MBA", "PhD"], 34, 123, ["BCG", "EY", "Axis Bank"]],
  ["Jamia Millia Islamia", "New Delhi", "Delhi", 65000, 4.2, "Public", ["B.Tech", "MBA", "M.Tech", "MCA"], 8, 25, ["TCS", "Wipro", "HCLTech"]],
  ["IISc Bangalore", "Bengaluru", "Karnataka", 350000, 4.9, "Public", ["B.Tech", "M.Tech", "M.Sc", "PhD"], 22, 86, ["Intel", "Google", "Qualcomm"]],
  ["NIT Karnataka Surathkal", "Mangaluru", "Karnataka", 180000, 4.7, "Public", ["B.Tech", "M.Tech", "MBA", "PhD"], 18, 54, ["Oracle", "Microsoft", "Shell"]],
  ["RV College of Engineering", "Bengaluru", "Karnataka", 420000, 4.4, "Private", ["B.Tech", "M.Tech", "MCA"], 11, 62, ["Cisco", "Flipkart", "Mercedes-Benz"]],
  ["PES University", "Bengaluru", "Karnataka", 480000, 4.2, "Private", ["B.Tech", "MBA", "BBA", "M.Tech"], 9, 45, ["Amazon", "Deloitte", "Bosch"]],
  ["IIM Bangalore", "Bengaluru", "Karnataka", 2450000, 4.9, "Public", ["MBA", "PGP", "Executive MBA", "PhD"], 35, 115, ["McKinsey", "Bain", "Goldman Sachs"]],
  ["IIT Madras", "Chennai", "Tamil Nadu", 250000, 4.9, "Public", ["B.Tech", "M.Tech", "MBA", "PhD"], 25, 198, ["Google", "Apple", "Texas Instruments"]],
  ["NIT Tiruchirappalli", "Tiruchirappalli", "Tamil Nadu", 175000, 4.8, "Public", ["B.Tech", "M.Tech", "MBA", "MCA"], 17, 52, ["Microsoft", "L&T", "Oracle"]],
  ["Anna University", "Chennai", "Tamil Nadu", 115000, 4.3, "Public", ["B.Tech", "M.Tech", "MBA", "PhD"], 7, 36, ["Infosys", "Cognizant", "Zoho"]],
  ["SRM Institute of Science and Technology", "Chennai", "Tamil Nadu", 450000, 4.0, "Private", ["B.Tech", "M.Tech", "MBA", "BBA"], 6, 44, ["TCS", "Accenture", "Amazon"]],
  ["VIT Vellore", "Vellore", "Tamil Nadu", 490000, 4.3, "Private", ["B.Tech", "M.Tech", "MBA", "MCA"], 9, 75, ["Microsoft", "PayPal", "Deloitte"]],
  ["IIT Hyderabad", "Hyderabad", "Telangana", 245000, 4.7, "Public", ["B.Tech", "M.Tech", "M.Des", "PhD"], 20, 65, ["Google", "Sprinklr", "Qualcomm"]],
  ["NIT Warangal", "Warangal", "Telangana", 165000, 4.7, "Public", ["B.Tech", "M.Tech", "MBA", "MCA"], 16, 88, ["Microsoft", "Goldman Sachs", "Oracle"]],
  ["IIIT Hyderabad", "Hyderabad", "Telangana", 360000, 4.8, "Private", ["B.Tech", "M.Tech", "MS", "PhD"], 32, 102, ["Google", "Uber", "Adobe"]],
  ["BITS Pilani Hyderabad Campus", "Hyderabad", "Telangana", 620000, 4.5, "Private", ["B.E.", "M.E.", "MBA", "PhD"], 18, 60, ["Amazon", "Flipkart", "Nvidia"]],
  ["ICFAI Business School Hyderabad", "Hyderabad", "Telangana", 1600000, 4.0, "Private", ["MBA", "PGPM", "PhD"], 9, 21, ["Deloitte", "ICICI Bank", "HCLTech"]],
  ["IIT Kharagpur", "Kharagpur", "West Bengal", 245000, 4.8, "Public", ["B.Tech", "M.Tech", "MBA", "LLB", "PhD"], 24, 260, ["Google", "Apple", "JP Morgan"]],
  ["Jadavpur University", "Kolkata", "West Bengal", 120000, 4.6, "Public", ["B.E.", "M.E.", "M.Sc", "PhD"], 11, 85, ["Amazon", "PwC", "Samsung"]],
  ["IIM Calcutta", "Kolkata", "West Bengal", 2500000, 4.9, "Public", ["MBA", "Executive MBA", "PhD"], 35, 120, ["BCG", "McKinsey", "Goldman Sachs"]],
  ["Heritage Institute of Technology", "Kolkata", "West Bengal", 395000, 3.9, "Private", ["B.Tech", "M.Tech", "MBA"], 5, 18, ["TCS", "Cognizant", "Wipro"]],
  ["Techno India University", "Kolkata", "West Bengal", 320000, 3.8, "Private", ["B.Tech", "MBA", "BCA", "MCA"], 4, 16, ["Infosys", "Capgemini", "IBM"]],
  ["IIT Gandhinagar", "Gandhinagar", "Gujarat", 255000, 4.6, "Public", ["B.Tech", "M.Tech", "M.Sc", "PhD"], 15, 60, ["Google", "Tata Motors", "Amul"]],
  ["Nirma University", "Ahmedabad", "Gujarat", 260000, 4.2, "Private", ["B.Tech", "MBA", "M.Tech", "BBA"], 7, 30, ["Infosys", "Reliance", "Adani"]],
  ["DAIICT Gandhinagar", "Gandhinagar", "Gujarat", 240000, 4.4, "Private", ["B.Tech", "M.Tech", "M.Sc", "PhD"], 12, 82, ["Microsoft", "Amazon", "Sprinklr"]],
  ["IIM Ahmedabad", "Ahmedabad", "Gujarat", 2500000, 5.0, "Public", ["MBA", "Executive MBA", "PhD"], 36, 115, ["McKinsey", "BCG", "Bain"]],
  ["Pandit Deendayal Energy University", "Gandhinagar", "Gujarat", 310000, 4.0, "Private", ["B.Tech", "MBA", "M.Tech", "BBA"], 6, 25, ["Shell", "Adani", "Torrent Power"]],
  ["BITS Pilani", "Pilani", "Rajasthan", 620000, 4.8, "Private", ["B.E.", "M.E.", "MBA", "PhD"], 19, 60, ["Google", "Microsoft", "Nvidia"]],
  ["MNIT Jaipur", "Jaipur", "Rajasthan", 170000, 4.5, "Public", ["B.Tech", "M.Tech", "MBA", "PhD"], 12, 64, ["Amazon", "Deloitte", "L&T"]],
  ["IIT Jodhpur", "Jodhpur", "Rajasthan", 240000, 4.5, "Public", ["B.Tech", "M.Tech", "MBA", "PhD"], 17, 61, ["Microsoft", "Samsung", "Tata Elxsi"]],
  ["Manipal University Jaipur", "Jaipur", "Rajasthan", 365000, 4.0, "Private", ["B.Tech", "MBA", "BBA", "M.Tech"], 6, 43, ["Accenture", "Dell", "Capgemini"]],
  ["Jaipuria Institute of Management Jaipur", "Jaipur", "Rajasthan", 1225000, 3.9, "Private", ["PGDM", "MBA", "Executive Education"], 8, 22, ["Deloitte", "HDFC Bank", "Asian Paints"]],
] as const;

async function main() {
  await prisma.college.createMany({
    data: colleges.map(([name, location, state, fees, rating, type, courses, avgPackage, highestPackage, topRecruiters]) => ({
      name,
      location,
      state,
      fees,
      rating,
      type,
      courses: [...courses],
      overview: `${name} is a well-regarded ${type.toLowerCase()} institution in ${location}, ${state}, known for rigorous academics, industry exposure, active campus life, and career-focused programs across ${courses.slice(0, 3).join(", ")}.`,
      placements: {
        avgPackage,
        highestPackage,
        topRecruiters: [...topRecruiters],
      },
    })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

