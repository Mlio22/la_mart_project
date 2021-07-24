// sleep (waiting)
const sleep = async (time) => {
  return new Promise((r) => setTimeout(r, time));
};

module.exports = { sleep };
