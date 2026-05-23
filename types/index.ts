export type College = {
  id: string;
  name: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  type: string;
  courses: string[];
  overview: string;
  placements: {
    avgPackage: number;
    highestPackage: number;
    topRecruiters: string[];
  };
};

export type SavedCollege = {
  id: string;
  collegeId: string;
  college: College;
};

