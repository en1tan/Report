exports.genIDs = (code) => {
  return code + Math.random().toString(8).substr(2, 5);
};
