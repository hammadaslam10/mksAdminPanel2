exports.Conversion = (data) => {
  if (typeof data === "string") {
    data = data.split();
    data = Array.from(data);
    return data;
  } else {
    console.log(data);
    return data;
  }
};
