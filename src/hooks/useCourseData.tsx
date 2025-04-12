import { useState, useEffect } from "react";
import axios from "helper/axios";

const useCourseData = () => {
  const [courses, setCourses] = useState([]);
  const [standards, setStandards] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // const courseResponseAll = await axios.get("api/courses_all/");
        // setCourseAll(courseResponseAll.data);

        const courseResponse = await axios.get("api/courses/");
        setCourses(courseResponse.data);

        const standardResponse = await axios.get("api/standards/");
        setStandards(standardResponse.data);

        const subjectResponse = await axios.get("api/subjects/");
        setSubjects(subjectResponse.data);

        const moduleResponse = await axios.get("api/modules/");
        setModules(moduleResponse.data);

        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { courses, standards, subjects, modules, isLoading, error };
};

export default useCourseData;
