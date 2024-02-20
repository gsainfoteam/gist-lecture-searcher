import axios from "axios";

import { Course } from "./course";

export interface RegistrationInfo extends Course {
  countStamps: {
    time: string;
    count: number;
  }[];
}

export const fetchJsonRegistrationInfoData = async (fileName: string) => {
  const response = await axios.get<RegistrationInfo[]>(`/${fileName}`);

  return response.data;
};
