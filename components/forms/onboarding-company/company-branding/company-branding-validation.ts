import * as yup from "yup";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = ["image/png", "image/jpeg", "image/jpg"];

const fileRequired = (label: string) =>
  yup
    .mixed<File>()
    .required(`${label} is required`)
    .test("fileType", "Only PNG or JPG files are allowed", (file) => {
      if (!file) return false;
      return ALLOWED.includes(file.type);
    })
    .test("fileSize", "File must be less than 5MB", (file) => {
      if (!file) return false;
      return file.size <= MAX_SIZE;
    });

const companyBrandingSchema = yup.object({
  companyLogo: fileRequired("Company logo"),
  coverImage: fileRequired("Cover image"),
});

export default companyBrandingSchema;
