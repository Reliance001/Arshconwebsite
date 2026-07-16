function groupFiles(files) {
  return files.reduce((acc, file) => {
    if (!acc[file.fieldname]) {
      acc[file.fieldname] = [];
    }

    acc[file.fieldname].push(file);

    return acc;
  }, {});
}

function getStageFiles(files, index) {
  return files.filter((file) => file.fieldname === `stages[${index}][images]`);
}

module.exports = {
  groupFiles,
  getStageFiles,
};
