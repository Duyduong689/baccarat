export const mappingSelectData = (data, valueField, labelField) => {
  const result = data.map((item) => {
    return { label: item[labelField], value: item[valueField] };
  });
  return result;
};
