exports.Template = (template, keyword) => {
  try {
    let dynamictemplate = template;
    const keys = Object.keys(keyword);
    for (const i of keys) {
      dynamictemplate = dynamictemplate.replaceAll(`[${i}]`, keyword[i]);
    }
    return dynamictemplate;
  } catch (err) {
    throw new Error("Invalid Format!");
  }
};
