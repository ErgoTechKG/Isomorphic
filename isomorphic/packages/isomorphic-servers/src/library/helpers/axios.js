const customHeader = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: localStorage.getItem("id_token") || undefined,
});

const axiosConfig = {
  headers: customHeader(),
};

export default axiosConfig;
