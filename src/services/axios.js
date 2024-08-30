import axios from "axios";

export const getLeads = async (state) => {
  const { data } = await axios.get(
    `https://princesss.store/api/canva/get?state=${state}`
  );
  return data;
};

export const getAllLeads = async () => {
  const { data } = await axios.get(`https://princesss.store/api/canva/getAll`);
  return data;
};

export const createLeads = async (canva) => {
  const { data } = await axios.post(
    `https://princesss.store/api/canva/create`,
    canva
  );
  return data;
};

export const updateLeads = async (_id, canva) => {
  const { data } = await axios.patch(
    `https://princesss.store/api/canva/update`,
    { _id, canva }
  );
  return data;
};
